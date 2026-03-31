const dns = require('dns').promises;

async function checkEmailReputation(url) {
  try {
    const domain = new URL(url).hostname.replace('www.', '');
    console.log(`📧 Checking email reputation for: ${domain}`);

    const results = {
      domain,
      spf: await checkSPF(domain),
      dmarc: await checkDMARC(domain),
      dkim: await checkDKIM(domain),
      mx: await checkMX(domain),
    };

    results.score = calculateEmailScore(results);
    results.summary = generateEmailSummary(results);

    return results;
  } catch (error) {
    console.error('❌ Email reputation check error:', error.message);
    return null;
  }
}

async function checkSPF(domain) {
  try {
    const records = await dns.resolveTxt(domain);
    const spfRecord = records.flat().find((r) => r.startsWith('v=spf1'));

    if (!spfRecord) return { exists: false, valid: false, record: null };

    const isStrict = spfRecord.includes('-all');
    const isSoft = spfRecord.includes('~all');

    return {
      exists: true,
      valid: true,
      strict: isStrict,
      soft: isSoft,
      record: spfRecord,
    };
  } catch {
    return { exists: false, valid: false, record: null };
  }
}

async function checkDMARC(domain) {
  try {
    const records = await dns.resolveTxt(`_dmarc.${domain}`);
    const dmarcRecord = records.flat().find((r) => r.startsWith('v=DMARC1'));

    if (!dmarcRecord) return { exists: false, policy: null, record: null };

    const policyMatch = dmarcRecord.match(/p=(\w+)/);
    const policy = policyMatch ? policyMatch[1] : 'none';

    return {
      exists: true,
      policy,
      strong: policy === 'reject' || policy === 'quarantine',
      record: dmarcRecord,
    };
  } catch {
    return { exists: false, policy: null, record: null };
  }
}

async function checkDKIM(domain) {
  const selectors = ['default', 'google', 'mail', 'dkim', 'k1', 'smtp'];

  for (const selector of selectors) {
    try {
      const records = await dns.resolveTxt(`${selector}._domainkey.${domain}`);
      const dkimRecord = records.flat().find((r) => r.includes('v=DKIM1'));
      if (dkimRecord) {
        return {
          exists: true,
          selector,
          record: dkimRecord.substring(0, 50) + '...',
        };
      }
    } catch {
      continue;
    }
  }

  return { exists: false, selector: null, record: null };
}

async function checkMX(domain) {
  try {
    const records = await dns.resolveMx(domain);
    if (!records || records.length === 0) {
      return { exists: false, provider: 'none', records: [] };
    }

    const exchanges = records.map((r) => r.exchange.toLowerCase());
    let provider = 'Custom/Unknown';

    if (exchanges.some((e) => e.includes('google') || e.includes('gmail'))) {
      provider = 'Google Workspace';
    } else if (
      exchanges.some((e) => e.includes('outlook') || e.includes('microsoft'))
    ) {
      provider = 'Microsoft 365';
    } else if (exchanges.some((e) => e.includes('amazonses'))) {
      provider = 'Amazon SES';
    } else if (exchanges.some((e) => e.includes('mailgun'))) {
      provider = 'Mailgun';
    } else if (exchanges.some((e) => e.includes('sendgrid'))) {
      provider = 'SendGrid';
    }

    return { exists: true, provider, records: exchanges };
  } catch {
    return { exists: false, provider: 'none', records: [] };
  }
}

function calculateEmailScore(results) {
  let score = 0;
  if (results.mx.exists) score += 25;
  if (results.spf.exists) score += 25;
  if (results.spf.strict) score += 10;
  if (results.dkim.exists) score += 25;
  if (results.dmarc.exists) score += 15;
  if (results.dmarc.strong) score += 10;
  return Math.min(score, 100);
}

function generateEmailSummary(results) {
  const issues = [];
  if (!results.mx.exists) issues.push('no email setup');
  if (!results.spf.exists) issues.push('no SPF record');
  if (!results.dkim.exists) issues.push('no DKIM');
  if (!results.dmarc.exists) issues.push('no DMARC policy');

  if (issues.length === 0)
    return 'Email authentication is properly configured.';
  if (issues.length >= 3)
    return `Emails likely going to spam: ${issues.join(', ')}.`;
  return `Email issues detected: ${issues.join(', ')}.`;
}

module.exports = { checkEmailReputation };
