const mongoose = require('mongoose');

const preferencesSchema = new mongoose.Schema({
  key: { type: String, unique: true },
  selectedCategories: [String],
  locations: [String],
  lastUpdated: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Preferences', preferencesSchema);
