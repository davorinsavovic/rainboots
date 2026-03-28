const { scrapeWebsite } = require('../services/scraper');
const { analyzeWebsite } = require('../services/analyzer');

const runAudit = async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    const scraped = await scrapeWebsite(url);

    if (!scraped) {
      return res.status(500).json({ error: 'Scraping failed' });
    }

    const analysis = await analyzeWebsite(scraped.textContent);

    res.json({
      success: true,
      data: {
        ...scraped,
        analysis,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { runAudit };
