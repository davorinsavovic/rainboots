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

// ── HTML helpers ──────────────────────────────────────────────────────────────

/** Render a <ul> list of items as styled HTML list items */
const renderList = (items = []) => {
  if (!items || items.length === 0) return '<li>None identified</li>';
  return items
    .map((item) => `<li style="margin-bottom:8px;">${item}</li>`)
    .join('');
};

/** Render issues as red-accented list */
const renderIssuesList = (items = []) => {
  if (!items || items.length === 0)
    return '<p style="color:#6b7280;">No critical issues found.</p>';
  return items
    .map(
      (item) => `
    <div style="display:flex;gap:10px;align-items:flex-start;margin-bottom:10px;">
      <span style="color:#dc2626;font-size:16px;line-height:1.4;flex-shrink:0;">✗</span>
      <span style="font-size:14px;line-height:1.6;">${item}</span>
    </div>`,
    )
    .join('');
};

/** Render quick wins as green-accented list */
const renderWinsList = (items = []) => {
  if (!items || items.length === 0)
    return '<p style="color:#6b7280;">No quick wins identified.</p>';
  return items
    .map(
      (item) => `
    <div style="display:flex;gap:10px;align-items:flex-start;margin-bottom:10px;">
      <span style="color:#16a34a;font-size:16px;line-height:1.4;flex-shrink:0;">✓</span>
      <span style="font-size:14px;line-height:1.6;">${item}</span>
    </div>`,
    )
    .join('');
};

/** Render email reputation checks as a table */
const renderEmailHealthTable = (emailReputation) => {
  if (!emailReputation)
    return '<p style="color:#6b7280;">Email health data not available.</p>';

  const score = emailReputation.score || 0;
  const scoreColor =
    score >= 80 ? '#16a34a' : score >= 50 ? '#d97706' : '#dc2626';

  const checks = [
    {
      label: 'MX Records',
      pass: emailReputation.mx?.exists,
      detail:
        emailReputation.mx?.provider ||
        (emailReputation.mx?.exists
          ? 'Configured'
          : 'Missing — emails cannot be received'),
    },
    {
      label: 'SPF',
      pass: emailReputation.spf?.exists,
      detail: emailReputation.spf?.exists
        ? emailReputation.spf?.strict
          ? 'Strict policy'
          : emailReputation.spf?.soft
            ? 'Soft policy'
            : 'Configured'
        : 'Missing — sender authentication not set up',
    },
    {
      label: 'DKIM',
      pass: emailReputation.dkim?.exists,
      detail: emailReputation.dkim?.exists
        ? `Selector: ${emailReputation.dkim?.selector || 'configured'}`
        : 'Missing — emails may land in spam',
    },
    {
      label: 'DMARC',
      pass: emailReputation.dmarc?.exists,
      detail: emailReputation.dmarc?.exists
        ? `Policy: ${emailReputation.dmarc?.policy || 'set'}${emailReputation.dmarc?.strong ? ' (strong)' : ''}`
        : 'Missing — vulnerable to email spoofing',
    },
  ];

  const rows = checks
    .map(
      (c, i) => `
    <tr style="background:${i % 2 === 0 ? '#ffffff' : '#f9fafb'};">
      <td style="padding:10px 14px;font-size:13px;font-weight:500;">${c.label}</td>
      <td style="padding:10px 14px;font-size:13px;color:${c.pass ? '#16a34a' : '#dc2626'};">
        ${c.pass ? '✓ Pass' : '✗ Fail'}
      </td>
      <td style="padding:10px 14px;font-size:13px;color:#6b7280;">${c.detail}</td>
    </tr>`,
    )
    .join('');

  return `
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:14px;">
      <div style="font-size:26px;font-weight:600;color:${scoreColor};">${score}<span style="font-size:14px;color:#6b7280;">/100</span></div>
      <div style="font-size:13px;color:#6b7280;">
        ${score >= 80 ? 'Strong email authentication' : score >= 50 ? 'Some issues found — fixable quickly' : 'Critical issues — emails likely hitting spam'}
      </div>
    </div>
    <table cellpadding="0" cellspacing="0" border="0" style="width:100%;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
      <thead>
        <tr style="background:#f3f4f6;">
          <th style="padding:9px 14px;font-size:12px;font-weight:600;text-align:left;color:#374151;">Check</th>
          <th style="padding:9px 14px;font-size:12px;font-weight:600;text-align:left;color:#374151;">Status</th>
          <th style="padding:9px 14px;font-size:12px;font-weight:600;text-align:left;color:#374151;">Detail</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>`;
};

