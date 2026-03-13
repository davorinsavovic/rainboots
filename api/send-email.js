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
        ? services
            .map((s) => {
              const serviceLabels = {
                strategy: 'Marketing Strategy Development',
                digital: 'Digital Marketing',
                branding: 'Branding and Creative Services',
                content: 'Content Marketing',
              };
              return `• ${serviceLabels[s] || s}`;
            })
            .join('<br/>')
        : '• None selected';

    const budgetLabels = {
      under10k: 'Sidekick Level (Under $10k)',
      '10k-25k': 'Local Hero ($10k - $25k)',
      '25k-50k': 'City Protector ($25k - $50k)',
      '50k-100k': 'Avenger Level ($50k - $100k)',
      over100k: 'Justice League (Over $100k)',
    };

    const timelineLabels = {
      immediate: 'Emergency! (1-2 weeks)',
      short: 'Quick Mission (1-3 months)',
      medium: 'Strategic Campaign (3-6 months)',
      long: 'Epic Saga (6+ months)',
    };

    const businessTypeLabels = {
      advertising: 'Advertising and Marketing',
      travel: 'Transport and Travel',
      hospitality: 'Hotel and Catering',
      food: 'Food and Beverage',
      beauty: 'Health and Beauty',
      fashion: 'Fashion',
      sports: 'Sports and Leisure',
      tech: 'Technology and Apps',
      other: 'Other',
    };

    const currentYear = new Date().getFullYear();

    const htmlContent = `<!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;600;700&display=swap');
        </style>
      </head>
      <body style="margin:0;padding:0;background:#f5f7fa;font-family: 'Manrope', Arial, sans-serif;">
        <div style="max-width:600px;margin:30px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 10px 30px rgba(43,92,230,0.1);border:1px solid rgba(43,92,230,0.1);">

          <!-- Hero Header with Rainboots Gradient -->
          <div style="background:linear-gradient(135deg, #2b5ce6 0%, #4bb3d4 100%);padding:40px 30px;text-align:center;">
            <img src="https://rainbootsmarketing.com/images/rainboots_logo.png" 
                 alt="Rainboots Marketing"
                 style="max-width:180px;height:auto;margin-bottom:16px;filter:brightness(0) invert(1);"
                 onerror="this.onerror=null;this.src='https://via.placeholder.com/180x60/ffffff/2b5ce6?text=Rainboots';" />
            <h1 style="margin:10px 0 0;color:#ffffff;font-size:28px;font-weight:700;letter-spacing:-0.5px;font-family:'Manrope',Arial,sans-serif;">⚡ New Hero Signal ⚡</h1>
            <p style="margin:8px 0 0;color:rgba(255,255,255,0.9);font-size:16px;font-weight:300;">
              A new hero has summoned the Rainboots Justice League!
            </p>
          </div>

          <!-- Body -->
          <div style="padding:40px 30px;">
            <p style="font-size:18px;color:#1e293b;margin-top:0;font-weight:600;font-family:'Manrope',Arial,sans-serif;">🦸 Hero Alert!</p>

            <p style="font-size:16px;color:#334155;line-height:1.7;margin-bottom:30px;font-weight:300;">
              A new hero has sent a distress signal from their secret headquarters. Here are the details of their mission request:
            </p>

            <!-- Hero Profile Card -->
            <div style="background:#f8fafc;border-radius:12px;padding:24px;margin:24px 0;border:1px solid #e2e8f0;">
              <table style="width:100%;border-collapse:collapse;">
                <tr>
                  <td style="padding:10px 0;width:120px;color:#64748b;font-weight:400;">Hero Name:</td>
                  <td style="padding:10px 0;color:#0f172a;font-weight:600;">${name}</td>
                </tr>
                <tr>
                  <td style="padding:10px 0;color:#64748b;">Super Email:</td>
                  <td style="padding:10px 0;"><a href="mailto:${email}" style="color:#2b5ce6;text-decoration:none;font-weight:500;">${email}</a></td>
                </tr>
                <tr>
                  <td style="padding:10px 0;color:#64748b;">Secret Headquarters:</td>
                  <td style="padding:10px 0;color:#0f172a;font-weight:500;">${company || 'Classified'}</td>
                </tr>
                <tr>
                  <td style="padding:10px 0;color:#64748b;">Superpower:</td>
                  <td style="padding:10px 0;color:#0f172a;font-weight:500;">${businessTypeLabels[businessType] || businessType || 'Not specified'}</td>
                </tr>
              </table>
            </div>

            <!-- Mission Details Card -->
            <div style="background:#fff8e7;border-radius:12px;padding:24px;margin:24px 0;border-left:4px solid #f7d50f;">
              <h3 style="margin:0 0 16px;color:#1e293b;font-size:18px;font-weight:700;font-family:'Manrope',Arial,sans-serif;display:flex;align-items:center;gap:8px;">
                <span style="font-size:24px;">🎯</span> Mission Parameters
              </h3>
              
              <table style="width:100%;border-collapse:collapse;">
                <tr>
                  <td style="padding:8px 0;color:#64748b;width:120px;">Power Level:</td>
                  <td style="padding:8px 0;color:#0f172a;font-weight:600;"><span style="background:rgba(247,213,15,0.2);padding:4px 12px;border-radius:20px;color:#1e293b;">${budgetLabels[budget] || budget || 'Not specified'}</span></td>
                </tr>
                <tr>
                  <td style="padding:8px 0;color:#64748b;">Rescue Timeline:</td>
                  <td style="padding:8px 0;color:#0f172a;font-weight:500;">${timelineLabels[timeline] || timeline || 'Not specified'}</td>
                </tr>
              </table>
            </div>

            <!-- Services Needed -->
            <div style="margin:30px 0 20px;">
              <h3 style="margin:0 0 12px;color:#1e293b;font-size:18px;font-weight:700;font-family:'Manrope',Arial,sans-serif;display:flex;align-items:center;gap:8px;">
                <span style="font-size:24px;">⚙️</span> Heroic Services Needed
              </h3>
              <div style="background:#f1f5f9;border-radius:8px;padding:20px;">
                <p style="margin:0;color:#334155;font-size:16px;line-height:1.8;font-weight:400;">
                  ${servicesList}
                </p>
              </div>
            </div>

            <!-- Distress Signal -->
            <div style="margin:30px 0 20px;background:#ffffff;border:2px dashed #2b5ce6;border-radius:12px;padding:24px;">
              <h3 style="margin:0 0 12px;color:#1e293b;font-size:18px;font-weight:700;font-family:'Manrope',Arial,sans-serif;display:flex;align-items:center;gap:8px;">
                <span style="font-size:24px;">📡</span> Distress Signal
              </h3>
              <p style="margin:0;color:#334155;font-size:16px;line-height:1.8;font-style:italic;background:#f8fafc;padding:16px;border-radius:8px;">
                "${message || 'No distress signal provided.'}"
              </p>
            </div>

            <div style="margin-top:40px;padding-top:24px;border-top:2px solid #e2e8f0;">
              <p style="font-size:15px;color:#475569;margin-bottom:20px;font-weight:400;">
                <span style="font-size:18px;margin-right:8px;">⚡</span> 
                <strong style="color:#2b5ce6;">Action Required:</strong> This hero is waiting for the Justice League to assemble!
              </p>
              
              <div style="background:#f1f5f9;border-radius:8px;padding:16px;">
                <p style="margin:0 0 8px;color:#1e293b;font-size:15px;font-weight:600;">Quick Actions:</p>
                <p style="margin:5px 0;color:#2b5ce6;">✉️ Reply to this email to contact ${name.split(' ')[0]}</p>
                <p style="margin:5px 0;color:#2b5ce6;">📞 Schedule a discovery call</p>
                <p style="margin:5px 0;color:#2b5ce6;">📋 Add to CRM</p>
              </div>
            </div>

            <p style="font-size:16px;font-weight:500;color:#1e293b;margin-top:30px;">
              To your heroics,<br/>
              <strong style="color:#2b5ce6;">The Rainboots Justice League</strong>
            </p>
          </div>

          <!-- Footer with Rainboots Branding -->
          <div style="background:#f1f5f9;padding:24px 30px;text-align:center;border-top:1px solid #e2e8f0;">
            <div style="display:flex;justify-content:center;gap:20px;margin-bottom:16px;">
              <span style="font-size:24px;">⚡</span>
              <span style="font-size:24px;">💧</span>
              <span style="font-size:24px;">🦸</span>
            </div>
            <p style="margin:0 0 8px;color:#475569;font-size:14px;">Rainboots Marketing — Making Waves in Marketing</p>
            <p style="margin:0;color:#64748b;font-size:12px;">
              <a href="https://rainbootsmarketing.com" style="color:#2b5ce6;text-decoration:none;">rainbootsmarketing.com</a> &nbsp;|&nbsp; 
              <a href="mailto:hello@rainbootsmarketing.com" style="color:#2b5ce6;text-decoration:none;">hello@rainbootsmarketing.com</a>
            </p>
            <p style="margin:16px 0 0;color:#94a3b8;font-size:11px;">© ${currentYear} Rainboots Marketing. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>`;

    // Keep text version as fallback
    const textContent = `
⚡ NEW HERO SIGNAL RECEIVED ⚡

Hero Name: ${name}
Super Email: ${email}
Secret Headquarters: ${company || 'Not provided'}
Superpower: ${businessTypeLabels[businessType] || businessType || 'Not specified'}

Power Level: ${budgetLabels[budget] || budget || 'Not specified'}
Rescue Timeline: ${timelineLabels[timeline] || timeline || 'Not specified'}

Heroic Services Needed:
${servicesList.replace(/<br\/>/g, '\n')}

Distress Signal:
${message || 'No distress signal provided.'}

---
Rainboots Marketing — Making Waves in Marketing
rainbootsmarketing.com
`;

    const { data, error } = await resend.emails.send({
      from: 'Rainboots Justice League <hello@rainbootsmarketing.com>',
      to: ['davorins@gmail.com', 'steveutt915@gmail.com'], // Both email addresses
      subject: `⚡ New Hero Signal from ${name} ⚡`,
      html: htmlContent,
      text: textContent,
      reply_to: email,
    });

    if (error) {
      console.error('Resend error:', error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: error.message });
  }
}
