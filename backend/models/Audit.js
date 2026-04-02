// backend/models/Audit.js
const mongoose = require('mongoose');

const auditSchema = new mongoose.Schema({
  url: { type: String, required: true },
  title: String,
  category: { type: String, default: 'all' },
  analysis: {
    summary: String,
    issues: [String],
    opportunities: [String],
    quickWins: [String],
    outreachMessage: String,
    socialAnalysis: {
      score: Number,
      summary: String,
      missingPlatforms: [String],
      recommendations: [String],
    },
  },
  socialLinks: { type: Map, of: String },
  emailReputation: Object,
  scrapedEmail: {
    email: String,
    source: String,
    confidence: Number,
    firstName: String,
    lastName: String,
    position: String,
    timestamp: Date,
  },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Audit', auditSchema);
