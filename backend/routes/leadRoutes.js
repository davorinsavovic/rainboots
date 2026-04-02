const express = require('express');
const router = express.Router();
const multer = require('multer');
const csv = require('csv-parse/sync');
const Lead = require('../models/Lead');
const Preferences = require('../models/Preferences');
const { runNow } = require('../jobs/dailyLeadJob');
const progressEmitter = require('../services/progressEmitter');
const {
  findContactEmail,
  findContactEmails,
} = require('../services/emailScraper');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

// ── DEFAULT PREFERENCES ────────────────────────────────────────────────────────
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

// ── HELPER FUNCTIONS ──────────────────────────────────────────────────────────
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

// ── SSE ENDPOINT FOR REAL-TIME COLLECTION PROGRESS ───────────────────────────
router.get('/leads/collect/progress', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.flushHeaders();

  const sendEvent = (data) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  const onProgress = (data) => sendEvent(data);
  progressEmitter.on('progress', onProgress);

  sendEvent({ type: 'connected', message: 'Connected to progress stream' });

  req.on('close', () => {
    progressEmitter.off('progress', onProgress);
  });
});

// ── PREFERENCES ENDPOINTS ─────────────────────────────────────────────────────
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

// ── CATEGORIES ENDPOINT ───────────────────────────────────────────────────────
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

// ── LEAD ENDPOINTS ────────────────────────────────────────────────────────────

// GET all leads with pagination and filters
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
      search,
      tag,
    } = req.query;

    const filter = {};
    if (status && status !== 'all') filter.status = status;
    if (minScore) filter.score = { $gte: parseInt(minScore) };
    if (createdAfter) filter.createdAt = { $gte: new Date(createdAfter) };
    if (createdBefore)
      filter.createdAt = {
        ...(filter.createdAt || {}),
        $lte: new Date(createdBefore),
      };
    if (tag) filter.tags = tag;
    if (search) filter.$text = { $search: search };

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const [leads, total] = await Promise.all([
      Lead.find(filter).sort(sort).skip(skip).limit(limitNum),
      Lead.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limitNum);

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

// GET lead by ID
router.get('/leads/:id', async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ error: 'Lead not found' });
    res.json({ success: true, lead });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// CREATE new lead
router.post('/leads', async (req, res) => {
  try {
    const lead = new Lead({ ...req.body, source: req.body.source || 'manual' });
    await lead.save();
    res.status(201).json({ success: true, data: lead });
  } catch (err) {
    if (err.code === 11000) {
      return res
        .status(409)
        .json({
          success: false,
          error: 'A lead with this email already exists',
        });
    }
    res.status(500).json({ success: false, error: err.message });
  }
});

// UPDATE lead (full update)
router.put('/leads/:id', async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!lead)
      return res.status(404).json({ success: false, error: 'Lead not found' });
    res.json({ success: true, data: lead });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH lead (partial update - for status changes, etc.)
