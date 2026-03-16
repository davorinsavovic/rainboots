import https from 'https';

export default async function handler(req, res) {
  // Handle CORS preflight
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.REACT_APP_ANTHROPIC_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured on server' });
  }

  // Parse body safely
  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      return res.status(400).json({ error: 'Invalid JSON body' });
    }
  }
  if (!body || !body.messages) {
    return res.status(400).json({ error: 'Missing messages in request body' });
  }

  const payload = JSON.stringify({
    model: body.model || 'claude-sonnet-4-5',
    max_tokens: body.max_tokens || 2000,
    messages: body.messages,
  });

  return new Promise((resolve) => {
    const options = {
      hostname: 'api.anthropic.com',
      path: '/v1/messages',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
    };

    const request = https.request(options, (response) => {
      let data = '';
      response.on('data', (chunk) => {
        data += chunk;
      });
      response.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          res.status(response.statusCode).json(parsed);
        } catch {
          res.status(500).json({ error: 'Failed to parse Anthropic response' });
        }
        resolve();
      });
    });

    request.on('error', (err) => {
      res.status(500).json({ error: 'Request error: ' + err.message });
      resolve();
    });

    request.write(payload);
    request.end();
  });
}
