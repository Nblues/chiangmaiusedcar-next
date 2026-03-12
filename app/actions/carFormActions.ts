'use server';

export async function fetchBrands() {
  try {
    const res = await fetch('https://api-buyer.roddonjai.com/api-gateway/buyer/service-page/bluebook-search-page', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0'
      },
      next: { revalidate: 3600 }
    });
    const json = await res.json();
    return json?.data?.getCarBrand?.map((b: any) => b.brandName) || [];
  } catch (err) {
    return ['Toyota', 'Honda', 'Isuzu', 'Nissan', 'Mitsubishi', 'Ford', 'Mazda', 'Suzuki'];
  }
}

export async function fetchModels(brand: string) {
  try {
    const searchUrl = `https://www.roddonjai.com/service/bluebook-search-result?carBrand=${encodeURIComponent(brand)}`;
    const res = await fetch(searchUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      next: { revalidate: 3600 }
    });
    const html = await res.text();
    const match = html.match(/<script id="__NEXT_DATA__"([^>]*)>(.+?)<\/script>/);
    if (match) {
      const json = JSON.parse(match[2]);
      const results = json?.props?.pageProps?.initialState?.bluebookReducer?.bluebookSearchResult?.data?.results || [];
      const models = [...new Set(results.map((r: any) => r.carModel))].filter(Boolean);
      return models as string[];
    }
    return [];
  } catch (err) {
    return [];
  }
}

export async function fetchSubModels(brand: string, model: string) {
  try {
    const searchUrl = `https://www.roddonjai.com/service/bluebook-search-result?carBrand=${encodeURIComponent(brand)}&carModel=${encodeURIComponent(model)}`;
    const res = await fetch(searchUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      next: { revalidate: 3600 }
    });
    const html = await res.text();
    const match = html.match(/<script id="__NEXT_DATA__"([^>]*)>(.+?)<\/script>/);
    if (match) {
      const json = JSON.parse(match[2]);
      const results = json?.props?.pageProps?.initialState?.bluebookReducer?.bluebookSearchResult?.data?.results || [];
      // Also grab matching year options and prices if possible? Not required for dropdown, but we extract subModels.
      const submodels = [...new Set(results.map((r: any) => r.carSubModel))].filter(Boolean);
      return submodels as string[];
    }
    return [];
  } catch (err) {
    return [];
  }
}
