import { GoogleGenerativeAI } from '@google/generative-ai';

async function test() {
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = ai.getGenerativeModel({ model: 'gemini-3.1-pro-preview' });

  const prompt = `
        You are the Head of Procurement for a used car dealership in Thailand (Year 2026). Evaluate the car:
        - Brand: Honda
        - Model: City
        - Sub-Model: 1.5 SV
        - Gear: Auto
        - Year: 2018
        - Mileage: 120000 km
        - Region: Chiang Mai
        - Condition: Good
        - TTB/Roddonjai API Context Check: TTB Database Live Active! Found exact market prices for 2018 Honda City. Market values for ALL sub-models are:
1.5 SV (380000 THB)
CRUCIAL RULE: You MUST strictly use the lowest price found among the matching submodels (380000 THB) as your exact 'market_middle_price' to guarantee profitability and avoid risk. Do not invent any other middle price.
        
        Rules:
        1. CRITICAL CONTEXT: You are an expert Thai used car dealer appraiser. Your valuation methodology MUST strictly follow the authoritative TTB Bluebook standard.
        2. Step 1: Access your internal knowledge.
        3. Step 2: Set the 'market_middle_price' (ราคากลางรถมือสอง) heavily relying on the TTB.
        4. Step 3: Compute 'finance_ceiling' (ยอดจัดไฟแนนซ์สูงสุด). This MUST mathematically be EXACTLY 80% to 90% of your computed 'market_middle_price' based on current Thai bank LTV standards for this brand.
        5. Step 4: Determine 'retail_target' (ราคาตั้งขายหน้าร้านเต็นท์) mirroring current One2Car or Roddonjai listing market values for this precise sub-model and mileage.
        6. Step 5: Compute 'estimated_profit' (กำไรเป้าหมาย). Fast Movers (Toyota, Honda): 10% to 15% of retail_target.
        7. Step 6: Compute 'safe_buy_in' (ราคารับซื้อเข้า). Formula: safe_buy_in = retail_target - estimated_profit - reconditioning_costs.
        
        Return STRICTLY a JSON object with NO markdown formatting, NO backticks, ONLY raw JSON with keys:
        {
          "market_middle_price": number,
          "finance_ceiling": number,
          "retail_target": number,
          "safe_buy_in": number,
          "estimated_profit": number,
           "reconditioning_cost": number,
          "cost_breakdown_explanation": "string explaining how the buy_in and profit were calculated IN THAI"
        }
  `;

  try {
    const res = await model.generateContent(prompt);
    console.log(res.response.text());
  } catch (e) {
    console.error(e);
  }
}

test();