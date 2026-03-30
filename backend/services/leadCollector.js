const axios = require('axios');
const cheerio = require('cheerio');

function cleanUrl(url) {
  if (!url) return null;
  let cleaned = url.trim();
  cleaned = cleaned.replace(/\s+/g, '');
  cleaned = cleaned.replace(/\+\/*/g, '');
  cleaned = cleaned.replace(/^(https?:)?\/\/+/i, '');
  cleaned = cleaned.replace(/^(https?:)+/gi, '');
  cleaned = cleaned.replace(/^\/+/, '');
  cleaned = 'https://' + cleaned;
  cleaned = cleaned.replace(/\/+$/, '');
  return cleaned;
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function scrapeYellowPages(category, location) {
  const apiKey = process.env.SCRAPER_API_KEY;
  if (!apiKey) {
    console.error('❌ SCRAPER_API_KEY not set');
    return [];
  }

  const searchUrl = `https://www.yellowpages.com/search?search_terms=${encodeURIComponent(category)}&geo_location_terms=${encodeURIComponent(location)}`;

  try {
    console.log(`   🌐 Fetching: ${searchUrl}`);

    const response = await axios.get('http://api.scraperapi.com', {
      params: {
        api_key: apiKey,
        url: searchUrl,
        render: true,
        country_code: 'us',
      },
      timeout: 60000,
    });

    const $ = cheerio.load(response.data);
    const results = [];

    $('.result').each((_, el) => {
      const name = $(el).find('.business-name').text().trim();

      let website = '';
      $(el)
        .find('a')
        .each((_, link) => {
          const href = $(link).attr('href') || '';
          if (
            href &&
            href.startsWith('http') &&
            !href.includes('yellowpages') &&
            !href.includes('facebook') &&
            !href.includes('twitter') &&
            !href.includes('instagram') &&
            !website
          ) {
            website = href;
          }
        });

      if (name && website) {
        results.push({
          businessName: name,
          website: cleanUrl(website),
          category,
          location,
        });
      }
    });

    console.log(`      ✅ Found ${results.length} businesses`);
    return results.filter((b) => b.website);
  } catch (error) {
    console.log(
      `      ❌ Error scraping ${category} in ${location}: ${error.message}`,
    );
    return [];
  }
}

async function getLeads(preferences = null) {
  console.log('\n🚀 ========== LEAD DISCOVERY ENGINE ==========');

  const allLeads = [];
  const seenUrls = new Set();

  const categories = preferences?.selectedCategories || [
    'contractor',
    'roofing',
    'plumbing',
  ];
  const locations = preferences?.locations || ['Seattle'];

  console.log(`🎯 Categories: ${categories.join(', ')}`);
  console.log(`📍 Locations: ${locations.join(', ')}\n`);

  for (const location of locations) {
    for (const category of categories) {
      console.log(`   🔍 ${category} in ${location}`);
      const leads = await scrapeYellowPages(category, location);

      for (const lead of leads) {
        if (!seenUrls.has(lead.website)) {
          seenUrls.add(lead.website);
          allLeads.push(lead);
        }
      }

      await delay(1500);
    }
  }

  console.log(`\n📊 DISCOVERY COMPLETE: ${allLeads.length} unique leads\n`);
  return allLeads;
}

module.exports = { getLeads };
