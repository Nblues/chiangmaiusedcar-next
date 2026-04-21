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
      - Body Type: ${formData.bodyType && formData.bodyType !== 'ไม่ระบุ' ? formData.bodyType : 'Auto-detect from sub-model'}
      - Gear: ${formData.gear || 'Auto'}
      - Year: ${formData.year}
      - Mileage: ${formData.mileage} km
      - Region: ${formData.region}
      - Condition: ${formData.condition}
      - TTB/Roddonjai API Context Check: ${ttbLiveContext}
      - User Reference TTB Price: ${formData.referencePrice ? formData.referencePrice + ' THB' : 'Not provided'}
      - HISTORICAL VALUATION DATA: ${historicContext}

      Rules:
      1. CRITICAL CONTEXT: You are an expert Thai used car dealer appraiser.
      2. Step 1 (Middle Price): Base your 'market_middle_price' heavily on the User Reference TTB Price if provided. If not provided AND the API link is inactive, fall back to your internal market knowledge for 2026 Thailand. Use realistic bounds (e.g. 2017 Japanese pickup: 350K-450K, 2018 Eco car: 200K-330K). Do NOT invent unusually low or high prices.
      3. Step 2 (Finance Ceiling): Compute 'finance_ceiling'. MUST be EXACTLY 80% to 90% of your computed 'market_middle_price'.
      4. Step 3 (Retail Target): Determine 'retail_target' mirroring current Thai market actual sell prices for this model/year.
      5. Step 4 (Profit Margin): Compute 'estimated_profit'. MUST strictly be 10% to 20% of 'retail_target'. MATHEMATICAL FAIL-SAFE: Double check that estimated_profit is NEVER larger than retail_target. For a 360,000 THB car, 10% is 36,000 THB. Do NOT accidentally write 360,000 THB profit!
      6. Step 5 (Safe Buy-in): Compute 'safe_buy_in' = retail_target - estimated_profit - reconditioning_costs. Reconditioning cost varies from 15,000 to 50,000 THB depending on age.
      7. Provide 1-3 critical mechanical inspection checkpoints (ปัญหาอาการเสียประจำรุ่น).
      8. Provide 3-5 pros and cons of this specific car model.
      9. Provide information about spare parts pricing and availability.

      Return STRICTLY a JSON object with NO markdown formatting, NO backticks, ONLY raw JSON with keys:
      {
        "calculation_reasoning": "IN THAI: Explain your step-by-step mathematical reasoning FIRST. Mention how you arrived at market_middle_price, retail_target, what percentage you used for estimated_profit, and the final safe_buy_in. Also compare with HISTORICAL VALUATION DATA if any.",
        "new_car_price": number,
        "market_middle_price": number,
        "finance_ceiling": number,
        "retail_target": number,
        "safe_buy_in": number,
        "estimated_profit": number,
        "reconditioning_cost": number,
        "cost_breakdown_explanation": "Summarize the final calculation.",
        "checkpoints": ["string array IN THAI"],
        "pros": ["string array IN THAI"],
        "cons": ["string array IN THAI"],
        "common_issues": ["string array IN THAI"],
        "spare_parts_and_service": "string IN THAI"
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


