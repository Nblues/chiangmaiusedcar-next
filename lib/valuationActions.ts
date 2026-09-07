// Client-safe helpers for the valuation dashboard. All Supabase access happens
// server-side in pages/api/admin/valuation.ts (gated by the admin session) so no
// DB credentials are ever bundled into client-side JavaScript.

const API_URL = '/api/admin/valuation';

function getCookie(name: string): string {
  if (typeof document === 'undefined') return '';
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = document.cookie.match(new RegExp('(?:^|; )' + escaped + '=([^;]*)'));
  return match && match[1] ? decodeURIComponent(match[1]) : '';
}

async function apiRequest(method: string, body?: any, query?: string) {
  const csrfToken = getCookie('__Host-csrfToken') || getCookie('csrfToken');
  const res = await fetch(`${API_URL}${query ? `?${query}` : ''}`, {
    method,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(csrfToken ? { 'X-CSRF-Token': csrfToken } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  return res.json();
}

export async function saveValuation(data: any, adminName: string = 'Admin User') {
  try {
    const carDetails =
      `${data.input.brand} ${data.input.model} ${data.input.subModel || ''} ${data.input.bodyType && data.input.bodyType !== 'ไม่ระบุ' ? `(${data.input.bodyType})` : ''} ${data.input.color ? `สี${data.input.color}` : ''} ${data.input.gear ? `เกียร์${data.input.gear}` : ''} ${data.input.condition}`.trim();

    const row = {
      car_details: carDetails,
      year: data.input.year,
      mileage: data.input.mileage,
      region: data.input.region,
      ttb_finance_max: data.result.finance_ceiling,
      retail_target: data.result.retail_target,
      max_buy_in: data.result.safe_buy_in,
      estimated_profit: data.result.estimated_profit,
      cashback_surplus: data.result.cashback,
      admin_name: adminName,
    };

    return await apiRequest('POST', { row });
  } catch (error: any) {
    console.error('Database Save Error:', error);
    return { success: false, error: error.message };
  }
}

export async function getRecentValuations() {
  try {
    const res = await apiRequest('GET');
    return res.success ? res.data || [] : [];
  } catch (error) {
    console.error('Error fetching history:', error);
    return [];
  }
}

export async function deleteValuation(id: number | string) {
  try {
    return await apiRequest('DELETE', undefined, `id=${encodeURIComponent(String(id))}`);
  } catch (error: any) {
    console.error('Delete Error:', error);
    return { success: false, error: error.message };
  }
}

export async function updateValuation(id: number | string, updates: any) {
  try {
    return await apiRequest('PUT', { id, updates });
  } catch (error: any) {
    console.error('Update Error:', error);
    return { success: false, error: error.message };
  }
}
