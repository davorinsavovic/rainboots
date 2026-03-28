const express = require('express');
const Lead = require('../models/Lead');
const { runNow } = require('../jobs/dailyLeadJob');

const router = express.Router();

// Get all leads with pagination, filtering, and sorting
router.get('/leads', async (req, res) => {
  try {
    const {
      limit = 10,
      page = 1,
      sort = '-score',
      status,
      createdAfter,
      createdBefore,
      minScore,
    } = req.query;

    // Build filter object
    let filter = {};
    if (status && status !== 'all') filter.status = status;
    if (minScore) filter.score = { $gte: parseInt(minScore) };

    // Date filtering
    if (createdAfter) {
      filter.createdAt = { $gte: new Date(createdAfter) };
    }
    if (createdBefore) {
      filter.createdAt = { ...filter.createdAt, $lte: new Date(createdBefore) };
    }

    // Calculate pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Get total count for pagination
    const total = await Lead.countDocuments(filter);
    const totalPages = Math.ceil(total / limitNum);

    // Get paginated and sorted results
    const leads = await Lead.find(filter).sort(sort).skip(skip).limit(limitNum);

    console.log(
      `📊 Fetched ${leads.length} leads (page ${pageNum} of ${totalPages}, total: ${total})`,
    );

    res.json({
      success: true,
      leads,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalLeads: total,
        limit: limitNum,
        hasNext: pageNum < totalPages,
        hasPrev: pageNum > 1,
      },
    });
  } catch (error) {
    console.error('Error fetching leads:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get single lead
router.get('/leads/:id', async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ error: 'Lead not found' });
    res.json({ success: true, lead });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update lead status
router.patch('/leads/:id', async (req, res) => {
  try {
    const { status, notes } = req.body;
    const update = { status };
    if (notes) update.notes = notes;
    if (status === 'reviewed') update.reviewedAt = new Date();
    if (status === 'contacted') update.contactedAt = new Date();

    const lead = await Lead.findByIdAndUpdate(req.params.id, update, {
      new: true,
    });
    res.json({ success: true, lead });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get lead statistics
router.get('/stats/leads', async (req, res) => {
  try {
    const total = await Lead.countDocuments();
    const newLeads = await Lead.countDocuments({ status: 'new' });
    const reviewed = await Lead.countDocuments({ status: 'reviewed' });
    const contacted = await Lead.countDocuments({ status: 'contacted' });
    const closed = await Lead.countDocuments({ status: 'closed' });

    const avgResult = await Lead.aggregate([
      { $group: { _id: null, avg: { $avg: '$score' } } },
    ]);

    // Get leads created in last 7 days
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const newThisWeek = await Lead.countDocuments({
      createdAt: { $gte: weekAgo },
    });

    const stats = {
      total,
      new: newLeads,
      reviewed,
      contacted,
      closed,
      avgScore: Math.round(avgResult[0]?.avg || 0),
      newThisWeek,
    };

    res.json({ success: true, stats });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: error.message });
  }
});

// Manually trigger lead collection - RUN SYNC to see output
router.post('/leads/collect', async (req, res) => {
  console.log('\n🔧 ========== MANUAL COLLECTION TRIGGERED ==========');

  try {
    // Run the job and WAIT for it to complete
    console.log('⏳ Running lead collection (this may take a few minutes)...');

    const result = await runNow();

    console.log('✅ Collection completed. Sending response...');

    res.json({
      success: true,
      message: 'Lead collection completed',
      result,
    });
  } catch (error) {
    console.error('🔥 Collection error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      stack: error.stack,
    });
  }
});

module.exports = router;
