const { scrapeWebsite } = require('../services/scraper');
const { analyzeWebsite } = require('../services/analyzer');
const { getLeads } = require('../services/leadCollector');
const Lead = require('../models/Lead');

// Function to run the job manually or via cron
async function runNow() {
  console.log('\n🌅 ========== DAILY LEAD JOB STARTING ==========');
  const startTime = Date.now();

  try {
    const leads = await getLeads();
    console.log(`📊 Found ${leads.length} leads to process\n`);

    let processed = 0;
    let saved = 0;
    let failed = 0;
    let skipped = 0;

    for (const lead of leads) {
      processed++;
      console.log(
        `\n[${processed}/${leads.length}] Processing: ${lead.businessName}`,
      );
      console.log(`   📍 URL: ${lead.website}`);
      console.log(
        `   📂 Category: ${lead.category} | Location: ${lead.location}`,
      );

      try {
        if (!lead.website) {
          console.log(`   ⏭️  No website URL, skipping`);
          skipped++;
          continue;
        }

        // Check if already exists in database
        const existing = await Lead.findOne({ website: lead.website });
        if (existing) {
          console.log(
            `   📌 Already exists (created: ${existing.createdAt.toLocaleDateString()}), skipping`,
          );
          skipped++;
          continue;
        }

        // Scrape website
        console.log(`   🌐 Scraping website...`);
        const scraped = await scrapeWebsite(lead.website);

        if (!scraped) {
          console.log(
            `   ❌ Scraping failed - website may be down or doesn't exist`,
          );
          failed++;
          continue;
        }

        console.log(`   ✅ Scraped successfully`);
        console.log(
          `   📄 Title: ${scraped.title?.substring(0, 60) || 'No title'}...`,
        );
        console.log(
          `   📊 Content length: ${scraped.textContent?.length || 0} chars`,
        );

        // Analyze with AI
        console.log(`   🤖 Analyzing with Claude...`);
        const analysis = await analyzeWebsite(
          scraped.textContent,
          lead.website,
        );

        if (!analysis) {
          console.log(`   ❌ Analysis failed - API error`);
          failed++;
          continue;
        }

        // Calculate score
        const score = analysis.score || 50; // Default score if missing
        console.log(`   📊 Opportunity Score: ${score}/100`);

        // Save to database
        const newLead = await Lead.create({
          businessName: lead.businessName,
          website: lead.website,
          category: lead.category,
          location: lead.location,
          title: scraped.title || lead.businessName,
          analysis: {
            summary: analysis.summary || 'No summary available',
            issues: analysis.issues || [],
            opportunities: analysis.opportunities || [],
            quickWins: analysis.quickWins || [],
            outreachMessage: analysis.outreachMessage || '',
            score: score,
          },
          score: score,
          status: 'new',
        });

        saved++;
        console.log(`   ✅ SAVED! (ID: ${newLead._id})`);
        console.log(
          `   📝 Issues: ${analysis.issues?.length || 0} | Opportunities: ${analysis.opportunities?.length || 0} | Quick Wins: ${analysis.quickWins?.length || 0}`,
        );
      } catch (err) {
        console.log(`   ❌ ERROR: ${err.message}`);
        if (err.stack) {
          console.log(`   📍 Stack: ${err.stack.substring(0, 200)}...`);
        }
        failed++;
      }

      // Small delay to avoid rate limits
      if (processed < leads.length) {
        console.log(`   ⏳ Waiting 2 seconds before next...`);
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }

    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log('\n' + '='.repeat(50));
    console.log('📊 ========== DAILY JOB COMPLETE ==========');
    console.log(`   ✅ Processed: ${processed}`);
    console.log(`   💾 Saved: ${saved}`);
    console.log(`   ⏭️  Skipped: ${skipped}`);
    console.log(`   ❌ Failed: ${failed}`);
    console.log(`   ⏱️  Duration: ${duration}s`);
    console.log('='.repeat(50) + '\n');

    return { processed, saved, failed, skipped };
  } catch (error) {
    console.error('🔥 DAILY JOB ERROR:', error);
    return { error: error.message };
  }
}

// For cron job (not used yet, but ready for future)
const cron = require('node-cron');
if (process.env.ENABLE_CRON === 'true') {
  cron.schedule('0 6 * * *', async () => {
    console.log('⏰ Cron: Running daily lead job at 6 AM');
    await runNow();
  });
}

module.exports = { runNow };
