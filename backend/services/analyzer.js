const OpenAI = require('openai');

// Check if API key exists
if (!process.env.OPENAI_API_KEY) {
  console.error('❌ OPENAI_API_KEY is not set in environment variables');
  throw new Error(
    'OPENAI_API_KEY is required. Please set it in your .env file',
  );
}

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function analyzeWebsite(textContent) {
  const prompt = `
You are a website conversion and marketing expert.

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

Website content:
${textContent}
`;

  try {
    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const raw = response.choices[0].message.content;

    // Try parsing JSON
    try {
      return JSON.parse(raw);
    } catch (err) {
      console.error('AI returned invalid JSON:', raw);
      throw new Error('Failed to parse AI response');
    }
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw error;
  }
}

module.exports = { analyzeWebsite };
