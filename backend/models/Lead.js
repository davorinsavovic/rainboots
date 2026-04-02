const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  businessName: String,
  website: String,
  category: String,
  location: String,
  title: String,
  socialLinks: { type: Map, of: String },
  emailReputation: {
    domain: String,
    score: Number,
    mx: { exists: Boolean, provider: String },
    spf: { exists: Boolean, strict: Boolean, soft: Boolean },
    dkim: { exists: Boolean, selector: String },
    dmarc: { exists: Boolean, policy: String, strong: Boolean },
  },
  analysis: {
    summary: String,
    issues: [String],
    opportunities: [String],
    quickWins: [String],
    outreachMessage: String,
    score: Number,
    socialAnalysis: {
      score: Number,
      summary: String,
      missingPlatforms: [String],
      recommendations: [String],
    },
    emailAnalysis: {
      summary: String,
      issues: [String],
      recommendations: [String],
    },
  },
  score: { type: Number, default: 0 },
  status: {
    type: String,
    enum: [
      'new',
      'reviewed',
      'contacted',
      'replied',
      'qualified',
      'closed',
      'unsubscribed',
    ],
    default: 'new',
  },
  createdAt: { type: Date, default: Date.now },
  reviewedAt: Date,
  contactedAt: Date,
  notes: String,

  contactEmail: {
    type: String,
    trim: true,
    lowercase: true,
  },

  // Person at the business to address outreach to
  contactName: {
    type: String,
    trim: true,
  },
  contactTitle: {
    type: String,
    trim: true,
  },
  phone: {
    type: String,
    trim: true,
  },

  // Clean domain (e.g. "acme.com") — your existing 'website' may have full URLs,
  // this is used for email scraping lookups
  domain: {
    type: String,
    trim: true,
    lowercase: true,
  },

  // How the contactEmail was found
  emailSource: {
    type: String,
    enum: [
      'manual',
      'hunter',
      'scraped',
      'csv',
      'auto',
      'unknown',
      'guessed',
      'whois',
      'clearbit',
      'abstract',
    ],
    default: 'auto',
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },

  // Freeform tags for grouping/filtering leads (e.g. 'seattle', 'high-priority')
  tags: [{ type: String, trim: true }],

  // History of every campaign email sent to this lead
  campaignsSent: [
    {
      templateId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'EmailTemplate',
      },
      sentAt: { type: Date, default: Date.now },
      subject: { type: String },
    },
  ],

  // Timestamp of the most recent outreach (any channel)
  lastContactedAt: { type: Date },

  // How this lead entered the system
  source: {
    type: String,
    enum: ['auto', 'manual', 'csv', 'scrape', 'other', 'website_audit'],
    default: 'auto',
  },

  // Set when a lead unsubscribes
  unsubscribedAt: { type: Date },
});

// ── Indexes ───────────────────────────────────────────────────────────────────
leadSchema.index({ score: -1 });
leadSchema.index({ status: 1 });
leadSchema.index({ createdAt: -1 });
leadSchema.index({ tags: 1 });
// sparse: true means leads without a contactEmail don't conflict on uniqueness
leadSchema.index({ contactEmail: 1 }, { sparse: true });
leadSchema.index({
  businessName: 'text',
  contactName: 'text',
  location: 'text',
});

module.exports = mongoose.model('Lead', leadSchema);
