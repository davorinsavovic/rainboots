// services/leadCollector.js - Debug version
const { chromium } = require('playwright');

function cleanUrl(url) {
  if (!url) return null;

  let cleaned = url.trim();

  // Remove spaces and junk like "+ //"
  cleaned = cleaned.replace(/\s+/g, '');
  cleaned = cleaned.replace(/\+\/*/g, '');

  // 🔥 Normalize ALL protocol issues in one shot
  cleaned = cleaned.replace(/^(https?:)?\/\/+/i, ''); // removes //, https//, http//
  cleaned = cleaned.replace(/^(https?:)+/gi, ''); // removes repeated httpshttps

  // Remove any remaining leading garbage slashes
  cleaned = cleaned.replace(/^\/+/, '');

  // Now rebuild properly
  cleaned = 'https://' + cleaned;

  // Remove trailing slashes
  cleaned = cleaned.replace(/\/+$/, '');

  return cleaned;
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function scrapeYellowPages(category, location) {
  const browser = await chromium.launch({ headless: true });

  const context = await browser.newContext({
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  });

  const page = await context.newPage();
  const searchUrl = `https://www.yellowpages.com/search?search_terms=${encodeURIComponent(category)}&geo_location_terms=${encodeURIComponent(location)}`;

  try {
    await page.goto(searchUrl, {
      waitUntil: 'domcontentloaded',
      timeout: 30000,
    });
    await page
      .waitForSelector('.result, .business-name', { timeout: 10000 })
      .catch(() => {});

    const businesses = await page.evaluate(
      ({ cat, loc }) => {
        const results = [];
        const listings = document.querySelectorAll('.result');

        listings.forEach((el) => {
          let name = '';
          const nameEl = el.querySelector('.business-name');
          if (nameEl) name = nameEl.innerText?.trim() || '';

          let website = '';
          const links = el.querySelectorAll('a');
          for (const link of links) {
            const href = link.href || '';
            if (
              href &&
              href.includes('http') &&
              !href.includes('yellowpages') &&
              !href.includes('facebook') &&
              !href.includes('twitter') &&
              !href.includes('instagram')
            ) {
              website = href;
              break;
            }
          }

          if (name && website) {
            results.push({
              businessName: name,
              website: website,
              category: cat,
              location: loc,
            });
          }
        });

        return results;
      },
      { cat: category, loc: location },
    );

    await browser.close();

    const cleaned = businesses
      .map((b) => ({
        ...b,
        website: cleanUrl(b.website),
      }))
      .filter((b) => b.website);

    if (cleaned.length > 0) {
      console.log(`      ✅ Found ${cleaned.length} businesses with websites`);
    }

    return cleaned;
  } catch (error) {
    console.log(`      ❌ Error: ${error.message}`);
    await browser.close();
    return [];
  }
}

async function getLeads() {
  console.log('\n🚀 ========== LEAD DISCOVERY ENGINE ==========');
  console.log(
    '🎯 Automatically finding businesses that need marketing help...\n',
  );

  const allLeads = [];
  const seenUrls = new Set();

  // Use fewer categories and locations for testing
  const categories = ['contractor', 'roofing', 'plumbing'];
  const locations = ['Seattle'];

  let totalFound = 0;

  try {
    for (const location of locations) {
      for (const category of categories) {
        console.log(`   🔍 ${category} in ${location}`);
        const leads = await scrapeYellowPages(category, location);
        console.log(`      📦 Received ${leads.length} leads from scraper`);

        for (const lead of leads) {
          const key = lead.website;
          if (!seenUrls.has(key)) {
            seenUrls.add(key);
            allLeads.push(lead);
            totalFound++;
          }
        }

        await delay(1500);
      }
    }

    console.log(`\n📊 DISCOVERY COMPLETE:`);
    console.log(`   🔍 Total unique leads discovered: ${totalFound}`);
    console.log(`   📝 Returning ${allLeads.length} leads for processing\n`);

    if (allLeads.length > 0) {
      console.log(`📋 FIRST 3 LEADS:`);
      allLeads.slice(0, 3).forEach((lead, i) => {
        console.log(`   ${i + 1}. ${lead.businessName}`);
        console.log(`      🌐 ${lead.website}`);
      });
    }

    return allLeads;
  } catch (error) {
    console.error('🔥 ERROR in getLeads:', error);
    return [];
  }
}

module.exports = { getLeads };
