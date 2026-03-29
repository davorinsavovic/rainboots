const express = require('express');
const Lead = require('../models/Lead');
const { runNow } = require('../jobs/dailyLeadJob');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Path to category preferences file
const preferencesPath = path.join(
  __dirname,
  '../data/categoryPreferences.json',
);

// Helper to read preferences
const readPreferences = () => {
  try {
    const data = fs.readFileSync(preferencesPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return {
      selectedCategories: [
        'contractor',
        'roofing',
        'plumbing',
        'electrical',
        'landscaping',
        'real estate agent',
        'dentist',
        'restaurant',
        'yoga studio',
        'spa',
      ],
      locations: [
        'Seattle',
        'Bellevue',
        'Kirkland',
        'Redmond',
        'Bothell',
        'Woodinville',
      ],
      lastUpdated: new Date().toISOString(),
    };
  }
};

// Get location preferences
router.get('/preferences/locations', async (req, res) => {
  try {
    const prefs = readPreferences();
    res.json({
      success: true,
      preferences: { locations: prefs.locations || [] },
    });
  } catch (error) {
    console.error('Error reading location preferences:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update location preferences
router.post('/preferences/locations', async (req, res) => {
  try {
    const { locations } = req.body;
    const prefs = readPreferences();
    prefs.locations = locations;
    prefs.lastUpdated = new Date().toISOString();
    savePreferences(prefs);
    res.json({ success: true, preferences: prefs });
  } catch (error) {
    console.error('Error saving location preferences:', error);
    res.status(500).json({ error: error.message });
  }
});

// Helper to save preferences
const savePreferences = (preferences) => {
  const dir = path.dirname(preferencesPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(preferencesPath, JSON.stringify(preferences, null, 2));
};

// Get category preferences
router.get('/preferences/categories', async (req, res) => {
  try {
    const prefs = readPreferences();
    res.json({ success: true, preferences: prefs });
  } catch (error) {
    console.error('Error reading preferences:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update category preferences
router.post('/preferences/categories', async (req, res) => {
  try {
    const { selectedCategories, locations } = req.body;
    const prefs = readPreferences();

    if (selectedCategories !== undefined)
      prefs.selectedCategories = selectedCategories;
    if (locations !== undefined) prefs.locations = locations;
    prefs.lastUpdated = new Date().toISOString();

    savePreferences(prefs);

    res.json({ success: true, preferences: prefs });
  } catch (error) {
    console.error('Error saving preferences:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all available categories
router.get('/categories/all', async (req, res) => {
  const allCategories = [
    // Construction & Trades
    {
      id: 'contractor',
      label: 'General Contractor',
      icon: '🔨',
      group: 'Construction',
    },
    { id: 'roofing', label: 'Roofing', icon: '🏠', group: 'Construction' },
    { id: 'plumbing', label: 'Plumbing', icon: '💧', group: 'Construction' },
    {
      id: 'electrical',
      label: 'Electrical',
      icon: '⚡',
      group: 'Construction',
    },
    {
      id: 'landscaping',
      label: 'Landscaping',
      icon: '🌿',
      group: 'Construction',
    },
    { id: 'painting', label: 'Painting', icon: '🎨', group: 'Construction' },
    { id: 'flooring', label: 'Flooring', icon: '🪵', group: 'Construction' },
    { id: 'hvac', label: 'HVAC', icon: '❄️', group: 'Construction' },
    { id: 'masonry', label: 'Masonry', icon: '🧱', group: 'Construction' },
    { id: 'carpentry', label: 'Carpentry', icon: '🪚', group: 'Construction' },

    // Real Estate & Property
    {
      id: 'real estate agent',
      label: 'Real Estate Agent',
      icon: '🏡',
      group: 'Real Estate',
    },
    {
      id: 'property management',
      label: 'Property Management',
      icon: '🏢',
      group: 'Real Estate',
    },
    {
      id: 'real estate developer',
      label: 'Real Estate Developer',
      icon: '🏗️',
      group: 'Real Estate',
    },
    {
      id: 'commercial real estate',
      label: 'Commercial Real Estate',
      icon: '🏭',
      group: 'Real Estate',
    },

    // Health & Wellness
    { id: 'dentist', label: 'Dentist', icon: '🦷', group: 'Healthcare' },
    {
      id: 'chiropractor',
      label: 'Chiropractor',
      icon: '👨‍⚕️',
      group: 'Healthcare',
    },
    {
      id: 'physical therapy',
      label: 'Physical Therapy',
      icon: '💪',
      group: 'Healthcare',
    },
    { id: 'yoga studio', label: 'Yoga Studio', icon: '🧘', group: 'Wellness' },
    { id: 'fitness gym', label: 'Fitness Gym', icon: '🏋️', group: 'Wellness' },
    { id: 'spa', label: 'Spa', icon: '💆', group: 'Wellness' },
    { id: 'salon', label: 'Salon', icon: '💇', group: 'Wellness' },
    {
      id: 'massage therapy',
      label: 'Massage Therapy',
      icon: '💆‍♂️',
      group: 'Wellness',
    },

    // Food & Beverage
    { id: 'restaurant', label: 'Restaurant', icon: '🍽️', group: 'Food' },
    { id: 'cafe', label: 'Cafe', icon: '☕', group: 'Food' },
    { id: 'bakery', label: 'Bakery', icon: '🥐', group: 'Food' },
    { id: 'food truck', label: 'Food Truck', icon: '🚚', group: 'Food' },
    { id: 'brewery', label: 'Brewery', icon: '🍺', group: 'Food' },
    { id: 'winery', label: 'Winery', icon: '🍷', group: 'Food' },

    // Professional Services
    {
      id: 'accounting',
      label: 'Accounting',
      icon: '📊',
      group: 'Professional',
    },
    { id: 'lawyer', label: 'Lawyer', icon: '⚖️', group: 'Professional' },
    {
      id: 'insurance agent',
      label: 'Insurance Agent',
      icon: '🛡️',
      group: 'Professional',
    },
    {
      id: 'financial advisor',
      label: 'Financial Advisor',
      icon: '💰',
      group: 'Professional',
    },
    {
      id: 'marketing agency',
      label: 'Marketing Agency',
      icon: '📢',
      group: 'Professional',
    },
    {
      id: 'web design',
      label: 'Web Design',
      icon: '💻',
      group: 'Professional',
    },

    // Automotive
    {
      id: 'auto repair',
      label: 'Auto Repair',
      icon: '🔧',
      group: 'Automotive',
    },
    {
      id: 'car detailing',
      label: 'Car Detailing',
      icon: '🚗',
      group: 'Automotive',
    },
    { id: 'towing', label: 'Towing', icon: '🚛', group: 'Automotive' },
    {
      id: 'auto body shop',
      label: 'Auto Body Shop',
      icon: '🚙',
      group: 'Automotive',
    },

    // Home Services
    {
      id: 'cleaning service',
      label: 'Cleaning Service',
      icon: '🧹',
      group: 'Home Services',
    },
    {
      id: 'window washing',
      label: 'Window Washing',
      icon: '🪟',
      group: 'Home Services',
    },
    {
      id: 'pest control',
      label: 'Pest Control',
      icon: '🐜',
      group: 'Home Services',
    },
    {
      id: 'moving company',
      label: 'Moving Company',
      icon: '📦',
      group: 'Home Services',
    },

    // Pet Services
    {
      id: 'pet grooming',
      label: 'Pet Grooming',
      icon: '🐕',
      group: 'Pet Services',
    },
    {
      id: 'veterinarian',
      label: 'Veterinarian',
      icon: '🐾',
      group: 'Pet Services',
    },
    {
      id: 'dog walking',
      label: 'Dog Walking',
      icon: '🐩',
      group: 'Pet Services',
    },

    // Education
    { id: 'daycare', label: 'Daycare', icon: '👶', group: 'Education' },
    { id: 'tutoring', label: 'Tutoring', icon: '📚', group: 'Education' },
    {
      id: 'music lessons',
      label: 'Music Lessons',
      icon: '🎵',
      group: 'Education',
    },
    { id: 'art studio', label: 'Art Studio', icon: '🎨', group: 'Education' },

    // Entertainment
    { id: 'nightclub', label: 'Nightclub', icon: '🎵', group: 'Entertainment' },
    {
      id: 'event planning',
      label: 'Event Planning',
      icon: '🎉',
      group: 'Entertainment',
    },
    {
      id: 'photography',
      label: 'Photography',
      icon: '📸',
      group: 'Entertainment',
    },
  ];

  res.json({ success: true, categories: allCategories });
});

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
