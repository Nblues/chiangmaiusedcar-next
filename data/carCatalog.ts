/**
 * Static catalog of car brands -> models -> sub-models (trims) for the
 * used-car market in Thailand.
 *
 * WHY STATIC: previously these lists were scraped live from roddonjai.com
 * (an undocumented internal endpoint, with a spoofed browser User-Agent).
 * That endpoint's page structure changed and broke the scrape, and relying
 * on it long-term carries real risk (fragile, subject to change, and reuses
 * another company's data without a clear agreement). Brand/model/sub-model
 * *names* change very rarely, so a locally maintained list is a safe,
 * stable replacement. The UI still allows free-text entry for anything
 * missing from this list (see pages/admin/valuation.tsx datalist/Input
 * fallbacks), so this list does not need to be 100% exhaustive.
 */

export type CarCatalog = Record<string, Record<string, string[]>>;

export const CAR_CATALOG: CarCatalog = {
  Toyota: {
    Vios: ['1.5 J', '1.5 E', '1.5 G', '1.5 S', '1.5 GR Sport'],
    Yaris: ['1.2 J', '1.2 E', '1.2 G', '1.2 Sport'],
    'Yaris Ativ': ['1.2 Entry', '1.2 Sport', '1.2 Premium', '1.2 GR Sport'],
    Altis: ['1.6 Entry', '1.6 GX', '1.8 GX', '1.8 Hybrid Premium'],
    Camry: ['2.0 G', '2.5 HEV Premium', '2.5 HEV Premium Luxury'],
    Fortuner: ['2.4 Entry 4x2', '2.4 Std 4x2', '2.8 4x2 High', '2.8 4x4 High', 'Legender 4x4'],
    'Hilux Revo': [
      'Standard Cab 2.4 J Plus',
      'Smart Cab 2.4 E Plus',
      'Double Cab 2.4 Entry',
      'Double Cab 2.8 Prerunner Z Edition',
      'Double Cab 4x4 High',
      'Rocco 4x4',
    ],
    'Hilux Vigo': ['Standard Cab', 'Smart Cab', 'Double Cab 3.0G', 'Double Cab 4x4'],
    Innova: ['2.0 J', '2.0 G', '2.0 V', 'Zenix Hybrid'],
    Avanza: ['1.5 E', '1.5 G', '1.5 Veloz'],
    Sienta: ['1.5 V', '1.5 Hybrid'],
    'C-HR': ['1.8 Mid', '1.8 Hi'],
    'Corolla Cross': ['1.8 Mid', '1.8 GR Sport', 'Hybrid Premium'],
    Alphard: ['2.5 Hybrid'],
  },
  Honda: {
    City: ['1.0 Turbo RS', '1.5 V', '1.5 SV', 'e:HEV RS'],
    Civic: ['1.5 Turbo EL', '1.8 EL', 'FC 1.8 E'],
    Accord: ['2.0 EL', 'Hybrid'],
    Jazz: ['1.5 V', '1.5 RS'],
    'HR-V': ['1.8 E', '1.8 EL', 'e:HEV RS'],
    'CR-V': ['2.4 EL', '1.5 Turbo EL', '2.0 e:HEV RS'],
    'BR-V': ['1.5 V', '1.5 SV'],
    Mobilio: ['1.5 V', '1.5 RS'],
    Freed: ['1.5 E'],
  },
  Isuzu: {
    'D-Max': ['Spark Standard Cab', 'Hi-Lander Cab4', 'V-Cross 4x2', 'V-Cross 4x4'],
    'MU-X': ['1.9 Ddi Active', '3.0 Ddi Hi-Lander 4x4'],
  },
  Nissan: {
    Almera: ['1.0 Turbo VL', 'E-Power VL'],
    March: ['1.2 E', '1.2 VL'],
    Note: ['E-Power VL'],
    Navara: ['Single Cab', 'King Cab Calibre', 'Double Cab Pro-4X'],
    Terra: ['2.3 VL 4WD'],
    'X-Trail': ['2.0 V', 'e-Power'],
    Sylphy: ['1.6 V'],
    Kicks: ['e-Power VL'],
  },
  Mitsubishi: {
    Attrage: ['1.2 GLX', '1.2 GLS'],
    Mirage: ['1.2 GLX', '1.2 GLS'],
    Triton: ['Single Cab', 'Mega Cab', 'Double Cab GLS', 'Double Cab Athlete'],
    'Pajero Sport': ['2.4 GT Premium', '2.4 Elite Edition'],
    Xpander: ['1.5 GLS', 'Cross'],
    Outlander: ['2.0 GLX', 'PHEV'],
  },
  Mazda: {
    Mazda2: ['1.3 Sports High', '1.3 Sports High Plus'],
    Mazda3: ['2.0 SP', '2.0 SkyActiv Sport'],
    'CX-3': ['2.0 S', '2.0 SP'],
    'CX-5': ['2.0 C', '2.2 XDL AWD'],
    'CX-8': ['2.2 XDL AWD'],
    'BT-50': ['Double Cab SP', 'Pro Double Cab'],
  },
  Ford: {
    Ranger: ['Open Cab XL', 'Double Cab XLT', 'Wildtrak 4x4', 'Raptor'],
    Everest: ['Titanium 4x2', 'Titanium+ 4x4'],
    Focus: ['1.5 Trend'],
    EcoSport: ['1.5 Titanium'],
  },
  Suzuki: {
    Swift: ['1.2 GL', '1.2 GLX'],
    Ciaz: ['1.2 GL', '1.2 GLX'],
    Celerio: ['1.0 GL'],
    Ertiga: ['1.5 GX'],
    XL7: ['1.5 GLX'],
  },
  Chevrolet: {
    Colorado: ['High Country Storm', 'LT Z71'],
    Trailblazer: ['LTZ', 'Z71'],
    Captiva: ['LS', 'LTZ'],
  },
  MG: {
    MG3: ['1.5 D', '1.5 X'],
    MG5: ['1.5 D', '1.5 X'],
    ZS: ['1.5 D', 'EV'],
    HS: ['1.5 Turbo X'],
    Extender: ['Giant Cab', 'Double Cab'],
  },
  Hyundai: {
    Accent: ['1.4 GL'],
    Elantra: ['1.6 Premium'],
    Tucson: ['2.0 Premium'],
    Staria: ['2.2 Premium'],
  },
  BMW: {
    'Series 3': ['320d', '330e M Sport'],
    'Series 5': ['520d', '530e M Sport'],
    X1: ['sDrive18d'],
    X3: ['xDrive20d M Sport'],
    X5: ['xDrive30d'],
  },
  'Mercedes-Benz': {
    'C-Class': ['C200', 'C300 AMG Dynamic'],
    'E-Class': ['E200', 'E300 AMG Dynamic'],
    GLA: ['GLA200'],
    GLC: ['GLC300 AMG Dynamic'],
  },
  Volvo: {
    S60: ['T5 Momentum'],
    XC40: ['T4 Momentum', 'Recharge Pure Electric'],
    XC60: ['T8 Inscription'],
    XC90: ['T8 Inscription'],
  },
  Subaru: {
    XV: ['2.0i-S EyeSight'],
    Forester: ['2.0i-L'],
  },
  Haval: {
    H6: ['HEV Ultra'],
    Jolion: ['HEV Ultra'],
  },
  BYD: {
    'Atto 3': ['Standard Range', 'Extended Range'],
    Dolphin: ['Standard Range', 'Extended Range'],
    Seal: ['Dynamic', 'Performance'],
  },
};

export const CAR_BRANDS: string[] = Object.keys(CAR_CATALOG).sort((a, b) => a.localeCompare(b));

export function getModelsForBrand(brand: string): string[] {
  const models = CAR_CATALOG[brand];
  if (!models) return [];
  return Object.keys(models).sort((a, b) => a.localeCompare(b));
}

export function getSubModelsForModel(brand: string, model: string): string[] {
  return CAR_CATALOG[brand]?.[model] || [];
}
