const express = require('express');
const { Resend } = require('resend');
const router = express.Router();

// Initialize Resend with your API key
const resend = new Resend(process.env.RESEND_API_KEY);

// This will be mounted at /api/send-email (because index.js uses app.use('/api', router))
router.post('/send-email', async (req, res) => {
  try {
    const { to, subject, body } = req.body;

    // Validate required fields
    if (!to || !subject || !body) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    console.log('📧 Sending email:', { to, subject });

    const { data, error } = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: Array.isArray(to) ? to : [to],
      subject,
      html: body,
    });

    if (error) {
      console.error('❌ Resend error:', error);
      return res.status(500).json({ error: error.message });
    }

    console.log('✅ Email sent. ID:', data?.id);
    res.json({ success: true, id: data?.id });
  } catch (error) {
    console.error('❌ Server error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Add a test endpoint to verify the router is working
router.get('/test', (req, res) => {
  res.json({ message: 'Email router is working!' });
});

module.exports = router;
