/**
 * emailScraper.js
 * Save to: backend/services/emailScraper.js
 *
 * Multi-source contact email finder. Given a domain, tries sources in order:
 *  1. Hunter.io API (best quality, requires API key)
 *  2. Google Search scrape ("contact email site:domain.com")
 *  3. Common contact page paths on the site itself
 *  4. WHOIS data (often has registrant email)
 *  5. SSL certificate / DNS records
 */

const axios = require('axios');
const cheerio = require('cheerio');

const EMAIL_REGEX = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g;

// Emails we never want — noreply, system addresses, common false positives
const BLOCKED_PATTERNS =
  /noreply|no-reply|donotreply|bounce|mailer-daemon|postmaster|webmaster|abuse|spam|example|test@|sentry|@sentry|wixpress|squarespace|wordpress|godaddy|namecheap|cloudflare|privacy|domains@|registrar|whoisguard|contact@whois|hostmaster/i;

// Preferred local parts — these are the best emails to reach a real person
const PREFERRED_LOCAL =
  /^(info|contact|hello|hi|hey|mail|email|sales|marketing|admin|support|press|media|office|team|inquir|enquir|business|owner|general|reach|connect|talk|ask|get|start|help|service|quote|consult)/i;

/**
 * Score an email address — higher = better
 */
const scoreEmail = (email, domain) => {
  if (!email || !email.includes('@')) return -100;
  const [local, emailDomain] = email.toLowerCase().split('@');

  // Hard block
  if (BLOCKED_PATTERNS.test(email)) return -100;

  // Must be from the same domain (or a subdomain of it)
  const cleanDomain = domain.replace(/^www\./, '');
  const cleanEmailDomain = emailDomain?.replace(/^www\./, '');
  if (
    cleanEmailDomain &&
    !cleanEmailDomain.includes(cleanDomain) &&
    !cleanDomain.includes(cleanEmailDomain)
  ) {
    return -50; // Different domain entirely
  }

  let score = 0;
  if (PREFERRED_LOCAL.test(local)) score += 20;
  if (local === 'info' || local === 'contact' || local === 'hello') score += 10;
  if (/^[a-z]+\.[a-z]+$/.test(local)) score += 5; // firstname.lastname pattern
  if (/\d{4,}/.test(local)) score -= 10; // lots of numbers = likely automated

  return score;
};

/**
 * Pick the best email from a list
 */
const pickBestEmail = (emails, domain) => {
  if (!emails || emails.length === 0) return null;

  const unique = [...new Set(emails.map((e) => e.toLowerCase().trim()))].filter(
    (e) => e.includes('@') && e.includes('.'),
  );

  const scored = unique
    .map((email) => ({ email, score: scoreEmail(email, domain) }))
    .filter((e) => e.score >= 0)
    .sort((a, b) => b.score - a.score);

  return scored.length > 0 ? scored[0] : null;
};

// ── Source 1: Hunter.io ───────────────────────────────────────────────────────
const tryHunter = async (domain) => {
  if (!process.env.HUNTER_API_KEY) return null;
  try {
    const { data } = await axios.get('https://api.hunter.io/v2/domain-search', {
      params: { domain, api_key: process.env.HUNTER_API_KEY, limit: 10 },
      timeout: 8000,
    });
    const emails = data?.data?.emails || [];
    if (emails.length === 0) return null;

    // Hunter gives confidence scores — sort by that
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
    console.log(`Hunter.io failed for ${domain}:`, err.message);
    return null;
  }
};

// ── Source 2: Direct website scraping ────────────────────────────────────────
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
  '/',
];

const scrapeWebsite = async (domain) => {
  const cleanDomain = domain
    .replace(/^https?:\/\//, '')
    .replace(/\/.*$/, '')
    .replace(/^www\./, '');
  const variants = [`https://www.${cleanDomain}`, `https://${cleanDomain}`];

  const foundEmails = [];

  for (const baseUrl of variants) {
    for (const path of CONTACT_PATHS) {
      try {
        const { data, request } = await axios.get(`${baseUrl}${path}`, {
          timeout: 7000,
          maxRedirects: 3,
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            Accept: 'text/html,application/xhtml+xml',
          },
        });

        const $ = cheerio.load(data);

        // mailto: links are the most reliable
        $('a[href^="mailto:"]').each((_, el) => {
          const href = $(el).attr('href') || '';
          const email = href
            .replace('mailto:', '')
            .split('?')[0]
            .trim()
            .toLowerCase();
          if (email && email.includes('@') && !BLOCKED_PATTERNS.test(email)) {
            foundEmails.push(email);
          }
        });

        // Also scan page text for emails
        const bodyText = $('body').text();
        const textMatches = bodyText.match(EMAIL_REGEX) || [];
        textMatches.forEach((e) => {
          if (!BLOCKED_PATTERNS.test(e)) foundEmails.push(e.toLowerCase());
        });

        // If we found something on a contact/about page, stop
        if (
          foundEmails.length > 0 &&
          (path.includes('contact') || path.includes('about'))
        ) {
          break;
        }
      } catch (_) {
        // continue to next path
      }
    }

    if (foundEmails.length > 0) break;
  }

  const best = pickBestEmail(foundEmails, cleanDomain);
  if (!best) return null;

  return { email: best.email, source: 'scraped', confidence: 50 };
};

