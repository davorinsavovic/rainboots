const Anthropic = require('@anthropic-ai/sdk');

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

async function analyzeWebsite(textContent) {
  const prompt = `You are a website conversion and marketing expert.

Analyze this business website content.

Return ONLY valid JSON in this format:

{
  "summary": "",
  "issues": [],
  "opportunities": [],
  "quickWins": [],
  "outreachMessage": ""
}

Rules:
- Be specific and actionable
- Do not include any text outside JSON
- Keep outreach message short and persuasive
- Use the business name if found in the content

Website content:
${textContent}`;

  try {
    console.log('🤖 Sending to Claude for analysis...');

    // Try the latest Claude 3.5 model
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 4096,
      temperature: 0.7,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const raw = response.content[0].text;
    console.log('📝 Received response from Claude, length:', raw.length);

    // Try to extract JSON from the response
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0]);
        console.log('✅ Successfully parsed Claude response');
        return parsed;
      } catch (parseError) {
        console.error('Failed to parse JSON:', parseError.message);
        console.error('Raw response preview:', raw.substring(0, 200));
        throw new Error('Invalid JSON format in Claude response');
      }
    } else {
      console.error('No JSON found in response');
      console.error('Raw response preview:', raw.substring(0, 200));
      throw new Error('No JSON found in Claude response');
    }
  } catch (error) {
    console.error('❌ Claude API error:', error.message);
    throw error;
  }
}

module.exports = { analyzeWebsite };
