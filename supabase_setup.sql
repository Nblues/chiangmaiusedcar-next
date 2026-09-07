-- Run this in your Supabase SQL Editor to create the valuations table

CREATE TABLE IF NOT EXISTS valuations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  car_details TEXT NOT NULL,
  year INTEGER NOT NULL,
  mileage INTEGER NOT NULL,
  region TEXT NOT NULL,
  ttb_finance_max INTEGER NOT NULL,
  retail_target INTEGER NOT NULL,
  max_buy_in INTEGER NOT NULL,
  estimated_profit INTEGER NOT NULL,
  cashback_surplus INTEGER NOT NULL,
  admin_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Note: All application access to this table goes through the authenticated
-- server-side API route (pages/api/admin/valuation.ts) using the Supabase
-- service role key, which always bypasses RLS. RLS is enabled here with NO
-- policies as defense-in-depth, so the public anon key can never read/write
-- this table directly (e.g. if it were ever used client-side by mistake).
ALTER TABLE valuations ENABLE ROW LEVEL SECURITY;
