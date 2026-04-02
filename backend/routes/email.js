const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { Resend } = require('resend');
const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
const EmailTemplate = require('../models/EmailTemplate');
const Lead = require('../models/Lead');
const { generateReportHTML } = require('../services/reportGenerator');

const resend = new Resend(process.env.RESEND_API_KEY);

const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL;
const BUCKET_NAME = process.env.R2_BUCKET || 'rainboots';
const FROM_EMAIL =
  process.env.FROM_EMAIL || 'Rainboots Marketing <info@rainbootsmarketing.com>';
const REPLY_TO = process.env.REPLY_TO_EMAIL || 'hello@rainbootsmarketing.com';

// R2 client for downloading attachments to send via Resend
const r2Client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

const isR2Url = (url) => {
  if (!url) return false;
  return (
    url.includes('r2.cloudflarestorage.com') ||
    url.includes('.r2.dev') ||
    (R2_PUBLIC_URL && url.includes(R2_PUBLIC_URL))
  );
};

const extractKeyFromR2Url = (url) => {
  if (R2_PUBLIC_URL && url.includes(R2_PUBLIC_URL))
    return url.replace(`${R2_PUBLIC_URL}/`, '');
  const m = url.match(/\.r2\.dev\/(.+)$/);
  if (m) return m[1];
  return null;
};

const downloadFromR2 = async (url) => {
  const key = extractKeyFromR2Url(url);
  if (!key) throw new Error(`Cannot extract key from: ${url}`);
  const fullKey = key.startsWith('attachments/') ? key : `attachments/${key}`;
  const { Body, ContentType } = await r2Client.send(
    new GetObjectCommand({ Bucket: BUCKET_NAME, Key: fullKey }),
  );
  const chunks = [];
  for await (const chunk of Body) chunks.push(chunk);
  return { buffer: Buffer.concat(chunks), contentType: ContentType };
};

const htmlToText = (html) =>
  html
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

/**
 * Personalise HTML for a specific lead
 */
const personaliseForLead = (html, lead) => {
  let out = html;
  out = out.replace(/\[lead\.businessName\]/g, lead.businessName || '');
  out = out.replace(/\[lead\.contactName\]/g, lead.contactName || '');
  out = out.replace(/\[lead\.contactEmail\]/g, lead.contactEmail || '');
  out = out.replace(/\[lead\.industry\]/g, lead.industry || '');
  out = out.replace(/\[lead\.location\.city\]/g, lead.location?.city || '');
  out = out.replace(/\[lead\.location\.state\]/g, lead.location?.state || '');
  out = out.replace(/\[lead\.website\]/g, lead.website || lead.domain || '');
  out = out.replace(/\[lead\.score\]/g, lead.score || '');
  return out;
};

/**
 * Build Resend-compatible attachments array from template attachments
 */
const buildAttachments = async (templateAttachments = []) => {
  const result = [];
  for (const att of templateAttachments) {
    try {
      if (att.url && isR2Url(att.url)) {
        const { buffer, contentType } = await downloadFromR2(att.url);
        result.push({
          filename: att.filename,
          content: buffer,
          contentType: contentType || att.mimeType,
        });
      }
    } catch (err) {
      console.error(`Failed to load attachment ${att.filename}:`, err.message);
    }
  }
  return result;
};

/**
 * Send one email via Resend with retry
 */
const sendOne = async ({
  to,
  subject,
  html,
  attachments = [],
  retries = 2,
}) => {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const payload = {
        from: FROM_EMAIL,
        reply_to: REPLY_TO,
        to,
        subject,
        html,
      };
      if (attachments.length > 0) payload.attachments = attachments;
      const { data, error } = await resend.emails.send(payload);
      if (error) throw new Error(error.message || JSON.stringify(error));
      return { success: true, id: data.id };
    } catch (err) {
      if (attempt === retries) return { success: false, error: err.message };
      await new Promise((r) => setTimeout(r, 1500 * (attempt + 1)));
    }
  }
};

