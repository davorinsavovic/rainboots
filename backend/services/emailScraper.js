/**
 * emailScraper.js - Enhanced with contact form detection and submission
 * Save to: backend/services/emailScraper.js
 */

const axios = require('axios');
const cheerio = require('cheerio');

const EMAIL_REGEX = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g;

// Emails we never want
const BLOCKED_PATTERNS =
  /noreply|no-reply|donotreply|bounce|mailer-daemon|postmaster|webmaster|abuse|spam|example|test@|sentry|@sentry|wixpress|squarespace|wordpress|godaddy|namecheap|cloudflare|privacy|domains@|registrar|whoisguard|contact@whois|hostmaster/i;

// Preferred local parts
const PREFERRED_LOCAL =
  /^(info|contact|hello|hi|hey|mail|email|sales|marketing|admin|support|press|media|office|team|inquir|enquir|business|owner|general|reach|connect|talk|ask|get|start|help|service|quote|consult)/i;

// Score an email address
const scoreEmail = (email, domain) => {
  if (!email || !email.includes('@')) return -100;
  const [local, emailDomain] = email.toLowerCase().split('@');

  if (BLOCKED_PATTERNS.test(email)) return -100;

  const cleanDomain = domain.replace(/^www\./, '');
  const cleanEmailDomain = emailDomain?.replace(/^www\./, '');
  if (
    cleanEmailDomain &&
    !cleanEmailDomain.includes(cleanDomain) &&
    !cleanDomain.includes(cleanEmailDomain)
  ) {
    return -50;
  }

  let score = 0;
  if (PREFERRED_LOCAL.test(local)) score += 20;
  if (local === 'info' || local === 'contact' || local === 'hello') score += 10;
  if (/^[a-z]+\.[a-z]+$/.test(local)) score += 5;
  if (/\d{4,}/.test(local)) score -= 10;

  return score;
};

// Pick best email
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

// ── NEW: Detect Contact Forms and Extract Form Actions ────────────────────────
const detectContactForms = async (url, $) => {
  const forms = [];

  // Find all forms
  $('form').each((i, form) => {
    const action = $(form).attr('action') || '';
    const method = $(form).attr('method') || 'get';
    const inputs = [];

    // Look for email-like inputs
    $(form)
      .find('input, textarea')
      .each((j, input) => {
        const type = $(input).attr('type') || '';
        const name = $(input).attr('name') || '';
        const id = $(input).attr('id') || '';
        const placeholder = $(input).attr('placeholder') || '';
        const className = $(input).attr('class') || '';

        const isEmailField =
          type === 'email' ||
          name.toLowerCase().includes('email') ||
          id.toLowerCase().includes('email') ||
          placeholder.toLowerCase().includes('email') ||
          className.toLowerCase().includes('email');

        if (isEmailField) {
          inputs.push({ type, name, id, placeholder });
        }
      });

    if (
      inputs.length > 0 ||
      (action && (action.includes('contact') || action.includes('email')))
    ) {
      forms.push({
        action,
        method,
        inputs,
        fullAction: new URL(action, url).href,
      });
    }
  });

  return forms;
};

// ── NEW: Check for JavaScript-Encoded Emails ──────────────────────────────────
const decodeEncodedEmail = (text) => {
  // ROT13 decoding
  const rot13 = (str) => {
    return str.replace(/[a-zA-Z]/g, (c) => {
      const base = c <= 'Z' ? 65 : 97;
      return String.fromCharCode(((c.charCodeAt(0) - base + 13) % 26) + base);
    });
  };

  // Check for common encoding patterns
  if (text.includes('&#') || text.includes('&#')) {
    // HTML entity decoding
    const decoded = text.replace(/&#(\d+);/g, (match, dec) =>
      String.fromCharCode(dec),
    );
    if (EMAIL_REGEX.test(decoded)) return decoded;
  }

  // Check for ROT13 patterns
  if (text.match(/[a-zA-Z]{5,}@[a-zA-Z]{3,}\.[a-zA-Z]{2,}/)) {
    const decoded = rot13(text);
    if (EMAIL_REGEX.test(decoded)) return decoded;
  }

  // Check for reversed text
  if (text.includes('moc.')) {
    const reversed = text.split('').reverse().join('');
    if (EMAIL_REGEX.test(reversed)) return reversed;
  }

  return null;
};

