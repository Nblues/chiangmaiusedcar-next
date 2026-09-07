import { isAuthenticated, verifyCsrf } from '../../../middleware/adminAuth';
import { supabase } from '../../../lib/supabase';
import type { NextApiRequest, NextApiResponse } from 'next';

// Server-only valuation history CRUD. Keeping all Supabase access here (instead of
// calling supabase directly from pages/admin/valuation.tsx) means the DB client and
// its key never reach the client bundle, and every request must carry a valid admin
// session — the `valuations` table itself has RLS enabled with no public policies.
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!isAuthenticated(req)) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }

  if (!supabase) {
    return res.status(200).json({
      success: false,
      error: 'Database connection not configured. Missing NEXT_PUBLIC_SUPABASE_URL.',
      data: [],
    });
  }

  // Mutations require CSRF verification (double-submit cookie, same as other admin APIs).
  if (req.method !== 'GET' && !verifyCsrf(req)) {
    return res.status(403).json({ success: false, error: 'Invalid CSRF token' });
  }

  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('valuations')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return res.status(200).json({ success: true, data: data || [] });
    }

    if (req.method === 'POST') {
      const { row } = req.body || {};
      if (!row || typeof row !== 'object') {
        return res.status(400).json({ success: false, error: 'Missing row data' });
      }
      const { error } = await supabase.from('valuations').insert([row]);
      if (error) throw error;
      return res.status(200).json({ success: true });
    }

    if (req.method === 'PUT') {
      const { id, updates } = req.body || {};
      if (!id || !updates || typeof updates !== 'object') {
        return res.status(400).json({ success: false, error: 'Missing id or updates' });
      }
      const { error } = await supabase.from('valuations').update(updates).eq('id', id);
      if (error) throw error;
      return res.status(200).json({ success: true });
    }

    if (req.method === 'DELETE') {
      const id = (req.query.id as string) || req.body?.id;
      if (!id) {
        return res.status(400).json({ success: false, error: 'Missing id' });
      }
      const { error } = await supabase.from('valuations').delete().eq('id', id);
      if (error) throw error;
      return res.status(200).json({ success: true });
    }

    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  } catch (error: any) {
    console.error('Valuation API error:', error);
    return res.status(500).json({ success: false, error: error.message || 'Server error' });
  }
}
