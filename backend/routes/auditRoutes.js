const express = require('express');
const { runAudit } = require('../controllers/auditController');
const Audit = require('../models/Audit');

const router = express.Router();

router.post('/audit', runAudit);

// Save audit result
router.post('/audit/save', async (req, res) => {
  try {
    const audit = new Audit(req.body);
    await audit.save();
    res.json({ success: true, id: audit._id });
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

module.exports = router;
