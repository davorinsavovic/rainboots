const mongoose = require('mongoose');

const emailTemplateSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      maxlength: 100,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    content: {
      type: String,
      required: true,
    },
    completeContent: {
      type: String,
    },
    status: {
      type: Boolean,
      default: true,
    },
    includeSignature: {
      type: Boolean,
      default: false,
    },
    signatureConfig: {
      organizationName: {
        type: String,
        default: 'Rainboots Marketing',
        trim: true,
      },
      title: { type: String, trim: true, default: '' },
      fullName: { type: String, trim: true, default: '' },
      phone: { type: String, trim: true, default: '' },
      email: { type: String, trim: true, default: '' },
      website: {
        type: String,
        trim: true,
        default: 'https://rainbootsmarketing.com',
      },
      additionalInfo: { type: String, trim: true, default: '' },
    },
    variables: [
      {
        name: { type: String, required: true, trim: true },
        description: { type: String, required: true, trim: true },
        defaultValue: { type: String, trim: true },
      },
    ],
    category: {
      type: String,
      enum: ['outreach', 'follow-up', 'proposal', 'newsletter', 'other'],
      default: 'outreach',
    },
    tags: [{ type: String, trim: true }],
    version: { type: Number, default: 1 },
    previousVersions: [
      {
        content: String,
        updatedAt: Date,
        updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      },
    ],
    attachments: [
      {
        filename: { type: String, trim: true },
        url: { type: String, trim: true },
        size: { type: Number },
        mimeType: { type: String, trim: true },
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    lastUpdatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

emailTemplateSchema.index({ tags: 1 });
emailTemplateSchema.index({ createdAt: -1 });
emailTemplateSchema.index({ category: 1, status: 1 });

// ── Helpers ───────────────────────────────────────────────────────────────────
const getR2PublicUrl = () =>
  process.env.R2_PUBLIC_URL ||
  'https://pub-3eb0901007e24e51b6ed1bde149cb0bb.r2.dev';

const getLogoUrl = () => `${getR2PublicUrl()}/logo/rainboots-logo.png`;

const addEmailStyles = (html) => {
  if (!html) return '';
  let s = html;
  s = s.replace(
    /<p(\s[^>]*)?>/g,
    '<p style="margin:0 0 16px;padding:0;line-height:1.6;color:#333;"$1>',
  );
  s = s.replace(
    /<h1(\s[^>]*)?>/g,
    '<h1 style="font-size:28px;font-weight:bold;margin:0 0 20px;color:#222;line-height:1.3;"$1>',
  );
  s = s.replace(
    /<h2(\s[^>]*)?>/g,
    '<h2 style="font-size:24px;font-weight:bold;margin:0 0 18px;color:#222;line-height:1.3;"$1>',
  );
  s = s.replace(
    /<h3(\s[^>]*)?>/g,
    '<h3 style="font-size:20px;font-weight:600;margin:0 0 16px;color:#222;line-height:1.3;"$1>',
  );
  s = s.replace(
    /<ul(\s[^>]*)?>/g,
    '<ul style="margin:0 0 16px 20px;padding:0;color:#333;line-height:1.6;"$1>',
  );
  s = s.replace(
    /<ol(\s[^>]*)?>/g,
    '<ol style="margin:0 0 16px 20px;padding:0;color:#333;line-height:1.6;"$1>',
  );
  s = s.replace(/<li(\s[^>]*)?>/g, '<li style="margin:0 0 8px;padding:0;"$1>');
  s = s.replace(
    /<a(\s[^>]*)?>/g,
    '<a style="color:#212d51;text-decoration:none;border-bottom:1px solid #212d51;padding-bottom:1px;"$1>',
  );
  s = s.replace(/<strong(\s[^>]*)?>/g, '<strong style="font-weight:bold;"$1>');
  s = s.replace(/<em(\s[^>]*)?>/g, '<em style="font-style:italic;"$1>');
  s = s.replace(
    /<blockquote(\s[^>]*)?>/g,
    '<blockquote style="margin:20px 0;padding:15px 20px;background:#f8f9fa;border-left:4px solid #212d51;color:#555;font-style:italic;"$1>',
  );
  return s;
};

// ── Instance methods ──────────────────────────────────────────────────────────
emailTemplateSchema.methods.generateSignatureHTML = function () {
  if (!this.includeSignature || !this.signatureConfig) return '';
  const {
    organizationName = '',
    title = '',
    fullName = '',
    phone = '',
    email = '',
    website = '',
    additionalInfo = '',
  } = this.signatureConfig;
  return `
<div style="margin-top:40px;padding-top:20px;border-top:1px solid #eaeaea;">
  <strong style="color:#222;font-size:16px;display:block;margin-bottom:8px;">${organizationName}</strong>
  ${fullName ? `<div style="margin-bottom:4px;"><strong>${fullName}</strong></div>` : ''}
  ${title ? `<div style="margin-bottom:4px;color:#666;font-size:14px;">${title}</div>` : ''}
  <div style="margin-top:12px;font-size:14px;">
    ${phone ? `<div style="margin-bottom:4px;"><span style="color:#666;">Phone:</span> ${phone}</div>` : ''}
    ${email ? `<div style="margin-bottom:4px;"><span style="color:#666;">Email:</span> <a href="mailto:${email}" style="color:#212d51;text-decoration:none;">${email}</a></div>` : ''}
    ${website ? `<div style="margin-bottom:4px;"><span style="color:#666;">Website:</span> <a href="${website}" style="color:#212d51;text-decoration:none;">${website}</a></div>` : ''}
    ${additionalInfo ? `<div style="margin-top:8px;color:#666;font-size:13px;">${additionalInfo}</div>` : ''}
  </div>
</div>`;
};

emailTemplateSchema.methods.generateAttachmentsHTML = function () {
  if (!this.attachments || this.attachments.length === 0) return '';
  const items = this.attachments
    .map((a) => {
      const icon = a.mimeType?.startsWith('image/')
        ? '🖼️'
        : a.mimeType === 'application/pdf'
          ? '📄'
          : '📎';
      return `<div style="margin:12px 0;padding:12px;background:#f8f9fa;border-radius:6px;border-left:4px solid #212d51;">
      <span style="font-size:20px;">${icon}</span>
      <strong style="margin-left:8px;">${a.filename}</strong>
      ${a.url ? `<div style="margin-top:6px;font-size:13px;"><a href="${a.url}" style="color:#212d51;" target="_blank">Download</a></div>` : ''}
    </div>`;
    })
    .join('');
  return `<div style="margin-top:30px;padding-top:25px;border-top:2px solid #eaeaea;">
    <h3 style="color:#333;font-size:18px;">📎 Attachments (${this.attachments.length})</h3>${items}</div>`;
};

emailTemplateSchema.methods.getCompleteEmailHTML = function () {
  const logoUrl = getLogoUrl();
  let body = addEmailStyles(this.content);
  if (this.attachments && this.attachments.length > 0)
    body += this.generateAttachmentsHTML();
  if (this.includeSignature) body += this.generateSignatureHTML();

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <title>${this.subject}</title>
  <style>
    @media only screen and (max-width:600px){.container{width:100%!important;padding:10px!important;}.email-body{padding:20px!important;}}
    body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;line-height:1.6;color:#333;margin:0;padding:0;}
  </style>
</head>
<body style="margin:0;padding:0;background:#f6f6f6;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f6f6f6;padding:40px 0;">
    <tr><td align="center">
      <div class="container" style="max-width:600px;margin:0 auto;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#fff;border-radius:8px;box-shadow:0 2px 10px rgba(0,0,0,0.05);overflow:hidden;">
          <tr>
            <td style="padding:30px 30px 0;">
              <div style="border-bottom:1px solid #eaeaea;padding-bottom:20px;">
                <img src="${logoUrl}" alt="Rainboots Marketing" height="36" style="display:block;height:36px;"
                     onerror="this.onerror=null;this.src='https://rainbootsmarketing.com/assets/img/logo.png';" />
              </div>
             </td>
           </tr>
           <tr>
            <td class="email-body" style="padding:30px;">
              <div style="max-width:100%;">${body}</div>
            </td>
           </tr>
           <tr>
            <td style="padding:0 30px;">
              <div style="text-align:center;font-size:13px;color:#666;padding:30px 0 20px;margin-top:40px;border-top:1px solid #eaeaea;">
                <p style="margin:0 0 8px;">You're receiving this email from <strong style="color:#333;">Rainboots Marketing</strong>.</p>
                <p style="margin:0;">
                  <a href="https://rainbootsmarketing.com/unsubscribe" style="color:#212d51;text-decoration:none;">Unsubscribe</a> &bull;
                  <a href="https://rainbootsmarketing.com/contact" style="color:#212d51;text-decoration:none;">Contact Us</a> &bull;
                  <a href="https://rainbootsmarketing.com" style="color:#212d51;text-decoration:none;">Website</a>
                </p>
              </div>
            </td>
           </tr>
        </table>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top:20px;">
          <tr><td align="center" style="padding:20px 0;">
            <p style="margin:0;font-size:12px;color:#999;">&copy; ${new Date().getFullYear()} Rainboots Marketing. All rights reserved.</p>
          </td></tr>
        </table>
      </div>
    </td>
  </tr>
</table>
</body>
</html>`;
};

// ── Pre-save: regenerate completeContent + version ────────────────────────────
emailTemplateSchema.pre('save', function (next) {
  if (
    this.isModified('content') ||
    this.isModified('includeSignature') ||
    this.isModified('signatureConfig') ||
    this.isModified('attachments')
  ) {
    this.completeContent = this.getCompleteEmailHTML();
    if (!this.isNew) {
      this.previousVersions = this.previousVersions || [];
      this.previousVersions.push({
        content: this.content,
        updatedAt: new Date(),
        updatedBy: this.lastUpdatedBy,
      });
      this.version += 1;
    }
  }
  next();
});

const EmailTemplate = mongoose.model('EmailTemplate', emailTemplateSchema);
module.exports = EmailTemplate;