/** Render social links */
const renderSocialLinks = (socialLinks) => {
  if (!socialLinks || socialLinks.size === 0) {
    return '<p style="color:#6b7280;font-size:13px;">No social media profiles found.</p>';
  }
  const entries =
    socialLinks instanceof Map
      ? [...socialLinks.entries()]
      : Object.entries(socialLinks);
  if (entries.length === 0)
    return '<p style="color:#6b7280;font-size:13px;">No social media profiles found.</p>';

  return entries
    .map(
      ([platform, url]) =>
        `<a href="${url}" style="display:inline-block;margin:4px 6px 4px 0;padding:5px 14px;border:1px solid #1a2340;border-radius:20px;font-size:12px;color:#1a2340;text-decoration:none;">${platform}</a>`,
    )
    .join('');
};

/** Score colour helper */
const getScoreColor = (score) => {
  if (score >= 80) return '#16a34a';
  if (score >= 60) return '#d97706';
  if (score >= 40) return '#f97316';
  return '#dc2626';
};

// ── Main personalisation function ─────────────────────────────────────────────
/**
 * Replace ALL template variables with real lead data.
 * Handles: scalars, arrays (issues/quickWins/opportunities),
 * email reputation checks, social links, and dynamic report section.
 */
const personaliseForLead = (html, lead) => {
  let out = html;

  console.log('🔧 Personalizing email for lead:', lead.businessName);
  console.log('📊 Lead has analysis:', !!lead.analysis);
  console.log('📋 Issues count:', lead.analysis?.issues?.length || 0);
  console.log('⚡ Quick wins count:', lead.analysis?.quickWins?.length || 0);

  // 1. Basic scalar fields
  out = out.replace(
    /\[lead\.businessName\]/g,
    lead.businessName || 'your business',
  );
  out = out.replace(/\[lead\.contactName\]/g, lead.contactName || 'there');
  out = out.replace(/\[lead\.contactEmail\]/g, lead.contactEmail || '');
  out = out.replace(/\[lead\.website\]/g, lead.website || lead.domain || '');
  out = out.replace(/\[lead\.domain\]/g, lead.domain || lead.website || '');
  out = out.replace(/\[lead\.category\]/g, lead.category || '');
  out = out.replace(/\[lead\.location\]/g, lead.location || '');
  out = out.replace(/\[lead\.industry\]/g, lead.industry || '');
  out = out.replace(/\[lead\.phone\]/g, lead.phone || '');
  out = out.replace(/\[lead\.score\]/g, lead.score || '0');

  // 2. Analysis fields
  out = out.replace(
    /\[lead\.analysis\.summary\]/g,
    lead.analysis?.summary || '',
  );
  out = out.replace(
    /\[lead\.outreachMessage\]/g,
    lead.analysis?.outreachMessage || '',
  );
  out = out.replace(
    /\[lead\.analysis\.outreachMessage\]/g,
    lead.analysis?.outreachMessage || '',
  );

  // 3. Issues array - [lead.analysis.issues.0], [lead.analysis.issues.1], etc.
  const issues = lead.analysis?.issues || [];
  for (let i = 0; i < issues.length; i++) {
    const regex = new RegExp(`\\[lead\\.analysis\\.issues\\.${i}\\]`, 'g');
    out = out.replace(regex, issues[i] || '');
  }
  // Clean up any remaining issue placeholders that don't have data
  out = out.replace(/\[lead\.analysis\.issues\.\d+\]/g, 'No issue identified');

  // 4. Quick Wins array - [lead.analysis.quickWins.0], etc.
  const quickWins = lead.analysis?.quickWins || [];
  for (let i = 0; i < quickWins.length; i++) {
    const regex = new RegExp(`\\[lead\\.analysis\\.quickWins\\.${i}\\]`, 'g');
    out = out.replace(regex, quickWins[i] || '');
  }
  out = out.replace(
    /\[lead\.analysis\.quickWins\.\d+\]/g,
    'No quick win identified',
  );

  // 5. Opportunities array - [lead.analysis.opportunities.0], etc.
  const opportunities = lead.analysis?.opportunities || [];
  for (let i = 0; i < opportunities.length; i++) {
    const regex = new RegExp(
      `\\[lead\\.analysis\\.opportunities\\.${i}\\]`,
      'g',
    );
    out = out.replace(regex, opportunities[i] || '');
  }
  out = out.replace(
    /\[lead\.analysis\.opportunities\.\d+\]/g,
    'No opportunity identified',
  );

  // 6. List versions (HTML formatted for email)
  out = out.replace(
    /\[lead\.issues\.list\]/g,
    issues.map((i) => `<li style="margin-bottom: 8px;">${i}</li>`).join('') ||
      '<li>No issues identified</li>',
  );
  out = out.replace(
    /\[lead\.quickWins\.list\]/g,
    quickWins
      .map((w) => `<li style="margin-bottom: 8px;">${w}</li>`)
      .join('') || '<li>No quick wins identified</li>',
  );
  out = out.replace(
    /\[lead\.opportunities\.list\]/g,
    opportunities
      .map((o) => `<li style="margin-bottom: 8px;">${o}</li>`)
      .join('') || '<li>No opportunities identified</li>',
  );

  // 7. Social links badges
  const socialLinks = lead.socialLinks;
  if (socialLinks) {
    const entries =
      socialLinks instanceof Map
        ? [...socialLinks.entries()]
        : Object.entries(socialLinks || {});
    out = out.replace(
      /\[lead\.socialLinks\.badges\]/g,
      entries
        .map(
          ([platform, url]) =>
            `<a href="${url}" style="display:inline-block;margin:4px;padding:4px 12px;background:#f0f0f0;border-radius:20px;text-decoration:none;color:#333;font-size:12px;">${platform}</a>`,
        )
        .join('') || 'No social links found',
    );
  } else {
    out = out.replace(
      /\[lead\.socialLinks\.badges\]/g,
      'No social links found',
    );
  }

  // 8. Email reputation
  const rep = lead.emailReputation;
  if (rep) {
    out = out.replace(/\[lead\.emailReputation\.score\]/g, rep.score || '0');
    out = out.replace(
      /\[lead\.emailReputation\.mx\.exists\]/g,
      rep.mx?.exists ? 'Yes' : 'No',
    );
    out = out.replace(
      /\[lead\.emailReputation\.mx\.provider\]/g,
      rep.mx?.provider || '',
    );
    out = out.replace(
      /\[lead\.emailReputation\.spf\.exists\]/g,
      rep.spf?.exists ? 'Yes' : 'No',
    );
    out = out.replace(
      /\[lead\.emailReputation\.dkim\.exists\]/g,
      rep.dkim?.exists ? 'Yes' : 'No',
    );
    out = out.replace(
      /\[lead\.emailReputation\.dkim\.selector\]/g,
      rep.dkim?.selector || '',
    );
    out = out.replace(
      /\[lead\.emailReputation\.dmarc\.exists\]/g,
      rep.dmarc?.exists ? 'Yes' : 'No',
    );
    out = out.replace(
      /\[lead\.emailReputation\.dmarc\.policy\]/g,
      rep.dmarc?.policy || '',
    );
  }

  // 9. Social analysis
  const socialAnalysis = lead.analysis?.socialAnalysis;
  if (socialAnalysis) {
    out = out.replace(/\[lead\.social\.score\]/g, socialAnalysis.score || '0');
    out = out.replace(
      /\[lead\.social\.summary\]/g,
      socialAnalysis.summary || '',
    );
    const missingPlatforms = socialAnalysis.missingPlatforms || [];
    out = out.replace(
      /\[lead\.social\.missingPlatforms\.list\]/g,
      missingPlatforms
        .map((p) => `<li style="margin-bottom: 6px;">${p}</li>`)
        .join('') || '<li>None</li>',
    );
  }

  // 10. Email analysis
  const emailAnalysis = lead.analysis?.emailAnalysis;
  if (emailAnalysis) {
    out = out.replace(
      /\[lead\.emailAnalysis\.summary\]/g,
      emailAnalysis.summary || '',
    );
    const emailIssues = emailAnalysis.issues || [];
    for (let i = 0; i < emailIssues.length; i++) {
      const regex = new RegExp(
        `\\[lead\\.emailAnalysis\\.issues\\.${i}\\]`,
        'g',
      );
      out = out.replace(regex, emailIssues[i] || '');
    }
  }

  // 11. Clean up any remaining unfilled variables
  out = out.replace(/\[lead\.[^\]]+\]/g, '');

  console.log('✅ Personalization complete');
  return out;
};

