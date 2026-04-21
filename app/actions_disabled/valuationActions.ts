'use server';

import { supabase } from '../../lib/supabase';
import { revalidatePath } from 'next/cache';

export async function saveValuation(data: any, adminName: string = 'Admin User') {
  if (!supabase) return { success: false, error: 'Database connection not configured. Missing NEXT_PUBLIC_SUPABASE_URL in .env.local' };
  
  try {
    const carDetails = `${data.input.brand} ${data.input.model} ${data.input.subModel || ''} ${data.input.bodyType && data.input.bodyType !== 'ไม่ระบุ' ? `(${data.input.bodyType})` : ''} ${data.input.color ? `สี${data.input.color}` : ''} ${data.input.gear ? `เกียร์${data.input.gear}` : ''} ${data.input.condition}`.trim();
    const { error } = await supabase.from('valuations').insert([{
      car_details: carDetails,
      year: data.input.year,
      mileage: data.input.mileage,
      region: data.input.region,
      ttb_finance_max: data.result.finance_ceiling,
      retail_target: data.result.retail_target,
      max_buy_in: data.result.safe_buy_in,
      estimated_profit: data.result.estimated_profit,
      cashback_surplus: data.result.cashback,
      admin_name: adminName
    }]);

    if (error) throw error;
    
    revalidatePath('/admin/valuation');
    return { success: true };
  } catch (error: any) {
    console.error("Database Save Error:", error);
    return { success: false, error: error.message };
  }
}

export async function getRecentValuations() {
  if (!supabase) return [];
  
  try {
    const { data, error } = await supabase
      .from('valuations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching history:", error);
    return [];
  }
}

export async function deleteValuation(id: number) {
  if (!supabase) return { success: false, error: 'DB not configured' };
  try {
    const { error } = await supabase.from('valuations').delete().eq('id', id);
    if (error) throw error;
    revalidatePath('/admin/valuation');
    return { success: true };
  } catch (error: any) {
    console.error("Delete Error:", error);
    return { success: false, error: error.message };
  }
}

export async function updateValuation(id: number, updates: any) {
  if (!supabase) return { success: false, error: 'DB not configured' };
  try {
    const { error } = await supabase.from('valuations').update(updates).eq('id', id);
    if (error) throw error;
    revalidatePath('/admin/valuation');
    return { success: true };
  } catch (error: any) {
    console.error("Update Error:", error);
    return { success: false, error: error.message };
  }
}
