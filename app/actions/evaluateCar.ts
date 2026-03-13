'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';
import { supabase } from '../../lib/supabase';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchTTBBluebook(brand: string, model: string, year: number, subModel?: string): Promise<string | null> {
  try {
    const searchUrl = `https://www.roddonjai.com/service/bluebook-search-result?carBrand=${encodeURIComponent(brand)}&carModel=${encodeURIComponent(model)}&year=${year}`;
    const res = await fetch(searchUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0' },
      next: { revalidate: 3600 }
    });
    
    if (!res.ok) return null;
    
    const html = await res.text();
    const match = html.match(/<script id="__NEXT_DATA__"([^>]*)>(.+?)<\/script>/);
    
    if (match) {
      const json = JSON.parse(match[2] as string);
      const results = json?.props?.pageProps?.initialState?.bluebookReducer?.bluebookSearchResult?.data?.results || [];
      const validPrices = results.filter((r:any) => Number(r.marketPriceSecondhand) > 0);
      
      if (validPrices.length > 0) {
        let targetPrices = validPrices;
        
        // If subModel is specified, try to find a matching or closely resembling sub-model
        if (subModel) {
          const subModelTerms = subModel.toLowerCase().split(/\s+/);
          const matchedSubModels = validPrices.filter((r:any) => {
             const rSub = r.carSubModel.toLowerCase();
             // Check if all or most terms match
             return subModelTerms.some(term => rSub.includes(term));
          });
          if (matchedSubModels.length > 0) {
             targetPrices = matchedSubModels;
          }
        }
        
        const mapList = validPrices.map((r:any) => `- ${r.carSubModel}: ${r.marketPriceSecondhand} THB`);
        const minPrice = Math.min(...targetPrices.map((r:any) => Number(r.marketPriceSecondhand)));
        console.log(`[Deep Fetcher] Found ${validPrices.length} sub-models. Selected Min: ${minPrice}`);
        
        return `TTB Database Live Active! Found exact market prices for ${year} ${brand} ${model}. Market values for ALL sub-models are:\n${mapList.join('\n')}\n\nCRUCIAL RULE: You MUST strictly use the lowest price found among the matching submodels (${minPrice} THB) as your exact 'market_middle_price' to guarantee profitability and avoid risk. Do not invent any other middle price.`;
      }
    }
    return null;
  } catch(error) {
    console.error('[TTB Fetcher Error]', error);
    return null;
  }
}

