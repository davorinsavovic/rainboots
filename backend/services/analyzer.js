const Anthropic = require('@anthropic-ai/sdk');

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

async function analyzeWebsite(
  textContent,
  url,
  socialLinks = {},
  emailReputation = null,
) {
  const socialSummary =
    Object.keys(socialLinks).length > 0
      ? `Found: ${Object.keys(socialLinks).join(', ')}`
      : 'No social media profiles detected';

  const emailSummary = emailReputation
    ? `
  Domain: ${emailReputation.domain}
  MX Records: ${emailReputation.mx.exists ? `✅ ${emailReputation.mx.provider}` : '❌ Missing'}
  SPF: ${emailReputation.spf.exists ? '✅ Configured' : '❌ Missing'}
  DKIM: ${emailReputation.dkim.exists ? '✅ Configured' : '❌ Missing'}
  DMARC: ${emailReputation.dmarc.exists ? `✅ Policy: ${emailReputation.dmarc.policy}` : '❌ Missing'}
  Email Score: ${emailReputation.score}/100`
    : 'Email reputation check unavailable';

  const prompt = `You are a website conversion and marketing expert.

Analyze this business website, its social media presence, and email reputation.

Return ONLY valid JSON in this exact format:

{
  "summary": "",
  "issues": [],
  "opportunities": [],
  "quickWins": [],
  "score": 0,
  "outreachMessage": "",
  "socialAnalysis": {
    "score": 0,
    "summary": "",
    "missingPlatforms": [],
    "recommendations": []
  },
  "emailAnalysis": {
    "summary": "",
    "issues": [],
    "recommendations": []
  }
}

Rules:
- Be specific and actionable
- Do NOT include any text outside JSON
- Website score 0-100 (higher = more opportunity)
- Factor email and social gaps into outreach message
- Keep outreach message short and personalized

Website URL: ${url}

Social media: ${socialSummary}

Email reputation:
${emailSummary}

Website content:
${textContent}`;

  try {
    console.log('🤖 Sending to Claude for analysis...');

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 4096,
      temperature: 0.4,
      messages: [{ role: 'user', content: prompt }],
    });

    const raw = response.content[0].text;
    console.log('📝 Received response, length:', raw.length);

    let parsed;

    try {
      parsed = JSON.parse(raw);
    } catch (err) {
      console.warn('⚠️ Direct JSON parse failed, trying extraction...');
      const match = raw.match(/\{[\s\S]*\}/);
      if (!match) throw new Error('No JSON found in Claude response');
      parsed = JSON.parse(match[0]);
    }

    console.log('✅ Successfully parsed Claude response');

    return {
      summary: parsed.summary || '',
      issues: parsed.issues || [],
      opportunities: parsed.opportunities || [],
      quickWins: parsed.quickWins || [],
      score: parsed.score || 0,
      outreachMessage: parsed.outreachMessage || '',
      socialAnalysis: parsed.socialAnalysis || {
        score: 0,
        summary: '',
        missingPlatforms: [],
        recommendations: [],
      },
    };
  } catch (error) {
    console.error('❌ Claude API error:', error.message);
    throw error;
  }
}

module.exports = { analyzeWebsite };
