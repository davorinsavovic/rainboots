/**
 * emailScraper.js
 * backend/services/emailScraper.js
 */

const axios = require('axios');
const cheerio = require('cheerio');
const dns = require('dns').promises;

const EMAIL_REGEX = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g;

const BLOCKED_PATTERNS =
  /noreply|no-reply|donotreply|bounce|mailer-daemon|postmaster|webmaster|abuse|spam|example|test@|sentry|@sentry|wixpress|squarespace|wordpress|godaddy|namecheap|cloudflare|privacy|domains@|registrar|whoisguard|contact@whois|hostmaster|info@example|admin@example/i;

// ── Score a real found email (not a guess) ─────────────────────────────────
const scoreEmail = (email, domain) => {
  if (!email || !email.includes('@')) return -100;
  const [local, emailDomain] = email.toLowerCase().split('@');

  if (BLOCKED_PATTERNS.test(email)) return -100;

  const cleanDomain = domain.replace(/^www\./, '');
  const cleanEmailDomain = emailDomain?.replace(/^www\./, '');

  // Domain mismatch — deprioritise but don't discard
  if (
    cleanEmailDomain &&
    !cleanEmailDomain.includes(cleanDomain) &&
    !cleanDomain.includes(cleanEmailDomain)
  ) {
    return -50;
  }

  let score = 0;

  // Preferred contact-type prefixes
  if (
    /^(info|contact|hello|hi|hey|mail|email|sales|marketing|admin|support|press|media|office|team|inquir|enquir|business|owner|general|reach|connect|services|service|work|jobs|careers|partners|partnership)/i.test(
      local,
    )
  )
    score += 15;

  // firstname.lastname pattern — likely a real person
  if (/^[a-z]+\.[a-z]+$/.test(local)) score += 10;

  // Single word — could go either way
  if (/^[a-z]+$/.test(local) && local.length > 3) score += 5;

  // Numbers suggest automated/system addresses
  if (/\d{4,}/.test(local)) score -= 10;

  return score;
};

const pickBestEmail = (emails, domain) => {
  if (!emails || emails.length === 0) return null;
  const unique = [...new Set(emails.map((e) => e.toLowerCase().trim()))].filter(
    (e) => e.includes('@') && e.includes('.'),
  );
  const scored = unique
    .map((email) => ({ email, score: scoreEmail(email, domain) }))
    .filter((e) => e.score > -50)
    .sort((a, b) => b.score - a.score);
  return scored.length > 0 ? scored[0] : null;
};

// ── Verify an email address exists via SMTP (no message sent) ─────────────────
// Uses RCPT TO handshake — tells us if the mailbox exists without sending anything
const verifySMTP = async (email, domain) => {
  const net = require('net');

  try {
    // Get MX records
    const mxRecords = await dns.resolveMx(domain);
    if (!mxRecords || mxRecords.length === 0) return false;

    // Sort by priority (lowest = highest priority)
    mxRecords.sort((a, b) => a.priority - b.priority);
    const mxHost = mxRecords[0].exchange;

    return await new Promise((resolve) => {
      const timeout = setTimeout(() => {
        socket.destroy();
        resolve(false);
      }, 8000);

      const socket = net.createConnection(25, mxHost);
      let step = 0;
      let buffer = '';

      socket.on('data', (data) => {
        buffer += data.toString();
        const lines = buffer.split('\r\n');
        buffer = lines.pop();

        for (const line of lines) {
          if (!line) continue;
          const code = parseInt(line.substring(0, 3));

          if (step === 0 && code === 220) {
            socket.write(`EHLO rainbootsmarketing.com\r\n`);
            step = 1;
          } else if (step === 1 && (code === 250 || code === 220)) {
            socket.write(`MAIL FROM:<verify@rainbootsmarketing.com>\r\n`);
            step = 2;
          } else if (step === 2 && code === 250) {
            socket.write(`RCPT TO:<${email}>\r\n`);
            step = 3;
          } else if (step === 3) {
            socket.write(`QUIT\r\n`);
            clearTimeout(timeout);
            socket.destroy();
            // 250 or 251 = exists, 550/551/553 = doesn't exist
            resolve(code >= 200 && code < 300);
          }
        }
      });

      socket.on('error', () => {
        clearTimeout(timeout);
        resolve(null); // null = couldn't verify (not a failure)
      });

      socket.on('close', () => {
        clearTimeout(timeout);
      });
    });
  } catch (err) {
    return null; // MX lookup failed — can't verify
  }
};

