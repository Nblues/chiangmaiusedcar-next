export default function handler(req, res) {
  // Never expose diagnostic endpoints in production
  if (process.env.NODE_ENV === 'production') {
    return res.status(404).json({ error: 'Not found' });
  }

  return res.status(200).json({ status: 'ok', timestamp: Date.now() });
}