// ── POST /email/send-campaign ─────────────────────────────────────────────────
// Send to selected lead IDs (original - no report)
router.post(
  '/send-campaign',
  [
    body('templateId').notEmpty().withMessage('templateId required'),
    body('leadIds')
      .isArray({ min: 1 })
      .withMessage('leadIds must be a non-empty array'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ success: false, errors: errors.array() });

    const { templateId, leadIds } = req.body;

    try {
      const template = await EmailTemplate.findById(templateId);
      if (!template)
        return res
          .status(404)
          .json({ success: false, error: 'Template not found' });

      const leads = await Lead.find({
        _id: { $in: leadIds },
        status: { $ne: 'unsubscribed' },
      });
      if (leads.length === 0)
        return res
          .status(400)
          .json({ success: false, error: 'No eligible leads found' });

      const baseHtml =
        template.completeContent || template.getCompleteEmailHTML();
      const attachments = await buildAttachments(template.attachments);

      const results = await Promise.allSettled(
        leads.map(async (lead) => {
          if (!lead.contactEmail)
            return {
              success: false,
              leadId: lead._id,
              error: 'No email address',
            };

          const html = personaliseForLead(baseHtml, lead);
          const result = await sendOne({
            to: lead.contactEmail,
            subject: template.subject,
            html,
            attachments,
          });

          if (result.success) {
            // Update lead record
            await Lead.findByIdAndUpdate(lead._id, {
              $push: {
                campaignsSent: {
                  templateId: template._id,
                  subject: template.subject,
                  sentAt: new Date(),
                },
              },
              $set: {
                lastContactedAt: new Date(),
                status: lead.status === 'new' ? 'contacted' : lead.status,
              },
            });
          }

          return {
            ...result,
            leadId: lead._id,
            email: lead.contactEmail,
            businessName: lead.businessName,
          };
        }),
      );

      const formatted = results.map((r) =>
        r.status === 'fulfilled'
          ? r.value
          : { success: false, error: r.reason },
      );

      res.json({
        success: true,
        totalLeads: leads.length,
        sent: formatted.filter((r) => r.success).length,
        failed: formatted.filter((r) => !r.success).length,
        results: formatted,
      });
    } catch (err) {
      console.error('Campaign send error:', err);
      res.status(500).json({ success: false, error: err.message });
    }
  },
);

