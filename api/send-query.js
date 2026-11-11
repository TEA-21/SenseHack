const WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS = 15;
const ipRequests = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  if (ipRequests.size > 500) {
    for (const [key, timestamps] of ipRequests.entries()) {
      const valid = timestamps.filter(t => now - t < WINDOW_MS);
      if (valid.length === 0) {
        ipRequests.delete(key);
      } else {
        ipRequests.set(key, valid);
      }
    }
  }

  const timestamps = (ipRequests.get(ip) || []).filter(t => now - t < WINDOW_MS);
  if (timestamps.length >= MAX_REQUESTS) {
    return true;
  }
  timestamps.push(now);
  ipRequests.set(ip, timestamps);
  return false;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed.' });

  const headers = req.headers || {};
  const originHeader = headers.origin || headers.referer;
  if (originHeader) {
    try {
      const hostname = new URL(originHeader).hostname;
      const allowed =
        hostname === 'localhost' ||
        hostname === '127.0.0.1' ||
        hostname === 'vit.ac.in' ||
        hostname.endsWith('.vit.ac.in') ||
        hostname.endsWith('.vercel.app');
      if (!allowed) {
        return res.status(403).json({ error: 'Forbidden: untrusted origin.' });
      }
    } catch {
      return res.status(403).json({ error: 'Forbidden: untrusted origin.' });
    }
  }

  if (JSON.stringify(req.body || {}).length > 10240) {
    return res.status(400).json({ error: 'Payload exceeds 10KB limit.' });
  }

  const clientIp = (headers['x-forwarded-for'] || '').split(',')[0].trim() || headers['x-real-ip'] || req.socket?.remoteAddress || 'unknown';
  if (isRateLimited(clientIp)) {
    return res.status(429).json({ error: 'Too many queries submitted. Please wait a few minutes before trying again.' });
  }

  const { email, message, website } = req.body || {};
  if (website) return res.status(200).json({ ok: true });
  if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || typeof message !== 'string' || message.trim().length < 8 || message.length > 5000) {
    return res.status(400).json({ error: 'Please enter a valid email and a query of at least 8 characters.' });
  }
  if (!process.env.RESEND_API_KEY || !process.env.RESEND_FROM_EMAIL) {
    return res.status(503).json({ error: 'The query inbox is not configured yet. Please email ieee@vit.ac.in directly.' });
  }
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: process.env.RESEND_FROM_EMAIL,
        to: [process.env.QUERY_TO_EMAIL || 'ieee@vit.ac.in'],
        reply_to: email,
        subject: 'New SenseHack website query',
        text: `A new query was submitted through the SenseHack website.\n\nFrom: ${email}\n\nQuery:\n${message.trim()}`
      })
    });
    if (!response.ok) {
      const detail = await response.text();
      console.error('Resend delivery failed:', detail);
      return res.status(502).json({ error: 'Email delivery failed. Please try again or email ieee@vit.ac.in directly.' });
    }
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Query delivery error:', error);
    return res.status(500).json({ error: 'Unable to send your query right now.' });
  }
}
