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

  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'ID parameter is required' });
  }

  try {
    // Resolve source details by ID
    const sourceDetails = {
      id: id,
      name: `Medical Source ${id}`,
      url: `https://example.com/source/${id}`,
      description: `Detailed information for medical source ${id}`,
      type: 'medical_journal',
      lastUpdated: new Date().toISOString(),
      verified: true,
      categories: ['cardiology', 'general_medicine'],
      metadata: {
        publisher: 'Example Medical Publisher',
        impact_factor: '4.5',
        peer_reviewed: true
      }
    };

    return res.status(200).json(sourceDetails);
  } catch (error) {
    return res.status(500).json({ 
      error: 'Failed to resolve source details',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
