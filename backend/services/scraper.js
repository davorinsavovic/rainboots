const { chromium } = require('playwright');

async function scrapeWebsite(url) {
  let browser;

  try {
    console.log(`🌐 Launching browser for: ${url}`);

    browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const context = await browser.newContext({
      userAgent:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    });

    const page = await context.newPage();

    console.log(`📄 Navigating to: ${url}`);
    await page.goto(url, {
      waitUntil: 'domcontentloaded',
      timeout: 30000,
    });

    const title = await page.title();
    console.log(`✅ Page title: ${title}`);

    const textContent = await page.evaluate(() => {
      return document.body.innerText;
    });

    return {
      title,
      textContent: textContent.slice(0, 8000),
    };
  } catch (error) {
    console.error('❌ Scraping error:', error.message);
    return null;
  } finally {
    if (browser) {
      await browser.close();
      console.log('🔒 Browser closed');
    }
  }
}

module.exports = { scrapeWebsite };
