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
    enum: ['new', 'reviewed', 'contacted', 'closed'],
    default: 'new',
  },
  createdAt: { type: Date, default: Date.now },
  reviewedAt: Date,
  contactedAt: Date,
  notes: String,
});

module.exports = mongoose.model('Lead', leadSchema);
