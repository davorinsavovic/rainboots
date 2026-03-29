// backend/routes/blogRoutes.js
const express = require('express');
const Anthropic = require('@anthropic-ai/sdk');

const router = express.Router();

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

router.post('/generate', async (req, res) => {
  try {
    const { model, max_tokens, messages } = req.body;

    if (!messages || !messages[0]?.content) {
      return res
        .status(400)
        .json({ error: 'Missing messages in request body' });
    }

    console.log('🤖 Generating blog article...');

    const response = await anthropic.messages.create({
      model: model || 'claude-sonnet-4-6',
      max_tokens: max_tokens || 4000,
      temperature: 0.7,
      messages: messages,
    });

    const raw = response.content[0].text;
    console.log('✅ Blog article generated successfully');

    res.json({ content: [{ text: raw }] });
  } catch (error) {
    console.error('❌ Blog generation error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
