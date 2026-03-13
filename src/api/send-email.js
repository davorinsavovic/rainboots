import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { to, subject, body } = req.body;

    const { data, error } = await resend.emails.send({
      from: 'Rainboots Marketing <hello@rainbootsmarketing.com>',
      to,
      subject,
      html: body,
    });

    if (error) {
      return res.status(500).json(error);
    }

    res.status(200).json({
      success: true,
      id: data.id,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
}
