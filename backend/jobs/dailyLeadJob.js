const { scrapeWebsite } = require('../services/scraper');
const { analyzeWebsite } = require('../services/analyzer');
const { getLeads } = require('../services/leadCollector');
const { checkEmailReputation } = require('../services/emailReputation');
const Lead = require('../models/Lead');
const progressEmitter = require('../services/progressEmitter');

// Normalize URLs to prevent duplicates
function normalizeUrl(url) {
  return url
    ?.toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/\/$/, '');
}

// Function to run the job manually or via cron
async function runNow() {
  console.log('\n🌅 ========== DAILY LEAD JOB STARTING ==========');
  const startTime = Date.now();

  progressEmitter.emit('progress', {
    type: 'start',
    message: '🚀 Lead collection started...',
  });

  try {
    progressEmitter.emit('progress', {
      type: 'scraping',
      message: '🔍 Discovering businesses from YellowPages...',
    });

    const leads = await getLeads();

    progressEmitter.emit('progress', {
      type: 'found',
      message: `📋 Found ${leads.length} businesses to analyze`,
      total: leads.length,
    });

    let processed = 0;
    let saved = 0;
    let failed = 0;
    let skipped = 0;

    for (const lead of leads) {
      processed++;

      progressEmitter.emit('progress', {
        type: 'processing',
        message: `🤖 Analyzing ${lead.businessName}...`,
        current: processed,
        total: leads.length,
        saved,
        skipped,
        failed,
        percent: Math.round((processed / leads.length) * 100),
      });

      console.log(
        `\n[${processed}/${leads.length}] Processing: ${lead.businessName}`,
      );

      try {
        if (!lead.website) {
          skipped++;
          continue;
        }

        const normalizedWebsite = normalizeUrl(lead.website);
        const existing = await Lead.findOne({
          website: { $regex: new RegExp(`^https?:\/\/${normalizedWebsite}`) },
        });

        if (existing) {
          progressEmitter.emit('progress', {
            type: 'skipped',
            message: `⏭️ Already exists: ${lead.businessName}`,
            current: processed,
            total: leads.length,
            saved,
            skipped: ++skipped,
            failed,
            percent: Math.round((processed / leads.length) * 100),
          });
          continue;
        }

        const scraped = await scrapeWebsite(lead.website);
        if (!scraped) {
          failed++;
          continue;
        }

        const [analysis, emailReputation] = await Promise.all([
          analyzeWebsite(
            scraped.textContent,
            lead.website,
            scraped.socialLinks || {},
          ),
          checkEmailReputation(lead.website),
        ]);

        if (!analysis) {
          failed++;
          continue;
        }

        const score = analysis.score || 50;

        const newLead = await Lead.create({
          businessName: lead.businessName,
          website: lead.website,
          category: lead.category,
          location: lead.location,
          title: scraped.title || lead.businessName,
          socialLinks: scraped.socialLinks || {},
          emailReputation: emailReputation || null,
          analysis: {
            summary: analysis.summary || '',
            issues: analysis.issues || [],
            opportunities: analysis.opportunities || [],
            quickWins: analysis.quickWins || [],
            outreachMessage: analysis.outreachMessage || '',
            score,
            socialAnalysis: analysis.socialAnalysis || null,
            emailAnalysis: analysis.emailAnalysis || null,
          },
          score,
          status: 'new',
        });

        saved++;

        progressEmitter.emit('progress', {
          type: 'saved',
          message: `✅ Saved: ${lead.businessName} (score: ${score})`,
          current: processed,
          total: leads.length,
          saved,
          skipped,
          failed,
          percent: Math.round((processed / leads.length) * 100),
          leadName: lead.businessName,
          score,
        });
      } catch (err) {
        failed++;
        progressEmitter.emit('progress', {
          type: 'failed',
          message: `❌ Failed: ${lead.businessName} — ${err.message}`,
          current: processed,
          total: leads.length,
          saved,
          skipped,
          failed,
          percent: Math.round((processed / leads.length) * 100),
        });
      }

      if (processed < leads.length) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }

    const duration = ((Date.now() - startTime) / 1000).toFixed(1);

    progressEmitter.emit('progress', {
      type: 'complete',
      message: `🎉 Done! Saved ${saved} new leads in ${duration}s`,
      processed,
      saved,
      skipped,
      failed,
      duration,
    });

    return { processed, saved, failed, skipped };
  } catch (error) {
    progressEmitter.emit('progress', {
      type: 'error',
      message: `🔥 Collection error: ${error.message}`,
    });
    return { error: error.message };
  }
}

// Optional cron setup
const cron = require('node-cron');

if (process.env.ENABLE_CRON === 'true') {
  cron.schedule('0 6 * * *', async () => {
    console.log('⏰ Cron: Running daily lead job at 6 AM');
    await runNow();
  });
}

module.exports = { runNow };
