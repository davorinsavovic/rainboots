const express = require('express');
const Lead = require('../models/Lead');
const Preferences = require('../models/Preferences');
const { runNow } = require('../jobs/dailyLeadJob');

const router = express.Router();

const DEFAULT_PREFERENCES = {
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
};

const readPreferences = async () => {
  try {
    const prefs = await Preferences.findOne({ key: 'main' });
    return prefs || DEFAULT_PREFERENCES;
  } catch (error) {
    return DEFAULT_PREFERENCES;
  }
};

const savePreferences = async (data) => {
  await Preferences.findOneAndUpdate(
    { key: 'main' },
    { ...data, key: 'main', lastUpdated: new Date() },
    { upsert: true, new: true },
  );
};

router.get('/preferences/locations', async (req, res) => {
  try {
    const prefs = await readPreferences();
    res.json({
      success: true,
      preferences: { locations: prefs.locations || [] },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/preferences/locations', async (req, res) => {
  try {
    const { locations } = req.body;
    const prefs = await readPreferences();
    await savePreferences({ ...(prefs._doc || prefs), locations });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/preferences/categories', async (req, res) => {
  try {
    const prefs = await readPreferences();
    res.json({ success: true, preferences: prefs });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/preferences/categories', async (req, res) => {
  try {
    const { selectedCategories, locations } = req.body;
    const prefs = await readPreferences();
    const current = prefs._doc || prefs;
    await savePreferences({
      ...current,
      ...(selectedCategories !== undefined && { selectedCategories }),
      ...(locations !== undefined && { locations }),
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/categories/all', async (req, res) => {
  const allCategories = [
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
    { id: 'restaurant', label: 'Restaurant', icon: '🍽️', group: 'Food' },
    { id: 'cafe', label: 'Cafe', icon: '☕', group: 'Food' },
    { id: 'bakery', label: 'Bakery', icon: '🥐', group: 'Food' },
    { id: 'food truck', label: 'Food Truck', icon: '🚚', group: 'Food' },
    { id: 'brewery', label: 'Brewery', icon: '🍺', group: 'Food' },
    { id: 'winery', label: 'Winery', icon: '🍷', group: 'Food' },
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
    { id: 'daycare', label: 'Daycare', icon: '👶', group: 'Education' },
    { id: 'tutoring', label: 'Tutoring', icon: '📚', group: 'Education' },
    {
      id: 'music lessons',
      label: 'Music Lessons',
      icon: '🎵',
      group: 'Education',
    },
    { id: 'art studio', label: 'Art Studio', icon: '🎨', group: 'Education' },
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

    let filter = {};
    if (status && status !== 'all') filter.status = status;
    if (minScore) filter.score = { $gte: parseInt(minScore) };
    if (createdAfter) filter.createdAt = { $gte: new Date(createdAfter) };
    if (createdBefore)
      filter.createdAt = { ...filter.createdAt, $lte: new Date(createdBefore) };

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const total = await Lead.countDocuments(filter);
    const totalPages = Math.ceil(total / limitNum);
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

router.get('/leads/:id', async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ error: 'Lead not found' });
    res.json({ success: true, lead });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

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

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const newThisWeek = await Lead.countDocuments({
      createdAt: { $gte: weekAgo },
    });

    res.json({
      success: true,
      stats: {
        total,
        new: newLeads,
        reviewed,
        contacted,
        closed,
        avgScore: Math.round(avgResult[0]?.avg || 0),
        newThisWeek,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/leads/collect', async (req, res) => {
  console.log('\n🔧 ========== MANUAL COLLECTION TRIGGERED ==========');
  res.json({ success: true, message: 'Collection started' });

  runNow()
    .then((result) => {
      console.log('✅ Background collection complete:', JSON.stringify(result));
    })
    .catch((err) => {
      console.error('🔥 Background collection error:', err.message);
    });
});

module.exports = router;
