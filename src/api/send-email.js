import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      name,
      email,
      company,
      businessType,
      services,
      budget,
      timeline,
      message,
    } = req.body;

    const servicesList =
      services?.length > 0
        ? services.map((s) => `• ${s}`).join('\n')
        : 'None selected';

    const emailContent = `
🦸 NEW HERO SIGNAL RECEIVED 🦸

Hero Name: ${name}
Super Email: ${email}
Secret Headquarters: ${company || 'Not provided'}
Superpower: ${businessType || 'Not specified'}

Power Level: ${budget || 'Not specified'}
Rescue Timeline: ${timeline || 'Not specified'}

Heroic Services Needed:
${servicesList}

Distress Signal:
${message}
`;

    const { data, error } = await resend.emails.send({
      from: 'Rainboots Marketing <hello@rainbootsmarketing.com>',
      to: ['services@rainbootsmarketing.com'],
      subject: `🦸 New Hero Signal from ${name}`,
      text: emailContent,
      reply_to: email,
    });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
