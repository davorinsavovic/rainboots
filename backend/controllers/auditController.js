const { scrapeWebsite } = require('../services/scraper');
const { analyzeWebsite } = require('../services/analyzer');

const runAudit = async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    console.log(`🔍 Starting audit for: ${url}`);

    const scraped = await scrapeWebsite(url);

    if (!scraped) {
      return res.status(500).json({ error: 'Failed to scrape website' });
    }

    console.log(`✅ Scraped: ${scraped.title}`);
    console.log(
      `📱 Social links: ${Object.keys(scraped.socialLinks || {}).join(', ') || 'none'}`,
    );

    const analysis = await analyzeWebsite(
      scraped.textContent,
      url,
      scraped.socialLinks,
    );

    console.log(`✅ Analysis complete`);

    res.json({
      success: true,
      data: {
        url,
        title: scraped.title,
        socialLinks: scraped.socialLinks || {},
        analysis,
      },
    });
  } catch (error) {
    console.error('❌ Audit error:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

module.exports = { runAudit };