// ── Attachments ───────────────────────────────────────────────────────────────
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

// ── Send one email via Resend with retry ──────────────────────────────────────
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
    if (!errors.isEmpty())
      return res.status(400).json({ success: false, errors: errors.array() });

    const {
      templateId,
      leadIds,
      includeReport = true,
      reportFormat = 'inline',
    } = req.body;

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

          let html = personaliseForLead(baseHtml, lead);
          let reportAttachments = [...attachments];

          if (includeReport && lead.analysis) {
            const reportHtml = generateReportHTML(lead, {
              includeSocial: true,
              includeEmailReputation: true,
              includeOutreach: true,
              theme: 'dark',
            });

            if (reportFormat === 'inline' || reportFormat === 'both') {
              const reportSection = `
                <div style="margin-top:40px;padding-top:20px;border-top:2px solid #eaeaea;">
                  <details>
                    <summary style="cursor:pointer;font-weight:600;color:#1a2340;padding:10px;background:#f5f5f5;border-radius:8px;font-size:14px;">
                      View your full website audit report
                    </summary>
                    <div style="margin-top:20px;">${reportHtml}</div>
                  </details>
                </div>`;
              html = html.replace('</body>', `${reportSection}</body>`);
            }

            if (reportFormat === 'attachment' || reportFormat === 'both') {
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
      console.error('Campaign with report error:', err);
      res.status(500).json({ success: false, error: err.message });
    }
  },
);

