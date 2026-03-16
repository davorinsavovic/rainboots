export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Only allow requests from your own domain
  const origin = req.headers.origin || '';
  const allowed = [
    'https://rainbootsmarketing.com',
    'https://www.rainbootsmarketing.com',
    'http://localhost:3000',
    'http://localhost:5173',
  ];
  if (!allowed.includes(origin)) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const apiKey = process.env.REACT_APP_ANTHROPIC_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();

    // Set CORS header so browser accepts the response
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    return res.status(response.status).json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Proxy error: ' + err.message });
  }
}
