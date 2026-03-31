const { scrapeWebsite } = require('../services/scraper');
const { analyzeWebsite } = require('../services/analyzer');
const { checkEmailReputation } = require('../services/emailReputation');

const runAudit = async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'URL is required' });

    console.log(`🔍 Starting audit for: ${url}`);

    const [scraped, emailReputation] = await Promise.all([
      scrapeWebsite(url),
      checkEmailReputation(url),
    ]);

    if (!scraped) {
      return res.status(500).json({ error: 'Failed to scrape website' });
    }

    console.log(`✅ Scraped: ${scraped.title}`);
    console.log(`📧 Email score: ${emailReputation?.score ?? 'N/A'}`);
    console.log(
      `📱 Social links: ${Object.keys(scraped.socialLinks || {}).join(', ') || 'none'}`,
    );

    const analysis = await analyzeWebsite(
      scraped.textContent,
      url,
      scraped.socialLinks,
      emailReputation,
    );

    res.json({
      success: true,
      data: {
        url,
        title: scraped.title,
        socialLinks: scraped.socialLinks || {},
        emailReputation,
        analysis,
      },
    });
  } catch (error) {
    console.error('❌ Audit error:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

module.exports = { runAudit };