// ── NEW: Check Contact Page for Hidden Emails in Scripts ──────────────────────
const extractEmailsFromScripts = ($) => {
  const emails = [];
  $('script').each((i, script) => {
    const content = $(script).html() || '';
    if (content.includes('@') && content.includes('.')) {
      const found = content.match(EMAIL_REGEX);
      if (found) emails.push(...found);
    }
  });
  return emails;
};

// ── NEW: Extract from JSON-LD structured data ─────────────────────────────────
const extractFromJSONLD = ($) => {
  const emails = [];
  $('script[type="application/ld+json"]').each((i, script) => {
    try {
      const data = JSON.parse($(script).html() || '{}');
      const emailFields = ['email', 'contactPoint', 'sameAs'];

      const extract = (obj) => {
        if (!obj) return;
        if (typeof obj === 'string' && EMAIL_REGEX.test(obj)) {
          emails.push(obj);
        } else if (Array.isArray(obj)) {
          obj.forEach(extract);
        } else if (typeof obj === 'object') {
          Object.values(obj).forEach(extract);
        }
      };

      extract(data);
    } catch (e) {
      // Invalid JSON, skip
    }
  });
  return emails;
};

// ── Enhanced Website Scraper with Form Detection ─────────────────────────────
const scrapeWebsite = async (domain) => {
  const cleanDomain = domain
    .replace(/^https?:\/\//, '')
    .replace(/\/.*$/, '')
    .replace(/^www\./, '');
  const variants = [`https://www.${cleanDomain}`, `https://${cleanDomain}`];

  const foundEmails = [];
  let contactForms = [];

  for (const baseUrl of variants) {
    for (const path of CONTACT_PATHS) {
      try {
        const { data, request } = await axios.get(`${baseUrl}${path}`, {
          timeout: 10000,
          maxRedirects: 3,
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
            Accept: 'text/html,application/xhtml+xml',
          },
        });

        const $ = cheerio.load(data);

        // 1. Extract mailto: links
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

        // 2. Extract from page text
        const bodyText = $('body').text();
        const textMatches = bodyText.match(EMAIL_REGEX) || [];
        textMatches.forEach((e) => {
          if (!BLOCKED_PATTERNS.test(e)) foundEmails.push(e.toLowerCase());
        });

        // 3. Extract from scripts (often have encoded emails)
        const scriptEmails = extractEmailsFromScripts($);
        scriptEmails.forEach((e) => {
          const decoded = decodeEncodedEmail(e);
          if (decoded && !BLOCKED_PATTERNS.test(decoded)) {
            foundEmails.push(decoded.toLowerCase());
          } else if (!BLOCKED_PATTERNS.test(e)) {
            foundEmails.push(e.toLowerCase());
          }
        });

        // 4. Extract from JSON-LD structured data
        const jsonldEmails = extractFromJSONLD($);
        jsonldEmails.forEach((e) => {
          if (!BLOCKED_PATTERNS.test(e)) foundEmails.push(e.toLowerCase());
        });

        // 5. Detect contact forms
        const forms = await detectContactForms(`${baseUrl}${path}`, $);
        if (forms.length > 0) {
          contactForms.push(...forms);
        }

        // 6. Look for hidden email in data attributes
        $('[data-email], [data-mail], [data-contact]').each((_, el) => {
          const dataEmail = $(el).attr('data-email') || $(el).attr('data-mail');
          if (dataEmail && EMAIL_REGEX.test(dataEmail)) {
            foundEmails.push(dataEmail.toLowerCase());
          }
        });

        if (
          foundEmails.length > 0 &&
          (path.includes('contact') || path.includes('about'))
        ) {
          break;
        }
      } catch (_) {
        // Continue to next path
      }
    }
    if (foundEmails.length > 0) break;
  }

  // Try to extract from contact form actions (might contain email endpoints)
  for (const form of contactForms) {
    if (form.action && form.action.includes('@')) {
      const emailMatch = form.action.match(EMAIL_REGEX);
      if (emailMatch) foundEmails.push(emailMatch[0]);
    }
  }

  const best = pickBestEmail(foundEmails, cleanDomain);
  if (!best) return null;

  return {
    email: best.email,
    source: 'scraped',
    confidence: 50,
    contactFormsFound: contactForms.length,
    additionalEmails: foundEmails.slice(0, 5), // Return some additional candidates
  };
};