export async function getTTBSubModels(brand: string, model: string, year: number): Promise<{ success: boolean, data?: string[], error?: string }> {
  try {
    const searchUrl = `https://www.roddonjai.com/service/bluebook-search-result?carBrand=${encodeURIComponent(brand)}&carModel=${encodeURIComponent(model)}&year=${year}`;
    const res = await fetch(searchUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0' },
      next: { revalidate: 3600 }
    });
    
    if (!res.ok) throw new Error('TTB Search Failed');
    
    const html = await res.text();
    const match = html.match(/<script id="__NEXT_DATA__"([^>]*)>(.+?)<\/script>/);
    
    if (match) {
      const json = JSON.parse(match[2] as string);
      const results = json?.props?.pageProps?.initialState?.bluebookReducer?.bluebookSearchResult?.data?.results || [];
      const validPrices = results.filter((r:any) => Number(r.marketPriceSecondhand) > 0);
      
      const subModels = Array.from(new Set(validPrices.map((r:any) => r.carSubModel))) as string[];
      
      return { success: true, data: subModels };
    }
    return { success: false, error: 'No data found' };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function evaluateCarWithAI(formData: {
  brand: string;
  model: string;
  subModel?: string;
  bodyType?: string;
  color?: string;
  gear?: string;
  year: number;
  mileage: number;
  region: string;
  condition: string;
  referencePrice?: string | number;
}) {
  try {
    // Attempt to fetch real TTB data first
    const ttbLiveContext = await fetchTTBBluebook(formData.brand, formData.model, formData.year, formData.subModel) || 'No active API link. Rely on internal base DLT knowledge.';

    // Fetch precise historical evaluation targets for this model
    let historicContext = 'เนเธกเนเธกเธตเธเธฃเธฐเธงเธฑเธ•เธดเธเธฒเธฃเธเธฃเธฐเน€เธกเธดเธเธฃเธ–เธฃเธธเนเธเธเธตเนเนเธเธเธฒเธเธเนเธญเธกเธนเธฅ (No internal past history)';
    if (supabase) {
      const { data: pastValuations } = await supabase
        .from('valuations')
        .select('*')
        .ilike('car_details', `%${formData.brand}%${formData.model}%`)
        .order('created_at', { ascending: false })
        .limit(5);

      if (pastValuations && pastValuations.length > 0) {
        const formattedHistory = pastValuations.map(row => 
          `- เธงเธฑเธเธ—เธตเนเธเธฃเธฐเน€เธกเธดเธเน€เธ”เธดเธก: ${new Date(row.created_at).toLocaleDateString()} เธเนเธญเธกเธนเธฅ: ${row.car_details} (เธเธต ${row.year}) | เธฃเธฒเธเธฒเธฃเธฑเธเธเธทเนเธญเน€เธเนเธฒเธ—เธตเนเน€เธเธขเธเธฃเธฐเน€เธกเธดเธ (Safe Buy-In): ${row.max_buy_in?.toLocaleString() || 'N/A'} เธเธฒเธ— | เธฃเธฒเธเธฒเธ•เธฅเธฒเธ”เธ•เธฑเนเธเธเธฒเธข (Retail Target): ${row.retail_target?.toLocaleString() || 'N/A'} เธเธฒเธ—`
        ).join('\n');
        historicContext = `เธเธเธเธฃเธฐเธงเธฑเธ•เธดเธเธฒเธฃเธเธฃเธฐเน€เธกเธดเธเธฃเธฒเธเธฒเธเธญเธเธจเธนเธเธขเนเน€เธฃเธฒเนเธเธญเธ”เธตเธ• เธเธฃเธธเธ“เธฒเธเธณเธฃเธนเธเนเธเธเธฃเธฒเธเธฒเน€เธ”เธดเธกเนเธเธเธฃเธฐเน€เธกเธดเธเนเธเธงเนเธเนเธกเนเธฅเธฐเธญเนเธฒเธเธญเธดเธเธเนเธฒเน€เธชเธทเนเธญเธก:\n${formattedHistory}`;
      }
    }

    const apiKey = process.env.GEMINI_API_KEY as string;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not defined in environment variables');
    }

    const ai = new GoogleGenerativeAI(apiKey);
    const model = ai.getGenerativeModel({ 
      model: 'gemini-3.1-pro-preview', // Upgraded to the ultimate latest 3.1 Pro version
      generationConfig: {
        temperature: 0, // เธ•เธฑเนเธเธเนเธฒเธเธงเธฒเธกเธชเธฃเนเธฒเธเธชเธฃเธฃเธเนเน€เธเนเธ 0 เน€เธเธทเนเธญเนเธซเนเนเธ”เนเธเธฅเธฅเธฑเธเธเน(เธฃเธฒเธเธฒ) เธ—เธตเนเธ•เธฒเธขเธ•เธฑเธงเธ—เธตเนเธชเธธเธ”
        topK: 1,
        topP: 0.1,
      }
    });

    const prompt = `
      You are the Head of Procurement for a used car dealership in Thailand (Year 2026). Evaluate the car:
      - Brand: ${formData.brand}
      - Model: ${formData.model}
      - Sub-Model: ${formData.subModel || 'Not specified'}
      - Body Type: ${formData.bodyType && formData.bodyType !== 'เนเธกเนเธฃเธฐเธเธธ' ? formData.bodyType : 'Auto-detect from sub-model'}
      - Gear: ${formData.gear || 'Auto'}
      - Year: ${formData.year}
      - Mileage: ${formData.mileage} km
      - Region: ${formData.region}
      - Condition: ${formData.condition}
      - TTB/Roddonjai API Context Check: ${ttbLiveContext}
      - User Reference TTB Price: ${formData.referencePrice ? formData.referencePrice + ' THB' : 'Not provided'}
      - HISTORICAL VALUATION DATA: ${historicContext}

      Rules:
      1. CRITICAL CONTEXT: You are an expert Thai used car dealer appraiser. Your valuation methodology MUST strictly follow the authoritative TTB Bluebook standard: "เธชเธณเธฃเธงเธเธฃเธฒเธเธฒเธ•เธฅเธฒเธ” เธเธฒเธเนเธซเธฅเนเธเธเนเธญเธกเธนเธฅเธ—เธตเนเธเนเธฒเน€เธเธทเนเธญเธ–เธทเธญ เธญเธฒเธ—เธด เธเธฒเธเธเธฃเธฐเธกเธนเธฅเธฃเธ–เธขเธเธ•เน, เธเธฒเธเนเธชเธ”เธเธฃเธ–เธขเธเธ•เน, เธเธฑเธเธเธกเธดเธ•เธฃ เนเธฅเธฐเธฅเธนเธเธเนเธฒ เธเธณเธเนเธญเธกเธนเธฅเธกเธฒเธงเธดเน€เธเธฃเธฒเธฐเธซเนเธ•เธฒเธกเธกเธฒเธ•เธฃเธเธฒเธ ISO9001: 2015 เนเธเนเน€เธเธ“เธ‘เนเธเธ“เธฐเธเธฃเธฃเธกเธเธฒเธฃเธเธดเธเธฒเธฃเธ“เธฒเนเธฅเธฐเธเธณเธซเธเธ”เธฃเธฒเธเธฒเธเธฅเธฒเธเธฃเธ–เธขเธเธ•เนเนเธเนเนเธฅเนเธง เธเนเธฒเธเธเธฒเธฃเธ•เธฃเธงเธเธชเธญเธเธเธฒเธ Auditor 'SGS Thailand Co., Ltd.' เนเธฅเธฐเนเธ”เนเธฃเธฑเธเธเธฒเธฃเธฃเธฑเธเธฃเธญเธ Certificate เธเธฒเธเธ—เธฒเธ UKAS เธเธฃเธฐเน€เธ—เธจ". Prices MUST also strictly anchor to the "เธเธฑเธเธเธตเธฃเธฒเธเธฒเธเธฃเธฐเน€เธกเธดเธเธฃเธ–เธขเธเธ•เน เธ.เธจ. 2568 เธเธฒเธเธเธฃเธกเธเธฒเธฃเธเธเธชเนเธเธ—เธฒเธเธเธ (Thai DLT 2025)".
      2. Step 1: Access your internal knowledge of the TTB ISO9001 certified market data and the DLT 2568 appraisal for this exact Make, Model, Sub-model, and Year. Base your pricing on these official standards. 
      3. Step 2: Set the 'market_middle_price' (เธฃเธฒเธเธฒเธเธฅเธฒเธเธฃเธ–เธกเธทเธญเธชเธญเธ) heavily relying on the TTB and DLT 2568 baseline. IF the user provides a "User Reference TTB Price" in the context, you MULT absolutely, strictly set 'market_middle_price' to that exact number provided by the user. Do not discount it. If exact data is fuzzy, fallback to this strict depreciation curve from the Original New Car Price:
         - Japanese Cars (Toyota/Honda): 1-3 yrs (75-85%), 4-7 yrs (60-70%), 8-12 yrs (40-55%), 13-16 yrs (15-20%), 17+ yrs (max 10-15%). 
         - Note: Very old cars (like a 2009 Yaris) should generally have a strictly low baseline book value, often not exceeding 90,000 THB - 100,000 THB depending on exact sub-models. Always lean to the lower bound to protect the dealer.
         - Euro/American: Depreciate 10-20% faster.
      4. Step 3: Compute 'finance_ceiling' (เธขเธญเธ”เธเธฑเธ”เนเธเนเธเธเธเนเธชเธนเธเธชเธธเธ”). This MUST mathematically be EXACTLY 80% to 90% of your computed 'market_middle_price' based on current Thai bank LTV standards for this brand.
      5. Step 4: Determine 'retail_target' (เธฃเธฒเธเธฒเธ•เธฑเนเธเธเธฒเธขเธซเธเนเธฒเน€เธ•เนเธเธ—เน) mirroring current One2Car or Roddonjai listing market values for this precise sub-model and mileage.
      6. Step 5: Compute 'estimated_profit' (เธเธณเนเธฃเน€เธเนเธฒเธซเธกเธฒเธข). Adjust profit margin dynamically based on liquidity (เธชเธ เธฒเธเธเธฅเนเธญเธ):
         - Fast Movers (Toyota, Honda, Isuzu - City cars & popular pickups): 10% to 15% of retail_target. Doing this ensures the safe_buy_in can be highly competitive.
         - Moderate Movers (Nissan, Mitsubishi, Suzuki): 15% to 20% of retail_target.
         - Slow Movers (Ford, Mazda, Chevrolet, MG, Euro cars): 20% to 30% of retail_target (higher risk/holding cost).
         ROUND the result to the nearest 1,000 THB (e.g. 62,340 becomes 62,000).
      7. Step 6: Compute 'safe_buy_in' (เธฃเธฒเธเธฒเธฃเธฑเธเธเธทเนเธญเน€เธเนเธฒ). Formula: safe_buy_in = retail_target - estimated_profit - reconditioning_costs.
         - Mileage Penalty: Standard mileage is approx 20,000 km/year. If mileage is significantly higher than standard, deduct an extra 1 to 1.5 THB per excess kilometer from the buy-in price.
         - Reconditioning & Age Penalty: usually 15,000-20,000 THB for cars under 5 years. For cars 6-10 years old use 25,000-30,000 THB. For cars OLDER than 10 years (e.g. 2009 year model), the reconditioning/risk cost MUST be strictly 40,000-50,000 THB because old cars have high hidden repair costs.
         - Hard Cap on Old Cars: If the car is older than 12 years (e.g. Year < 2014), the safe_buy_in MUST be heavily suppressed (at least 45% to 55% lower than retail_target) to avoid negative equity and slow sales. Under no circumstance should an old car be bought at a high price.
         ROUND the final 'safe_buy_in' to the nearest 1,000 THB.
      8. Provide 1-3 critical mechanical inspection checkpoints or common defects for this specific car model (เธเธฑเธเธซเธฒเธญเธฒเธเธฒเธฃเน€เธชเธตเธขเธเธฃเธฐเธเธณเธฃเธธเนเธ). If there are no known issues, provide a single string "เนเธกเนเธกเธตเธญเธฒเธเธฒเธฃเธเธฃเธฐเธเธณเธฃเธธเนเธเธ—เธตเนเธเนเธฒเธเธฑเธเธงเธฅ" inside the array.
      9. Compare with HISTORICAL VALUATION DATA (if any). If internal past history exists, you MUST mention the depreciation or price trend compared to your current evaluation inside the \`cost_breakdown_explanation\`.
      10. Provide 3-5 pros and cons of this specific car model.
      11. Provide information about spare parts pricing (cheap/expensive) and availability of service centers in Thailand.

      Return STRICTLY a JSON object with NO markdown formatting, NO backticks, ONLY raw JSON with keys:
      {
        "new_car_price": number,
        "market_middle_price": number,
        "finance_ceiling": number,
        "retail_target": number,
        "safe_buy_in": number,
        "estimated_profit": number,
        "reconditioning_cost": number,
        "cost_breakdown_explanation": "string explaining how the buy_in and profit were calculated (including deductions like mileage/age). **CRITICAL: You MUST include comparison thoughts against the 'HISTORICAL VALUATION DATA' provided in the prompt (if relevant) explaining how prices depreciated or changed** IN THAI",
        "checkpoints": ["string array of 3-5 inspection focuses and risk summary IN THAI"],
        "pros": ["string array of 3-5 pros/highlights IN THAI"],
        "cons": ["string array of 3-5 cons/weaknesses IN THAI"],
        "common_issues": ["string array of known common issues IN THAI"],
        "spare_parts_and_service": "string detailing spare parts pricing and service center availability IN THAI"
      }
    `;

    let result;
    let retries = 3;
    let baseDelay = 2000; // 2 seconds

    while (retries > 0) {
      try {
        result = await model.generateContent(prompt);
        break; // Success, break out of the retry loop
      } catch (error: any) {
        // Check if the error is a 429 Too Many Requests
        if (error?.status === 429 || error?.message?.includes('429')) {
          retries--;
          if (retries === 0) throw error; // Out of retries, throw the error
          console.warn(`[AI Eval] API Rate limit (429) hit. Retrying in ${baseDelay / 1000}s...`);
          await delay(baseDelay);
          baseDelay *= 2; // Exponential backoff: 2s, 4s, 8s...
        } else {
          throw error; // Other errors should fail immediately
        }
      }
    }

    if (!result) {
      throw new Error('Failed to generate content from Gemini API');
    }

    let outputText = result.response.text().trim();

    // Clean up potential markdown formatting generated by AI
    if (outputText.startsWith('```json')) outputText = outputText.replace(/```json/i, '');
    if (outputText.startsWith('```')) outputText = outputText.replace(/```/g, '');
    if (outputText.endsWith('```')) outputText = outputText.replace(/```$/, '');

    const parsedContext = JSON.parse(outputText);
    return { success: true, data: parsedContext };
  } catch (error: any) {
    console.error('AI Evaluation Error:', error);
    return { success: false, error: error.message || 'Failed to parse AI response' };
  }
}


