// Minimal runtime check API to isolate global serverless issues
// GET /api/runtime-check
export default function handler(req, res) {
  try {
    if (req.method !== 'GET') {
      return res.status(405).json({ ok: false, error: 'Method not allowed' });
    }
    return res.status(200).json({ ok: true, ts: Date.now(), node: process.version });
  } catch (err) {
    // Log explicit error to help diagnose FUNCTION_INVOCATION_FAILED
    // eslint-disable-next-line no-console
    console.error('Runtime check failure:', err);
    return res.status(500).json({ ok: false, error: err.message });
  }
}

export const config = {
  api: {
    bodyParser: false, // keep minimal
  },
};