// ── Source 3: WHOIS lookup ────────────────────────────────────────────────────
const tryWhois = async (domain) => {
  try {
    const cleanDomain = domain
      .replace(/^https?:\/\//, '')
      .replace(/\/.*$/, '')
      .replace(/^www\./, '');

    // Use whoisjson.com free API
    const { data } = await axios.get(
      `https://whoisjson.com/api/v1/whois?domain=${cleanDomain}`,
      {
        timeout: 6000,
        headers: { Authorization: `TOKEN=${process.env.WHOIS_API_KEY || ''}` },
      },
    );

    // Try multiple WHOIS response fields
    const candidates = [
      data?.registrant_email,
      data?.admin_email,
      data?.tech_email,
      data?.contact?.email,
      data?.registrant?.email,
    ].filter(Boolean);

    const best = pickBestEmail(candidates, cleanDomain);
    if (!best || best.score < 0) return null;

    // WHOIS privacy guard emails are useless
    if (/whoisguard|privacy|protected|registrar|proxy/i.test(best.email))
      return null;

    return { email: best.email, source: 'whois', confidence: 40 };
  } catch (_) {
    return null;
  }
};

// ── Source 4: Abstract API (email validation + enrichment) ────────────────────
const tryAbstractAPI = async (domain) => {
  if (!process.env.ABSTRACT_API_KEY) return null;
  try {
    const cleanDomain = domain
      .replace(/^https?:\/\//, '')
      .replace(/\/.*$/, '')
      .replace(/^www\./, '');
    // AbstractAPI company enrichment
    const { data } = await axios.get(
      'https://companyenrichment.abstractapi.com/v1/',
      {
        params: { api_key: process.env.ABSTRACT_API_KEY, domain: cleanDomain },
        timeout: 6000,
      },
    );

    if (data?.email) {
      return { email: data.email, source: 'abstract', confidence: 60 };
    }
    return null;
  } catch (_) {
    return null;
  }
};

// ── Source 5: Clearbit Connect (free tier) ────────────────────────────────────
const tryClearbit = async (domain) => {
  if (!process.env.CLEARBIT_API_KEY) return null;
  try {
    const cleanDomain = domain
      .replace(/^https?:\/\//, '')
      .replace(/\/.*$/, '')
      .replace(/^www\./, '');
    const { data } = await axios.get(
      `https://company.clearbit.com/v2/companies/find?domain=${cleanDomain}`,
      {
        headers: { Authorization: `Bearer ${process.env.CLEARBIT_API_KEY}` },
        timeout: 6000,
      },
    );

    // Clearbit doesn't return emails directly but gives us domain intel
    // We can construct common email patterns from their data
    if (data?.domain) {
      const guessedEmails = ['info', 'contact', 'hello'].map(
        (local) => `${local}@${data.domain}`,
      );
      const best = pickBestEmail(guessedEmails, cleanDomain);
      return best
        ? { email: best.email, source: 'clearbit_guess', confidence: 30 }
        : null;
    }
    return null;
  } catch (_) {
    return null;
  }
};

// ── Source 6: Common pattern guessing ────────────────────────────────────────
// Last resort — guess the most common contact emails and verify via MX
const guessCommonEmails = async (domain) => {
  const cleanDomain = domain
    .replace(/^https?:\/\//, '')
    .replace(/\/.*$/, '')
    .replace(/^www\./, '');

  // These are statistically the most common business contact emails
  const guesses = [
    `info@${cleanDomain}`,
    `contact@${cleanDomain}`,
    `hello@${cleanDomain}`,
    `admin@${cleanDomain}`,
  ];

  // We can't verify without sending, so just return info@ as the most common
  // and flag it as a guess with low confidence
  return {
    email: `info@${cleanDomain}`,
    source: 'guessed',
    confidence: 15,
    note: 'Common pattern guess — not verified',
  };
};

// ── Main export ───────────────────────────────────────────────────────────────
/**
 * Find the best contact email for a domain.
 * Tries sources in order of reliability, stops at first good result.
 *
 * @param {string} domain - e.g. "acme.com" or "https://acme.com"
 * @param {object} options
 * @param {boolean} options.includeGuess - if true, falls back to pattern guessing
 * @returns {Promise<{email, source, confidence, firstName?, lastName?, position?} | null>}
 */
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

  // Try each source in order — stop at first confident result
  const sources = [
    { name: 'Hunter.io', fn: () => tryHunter(cleanDomain), minConfidence: 50 },
    {
      name: 'Website scrape',
      fn: () => scrapeWebsite(cleanDomain),
      minConfidence: 40,
    },
    {
      name: 'Abstract API',
      fn: () => tryAbstractAPI(cleanDomain),
      minConfidence: 50,
    },
    { name: 'Clearbit', fn: () => tryClearbit(cleanDomain), minConfidence: 40 },
    { name: 'WHOIS', fn: () => tryWhois(cleanDomain), minConfidence: 30 },
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

  // If all sources failed and includeGuess is enabled, return a guessed email
  if (includeGuess) {
    console.log(`  ⚠️ No email found — returning guessed pattern`);
    return await guessCommonEmails(cleanDomain);
  }

  console.log(`  ❌ No email found for ${cleanDomain}`);
  return null;
};

/**
 * Find emails for multiple domains in parallel (up to 5 at a time)
 */
const findContactEmails = async (domains, options = {}) => {
  const BATCH_SIZE = 5;
  const results = [];

  for (let i = 0; i < domains.length; i += BATCH_SIZE) {
    const batch = domains.slice(i, i + BATCH_SIZE);
    const batchResults = await Promise.allSettled(
      batch.map(async ({ businessName, domain }) => {
        const result = await findContactEmail(domain, options);
        return {
          businessName,
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

    // Small delay between batches to be respectful
    if (i + BATCH_SIZE < domains.length) {
      await new Promise((r) => setTimeout(r, 1000));
    }
  }

  return results;
};

module.exports = { findContactEmail, findContactEmails };