// ── NEW: Try to find email via contact form submission endpoint ───────────────
const tryFormEndpointExtraction = async (domain) => {
  try {
    const cleanDomain = domain
      .replace(/^https?:\/\//, '')
      .replace(/\/.*$/, '')
      .replace(/^www\./, '');
    const baseUrl = `https://${cleanDomain}`;

    // Common contact form submission endpoints that might leak emails
    const formEndpoints = [
      '/wp-admin/admin-ajax.php',
      '/wp-json/contact-form-7/v1/contact-forms',
      '/api/contact',
      '/contact/send',
      '/form/submit',
      '/email/send',
    ];

    for (const endpoint of formEndpoints) {
      try {
        const response = await axios.get(`${baseUrl}${endpoint}`, {
          timeout: 5000,
          headers: { 'X-Requested-With': 'XMLHttpRequest' },
        });

        const data = JSON.stringify(response.data);
        const emails = data.match(EMAIL_REGEX);
        if (emails && emails.length > 0) {
          const best = pickBestEmail(emails, cleanDomain);
          if (best) {
            return {
              email: best.email,
              source: 'form_endpoint',
              confidence: 35,
            };
          }
        }
      } catch (e) {
        // Endpoint might not exist or require POST
      }
    }
    return null;
  } catch (err) {
    return null;
  }
};

// ── NEW: Extract from sitemap.xml (often contains contact info) ───────────────
const trySitemapExtraction = async (domain) => {
  try {
    const cleanDomain = domain
      .replace(/^https?:\/\//, '')
      .replace(/\/.*$/, '')
      .replace(/^www\./, '');
    const sitemapUrls = [
      `https://${cleanDomain}/sitemap.xml`,
      `https://${cleanDomain}/sitemap_index.xml`,
      `https://${cleanDomain}/sitemap/sitemap.xml`,
    ];

    for (const sitemapUrl of sitemapUrls) {
      try {
        const response = await axios.get(sitemapUrl, { timeout: 5000 });
        const text = response.data;
        const emails = text.match(EMAIL_REGEX);
        if (emails && emails.length > 0) {
          const best = pickBestEmail(emails, cleanDomain);
          if (best && best.score > 0) {
            return { email: best.email, source: 'sitemap', confidence: 45 };
          }
        }
      } catch (e) {
        // Sitemap not found
      }
    }
    return null;
  } catch (err) {
    return null;
  }
};

// Contact page paths to check
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
  '/help',
  '/',
];

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

// ── Source 2: WHOIS lookup ────────────────────────────────────────────────────
const tryWhois = async (domain) => {
  try {
    const cleanDomain = domain
      .replace(/^https?:\/\//, '')
      .replace(/\/.*$/, '')
      .replace(/^www\./, '');
    const { data } = await axios.get(
      `https://whoisjson.com/api/v1/whois?domain=${cleanDomain}`,
      {
        timeout: 6000,
      },
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

// ── Main export ───────────────────────────────────────────────────────────────
const findContactEmail = async (domain, options = {}) => {
  const { includeGuess = false, includeAdvanced = true } = options;

  if (!domain) return null;

  const cleanDomain = domain
    .replace(/^https?:\/\//, '')
    .replace(/\/.*$/, '')
    .replace(/^www\./, '')
    .toLowerCase()
    .trim();

  console.log(`\n🔍 Finding email for: ${cleanDomain}`);

  const sources = [
    { name: 'Hunter.io', fn: () => tryHunter(cleanDomain), minConfidence: 50 },
    {
      name: 'Website scrape',
      fn: () => scrapeWebsite(cleanDomain),
      minConfidence: 40,
    },
  ];

  // Advanced sources (can be disabled for speed)
  if (includeAdvanced) {
    sources.push(
      { name: 'WHOIS', fn: () => tryWhois(cleanDomain), minConfidence: 30 },
      {
        name: 'Sitemap',
        fn: () => trySitemapExtraction(cleanDomain),
        minConfidence: 35,
      },
      {
        name: 'Form endpoints',
        fn: () => tryFormEndpointExtraction(cleanDomain),
        minConfidence: 30,
      },
    );
  }

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

  if (includeGuess) {
    console.log(`  ⚠️ No email found — returning guessed pattern`);
    return { email: `info@${cleanDomain}`, source: 'guessed', confidence: 15 };
  }

  console.log(`  ❌ No email found for ${cleanDomain}`);
  return null;
};

const findContactEmails = async (domains, options = {}) => {
  const BATCH_SIZE = 5;
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

    if (i + BATCH_SIZE < domains.length) {
      await new Promise((r) => setTimeout(r, 1000));
    }
  }

  return results;
};

module.exports = { findContactEmail, findContactEmails };
