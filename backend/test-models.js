const Anthropic = require('@anthropic-ai/sdk');
require('dotenv').config();

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

async function testModels() {
  console.log('Testing latest Claude models...\n');

  const models = [
    'claude-3-5-sonnet-20241022',
    'claude-3-5-haiku-20241022',
    'claude-3-opus-20240229',
  ];

  for (const model of models) {
    try {
      console.log(`Testing ${model}...`);
      const response = await anthropic.messages.create({
        model: model,
        max_tokens: 50,
        messages: [{ role: 'user', content: "Say 'Working!'" }],
      });
      console.log(`✅ ${model} works! Response: ${response.content[0].text}\n`);
    } catch (error) {
      console.log(`❌ ${model} failed: ${error.message}\n`);
    }
  }
}

testModels();
