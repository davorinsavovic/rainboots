const Anthropic = require('@anthropic-ai/sdk');

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

async function analyzeWebsite(textContent, url, socialLinks = {}) {
  const socialSummary =
    Object.keys(socialLinks).length > 0
      ? `Found: ${Object.keys(socialLinks).join(', ')}`
      : 'No social media profiles detected on website';

  const prompt = `You are a website conversion and marketing expert.

Analyze this business website and its social media presence.

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
  }
}

Rules:
- Be specific and actionable
- Do NOT include any text outside JSON
- Website score 0–100 (higher = better opportunity for improvement)
- Social score 0–100 (higher = worse social presence = bigger opportunity)
- missingPlatforms: list platforms this business SHOULD have but doesn't
- Keep outreach message short, natural, personalized
- Factor social media gaps into the overall outreach message

Website URL: ${url}

Social media detected on website:
${socialSummary}

Website content:
${textContent}
`;

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