// ── Try common email patterns and verify which one actually exists ────────────
// This is the key improvement: instead of guessing info@, we test multiple
// common patterns against the actual mail server
const tryCommonPatterns = async (domain) => {
  const cleanDomain = domain.replace(/^www\./, '');

  // Ordered by likelihood for a small business
  const patterns = [
    `info@${cleanDomain}`,
    `contact@${cleanDomain}`,
    `hello@${cleanDomain}`,
    `services@${cleanDomain}`,
    `service@${cleanDomain}`,
    `sales@${cleanDomain}`,
    `marketing@${cleanDomain}`,
    `admin@${cleanDomain}`,
    `support@${cleanDomain}`,
    `office@${cleanDomain}`,
    `team@${cleanDomain}`,
    `work@${cleanDomain}`,
    `hi@${cleanDomain}`,
    `mail@${cleanDomain}`,
    `email@${cleanDomain}`,
    `business@${cleanDomain}`,
    `enquiries@${cleanDomain}`,
    `inquiries@${cleanDomain}`,
  ];

  console.log(
    `  Testing ${patterns.length} common email patterns for ${cleanDomain}...`,
  );

  for (const email of patterns) {
    try {
      const exists = await verifySMTP(email, cleanDomain);
      if (exists === true) {
        console.log(`  ✅ SMTP verified: ${email}`);
        return { email, source: 'smtp_verified', confidence: 85 };
      } else if (exists === null) {
        // Server blocked verification — can't trust any result, stop trying
        console.log(
          `  ⚠️ SMTP verification blocked by server — stopping pattern check`,
        );
        break;
      }
      // exists === false means mailbox doesn't exist, try next
    } catch (_) {
      break;
    }
  }

  return null;
};

// ── Extract emails from page HTML ──────────────────────────────────────────
const extractEmailsFromPage = ($, domain) => {
  const found = new Set();

  // 1. mailto: links — most reliable
  $('a[href^="mailto:"]').each((_, el) => {
    const href = $(el).attr('href') || '';
    const email = href
      .replace('mailto:', '')
      .split('?')[0]
      .trim()
      .toLowerCase();
    if (email && email.includes('@') && !BLOCKED_PATTERNS.test(email)) {
      found.add(email);
    }
  });

  // 2. JSON-LD structured data
  $('script[type="application/ld+json"]').each((_, script) => {
    try {
      const data = JSON.parse($(script).html() || '{}');
      const extract = (obj) => {
        if (!obj) return;
        if (
          typeof obj === 'string' &&
          obj.includes('@') &&
          EMAIL_REGEX.test(obj)
        ) {
          if (!BLOCKED_PATTERNS.test(obj)) found.add(obj.toLowerCase());
        } else if (Array.isArray(obj)) obj.forEach(extract);
        else if (typeof obj === 'object') Object.values(obj).forEach(extract);
      };
      extract(data);
    } catch (_) {}
  });

  // 3. Data attributes
  $('[data-email],[data-mail],[data-contact]').each((_, el) => {
    const e = $(el).attr('data-email') || $(el).attr('data-mail') || '';
    if (e && EMAIL_REGEX.test(e) && !BLOCKED_PATTERNS.test(e))
      found.add(e.toLowerCase());
  });

  // 4. Script tags (encoded emails)
  $('script:not([src])').each((_, script) => {
    const content = $(script).html() || '';
    if (content.includes('@')) {
      const matches = content.match(EMAIL_REGEX) || [];
      matches.forEach((e) => {
        if (!BLOCKED_PATTERNS.test(e) && !e.includes('example'))
          found.add(e.toLowerCase());
      });
    }
  });

  // 5. Plain text — last resort, noisy
  const bodyText = $('body').text();
  const textMatches = bodyText.match(EMAIL_REGEX) || [];
  textMatches.forEach((e) => {
    if (!BLOCKED_PATTERNS.test(e)) found.add(e.toLowerCase());
  });

  return Array.from(found);
};

