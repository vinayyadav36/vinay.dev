// Vercel serverless function for visitor counting
// Uses Upstash Redis HTTP API when env vars are configured, otherwise tracks via response headers
const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
const VISITOR_KEY = 'vinay_dev_visitors';

async function redisCommand(command, ...args) {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) return null;
  try {
    const response = await fetch(`${UPSTASH_URL}/${[command, ...args].join('/')}`, {
      headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` }
    });
    const data = await response.json();
    return data.result;
  } catch (err) {
    console.error('[visitors] Redis command failed:', err.message);
    return null;
  }
}

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    // Track a new visitor
    const count = await redisCommand('INCR', VISITOR_KEY);
    if (count !== null) {
      return res.status(200).json({ success: true, count: Number(count) });
    }
    // Fallback: Redis not configured, return success without tracking
    return res.status(200).json({ success: true, count: null, message: 'Tracking not configured' });
  }

  if (req.method === 'GET') {
    // Get current visitor count
    const count = await redisCommand('GET', VISITOR_KEY);
    if (count !== null) {
      return res.status(200).json({ success: true, count: Number(count) || 0 });
    }
    // Fallback: Redis not configured
    return res.status(200).json({ success: true, count: 0, configured: false });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}