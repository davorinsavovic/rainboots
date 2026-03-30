const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeWebsite(url) {
  try {
    console.log(`🌐 Fetching: ${url}`);

    const response = await axios.get(url, {
      timeout: 15000,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
      maxRedirects: 5,
    });

    const $ = cheerio.load(response.data);

    // Remove noise
    $('script, style, noscript, iframe, nav, footer, header').remove();

    const title = $('title').text().trim() || url;

    // Extract meaningful text
    const textParts = [];

    // Meta description
    const metaDesc = $('meta[name="description"]').attr('content');
    if (metaDesc) textParts.push(`Description: ${metaDesc}`);

    // Headings
    $('h1, h2, h3').each((_, el) => {
      const text = $(el).text().trim();
      if (text) textParts.push(text);
    });

    // Paragraphs
    $('p').each((_, el) => {
      const text = $(el).text().trim();
      if (text.length > 30) textParts.push(text);
    });

    // List items
    $('li').each((_, el) => {
      const text = $(el).text().trim();
      if (text.length > 20) textParts.push(text);
    });

    const textContent = textParts.join('\n').slice(0, 8000);

    console.log(`✅ Scraped: ${title} (${textContent.length} chars)`);

    return { title, textContent };
  } catch (error) {
    console.error('❌ Scraping error:', error.message);
    return null;
  }
}

module.exports = { scrapeWebsite };
