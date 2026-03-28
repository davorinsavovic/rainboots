// services/leadCollector.js
const { chromium } = require('playwright');

async function scrapeYellowPages(category, location) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // Format the search URL correctly
  const searchUrl = `https://www.yellowpages.com/search?search_terms=${encodeURIComponent(category)}&geo_location_terms=${encodeURIComponent(location)}`;

  console.log(`   🌐 Visiting: ${searchUrl}`);

  try {
    await page.goto(searchUrl, { waitUntil: 'networkidle', timeout: 30000 });

    // Wait for results to load
    await page
      .waitForSelector('.business-name, .info, .result', { timeout: 10000 })
      .catch(() => {
        console.log(`   ⚠️  No results found for ${category} in ${location}`);
        return [];
      });

    // Updated selectors for Yellow Pages current structure
    const businesses = await page.evaluate(() => {
      const results = [];

      // Try different possible selectors
      const items = document.querySelectorAll(
        '.business-name, .info, .result, [data-business-name]',
      );

      items.forEach((item) => {
        // Get business name - try multiple selectors
        let name = '';
        const nameEl = item.querySelector(
          '.business-name, .fn, [itemprop="name"], h2, h3',
        );
        if (nameEl) {
          name = nameEl.innerText?.trim() || '';
        } else if (item.getAttribute('data-business-name')) {
          name = item.getAttribute('data-business-name');
        } else if (item.innerText) {
          // Sometimes the name is just the text
          name = item.innerText.split('\n')[0]?.trim();
        }

        // Get website - try multiple selectors
        let website = '';
        const websiteEl = item.querySelector(
          'a[href*="http"], .website a, .links a',
        );
        if (websiteEl) {
          website = websiteEl.href;
          if (website && !website.startsWith('http')) {
            website = 'https://' + website;
          }
        }

        // Get phone
        let phone = '';
        const phoneEl = item.querySelector(
          '.phone, .phones, [itemprop="telephone"]',
        );
        if (phoneEl) {
          phone = phoneEl.innerText?.trim() || '';
        }

        // Get address
        let address = '';
        const addressEl = item.querySelector(
          '.street-address, .address, [itemprop="address"]',
        );
        if (addressEl) {
          address = addressEl.innerText?.trim() || '';
        }

        if (name && (website || phone)) {
          results.push({
            businessName: name,
            website: website || null,
            phone: phone,
            address: address,
          });
        }
      });

      // Also try to get from structured data
      const structuredItems = document.querySelectorAll(
        '[itemtype="http://schema.org/LocalBusiness"]',
      );
      structuredItems.forEach((item) => {
        const name =
          item.querySelector('[itemprop="name"]')?.innerText?.trim() || '';
        const website = item.querySelector('[itemprop="url"]')?.href || '';
        const phone =
          item.querySelector('[itemprop="telephone"]')?.innerText?.trim() || '';

        if (name && (website || phone)) {
          // Avoid duplicates
          if (!results.find((r) => r.businessName === name)) {
            results.push({
              businessName: name,
              website: website || null,
              phone: phone,
              address: '',
            });
          }
        }
      });

      return results;
    });

    await browser.close();

    // Filter out businesses without websites
    const withWebsites = businesses.filter((b) => b.website);
    console.log(
      `      ✅ Found ${businesses.length} total, ${withWebsites.length} with websites`,
    );

    return withWebsites;
  } catch (error) {
    console.error(`   ❌ Error scraping Yellow Pages: ${error.message}`);
    await browser.close();
    return [];
  }
}

async function getLeads() {
  console.log('\n🚀 ========== LEAD DISCOVERY ENGINE ==========');
  console.log('🎯 Finding businesses that need marketing help...\n');

  const allLeads = [];

  // Test with a single search first to verify it works
  const testLeads = await scrapeYellowPages('contractors', 'Seattle');

  if (testLeads.length === 0) {
    console.log(
      '\n⚠️  Yellow Pages scraping returned no results. Using sample leads for testing.\n',
    );

    // Return sample leads for testing
    return [
      {
        businessName: 'Vector RE Corp',
        website: 'https://vectorrecorp.com',
        category: 'real estate',
        location: 'Kirkland',
      },
      {
        businessName: 'DCM Contractors',
        website: 'http://dcmcontractors.com',
        category: 'construction',
        location: 'Seattle',
      },
      {
        businessName: 'Partizan Hoops',
        website: 'https://partizanhoops.com',
        category: 'sports',
        location: 'Seattle',
      },
      {
        businessName: 'Bothell Select Basketball',
        website: 'https://bothellselect.com',
        category: 'sports',
        location: 'Bothell',
      },
      {
        businessName: 'Live Love Flow Studios',
        website: 'https://www.liveloveflowstudios.com',
        category: 'wellness',
        location: 'Seattle',
      },
      {
        businessName: 'Simply Sweet',
        website: 'https://www.simplysweetwa.com',
        category: 'bakery',
        location: 'Snohomish',
      },
      {
        businessName: 'Sarajevo Lounge',
        website: 'https://www.sarajevonightclub.com',
        category: 'nightlife',
        location: 'Seattle',
      },
      {
        businessName: 'GraphiCode Inc.',
        website: 'https://www.graphicode.com',
        category: 'software',
        location: 'Redmond',
      },
      {
        businessName: 'Oregon Rule Co.',
        website: 'https://oregonrule.com',
        category: 'manufacturing',
        location: 'Oregon',
      },
      {
        businessName: 'Alpha Construction',
        website: 'http://www.alphawa.com',
        category: 'construction',
        location: 'Woodinville',
      },
      {
        businessName: 'Nelson Cabinetry',
        website: 'https://nelsonkb.com',
        category: 'ecommerce',
        location: 'Irving, TX',
      },
      {
        businessName: 'Cabinets.Deals',
        website: 'https://www.cabinets.deals',
        category: 'ecommerce',
        location: 'Houston, TX',
      },
    ];
  }

  allLeads.push(
    ...testLeads.map((lead) => ({
      ...lead,
      category: 'contractor',
      location: 'Seattle',
    })),
  );

  console.log(`\n📊 Total discovered: ${allLeads.length} leads`);
  return allLeads;
}

module.exports = { getLeads };
