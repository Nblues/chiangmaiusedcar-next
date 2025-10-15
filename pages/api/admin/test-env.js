/**
 * Test Environment Variables
 * GET /api/admin/test-env
 */

export default async function handler(req, res) {
  // Only allow in non-production for security
  if (process.env.NODE_ENV === 'production') {
    return res.status(404).json({ error: 'Not found' });
  }

  return res.status(200).json({
    hasAdminUsername: !!process.env.ADMIN_USERNAME,
    hasAdminPassword: !!process.env.ADMIN_PASSWORD,
    hasSessionSecret: !!process.env.SESSION_SECRET,
    adminUsernameLength: process.env.ADMIN_USERNAME?.length || 0,
    nodeEnv: process.env.NODE_ENV,
    // Don't expose actual values for security
  });
}
