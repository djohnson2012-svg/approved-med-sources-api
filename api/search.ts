import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { query } = req.query;

  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  try {
    // Implement search logic here
    const results = {
      query: query,
      sources: [
        {
          id: '1',
          name: 'Example Medical Source',
          url: 'https://example.com',
          description: 'Sample medical source for demonstration'
        }
      ]
    };

    return res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}
