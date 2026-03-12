const express = require('express');
const { Resend } = require('resend');
const router = express.Router();

// Initialize Resend with your API key
const resend = new Resend(process.env.RESEND_API_KEY);

router.post('/send-email', async (req, res) => {
  try {
    const { to, subject, body } = req.body;

    if (!to || !subject || !body) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const response = await resend.emails.send({
      from: 'Rainboots Marketing <hello@rainbootsmarketing.com>',
      to: Array.isArray(to) ? to : [to],
      subject: subject,
      html: body,
    });

    console.log('✅ Email sent:', response);

    res.json({
      success: true,
      id: response.data?.id,
    });
  } catch (error) {
    console.error('❌ Email error:', error);
    res.status(500).json({
      error: 'Failed to send email',
    });
  }
});
// Add a test endpoint to verify the router is working
router.get('/test', (req, res) => {
  res.json({ message: 'Email router is working!' });
});

module.exports = router;