// ── POST /email/send-manual ───────────────────────────────────────────────────
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

    const { templateId, emails, leadData } = req.body;

    try {
      const template = await EmailTemplate.findById(templateId);
      if (!template)
        return res
          .status(404)
          .json({ success: false, error: 'Template not found' });

      let html = template.completeContent || template.getCompleteEmailHTML();

      // If leadData is provided, personalize the email
      if (leadData) {
        html = personaliseForLead(html, leadData);
      }

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
    const { templateId, leadId } = req.body;
    const template = await EmailTemplate.findById(templateId);
    if (!template)
      return res
        .status(404)
        .json({ success: false, error: 'Template not found' });

    let html = template.completeContent || template.getCompleteEmailHTML();

    // If a leadId is provided, preview with real data
    if (leadId) {
      const lead = await Lead.findById(leadId);
      if (lead) html = personaliseForLead(html, lead);
    }

    res.json({
      success: true,
      data: { html, subject: template.subject, title: template.title },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── GET /email/variables ──────────────────────────────────────────────────────
// Returns all available template variables — useful for showing in the template editor
router.get('/variables', (req, res) => {
  res.json({
    success: true,
    variables: [
      {
        group: 'Basic',
        vars: [
          { token: '[lead.contactName]', description: "Contact person's name" },
          { token: '[lead.businessName]', description: 'Business name' },
          { token: '[lead.website]', description: 'Website URL' },
          { token: '[lead.domain]', description: 'Domain only' },
          { token: '[lead.category]', description: 'Business category' },
          { token: '[lead.location]', description: 'Location' },
          { token: '[lead.phone]', description: 'Phone number' },
        ],
      },
      {
        group: 'Scores',
        vars: [
          { token: '[lead.score]', description: 'Opportunity score (0–100)' },
          {
            token: '[lead.score.color]',
            description: 'Score colour (hex) for inline styles',
          },
          {
            token: '[lead.emailReputation.score]',
            description: 'Email health score (0–100)',
          },
          { token: '[lead.social.score]', description: 'Social media score' },
        ],
      },
      {
        group: 'Analysis',
        vars: [
          {
            token: '[lead.analysis.summary]',
            description: 'AI-generated summary',
          },
          {
            token: '[lead.outreachMessage]',
            description: 'Personalised outreach message',
          },
          {
            token: '[lead.issues.list]',
            description: 'Critical issues as styled HTML list',
          },
          {
            token: '[lead.quickWins.list]',
            description: 'Quick wins as styled HTML list',
          },
          {
            token: '[lead.opportunities.list]',
            description: 'Opportunities as plain list',
          },
          {
            token: '[lead.analysis.issues.0]',
            description: 'Individual issue by index (0, 1, 2...)',
          },
          {
            token: '[lead.analysis.quickWins.0]',
            description: 'Individual quick win by index',
          },
        ],
      },
      {
        group: 'Email health',
        vars: [
          {
            token: '[lead.emailHealth.table]',
            description: 'Full MX/SPF/DKIM/DMARC table (HTML)',
          },
          {
            token: '[lead.emailReputation.mx.provider]',
            description: 'MX provider name',
          },
          {
            token: '[lead.emailReputation.dkim.exists]',
            description: 'DKIM: Yes or No',
          },
          {
            token: '[lead.emailReputation.dmarc.policy]',
            description: 'DMARC policy value',
          },
        ],
      },
      {
        group: 'Social',
        vars: [
          {
            token: '[lead.social.summary]',
            description: 'Social media summary',
          },
          {
            token: '[lead.social.missingPlatforms.list]',
            description: 'Missing platforms as list items',
          },
          {
            token: '[lead.socialLinks.badges]',
            description: 'Found social links as badge links',
          },
        ],
      },
    ],
  });
});

// TEMPORARY DEBUG ROUTE
router.get('/debug-lead/:id', async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    res.json({
      success: true,
      id: lead._id,
      businessName: lead.businessName,
      contactName: lead.contactName,
      contactEmail: lead.contactEmail,
      hasAnalysis: !!lead.analysis,
      analysis: lead.analysis || null,
      score: lead.score,
    });
  } catch (err) {
    console.error('Debug error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