// ── Scrape the website itself ─────────────────────────────────────────────────
const CONTACT_PATHS = [
  '/contact',
  '/contact-us',
  '/contact_us',
  '/contactus',
  '/about',
  '/about-us',
  '/about_us',
  '/team',
  '/our-team',
  '/staff',
  '/reach-us',
  '/get-in-touch',
  '/connect',
  '/hello',
  '/support',
  '/',
];

const scrapeWebsite = async (domain) => {
  const cleanDomain = domain.replace(/^www\./, '');
  const variants = [`https://www.${cleanDomain}`, `https://${cleanDomain}`];
  const foundEmails = [];

  for (const baseUrl of variants) {
    for (const path of CONTACT_PATHS) {
      try {
        const { data } = await axios.get(`${baseUrl}${path}`, {
          timeout: 10000,
          maxRedirects: 3,
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            Accept: 'text/html,application/xhtml+xml',
          },
        });

        const $ = cheerio.load(data);
        const emails = extractEmailsFromPage($, cleanDomain);
        foundEmails.push(...emails);

        // If we found something on a contact/about page, stop there
        if (
          foundEmails.length > 0 &&
          (path.includes('contact') || path.includes('about'))
        )
          break;
      } catch (_) {}
    }
    if (foundEmails.length > 0) break;
  }

  const best = pickBestEmail(foundEmails, cleanDomain);
  if (!best) return null;

  return { email: best.email, source: 'scraped', confidence: 60 };
};

// ── Hunter.io ─────────────────────────────────────────────────────────────────
const tryHunter = async (domain) => {
  if (!process.env.HUNTER_API_KEY) return null;
  try {
    const { data } = await axios.get('https://api.hunter.io/v2/domain-search', {
      params: { domain, api_key: process.env.HUNTER_API_KEY, limit: 10 },
      timeout: 8000,
    });
    const emails = data?.data?.emails || [];
    if (emails.length === 0) return null;

    const best = emails
      .filter((e) => e.value && !BLOCKED_PATTERNS.test(e.value))
      .sort((a, b) => (b.confidence || 0) - (a.confidence || 0))[0];

    if (!best) return null;
    return {
      email: best.value,
      source: 'hunter',
      confidence: best.confidence,
      firstName: best.first_name,
      lastName: best.last_name,
      position: best.position,
    };
  } catch (err) {
    return null;
  }
};

// ── WHOIS ─────────────────────────────────────────────────────────────────────
const tryWhois = async (domain) => {
  try {
    const cleanDomain = domain.replace(/^www\./, '');
    const { data } = await axios.get(
      `https://whoisjson.com/api/v1/whois?domain=${cleanDomain}`,
      { timeout: 6000 },
    );
    const candidates = [
      data?.registrant_email,
      data?.admin_email,
      data?.tech_email,
      data?.contact?.email,
      data?.registrant?.email,
    ].filter(Boolean);
    const best = pickBestEmail(candidates, cleanDomain);
    if (!best || best.score < 0) return null;
    if (/whoisguard|privacy|protected|registrar|proxy/i.test(best.email))
      return null;
    return { email: best.email, source: 'whois', confidence: 40 };
  } catch (_) {
    return null;
  }
};

