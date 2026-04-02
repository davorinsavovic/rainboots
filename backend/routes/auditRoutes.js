const express = require('express');
const { runAudit } = require('../controllers/auditController');
const Audit = require('../models/Audit');

const router = express.Router();

router.post('/audit', runAudit);

// Save audit result (with scraped email)
router.post('/audit/save', async (req, res) => {
  try {
    const auditData = req.body;

    // Check if audit already exists for this URL
    const existing = await Audit.findOne({ url: auditData.url });

    if (existing) {
      // Update existing audit
      existing.title = auditData.title;
      existing.category = auditData.category;
      existing.analysis = auditData.analysis;
      existing.socialLinks = auditData.socialLinks;
      existing.emailReputation = auditData.emailReputation;
      if (auditData.scrapedEmail) {
        existing.scrapedEmail = auditData.scrapedEmail;
      }
      existing.timestamp = new Date();
      await existing.save();
      res.json({ success: true, id: existing._id, updated: true });
    } else {
      // Create new audit
      const audit = new Audit(auditData);
      await audit.save();
      res.json({ success: true, id: audit._id, updated: false });
    }
  } catch (err) {
    console.error('Error saving audit:', err);
    res.status(500).json({ error: 'Failed to save audit' });
  }
});

// Get audit history
router.get('/audit/history', async (req, res) => {
  try {
    const audits = await Audit.find().sort({ timestamp: -1 }).limit(20);
    res.json({ success: true, audits });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch audit history' });
  }
});

// Get single audit by ID
router.get('/audit/:id', async (req, res) => {
  try {
    const audit = await Audit.findById(req.params.id);
    if (!audit) {
      return res.status(404).json({ success: false, error: 'Audit not found' });
    }
    res.json({ success: true, audit });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch audit' });
  }
});

module.exports = router;
