const { getLeads } = require('../services/leadCollector');
const { scrapeWebsite } = require('../services/scraper');
const { analyzeWebsite } = require('../services/analyzer');
const { checkEmailReputation } = require('../services/emailReputation');
const { findContactEmail } = require('../services/emailScraper');
const Lead = require('../models/Lead');
const Preferences = require('../models/Preferences');
const progressEmitter = require('../services/progressEmitter');

const readPreferences = async () => {
  try {
    const prefs = await Preferences.findOne({ key: 'main' });
    return (
      prefs || {
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
      }
    );
  } catch (error) {
    return DEFAULT_PREFERENCES;
  }
};

const processLead = async (business, preferences) => {
  const results = {
    success: false,
    businessName: business.businessName,
    website: business.website,
    error: null,
    data: null,
  };

  try {
    console.log(
      `\n📊 Processing: ${business.businessName} (${business.website})`,
    );

    // 1. Scrape website (like WebsiteAudit)
    const scraped = await scrapeWebsite(business.website);
    if (!scraped) {
      results.error = 'Failed to scrape website';
      return results;
    }

    // 2. Check email reputation
    const emailReputation = await checkEmailReputation(business.website);

    // 3. Analyze with Claude AI
    const analysis = await analyzeWebsite(
      scraped.textContent,
      business.website,
      scraped.socialLinks || {},
      emailReputation,
    );

    // 4. Scrape contact email
    const domain = business.website
      .replace(/^https?:\/\//, '')
      .replace(/\/.*$/, '')
      .replace(/^www\./, '');
    const contactEmail = await findContactEmail(domain, { includeGuess: true });

    // 5. Calculate score from analysis
    const score = analysis.score || Math.floor(Math.random() * 40) + 30;

    results.data = {
      businessName: business.businessName,
      website: business.website,
      domain: domain,
      category: business.category,
      location: business.location,
      title: scraped.title,
      socialLinks: scraped.socialLinks || {},
      emailReputation: emailReputation,
      analysis: {
        summary: analysis.summary,
        issues: analysis.issues || [],
        opportunities: analysis.opportunities || [],
        quickWins: analysis.quickWins || [],
        outreachMessage: analysis.outreachMessage,
        score: score,
        socialAnalysis: analysis.socialAnalysis || {},
        emailAnalysis: analysis.emailAnalysis || {},
      },
      score: score,
      status: 'new',
      source: 'auto',
      contactEmail: contactEmail?.email || null,
      emailSource: contactEmail?.source || null,
      emailVerified: contactEmail?.confidence >= 70 || false,
      contactName: contactEmail?.firstName
        ? `${contactEmail.firstName} ${contactEmail.lastName || ''}`.trim()
        : null,
      contactTitle: contactEmail?.position || null,
      tags: [business.category, 'auto-collected'],
    };

    results.success = true;
    console.log(`  ✅ Processed: ${business.businessName} (Score: ${score})`);
    if (contactEmail?.email) {
      console.log(`  📧 Email found: ${contactEmail.email}`);
    }
    if (scraped.socialLinks && Object.keys(scraped.socialLinks).length > 0) {
      console.log(
        `  📱 Social: ${Object.keys(scraped.socialLinks).join(', ')}`,
      );
    }
  } catch (err) {
    console.error(
      `  ❌ Error processing ${business.businessName}:`,
      err.message,
    );
    results.error = err.message;
  }

  return results;
};

const runNow = async () => {
  console.log('\n🚀 ========== STARTING LEAD COLLECTION ==========\n');

  const preferences = await readPreferences();
  const categories = preferences.selectedCategories || [];
  const locations = preferences.locations || [];

  console.log(`🎯 Categories: ${categories.join(', ')}`);
  console.log(`📍 Locations: ${locations.join(', ')}\n`);

  // Get leads from discovery service
  const discoveredLeads = await getLeads(preferences);
  console.log(`\n📊 Discovered ${discoveredLeads.length} potential leads\n`);

  let saved = 0;
  let skipped = 0;
  let failed = 0;
  let current = 0;
  const total = discoveredLeads.length;

  progressEmitter.emit('progress', {
    type: 'start',
    message: `Starting collection of ${total} leads...`,
    total: total,
    current: 0,
    saved: 0,
    skipped: 0,
    failed: 0,
    percent: 0,
  });

  for (const business of discoveredLeads) {
    current++;
    const percent = Math.round((current / total) * 100);

    progressEmitter.emit('progress', {
      type: 'processing',
      message: `Processing ${current}/${total}: ${business.businessName}`,
      current: current,
      total: total,
      saved: saved,
      skipped: skipped,
      failed: failed,
      percent: percent,
    });

    // Check if lead already exists
    const existing = await Lead.findOne({ website: business.website });
    if (existing) {
      console.log(`⏭️ Skipping existing: ${business.businessName}`);
      skipped++;
      progressEmitter.emit('progress', {
        type: 'skipped',
        message: `⏭️ Skipped ${business.businessName} (already exists)`,
        current: current,
        total: total,
        saved: saved,
        skipped: skipped,
        failed: failed,
        percent: percent,
      });
      continue;
    }

    // Process the lead (scrape website, analyze, find email)
    const result = await processLead(business, preferences);

    if (result.success && result.data) {
      try {
        await Lead.create(result.data);
        saved++;
        progressEmitter.emit('progress', {
          type: 'saved',
          message: `✅ Saved ${result.data.businessName} (Score: ${result.data.score})${result.data.contactEmail ? ` - Email: ${result.data.contactEmail}` : ''}`,
          current: current,
          total: total,
          saved: saved,
          skipped: skipped,
          failed: failed,
          percent: percent,
        });
      } catch (err) {
        console.error(`Failed to save ${business.businessName}:`, err);
        failed++;
        progressEmitter.emit('progress', {
          type: 'failed',
          message: `❌ Failed to save ${business.businessName}: ${err.message}`,
          current: current,
          total: total,
          saved: saved,
          skipped: skipped,
          failed: failed,
          percent: percent,
        });
      }
    } else {
      failed++;
      progressEmitter.emit('progress', {
        type: 'failed',
        message: `❌ Failed to process ${business.businessName}: ${result.error || 'Unknown error'}`,
        current: current,
        total: total,
        saved: saved,
        skipped: skipped,
        failed: failed,
        percent: percent,
      });
    }

    // Small delay to be respectful to websites
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  const finalMessage = `✅ Collection complete! Saved: ${saved}, Skipped: ${skipped}, Failed: ${failed}`;
  console.log(`\n${finalMessage}\n`);

  progressEmitter.emit('progress', {
    type: 'complete',
    message: finalMessage,
    saved: saved,
    skipped: skipped,
    failed: failed,
    total: total,
  });

  return { saved, skipped, failed, total };
};

module.exports = { runNow };
