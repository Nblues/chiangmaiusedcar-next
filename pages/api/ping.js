export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  return res.status(200).send('pong');
}

export const config = {
  api: {
    bodyParser: false,
  },
  // Ensure this API runs on Node.js runtime (not Edge)
  runtime: 'nodejs',
};
