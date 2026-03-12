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

-- Note: Ensure Row Level Security (RLS) is disabled for this table if you're using Service Role Keys solely from Server Actions,
-- OR add appropriate policies to allow inserts and reads from authenticated server logic.
ALTER TABLE valuations DISABLE ROW LEVEL SECURITY;