// ── POST /email/send-campaign-with-report ─────────────────────────────────────
// NEW: Send campaign with full audit report attached or embedded
router.post(
  '/send-campaign-with-report',
  [
    body('templateId').notEmpty().withMessage('templateId required'),
    body('leadIds')
      .isArray({ min: 1 })
      .withMessage('leadIds must be a non-empty array'),
    body('includeReport').optional().isBoolean(),
    body('reportFormat').optional().isIn(['inline', 'attachment', 'both']),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const {
      templateId,
      leadIds,
      includeReport = true,
      reportFormat = 'inline',
    } = req.body;

    console.log(`📧 Sending campaign with report to ${leadIds.length} leads`);
    console.log(`   Report format: ${reportFormat}, Include: ${includeReport}`);

    try {
      const template = await EmailTemplate.findById(templateId);
      if (!template) {
        return res
          .status(404)
          .json({ success: false, error: 'Template not found' });
      }

      const leads = await Lead.find({
        _id: { $in: leadIds },
        status: { $ne: 'unsubscribed' },
      });

      if (leads.length === 0) {
        return res
          .status(400)
          .json({ success: false, error: 'No eligible leads found' });
      }

      const baseHtml =
        template.completeContent || template.getCompleteEmailHTML();
      const attachments = await buildAttachments(template.attachments);

      const results = await Promise.allSettled(
        leads.map(async (lead) => {
          if (!lead.contactEmail) {
            return {
              success: false,
              leadId: lead._id,
              error: 'No email address',
            };
          }

          let html = personaliseForLead(baseHtml, lead);
          let reportAttachments = [...attachments];

          // Generate and add report if requested
          if (includeReport && lead.analysis) {
            console.log(`   Generating report for ${lead.businessName}...`);

            const reportHtml = generateReportHTML(lead, {
              includeSocial: true,
              includeEmailReputation: true,
              includeOutreach: true,
              theme: 'dark',
            });

            if (reportFormat === 'inline' || reportFormat === 'both') {
              // Add report as a collapsible section in the email
              const reportSection = `
                <div style="margin-top: 40px; padding-top: 20px; border-top: 2px solid #eaeaea;">
                  <details style="margin-top: 20px;">
                    <summary style="cursor: pointer; font-weight: bold; color: #0e9aa7; padding: 10px; background: #f5f5f5; border-radius: 8px;">
                      📊 Click to view your full Website Audit Report
                    </summary>
                    <div style="margin-top: 20px;">
                      ${reportHtml}
                    </div>
                  </details>
                </div>
              `;
              // Insert before closing body tag
              html = html.replace('</body>', `${reportSection}</body>`);
            }

            if (reportFormat === 'attachment' || reportFormat === 'both') {
              // Add report as HTML attachment
              const safeBusinessName =
                lead.businessName?.replace(/[^a-z0-9]/gi, '_').toLowerCase() ||
                'report';
              reportAttachments.push({
                filename: `audit-report-${safeBusinessName}.html`,
                content: Buffer.from(reportHtml),
                contentType: 'text/html',
              });
            }
          }

          const result = await sendOne({
            to: lead.contactEmail,
            subject: template.subject,
            html,
            attachments: reportAttachments,
          });

          if (result.success) {
            await Lead.findByIdAndUpdate(lead._id, {
              $push: {
                campaignsSent: {
                  templateId: template._id,
                  subject: template.subject,
                  sentAt: new Date(),
                },
              },
              $set: {
                lastContactedAt: new Date(),
                status: lead.status === 'new' ? 'contacted' : lead.status,
              },
            });
          }

          return {
            ...result,
            leadId: lead._id,
            email: lead.contactEmail,
            businessName: lead.businessName,
            reportSent: includeReport,
            reportFormat,
          };
        }),
      );

      const formatted = results.map((r) =>
        r.status === 'fulfilled'
          ? r.value
          : { success: false, error: r.reason },
      );

      console.log(
        `✅ Campaign complete: ${formatted.filter((r) => r.success).length} sent, ${formatted.filter((r) => !r.success).length} failed`,
      );

      res.json({
        success: true,
        totalLeads: leads.length,
        sent: formatted.filter((r) => r.success).length,
        failed: formatted.filter((r) => !r.success).length,
        results: formatted,
      });
    } catch (err) {
      console.error('Campaign with report error:', err);
      res.status(500).json({ success: false, error: err.message });
    }
  },
);

// ── POST /email/send-manual ───────────────────────────────────────────────────
// Send to arbitrary email list (no lead record required)
router.post(
  '/send-manual',
  [
    body('templateId').notEmpty(),
    body('emails').isArray({ min: 1 }),
    body('emails.*').isEmail(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ success: false, errors: errors.array() });

    const { templateId, emails } = req.body;

    try {
      const template = await EmailTemplate.findById(templateId);
      if (!template)
        return res
          .status(404)
          .json({ success: false, error: 'Template not found' });

      const html = template.completeContent || template.getCompleteEmailHTML();
      const attachments = await buildAttachments(template.attachments);

      const results = await Promise.allSettled(
        emails.map(async (email) => {
          const result = await sendOne({
            to: email,
            subject: template.subject,
            html,
            attachments,
          });
          return { ...result, email };
        }),
      );

      const formatted = results.map((r) =>
        r.status === 'fulfilled'
          ? r.value
          : { success: false, error: r.reason },
      );

      res.json({
        success: true,
        total: emails.length,
        sent: formatted.filter((r) => r.success).length,
        failed: formatted.filter((r) => !r.success).length,
        results: formatted,
      });
    } catch (err) {
      console.error('Manual email send error:', err);
      res.status(500).json({ success: false, error: err.message });
    }
  },
);

// ── POST /email/preview ───────────────────────────────────────────────────────
router.post('/preview', async (req, res) => {
  try {
    const { templateId } = req.body;
    const template = await EmailTemplate.findById(templateId);
    if (!template)
      return res
        .status(404)
        .json({ success: false, error: 'Template not found' });

    res.json({
      success: true,
      data: {
        html: template.completeContent || template.getCompleteEmailHTML(),
        subject: template.subject,
        title: template.title,
      },
    });
  } catch (err) {
    console.error('Preview error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