// ── Sitemap ───────────────────────────────────────────────────────────────────
const trySitemap = async (domain) => {
  const cleanDomain = domain.replace(/^www\./, '');
  const urls = [
    `https://${cleanDomain}/sitemap.xml`,
    `https://www.${cleanDomain}/sitemap.xml`,
  ];
  for (const url of urls) {
    try {
      const { data } = await axios.get(url, { timeout: 5000 });
      const emails = (data.match(EMAIL_REGEX) || []).filter(
        (e) => !BLOCKED_PATTERNS.test(e),
      );
      const best = pickBestEmail(emails, cleanDomain);
      if (best && best.score > 0)
        return { email: best.email, source: 'sitemap', confidence: 45 };
    } catch (_) {}
  }
  return null;
};

// ── Main: findContactEmail ────────────────────────────────────────────────────
const findContactEmail = async (domain, options = {}) => {
  const { includeGuess = false } = options;
  if (!domain) return null;

  const cleanDomain = domain
    .replace(/^https?:\/\//, '')
    .replace(/\/.*$/, '')
    .replace(/^www\./, '')
    .toLowerCase()
    .trim();

  console.log(`\n🔍 Finding email for: ${cleanDomain}`);

  // Sources tried in order — stops at first confident result
  const sources = [
    { name: 'Hunter.io', fn: () => tryHunter(cleanDomain), minConfidence: 50 },
    {
      name: 'Website scrape',
      fn: () => scrapeWebsite(cleanDomain),
      minConfidence: 40,
    },
    { name: 'WHOIS', fn: () => tryWhois(cleanDomain), minConfidence: 30 },
    { name: 'Sitemap', fn: () => trySitemap(cleanDomain), minConfidence: 35 },
    // SMTP pattern verification — tests real mailboxes, most reliable fallback
    {
      name: 'SMTP verify',
      fn: () => tryCommonPatterns(cleanDomain),
      minConfidence: 80,
    },
  ];

  for (const source of sources) {
    try {
      console.log(`  Trying ${source.name}...`);
      const result = await source.fn();
      if (
        result &&
        result.email &&
        (result.confidence || 0) >= source.minConfidence
      ) {
        console.log(
          `  ✅ Found via ${source.name}: ${result.email} (confidence: ${result.confidence})`,
        );
        return result;
      }
    } catch (err) {
      console.log(`  ❌ ${source.name} failed: ${err.message}`);
    }
  }

  // Only guess if explicitly requested — avoids wrong info@ assumptions
  if (includeGuess) {
    console.log(`  ⚠️ Falling back to pattern guess`);
    return {
      email: `info@${cleanDomain}`,
      source: 'guessed',
      confidence: 10,
      note: 'Unverified guess — may not be correct',
    };
  }

  console.log(`  ❌ No email found for ${cleanDomain}`);
  return null;
};

// ── Batch processing ──────────────────────────────────────────────────────────
const findContactEmails = async (domains, options = {}) => {
  const BATCH_SIZE = 3; // Reduced from 5 — SMTP checks are slower
  const results = [];

  for (let i = 0; i < domains.length; i += BATCH_SIZE) {
    const batch = domains.slice(i, i + BATCH_SIZE);
    const batchResults = await Promise.allSettled(
      batch.map(async (item) => {
        const domain = typeof item === 'string' ? item : item.domain;
        const result = await findContactEmail(domain, options);
        return {
          businessName: typeof item === 'string' ? null : item.businessName,
          domain,
          ...(result || { email: null, source: null, confidence: 0 }),
        };
      }),
    );
    results.push(
      ...batchResults.map((r) =>
        r.status === 'fulfilled' ? r.value : { error: r.reason?.message },
      ),
    );
    if (i + BATCH_SIZE < domains.length)
      await new Promise((r) => setTimeout(r, 1500));
  }

  return results;
};

module.exports = { findContactEmail, findContactEmails };
