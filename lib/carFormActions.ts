// Brand/model/sub-model lists used to come from live-scraping roddonjai.com
// (an undocumented internal endpoint, with a spoofed browser User-Agent).
// That is fragile (their page structure already changed once and broke
// this) and reuses another company's data without a clear agreement.
// These names change rarely, so we now serve them from a locally
// maintained static catalog instead. See data/carCatalog.ts.
import { CAR_BRANDS, getModelsForBrand, getSubModelsForModel } from '../data/carCatalog';

export async function fetchBrands(): Promise<string[]> {
  return CAR_BRANDS;
}

export async function fetchModels(brand: string): Promise<string[]> {
  return getModelsForBrand(brand);
}

export async function fetchSubModels(brand: string, model: string): Promise<string[]> {
  return getSubModelsForModel(brand, model);
}
