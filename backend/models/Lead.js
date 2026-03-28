const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  businessName: String,
  website: String,
  category: String,
  location: String,

  title: String,
  analysis: {
    summary: String,
    issues: [String],
    opportunities: [String],
    quickWins: [String],
    outreachMessage: String,
    score: Number,
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
