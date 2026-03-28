const { chromium } = require('playwright');

async function scrapeWebsite(url) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });

    const title = await page.title();

    const textContent = await page.evaluate(() => {
      return document.body.innerText;
    });

    return {
      title,
      textContent: textContent.slice(0, 8000),
    };
  } catch (error) {
    console.error('Scraping error:', error);
    return null;
  } finally {
    await browser.close();
  }
}

module.exports = { scrapeWebsite };
