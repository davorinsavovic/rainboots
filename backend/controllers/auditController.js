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
      console.error(`❌ Scraping failed for: ${url}`);
      return res.status(500).json({ error: 'Failed to scrape website' });
    }

    console.log(`✅ Scraped successfully: ${scraped.title}`);
    console.log(`📊 Content length: ${scraped.textContent.length} characters`);

    // Pass both textContent AND url to the analyzer
    const analysis = await analyzeWebsite(scraped.textContent, url);

    console.log(`✅ Analysis complete`);

    // Return the URL in the response
    res.json({
      success: true,
      data: {
        url: url,
        title: scraped.title,
        textContent: scraped.textContent,
        analysis: analysis,
      },
    });
  } catch (error) {
    console.error('❌ Audit error:', error);
    res.status(500).json({
      error: 'Server error',
      details: error.message,
    });
  }
};

module.exports = { runAudit };
