'use client';

import { useState, useEffect } from 'react';
import { evaluateCarWithAI, getTTBSubModels } from '../../actions/evaluateCar';
import { fetchBrands, fetchModels } from '../../actions/carFormActions';
import { saveValuation, getRecentValuations, deleteValuation, updateValuation } from '../../actions/valuationActions';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Textarea } from '../../../components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../components/ui/table';
import {
  Loader2,
  Car,
  TrendingUp,
  DollarSign,
  Wallet,
  ShieldAlert,
  CheckCircle2,
  Search,
  History,
  BookOpen,
  Tag,
  Activity,
  Trash2,
  Pencil,
} from 'lucide-react';

export default function ValuationDashboard() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  
  const [brandsList, setBrandsList] = useState<string[]>([]);
  const [modelsList, setModelsList] = useState<string[]>([]);
  const [subModelsList, setSubModelsList] = useState<string[]>([]);
  
  const [loadingBrands, setLoadingBrands] = useState(false);
  const [loadingModels, setLoadingModels] = useState(false);
  const [loadingSubModels, setLoadingSubModels] = useState(false);
  
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    subModel: '',
    bodyType: 'ไม่ระบุ',
    gear: 'Auto',
    color: '',
    year: 2020,
    mileage: 50000,
    region: 'Chiang Mai/Northern',
    condition: '',
    referencePrice: '',
  });

  const fetchHistory = async () => {
    try {
      const data = await getRecentValuations();
      setHistory(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchHistory();
    loadBrands();
  }, []);

  const loadBrands = async () => {
    setLoadingBrands(true);
    const bs = await fetchBrands();
    setBrandsList(bs);
    setLoadingBrands(false);
  };

  const handleBrandChange = async (val: string) => {
    setFormData(prev => ({ ...prev, brand: val, model: '', subModel: '' }));
    setModelsList([]);
    setSubModelsList([]);
    
    setLoadingModels(true);
    const ms = await fetchModels(val);
    setModelsList(ms);
    setLoadingModels(false);
  };

  const handleModelChange = async (val: string) => {
    setFormData(prev => ({ ...prev, model: val, subModel: '' }));
    setSubModelsList([]);
    
    // We can rely on getTTBSubModels or handleFetchSubModels later, but wait, usually year is required.
    // If year is updated, maybe we can fetch submodels.
  };

  const handleFetchSubModels = async () => {
    if (!formData.brand || !formData.model || !formData.year) {
      alert('กรุณากรอก ยี่ห้อ, รุ่น, และ ปีรถ ให้ครบก่อนครับ');
      return;
    }
    setLoadingSubModels(true);
    const res = await getTTBSubModels(formData.brand, formData.model, formData.year);
    if (res.success && res.data) {
      setSubModelsList(res.data);
      if (res.data.length > 0) {
        setFormData(prev => ({ ...prev, subModel: res.data![0] }));
      }
      // Removed the alert here so it fails gracefully to the manual input.
    } else {
      alert(`Error fetching sub-models: ${res.error}`);
    }
    setLoadingSubModels(false);
  };

  const handleAnalyze = async () => {
    setLoading(true);
    const res = await evaluateCarWithAI(formData);
    if (res.success) {
      setResult(res.data);
    } else {
      alert(`AI Error: ${res.error}`);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!result) return;
    setSaving(true);
    const res = await saveValuation({ input: formData, result });
    if (res.success) {
      alert('✅ Data saved to Supabase successfully!');
      fetchHistory(); // Refresh table
    } else {
      alert(`Save Error: ${res.error}`);
    }
    setSaving(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('คุณต้องการลบข้อมูลประเมินนี้ใช่หรือไม่?')) return;
    const res = await deleteValuation(id);
    if (res.success) {
      fetchHistory();
    } else {
      alert(`ลบข้อมูลไม่สำเร็จ: ${res.error}`);
    }
  };

  const handleEdit = async (row: any) => {
    const newDetails = prompt('📝 แก้ไขข้อมูลรถ:', row.car_details);
    if (newDetails === null) return;

    const newBuyIn = prompt(`💰 แก้ไขราคารับซื้อเข้า (Safe) เดิม ${row.max_buy_in?.toLocaleString()}:`, row.max_buy_in);
    if (newBuyIn === null) return;

    const newTarget = prompt(`🎯 แก้ไขราคาขายปลีก เดิม ${row.retail_target?.toLocaleString()}:`, row.retail_target);
    if (newTarget === null) return;

    const updates = {
      car_details: newDetails.trim() || row.car_details,
      max_buy_in: Number(newBuyIn.replace(/,/g, '')) || row.max_buy_in,
      retail_target: Number(newTarget.replace(/,/g, '')) || row.retail_target
    };

    const res = await updateValuation(row.id, updates);
    if (res.success) {
      fetchHistory();
    } else {
      alert(`อัพเดทไม่สำเร็จ: ${res.error}`);
    }
  };

  const currentSearchQuery = [
    formData.brand,
    formData.model,
    formData.subModel,
    formData.year
  ].filter(Boolean).join(' ');

  const shortSearchQuery = [
    formData.brand,
    formData.model
  ].filter(Boolean).join(' ');

  return (
    ﻿<div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8 font-thai antialiased selection:bg-accent selection:text-white">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Modern 2026 Hero Header */}
        <div className="relative overflow-hidden mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-br from-slate-900 via-primary-900 to-black p-8 md:p-10 rounded-[2rem] shadow-2xl border border-white/10">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 rounded-full bg-accent/20 blur-3xl mix-blend-screen pointer-events-none"></div>
          <div className="absolute bottom-0 left-10 -mb-20 w-64 h-64 rounded-full bg-primary/30 blur-3xl mix-blend-screen pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start md:items-center gap-6 text-center sm:text-left">
            <div className="relative w-20 h-20 md:w-28 md:h-28 shrink-0 rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(255,152,0,0.2)] bg-white flex items-center justify-center p-3 transform -rotate-3 hover:rotate-0 transition-transform duration-500">
              <picture>
                <source srcSet="/logo/logo_main_optimized.webp" type="image/webp" />
                <img
                  src="/logo/logo_main.png"
                  alt="โลโก้ ครูหนึ่งรถสวย"
                  className="object-contain w-full h-full scale-[1.15]"
                />
              </picture>
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-3 drop-shadow-md">
                ระบบประเมินราคากลางรถมือสอง
                <br className="hidden sm:block md:hidden" />{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-orange-400">
                  มาตรฐาน 2026
                </span>
              </h1>
              <p className="text-slate-300 tracking-wide text-sm md:text-base font-light max-w-xl leading-relaxed">
                วิเคราะห์โครงสร้างราคาด้วยข้อมูล{' '}
                <span className="font-semibold text-accent">Real-time</span> ที่ล้ำสมัย แม่นยำที่สุดแห่งยุค
              </p>
            </div>
          </div>
          <div className="relative z-10 hidden lg:flex items-center whitespace-nowrap bg-white/5 text-white border border-white/20 backdrop-blur-md px-5 py-2.5 rounded-full font-medium shadow-xl tracking-wide">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-accent"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
            ส่วนงานผู้บริหาร
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 min-h-[600px]">
          {/* Input Section - 4/12 width on Desktop */}
          <div className="lg:col-span-4 h-full">
            <Card className="h-full shadow-2xl shadow-indigo-50/50 border border-slate-200/60 rounded-[2rem] bg-white/95 backdrop-blur-2xl overflow-hidden flex flex-col">
              
<div className="h-2 w-full bg-gradient-to-r from-primary to-accent"></div>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg text-primary-900 font-semibold flex items-center">
                  <Car className="w-5 h-5 mr-2 text-accent" /> ข้อมูลรถยนต์
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5 flex-grow">
                <div className="space-y-4">
                  <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-medium text-slate-700">ยี่ห้อ (Brand)</label>
                        {loadingBrands && <Loader2 className="w-3 h-3 animate-spin text-primary" />}
                      </div>
                      <Input
                        list="brands-list"
                        placeholder="เช่น Toyota"
                        className="rounded-xl border-slate-200 focus:ring-primary-500/20 focus:border-primary bg-white shadow-sm"
                        value={formData.brand}
                        onChange={e => handleBrandChange(e.target.value)}
                      />
                      <datalist id="brands-list">
                        {brandsList.map(b => (
                          <option key={b} value={b} />
                        ))}
                      </datalist>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-medium text-slate-700">รุ่น (Model)</label>
                        {loadingModels && <Loader2 className="w-3 h-3 animate-spin text-primary" />}
                      </div>
                      <Input
                        list="models-list"
                        placeholder="เช่น Vios"
                        className="rounded-xl border-slate-200 focus:ring-primary-500/20 focus:border-primary bg-white shadow-sm"
                        value={formData.model}
                        onChange={e => handleModelChange(e.target.value)}
                      />
                      <datalist id="models-list">
                        {modelsList.map(m => (
                          <option key={m} value={m} />
                        ))}
                      </datalist>
                    </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700 flex justify-between items-center">
                      <span>รุ่นย่อย (Sub-Model)</span>
                    </label>
                    {subModelsList.length > 0 ? (
                      <Select
                        value={formData.subModel}
                        onValueChange={v => setFormData({ ...formData, subModel: v })}
                      >
                        <SelectTrigger className="rounded-xl border-slate-200 focus:ring-primary-500/20 shadow-sm bg-white">
                          <SelectValue placeholder="เลือกรุ่นย่อย..." />
                        </SelectTrigger>
                        <SelectContent className="max-h-[300px]">
                          {subModelsList.map((sm, idx) => (
                            <SelectItem key={idx} value={sm}>{sm}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        placeholder="เช่น 1.5 Entry"
                        className="rounded-xl border-slate-200 focus:ring-primary-500/20 focus:border-primary bg-white shadow-sm"
                        value={formData.subModel}
                        onChange={e => setFormData({ ...formData, subModel: e.target.value })}
                      />
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">รูปแบบตัวถัง <span className="text-xs text-orange-500 font-normal">(สำคัญมากสำหรับรถกระบะ)</span></label>
                    <Select
                      defaultValue="ไม่ระบุ"
                      onValueChange={v => setFormData({ ...formData, bodyType: v })}
                    >
                      <SelectTrigger className="rounded-xl border-slate-200 focus:ring-primary-500/20 shadow-sm bg-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="max-h-[300px]">
                        <SelectItem value="ไม่ระบุ">ออโต้ / ไม่ระบุ (AI ประเมินจากรุ่น)</SelectItem>
                        <SelectItem value="เก๋ง 4 ประตู (Sedan)">เก๋ง 4 ประตู (Sedan)</SelectItem>
                        <SelectItem value="เก๋ง 5 ประตู (Hatchback)">เก๋ง 5 ประตู (Hatchback)</SelectItem>
                        <SelectItem value="กระบะตอนเดียว (Single Cab)">กระบะตอนเดียว (Single Cab)</SelectItem>
                        <SelectItem value="กระบะแคปเปิดได้ (Smart/Open Cab)">กระบะแคป (Smart/Open Cab)</SelectItem>
                        <SelectItem value="กระบะ 4 ประตู (Double Cab)">กระบะ 4 ประตู (Double Cab)</SelectItem>
                        <SelectItem value="SUV / PPV">SUV / PPV / รถครอบครัว</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-700">ระบบเกียร์</label>
                      <Select
                        defaultValue="Auto"
                        onValueChange={v => setFormData({ ...formData, gear: v })}
                      >
                        <SelectTrigger className="rounded-xl border-slate-200 focus:ring-primary-500/20 shadow-sm bg-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Auto">Auto</SelectItem>
                          <SelectItem value="Manual">Manual</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-700">สีรถ</label>
                      <Input
                        placeholder="เช่น ขาว, ดำ..."
                        className="rounded-xl border-slate-200 focus:ring-primary-500/20 focus:border-primary bg-white shadow-sm"
                        value={formData.color}
                        onChange={e => setFormData({ ...formData, color: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-700">ปีรถ</label>
                      <Input
                        type="number"
                        defaultValue={2020}
                        className="rounded-xl border-slate-200 focus:ring-primary-500/20 focus:border-primary bg-white shadow-sm text-center"
                        onChange={e => setFormData({ ...formData, year: Number(e.target.value) })}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-700">เลขไมล์</label>
                      <Input
                        type="number"
                        defaultValue={50000}
                        className="rounded-xl border-slate-200 focus:ring-primary-500/20 focus:border-primary bg-white shadow-sm text-center"
                        onChange={e =>
                          setFormData({ ...formData, mileage: Number(e.target.value) })
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">ภูมิภาคการขาย</label>
                  <Select
                    defaultValue="Chiang Mai/Northern"
                    onValueChange={v => setFormData({ ...formData, region: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Chiang Mai/Northern">ภาคเหนือ / เชียงใหม่</SelectItem>
                      <SelectItem value="Bangkok/Central">ภาคกลาง / กรุงเทพฯ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">
                    ราคากลางอ้างอิง TTB (ถ้ามีให้กรอก ระบบจะยึดตามนี้เป๊ะ)
                  </label>
                  <Input
                    type="number"
                    placeholder="เช่น 930000"
                    className="rounded-xl border-slate-200 focus:ring-primary-500/20 focus:border-primary bg-white shadow-sm"
                    onChange={e => setFormData({ ...formData, referencePrice: e.target.value })}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">
                    สภาพรถ / จุดสังเกต (ถ้ามี)
                  </label>
                  <Textarea
                    placeholder="สภาพเดิมมือเดียว, มีรอยขีดข่วน..."
                    className="rounded-xl border-slate-200 focus:ring-primary-500/20 focus:border-primary bg-white shadow-sm min-h-[80px] resize-none"
                    onChange={e => setFormData({ ...formData, condition: e.target.value })}
                  />
                </div>

                <Button
                  onClick={handleAnalyze}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-primary to-primary-700 hover:to-primary-600 text-white rounded-xl shadow-lg shadow-primary-900/20 transition-all duration-300 py-6 text-base font-semibold"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" /> กำลังประมวลผลด้วย AI
                    </>
                  ) : (
                    'วิเคราะห์ราคารถด้วย AI'
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Results Section - 8/12 width */}
          {(result || loading) && (
            <div className="lg:col-span-8 space-y-6 animate-in fade-in slide-in-from-right-8 duration-700">
              {loading ? (
                <div className="h-full min-h-[500px] flex flex-col items-center justify-center p-8 border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl bg-white/60 backdrop-blur-md">
                  <div className="relative">
                    <div className="w-24 h-24 bg-primary-100/50 rounded-full flex items-center justify-center mb-6 shadow-inner absolute animate-ping opacity-75"></div>
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 relative z-10 shadow-sm border border-primary-100">
                      <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-primary-800 mb-2 animate-pulse">
                    AI กำลังวิเคราะห์ข้อมูล...
                  </h3>
                  <div className="space-y-2 w-full max-w-sm mt-4">
                    <div className="h-2 w-full bg-slate-200 rounded animate-pulse"></div>
                    <div className="h-2 w-5/6 bg-slate-200 rounded animate-pulse mx-auto"></div>
                    <div className="h-2 w-4/6 bg-slate-200 rounded animate-pulse mx-auto"></div>
                  </div>
                </div>
              ) : result ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center justify-between p-4 bg-white/80 border border-slate-100 shadow-sm rounded-2xl">
                      <div>
                        <p className="text-sm font-medium text-slate-500">
                          ราคากลาง TTB Bluebook (3-5 ดาว)
                        </p>
                        <div className="text-xl font-bold text-slate-800">
                          {result.market_middle_price
                            ? `฿${result.market_middle_price.toLocaleString()}`
                            : 'กำลังคำนวณ...'}
                        </div>
                      </div>
                      <div className="bg-blue-100 p-2.5 rounded-full">
                        <BookOpen className="w-5 h-5 text-blue-600" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white/80 border border-slate-100 shadow-sm rounded-2xl">
                      <div>
                        <p className="text-sm font-medium text-slate-500">ราคาป้ายแดงโดยประมาณ</p>
                        <div className="text-xl font-bold text-slate-800">
                          {result.new_car_price
                            ? `฿${result.new_car_price.toLocaleString()}`
                            : 'กำลังคำนวณ...'}
                        </div>
                      </div>
                      <div className="bg-rose-100 p-2.5 rounded-full">
                        <Tag className="w-5 h-5 text-rose-600" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 mb-8 text-lg font-medium px-2">
                    <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                      <span className="text-slate-600 flex items-center">
                        <Wallet className="w-5 h-5 md:w-6 md:h-6 mr-2 text-purple-600" />{' '}
                        ยอดจัดไฟแนนซ์สูงสุด
                      </span>
                      <div className="flex flex-col items-end">
                        <span className="text-xl md:text-2xl font-black text-purple-700">
                          ฿{result.finance_ceiling?.toLocaleString()}
                        </span>
                          <div className="flex gap-2 mt-1">
                          <a href="https://www.roddonjai.com/service/bluebook" target="_blank" rel="noopener noreferrer" className="text-[11px] bg-purple-50 text-purple-700 hover:bg-purple-100 flex items-center px-2 py-1 rounded-md transition-colors border border-purple-200">
                            🏦 เช็คราคากลาง TTB/รถโดนใจ
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                      <span className="text-slate-600 flex items-center">
                        <Car className="w-5 h-5 md:w-6 md:h-6 mr-2 text-orange-500" /> ราคาขายปลีกตลาด
                      </span>
                      <div className="flex flex-col items-end">
                        <span className="text-xl md:text-2xl font-black text-orange-600">
                          ฿{result.retail_target?.toLocaleString()}
                        </span>
                        <div className="flex flex-wrap justify-end gap-2 mt-2 max-w-[300px] md:max-w-full">
                          <a href={`https://www.facebook.com/marketplace/search/?query=${encodeURIComponent(currentSearchQuery)}`} target="_blank" rel="noopener noreferrer" className="text-[11px] bg-blue-50 text-blue-700 hover:bg-blue-100 flex items-center px-2 py-1 rounded-md transition-colors border border-blue-200">
                            🔍 ตลาดสด Facebook
                          </a>
                          <a href={`https://www.one2car.com/%E0%B8%A3%E0%B8%96-%E0%B8%AA%E0%B8%B3%E0%B8%AB%E0%B8%A3%E0%B8%B1%E0%B8%9A-%E0%B8%82%E0%B8%B2%E0%B8%A2?keyword=${encodeURIComponent(currentSearchQuery)}`} target="_blank" rel="noopener noreferrer" className="text-[11px] bg-yellow-50 text-yellow-700 hover:bg-yellow-100 flex items-center px-2 py-1 rounded-md transition-colors border border-yellow-200">
                            🔍 One2Car
                          </a>
                          <a href={`https://www.roddonjai.com/search?keyword=${encodeURIComponent(currentSearchQuery)}`} target="_blank" rel="noopener noreferrer" className="text-[11px] bg-indigo-50 text-indigo-700 hover:bg-indigo-100 flex items-center px-2 py-1 rounded-md transition-colors border border-indigo-200">
                            🔍 รถโดนใจ
                          </a>
                          <a href={`https://rod.kaidee.com/c11-auto-car?q=${encodeURIComponent(currentSearchQuery)}`} target="_blank" rel="noopener noreferrer" className="text-[11px] bg-rose-50 text-rose-700 hover:bg-rose-100 flex items-center px-2 py-1 rounded-md transition-colors border border-rose-200">
                            🔍 Kaidee Auto
                          </a>
                          <a href={`https://www.carsome.co.th/buy-car?q=${encodeURIComponent(shortSearchQuery)}`} target="_blank" rel="noopener noreferrer" className="text-[11px] bg-orange-50 text-orange-700 hover:bg-orange-100 flex items-center px-2 py-1 rounded-md transition-colors border border-orange-200">
                            🔍 CARSOME
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                      <span className="text-slate-600 flex items-center">
                        <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6 mr-2 text-emerald-500" />{' '}
                        เพดานรับซื้อเข้า (Safe)
                      </span>
                      <span className="text-xl md:text-2xl font-black text-emerald-600">
                        ฿{result.safe_buy_in?.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                      <span className="text-slate-600 flex items-center">
                        <TrendingUp className="w-5 h-5 md:w-6 md:h-6 mr-2 text-cyan-600" />{' '}
                          ส่วนต่าง (เป้าหมายกำไร + งบเผื่อเก็บงาน)
                        </span>
                        <span className="text-xl md:text-2xl font-black text-cyan-700">
                          ฿{((result.retail_target || 0) - (result.safe_buy_in || 0)).toLocaleString()}
                      </span>
                    </div>
                  </div>
                    {result.cost_breakdown_explanation && (
                      <div className="mt-4 p-4 md:p-5 bg-amber-50 rounded-2xl border border-amber-200 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-amber-400"></div>
                        <h4 className="text-[15px] font-bold text-amber-800 mb-2 flex items-center gap-2">
                          <Activity className="w-5 h-5" /> สรุปการคำนวณและหักค่าใช้จ่าย
                        </h4>
                        <p className="text-sm text-amber-700 leading-relaxed font-medium">
                          {result.cost_breakdown_explanation}
                        </p>
                      </div>
                    )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    {/* Pros / Cons sections */}
                    <Card className="shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-none rounded-3xl bg-white overflow-hidden relative">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-emerald-500"></div>
                      <CardHeader className="pb-4">
                        <CardTitle className="flex items-center text-lg font-bold text-slate-800">
                          <CheckCircle2 className="w-6 h-6 mr-2 text-emerald-500 bg-emerald-50 p-1 rounded-full" />
                          จุดเด่น (Pros)
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-3">
                          {result.pros?.map((pro, idx) => (
                            <li
                              key={idx}
                              className="flex items-start text-sm text-slate-700 font-medium leading-relaxed"
                            >
                              <span className="mr-2 text-emerald-500 mt-0.5">•</span> {pro}
                            </li>
                          ))}
                        </ul>

                        <div className="mt-6 border-t border-slate-100 pt-4">
                          <h4 className="flex items-center text-lg font-bold text-slate-800 mb-3">
                            <ShieldAlert className="w-6 h-6 mr-2 text-rose-500 bg-rose-50 p-1 rounded-full" />
                            จุดด้อย (Cons)
                          </h4>
                          <ul className="space-y-3">
                            {result.cons?.map((con, idx) => (
                              <li
                                key={idx}
                                className="flex items-start text-sm text-slate-700 font-medium leading-relaxed"
                              >
                                <span className="mr-2 text-rose-500 mt-0.5">•</span> {con}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-none rounded-3xl bg-white overflow-hidden relative">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 to-orange-500"></div>
                      <CardHeader className="pb-4">
                        <CardTitle className="flex items-center text-lg font-bold text-slate-800">
                          <ShieldAlert className="w-6 h-6 mr-2 text-orange-500 bg-orange-50 p-1 rounded-full" />
                          ข้อมูลอะไหล่และศูนย์บริการ
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm font-semibold text-slate-600 mb-2 mt-2">
                          สถานการณ์อะไหล่และศูนย์บริการ (Spare Parts & Service):
                        </p>
                        <p className="text-sm text-slate-700 font-medium leading-relaxed">
                          {result.spare_parts_and_service}
                        </p>
                        <Button
                          onClick={handleSave}
                          disabled={saving}
                          className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-xl py-6 font-semibold transition-all shadow-md mt-6"
                        >
                          {saving ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> กำลังบันทึก...
                            </>
                          ) : (
                            'บันทึกข้อมูลประวัติ'
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="grid grid-cols-1 gap-6 mt-6">
                    <Card className="shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-none rounded-3xl bg-white overflow-hidden relative">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-400 to-rose-500"></div>
                      <CardHeader className="pb-4">
                        <CardTitle className="flex items-center text-lg font-bold text-slate-800">
                          <ShieldAlert className="w-6 h-6 mr-2 text-rose-500 bg-rose-50 p-1 rounded-full" />
                          อาการเสียประจำรุ่นที่ต้องระวัง
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-3">
                          {result.checkpoints &&
                          result.checkpoints.length > 0 &&
                          !result.checkpoints.some(
                            c =>
                              c.includes('ไม่มีอาการ') ||
                              c.includes('ไม่มีปัญหา') ||
                              c.includes('ไม่น่ากังวล') ||
                              c.includes('ไม่มีประวัติ')
                          ) ? (
                            result.checkpoints.map((chk: string, idx: number) => (
                              <li
                                key={idx}
                                className="flex items-start bg-slate-50 p-3 rounded-xl border border-slate-100"
                              >
                                <span className="mr-3 text-rose-500 mt-0.5"></span>
                                <span className="text-sm text-slate-700 leading-relaxed font-medium">
                                  {chk}
                                </span>
                              </li>
                            ))
                          ) : (
                            <li className="flex items-start bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
                              <CheckCircle2 className="w-6 h-6 mr-3 text-emerald-500 shrink-0 mt-0.5" />
                              <span className="text-sm text-emerald-800 leading-relaxed font-medium">
                                รถรุ่นนี้ไม่มีประวัติอาการเสียประจำรุ่นที่ต้องกังวลเป็นพิเศษ
                              </span>
                            </li>
                          )}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </>
              ) : null}
            </div>
          )}

          {/* Right Section - History Data Table OR both depending on state */}
          {!result && !loading && (
            <div className="lg:col-span-8 h-full animate-in fade-in slide-in-from-right-8 duration-700">
              <Card className="h-full shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-none rounded-3xl bg-white/80 backdrop-blur-xl overflow-hidden flex flex-col">
                <CardHeader className="bg-slate-50/80 border-b border-slate-100/80 px-6 py-5">
                  <CardTitle className="text-xl text-primary-900 font-semibold flex items-center">
                    <History className="w-5 h-5 mr-2 text-primary-500" /> ประวัติการประเมิน
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 flex-grow">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-transparent border-b-slate-100 hover:bg-transparent">
                          <TableHead className="whitespace-nowrap py-4 text-slate-500 font-medium px-6">
                            วันที่
                          </TableHead>
                          <TableHead className="min-w-[200px] py-4 text-slate-500 font-medium px-6">
                            ข้อมูลรถ
                          </TableHead>
                          <TableHead className="whitespace-nowrap py-4 text-slate-500 font-medium px-6 text-right">
                            รับซื้อเข้า (Safe)
                          </TableHead>
                          <TableHead className="whitespace-nowrap py-4 text-slate-500 font-medium px-6 text-right">
                            ส่วนต่างรวม (เผื่อเก็บงาน)
                          </TableHead>
                          <TableHead className="whitespace-nowrap py-4 text-slate-500 font-medium px-6 text-center sticky right-0 bg-white/95 z-10 shadow-[-10px_0_15px_-3px_rgba(0,0,0,0.05)] border-l border-slate-100">
                            จัดการ
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {history.length > 0 ? (
                          history.slice(0, 7).map(row => (
                            <TableRow
                              key={row.id}
                              className="hover:bg-primary-50/40 transition-colors border-b-slate-50/80 group"
                            >
                              <TableCell className="text-sm text-slate-500 whitespace-nowrap px-6 py-3">
                                {new Date(row.created_at).toLocaleDateString('th-TH', {
                                  year: '2-digit',
                                  month: 'short',
                                  day: 'numeric',
                                })}
                              </TableCell>
                              <TableCell className="font-medium text-slate-800 px-6 py-3">
                                <div className="truncate max-w-[200px]">{row.car_details}</div>
                                <span className="block text-xs font-normal text-slate-400 mt-0.5">
                                  ปี {row.year} •{' '}
                                  {row.region === 'Chiang Mai/Northern' ? 'ภาคเหนือ' : 'ภาคกลาง'}
                                </span>
                              </TableCell>
                              <TableCell className="text-emerald-600 font-semibold whitespace-nowrap px-6 py-3 text-right">
                                ฿{row.max_buy_in?.toLocaleString()}
                              </TableCell>
                              <TableCell className="text-slate-600 font-medium whitespace-nowrap px-6 py-3 text-right">
                                ฿{((row.retail_target || 0) - (row.max_buy_in || 0)).toLocaleString()}
                              </TableCell>
                              <TableCell className="whitespace-nowrap px-6 py-3 text-center sticky right-0 bg-white/95 z-10 shadow-[-10px_0_15px_-3px_rgba(0,0,0,0.05)] border-l border-slate-50/50">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEdit(row)}
                                  className="text-slate-400 hover:text-primary-600 hover:bg-primary-50 h-8 w-8 p-0 mr-1"
                                >
                                  <Pencil className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDelete(row.id)}
                                  className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 h-8 w-8 p-0"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell
                              colSpan={5}
                              className="h-48 text-center text-slate-400 font-light"
                            >
                              ยังไม่มีประวัติการประเมินในระบบ
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Full History Data Table Section when results are shown */}
        {(result || loading) && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 mt-8">
            <Card className="shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-none rounded-3xl bg-white overflow-hidden">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100 px-6 py-5">
                <CardTitle className="text-xl text-primary-900 font-semibold flex items-center">
                    <History className="w-5 h-5 mr-2 text-primary-500" /> ประวัติการประเมิน
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50/50 border-b-slate-100 hover:bg-slate-50/50">
                        <TableHead className="whitespace-nowrap py-4 text-slate-500 font-medium px-6">
                          วันที่
                        </TableHead>
                        <TableHead className="min-w-[250px] py-4 text-slate-500 font-medium px-6">
                          ข้อมูลรถ
                        </TableHead>
                        <TableHead className="whitespace-nowrap py-4 text-slate-500 font-medium px-6">
                          ไฟแนนซ์สูงสุด
                        </TableHead>
                        <TableHead className="whitespace-nowrap py-4 text-slate-500 font-medium px-6">
                          รับซื้อเข้า (Safe)
                        </TableHead>
                        <TableHead className="whitespace-nowrap py-4 text-slate-500 font-medium px-6">
                            ส่วนต่าง (เผื่อเก็บงาน)
                        </TableHead>
                        <TableHead className="whitespace-nowrap py-4 text-slate-500 font-medium px-6 text-center sticky right-0 bg-white/95 z-10 shadow-[-10px_0_15px_-3px_rgba(0,0,0,0.05)] border-l border-slate-100">
                            จัดการ
                          </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {history.length > 0 ? (
                        history.map(row => (
                          <TableRow
                            key={row.id}
                            className="hover:bg-primary-50/30 transition-colors border-b-slate-50 group"
                          >
                            <TableCell className="text-sm text-slate-500 whitespace-nowrap px-6 py-4">
                              {new Date(row.created_at).toLocaleString('th-TH', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </TableCell>
                            <TableCell className="font-semibold text-slate-800 px-6 py-4">
                              {row.car_details} ({row.year})
                              <span className="block text-xs font-normal text-slate-400 mt-1">
                                {row.region === 'Chiang Mai/Northern'
                                  ? '📍 ภาคเหนือ'
                                  : '📍 ภาคกลาง'}
                              </span>
                            </TableCell>
                            <TableCell className="text-primary-600 font-medium whitespace-nowrap px-6 py-4">
                              ฿{row.ttb_finance_max?.toLocaleString()}
                            </TableCell>
                            <TableCell className="text-emerald-600 bg-emerald-50/30 font-bold whitespace-nowrap px-6 py-4 group-hover:bg-emerald-50/60 transition-colors">
                              ฿{row.max_buy_in?.toLocaleString()}
                            </TableCell>
                            <TableCell className="text-slate-600 font-medium whitespace-nowrap px-6 py-4">
                              ฿{((row.retail_target || 0) - (row.max_buy_in || 0)).toLocaleString()}
                            </TableCell>
                            <TableCell className="whitespace-nowrap px-6 py-4 text-center sticky right-0 bg-white/95 z-10 shadow-[-10px_0_15px_-3px_rgba(0,0,0,0.05)] border-l border-slate-50/50">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEdit(row)}
                                className="text-slate-400 hover:text-primary-600 hover:bg-primary-50 h-8 w-8 p-0 mr-1"
                              >
                                <Pencil className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(row.id)}
                                className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 h-8 w-8 p-0"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={6}
                            className="h-32 text-center text-slate-400 font-light"
                          >
                            ยังไม่มีประวัติการประเมินในระบบ
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

// trigger reload
