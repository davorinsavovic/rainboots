const Anthropic = require('@anthropic-ai/sdk');

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

async function analyzeWebsite(textContent, url) {
  const prompt = `You are a website conversion and marketing expert.

Analyze this business website.

Return ONLY valid JSON in this exact format:

{
  "summary": "",
  "issues": [],
  "opportunities": [],
  "quickWins": [],
  "score": 0,
  "outreachMessage": ""
}

Rules:
- Be specific and actionable
- Do NOT include any text outside JSON
- Score from 0–100 (higher = better opportunity for improvement / higher likelihood to convert)
- Keep outreach message short, natural, and personalized
- Mention the business name if identifiable
- Focus on lead generation, conversions, and missed opportunities

Website URL:
${url}

Website content:
${textContent}
`;

  try {
    console.log('🤖 Sending to Claude for analysis...');

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929', // safer, valid model claude-sonnet-4-5-20250929
      max_tokens: 4096,
      temperature: 0.4, // lower = more consistent JSON
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const raw = response.content[0].text;
    console.log('📝 Received response, length:', raw.length);

    let parsed;

    // First attempt: direct JSON parse
    try {
      parsed = JSON.parse(raw);
    } catch (err) {
      console.warn('⚠️ Direct JSON parse failed, trying extraction...');

      // Fallback: extract JSON block
      const match = raw.match(/\{[\s\S]*\}/);

      if (!match) {
        console.error('❌ No JSON found in response');
        console.error(raw.substring(0, 300));
        throw new Error('No JSON found in Claude response');
      }

      try {
        parsed = JSON.parse(match[0]);
      } catch (parseError) {
        console.error('❌ JSON parse failed after extraction');
        console.error(match[0].substring(0, 300));
        throw new Error('Invalid JSON format in Claude response');
      }
    }

    console.log('✅ Successfully parsed Claude response');

    // Ensure required fields exist (safety)
    return {
      summary: parsed.summary || '',
      issues: parsed.issues || [],
      opportunities: parsed.opportunities || [],
      quickWins: parsed.quickWins || [],
      score: parsed.score || 0,
      outreachMessage: parsed.outreachMessage || '',
    };
  } catch (error) {
    console.error('❌ Claude API error:', error.message);
    throw error;
  }
}

module.exports = { analyzeWebsite };