router.patch('/leads/:id', async (req, res) => {
  try {
    const { status, notes, contactEmail, contactName, contactTitle, tags } =
      req.body;
    const update = {};

    if (status) {
      update.status = status;
      if (status === 'reviewed') update.reviewedAt = new Date();
      if (status === 'contacted') {
        update.contactedAt = new Date();
        update.lastContactedAt = new Date();
      }
    }
    if (notes !== undefined) update.notes = notes;
    if (contactEmail !== undefined) update.contactEmail = contactEmail;
    if (contactName !== undefined) update.contactName = contactName;
    if (contactTitle !== undefined) update.contactTitle = contactTitle;
    if (tags !== undefined) update.tags = tags;

    const lead = await Lead.findByIdAndUpdate(req.params.id, update, {
      new: true,
    });
    if (!lead)
      return res.status(404).json({ success: false, error: 'Lead not found' });
    res.json({ success: true, lead });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE lead
router.delete('/leads/:id', async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead)
      return res.status(404).json({ success: false, error: 'Lead not found' });
    res.json({ success: true, message: 'Lead deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// BULK DELETE leads
router.delete('/leads', async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res
        .status(400)
        .json({ success: false, error: 'ids array required' });
    }
    const result = await Lead.deleteMany({ _id: { $in: ids } });
    res.json({ success: true, deleted: result.deletedCount });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET lead statistics
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

// GET all tags
router.get('/leads/tags/all', async (req, res) => {
  try {
    const tags = await Lead.distinct('tags');
    res.json({ success: true, data: tags.filter(Boolean).sort() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── EMAIL SCRAPING ENDPOINTS ──────────────────────────────────────────────────

// Scrape single domain for email
router.post('/leads/scrape-email', async (req, res) => {
  const { domain, includeGuess = false } = req.body;
  if (!domain)
    return res
      .status(400)
      .json({ success: false, error: 'domain is required' });

  try {
    const result = await findContactEmail(domain, { includeGuess });
    if (!result)
      return res.json({
        success: false,
        message: 'No email found for this domain',
      });
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Scrape multiple domains for emails
router.post('/leads/scrape-bulk', async (req, res) => {
  const { domains, includeGuess = false } = req.body;

  if (!Array.isArray(domains) || domains.length === 0) {
    return res
      .status(400)
      .json({ success: false, error: 'domains array required' });
  }
  if (domains.length > 20) {
    return res
      .status(400)
      .json({ success: false, error: 'Max 20 domains per request' });
  }

  try {
    const results = await findContactEmails(domains, { includeGuess });
    res.json({ success: true, data: results });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Scrape and save email for an existing lead
router.post('/leads/scrape-and-save/:id', async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead)
      return res.status(404).json({ success: false, error: 'Lead not found' });

    const domain = req.body.domain || lead.website || lead.domain;
    if (!domain)
      return res
        .status(400)
        .json({ success: false, error: 'No domain available for this lead' });

    const result = await findContactEmail(domain, {
      includeGuess: req.body.includeGuess || false,
    });

    if (result && result.email) {
      lead.contactEmail = result.email;
      lead.emailSource = result.source;
      lead.emailVerified = result.confidence >= 70;
      if (result.firstName || result.lastName) {
        lead.contactName = [result.firstName, result.lastName]
          .filter(Boolean)
          .join(' ');
      }
      if (result.position) lead.contactTitle = result.position;
      await lead.save();
    }

    res.json({
      success: !!result,
      data: result,
      lead: lead,
      message: result
        ? `Found: ${result.email} (${result.source})`
        : 'No email found',
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── CSV IMPORT ────────────────────────────────────────────────────────────────
router.post('/leads/import-csv', upload.single('file'), async (req, res) => {
  if (!req.file)
    return res.status(400).json({ success: false, error: 'No file uploaded' });

  try {
    const records = csv.parse(req.file.buffer.toString(), {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    if (records.length === 0)
      return res.status(400).json({ success: false, error: 'CSV is empty' });
    if (records.length > 1000)
      return res
        .status(400)
        .json({ success: false, error: 'Max 1000 rows per import' });

    const results = { created: 0, skipped: 0, errors: [] };

    for (const row of records) {
      try {
        const businessName =
          row.businessName ||
          row.business_name ||
          row['Business Name'] ||
          row.company ||
          row.Company ||
          '';
        const contactEmail =
          row.contactEmail ||
          row.contact_email ||
          row['Contact Email'] ||
          row.email ||
          row.Email ||
          '';
        const domain =
          row.domain || row.Domain || row.website || row.Website || '';

        if (!businessName && !contactEmail) {
          results.skipped++;
          continue;
        }

        await Lead.create({
          businessName: businessName || contactEmail,
          contactEmail: contactEmail || undefined,
          domain: domain || undefined,
          website: domain || undefined,
          contactName: row.contactName || row['Contact Name'] || row.name || '',
          contactTitle:
            row.contactTitle || row['Contact Title'] || row.title || '',
          phone: row.phone || row.Phone || '',
          category: row.category || row.Category || '',
          location: row.location || row.Location || row.city || '',
          tags: row.tags ? row.tags.split(',').map((t) => t.trim()) : [],
          notes: row.notes || row.Notes || '',
          source: 'csv',
          emailSource: contactEmail ? 'csv' : 'unknown',
        });
        results.created++;
      } catch (e) {
        if (e.code === 11000) results.skipped++;
        else
          results.errors.push({
            row: row.businessName || row.email,
            error: e.message,
          });
      }
    }

    res.json({ success: true, data: results });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, error: `CSV parse error: ${err.message}` });
  }
});

// ── LEAD COLLECTION ──────────────────────────────────────────────────────────
router.post('/leads/collect', async (req, res) => {
  console.log('\n🔧 ========== MANUAL COLLECTION TRIGGERED ==========');
  res.json({ success: true, message: 'Collection started' });

  runNow()
    .then((result) => {
      progressEmitter.emit('progress', {
        type: 'complete',
        message: '✅ Collection complete!',
        result,
      });
    })
    .catch((err) => {
      progressEmitter.emit('progress', {
        type: 'error',
        message: `❌ Error: ${err.message}`,
      });
    });
});

module.exports = router;
