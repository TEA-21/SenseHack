export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed.' });
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
