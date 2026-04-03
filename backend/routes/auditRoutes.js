const express = require('express');
const mongoose = require('mongoose');
const { runAudit } = require('../controllers/auditController');
const Audit = require('../models/Audit');

const router = express.Router();

/**
 * 🧪 TEST ROUTE
 */
router.get('/test', (req, res) => {
  res.json({ success: true, message: 'Audit routes working' });
});

router.post('/audit', runAudit);

router.post('/audit/save', async (req, res) => {
  try {
    const auditData = req.body;

    const existing = await Audit.findOne({ url: auditData.url });

    if (existing) {
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

      return res.json({
        success: true,
        id: existing._id,
        updated: true,
      });
    }

    const audit = new Audit({
      ...auditData,
      timestamp: new Date(),
    });

    await audit.save();

    res.json({
      success: true,
      id: audit._id,
      updated: false,
    });
  } catch (err) {
    console.error('Error saving audit:', err);
    res.status(500).json({ error: 'Failed to save audit' });
  }
});

router.get('/audit/history', async (req, res) => {
  try {
    const audits = await Audit.find().sort({ timestamp: -1 }).limit(20);

    res.json({ success: true, audits });
  } catch (err) {
    console.error('Error fetching history:', err);
    res.status(500).json({ error: 'Failed to fetch audit history' });
  }
});

router.get('/audit-list', async (req, res) => {
  try {
    console.log('📊 /audit-list endpoint called');

    const audits = await Audit.find().sort({ timestamp: -1 });

    console.log(`📊 Found ${audits.length} audits`);

    const formattedAudits = audits.map((audit) => ({
      _id: audit._id,
      businessName:
        audit.title ||
        audit.url.replace(/^https?:\/\//, '').replace(/\/.*$/, ''),
      website: audit.url,
      contactEmail: audit.scrapedEmail?.email || null,
      contactName: audit.scrapedEmail?.firstName
        ? `${audit.scrapedEmail.firstName} ${audit.scrapedEmail.lastName || ''}`.trim()
        : null,
      score: audit.analysis?.score || 50,
      status: 'new',
      analysis: audit.analysis || {},
      socialLinks: audit.socialLinks || {},
      emailReputation: audit.emailReputation || {},
      source: 'website_audit',
      createdAt: audit.timestamp,
    }));

    res.json({
      success: true,
      leads: formattedAudits,
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalLeads: formattedAudits.length,
        limit: formattedAudits.length,
        hasNext: false,
        hasPrev: false,
      },
    });
  } catch (error) {
    console.error('Error in /audit-list:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/audit', async (req, res) => {
  try {
    const audits = await Audit.find().sort({ timestamp: -1 });

    res.json({
      success: true,
      data: audits,
    });
  } catch (err) {
    console.error('Error fetching audits:', err);
    res.status(500).json({ error: 'Failed to fetch audits' });
  }
});

router.get('/audit/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ Prevent crash
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid audit ID',
      });
    }

    const audit = await Audit.findById(id);

    if (!audit) {
      return res.status(404).json({
        success: false,
        error: 'Audit not found',
      });
    }

    res.json({
      success: true,
      audit,
    });
  } catch (err) {
    console.error('Error fetching audit by ID:', err);
    res.status(500).json({ error: 'Failed to fetch audit' });
  }
});

module.exports = router;
