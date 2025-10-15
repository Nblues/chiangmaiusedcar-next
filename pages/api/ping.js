export default function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();
  res.status(200).send('pong');
}

export const config = { api: { bodyParser: false } };
