import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      company,
      businessType,
      services,
      budget,
      timeline,
      message,
    } = body;

    // Format services list
    const servicesList =
      services.length > 0
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
      from: 'Rainboots Marketing <services@rainbootsmarketing.com/>',
      to: ['services@rainbootsmarketing.com'],
      subject: `🦸 New Hero Signal from ${name}`,
      text: emailContent,
      replyTo: email,
    });

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ success: true, data });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
