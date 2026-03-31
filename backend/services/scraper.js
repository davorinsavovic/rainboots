const axios = require('axios');
const cheerio = require('cheerio');

const SOCIAL_PATTERNS = {
  facebook: /facebook\.com\/(?!sharer|share|dialog|plugins)([a-zA-Z0-9._-]+)/,
  instagram: /instagram\.com\/([a-zA-Z0-9._-]+)/,
  twitter: /(?:twitter|x)\.com\/([a-zA-Z0-9._-]+)/,
  linkedin: /linkedin\.com\/(?:company|in)\/([a-zA-Z0-9._-]+)/,
  youtube: /youtube\.com\/(?:channel|c|@)([a-zA-Z0-9._-]+)/,
  tiktok: /tiktok\.com\/@([a-zA-Z0-9._-]+)/,
  yelp: /yelp\.com\/biz\/([a-zA-Z0-9._-]+)/,
};

function extractSocialLinks(html, baseUrl) {
  const $ = cheerio.load(html);
  const found = {};

  // Check all anchor tags for social links
  $('a[href]').each((_, el) => {
    const href = $(el).attr('href') || '';
    for (const [platform, pattern] of Object.entries(SOCIAL_PATTERNS)) {
      if (!found[platform] && pattern.test(href)) {
        found[platform] = href.startsWith('http') ? href : `https://${href}`;
      }
    }
  });

  // Also check meta tags and other attributes
  $('[content], [data-href], [data-url]').each((_, el) => {
    const val =
      $(el).attr('content') ||
      $(el).attr('data-href') ||
      $(el).attr('data-url') ||
      '';
    for (const [platform, pattern] of Object.entries(SOCIAL_PATTERNS)) {
      if (!found[platform] && pattern.test(val)) {
        found[platform] = val;
      }
    }
  });

  // Check page text for social mentions
  const pageText = $.html();
  for (const [platform, pattern] of Object.entries(SOCIAL_PATTERNS)) {
    if (!found[platform]) {
      const match = pageText.match(pattern);
      if (match) {
        found[platform] = match[0].startsWith('http')
          ? match[0]
          : `https://${match[0]}`;
      }
    }
  }

  return found;
}

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

    // Extract social links BEFORE removing elements
    const socialLinks = extractSocialLinks(response.data, url);
    console.log(
      `📱 Social links found:`,
      Object.keys(socialLinks).join(', ') || 'none',
    );

    // Remove noise
    $('script, style, noscript, iframe, nav, footer, header').remove();

    const title = $('title').text().trim() || url;

    const textParts = [];

    const metaDesc = $('meta[name="description"]').attr('content');
    if (metaDesc) textParts.push(`Description: ${metaDesc}`);

    $('h1, h2, h3').each((_, el) => {
      const text = $(el).text().trim();
      if (text) textParts.push(text);
    });

    $('p').each((_, el) => {
      const text = $(el).text().trim();
      if (text.length > 30) textParts.push(text);
    });

    $('li').each((_, el) => {
      const text = $(el).text().trim();
      if (text.length > 20) textParts.push(text);
    });

    const textContent = textParts.join('\n').slice(0, 8000);

    console.log(`✅ Scraped: ${title} (${textContent.length} chars)`);

    return { title, textContent, socialLinks };
  } catch (error) {
    console.error('❌ Scraping error:', error.message);
    return null;
  }
}

module.exports = { scrapeWebsite };
