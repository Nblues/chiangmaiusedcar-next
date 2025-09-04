import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import SEO from '../components/SEO';

export default function PaymentCalculator() {
  const router = useRouter();
  const [carPrice, setCarPrice] = useState('');
  const [downPayment, setDownPayment] = useState('');
  const [interestRate, setInterestRate] = useState('4.50');
  const [loanTerm, setLoanTerm] = useState('60');
  const [result, setResult] = useState(null);
  const [errors, setErrors] = useState({});

  // ฟังก์ชันสำหรับ format ตัวเลขในช่อง input
  const formatInputNumber = value => {
    // ลบอักขระที่ไม่ใช่ตัวเลข
    const numericValue = value.replace(/[^0-9]/g, '');
    // แปลงเป็น number และ format ด้วยคอมม่า
    if (numericValue) {
      return parseInt(numericValue).toLocaleString('th-TH');
    }
    return '';
  };

  // ฟังก์ชันสำหรับแปลง formatted string กลับเป็น number
  const parseFormattedNumber = value => {
    return parseInt(value.replace(/,/g, '')) || 0;
  };

  // ฟังก์ชัน validation
  const validateInputs = (priceValue, downValue) => {
    const newErrors = {};

    if (!priceValue || priceValue <= 0) {
      newErrors.carPrice = 'กรุณาใส่ราคารถที่ถูกต้อง';
    } else if (priceValue < 50000) {
      newErrors.carPrice = 'ราคารถต้องไม่น้อยกว่า 50,000 บาท';
    } else if (priceValue > 10000000) {
      newErrors.carPrice = 'ราคารถต้องไม่เกิน 10,000,000 บาท';
    }

    if (downValue < 0) {
      newErrors.downPayment = 'เงินดาวน์ต้องไม่ติดลบ';
    } else if (downValue >= priceValue) {
      newErrors.downPayment = 'เงินดาวน์ต้องน้อยกว่าราคารถ';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculatePayment = useCallback(
    (price = carPrice) => {
      // แปลง formatted string เป็น number
      const carPriceValue =
        typeof price === 'string' ? parseFormattedNumber(price) : parseFloat(price);
      const down = parseFormattedNumber(downPayment);
      const rate = parseFloat(interestRate) / 100 / 12; // Monthly interest rate

      // Validate inputs
      if (!validateInputs(carPriceValue, down)) {
        return;
      }

      const loanAmount = carPriceValue - down;

      // คำนวณสำหรับหลายปี: 5, 6, 7 ปี
      const periods = [
        { years: 5, months: 60, label: '5 ปี' },
        { years: 6, months: 72, label: '6 ปี' },
        { years: 7, months: 84, label: '7 ปี' },
      ];

      const calculations = periods.map(period => {
        let monthlyPayment;
        if (rate === 0) {
          monthlyPayment = loanAmount / period.months;
        } else {
          monthlyPayment =
            (loanAmount * rate * Math.pow(1 + rate, period.months)) /
            (Math.pow(1 + rate, period.months) - 1);
        }

        const totalPayment = monthlyPayment * period.months;
        const totalInterest = totalPayment - loanAmount;

        // คำนวณ VAT 7% และค่าประกัน
        const vat = monthlyPayment * 0.07;
        const insurance = 200; // ค่าประกันประมาณ 200 บาท
        const monthlyPaymentWithVatAndInsurance = monthlyPayment + vat + insurance;

        return {
          ...period,
          monthlyPayment,
          totalPayment,
          totalInterest,
          vat,
          insurance,
          monthlyPaymentWithVatAndInsurance,
        };
      });

      setResult({
        carPrice: carPriceValue,
        loanAmount,
        calculations,
      });
    },
    [carPrice, downPayment, interestRate]
  );

  // ดึงราคาจาก URL parameter เมื่อมาจากหน้ารายละเอียดรถ
  useEffect(() => {
    if (router.query.price) {
      const formattedPrice = formatInputNumber(router.query.price);
      setCarPrice(formattedPrice);
      // Auto calculate เมื่อมีราคามาแล้ว - คำนวณทันทีสำหรับ 5-6-7 ปี
      if (router.query.price && !isNaN(router.query.price)) {
        setTimeout(() => {
          calculatePayment(router.query.price);
        }, 300);
      }
    }
  }, [router.query.price, calculatePayment]);

  const formatNumber = num => {
    return new Intl.NumberFormat('th-TH').format(Math.round(num));
  };

  return (
    <div>
      <SEO
        title="คำนวนค่างวดรถยนต์ - ครูหนึ่งรถสวย"
        description="เครื่องมือคำนวนค่างวดรถยนต์ คำนวนค่าผ่อนรายเดือน ดอกเบี้ย และยอดชำระรวม ครูหนึ่งรถสวย รถมือสองเชียงใหม่"
        keywords="คำนวนค่างวด, คำนวนค่าผ่อนรถ, เครื่องคิดเลข, สินเชื่อรถยนต์, รถมือสองเชียงใหม่"
        url="https://chiangmaiusedcar.com/payment-calculator"
      />

      {/* Hero Section */}
      <section className="bg-white text-primary py-16 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-prompt text-accent">
            คำนวนค่างวดรถยนต์
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto font-prompt">
            คำนวนค่าผ่อนรายเดือนและดอกเบี้ยได้ง่ายๆ
          </p>

          {/* แสดงข้อความและผลคำนวณเมื่อมาจากหน้ารายละเอียดรถ */}
          {router.query.price && (
            <div className="mt-6 bg-green-500/20 backdrop-blur-sm border border-green-400/30 rounded-xl p-4 max-w-4xl mx-auto">
              <p className="text-lg font-prompt mb-4 text-center">
                {router.query.carTitle && `${decodeURIComponent(router.query.carTitle)} - `}
                ราคา:{' '}
                <span className="font-bold text-yellow-300">
                  ฿{Number(router.query.price).toLocaleString()}
                </span>{' '}
                บาท
              </p>

              {/* ผลการคำนวณ 5-6-7 ปี แบบกะทัดรัด */}
              {result && (
                <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 mt-4">
                  <h3 className="text-lg font-bold text-primary mb-4 text-center font-prompt">
                    ค่างวดรายเดือน (รวม VAT + ประกัน)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {result.calculations.map((calc, index) => (
                      <div
                        key={calc.years}
                        className={`text-center p-4 rounded-lg ${
                          index === 1
                            ? 'bg-orange-100 border-2 border-orange-300'
                            : 'bg-gray-50 border border-gray-200'
                        }`}
                      >
                        <div
                          className={`text-lg font-bold mb-1 ${
                            index === 1 ? 'text-orange-600' : 'text-gray-800'
                          }`}
                        >
                          {calc.label}
                        </div>
                        <div
                          className={`text-2xl font-bold ${
                            index === 1 ? 'text-orange-600' : 'text-primary'
                          }`}
                        >
                          ฿{formatNumber(calc.monthlyPaymentWithVatAndInsurance)}
                        </div>
                        <div className="text-xs text-gray-600">ต่อเดือน</div>
                        {index === 1 && (
                          <div className="text-xs bg-orange-200 text-orange-700 px-2 py-1 rounded-full mt-2 inline-block">
                            แนะนำ
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 text-center mt-4 font-prompt">
                    ผลการคำนวณพร้อมแล้ว - สามารถปรับแต่งข้อมูลเพิ่มเติมด้านล่างได้
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Calculator Section */}
      <section className="py-16 bg-white border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-blue-50 rounded-2xl shadow-lg p-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Input Form */}
              <div>
                <h2 className="text-2xl font-bold text-primary mb-6 font-prompt">ข้อมูลการคำนวน</h2>

                <div className="space-y-6">
                  <div>
                    <label className="form-label">ราคารถ (บาท) *</label>
                    <input
                      type="text"
                      className={`form-input ${errors.carPrice ? 'border-red-500 bg-red-50' : ''}`}
                      placeholder="เช่น 500,000"
                      value={carPrice}
                      onChange={e => {
                        const formatted = formatInputNumber(e.target.value);
                        setCarPrice(formatted);
                        // Clear error when user starts typing
                        if (errors.carPrice) {
                          setErrors(prev => ({ ...prev, carPrice: null }));
                        }
                      }}
                    />
                    {errors.carPrice && (
                      <p className="text-red-500 text-sm mt-1 font-prompt">{errors.carPrice}</p>
                    )}
                  </div>

                  <div>
                    <label className="form-label">เงินดาวน์ (บาท)</label>
                    <input
                      type="text"
                      className={`form-input ${errors.downPayment ? 'border-red-500 bg-red-50' : ''}`}
                      placeholder="เช่น 50,000"
                      value={downPayment}
                      onChange={e => {
                        const formatted = formatInputNumber(e.target.value);
                        setDownPayment(formatted);
                        // Clear error when user starts typing
                        if (errors.downPayment) {
                          setErrors(prev => ({ ...prev, downPayment: null }));
                        }
                      }}
                    />
                    {errors.downPayment && (
                      <p className="text-red-500 text-sm mt-1 font-prompt">{errors.downPayment}</p>
                    )}
                  </div>

                  <div>
                    <label className="form-label">อัตราดอกเบี้ย (% ต่อปี)</label>
                    <select
                      className="form-select"
                      value={interestRate}
                      onChange={e => setInterestRate(e.target.value)}
                    >
                      <option value="4.50">4.50%</option>
                      <option value="5.00">5.00%</option>
                      <option value="5.50">5.50%</option>
                      <option value="6.00">6.00%</option>
                      <option value="6.50">6.50%</option>
                      <option value="7.0">7.0%</option>
                      <option value="7.5">7.5%</option>
                      <option value="8.0">8.0%</option>
                      <option value="8.5">8.5%</option>
                      <option value="9.0">9.0%</option>
                    </select>
                  </div>

                  <div>
                    <label className="form-label">ระยะเวลาผ่อน (เดือน)</label>
                    <select
                      className="form-select"
                      value={loanTerm}
                      onChange={e => setLoanTerm(e.target.value)}
                    >
                      <option value="12">12 เดือน (1 ปี)</option>
                      <option value="24">24 เดือน (2 ปี)</option>
                      <option value="36">36 เดือน (3 ปี)</option>
                      <option value="48">48 เดือน (4 ปี)</option>
                      <option value="60">60 เดือน (5 ปี)</option>
                      <option value="72">72 เดือน (6 ปี)</option>
                      <option value="84">84 เดือน (7 ปี)</option>
                    </select>
                  </div>

                  <button
                    onClick={() => calculatePayment()}
                    className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!carPrice || errors.carPrice || errors.downPayment}
                  >
                    คำนวนค่างวด
                  </button>

                  {/* ปุ่มกลับไปหน้ารถ (ถ้ามาจากหน้ารายละเอียดรถ) */}
                  {router.query.from && (
                    <button
                      onClick={() => router.back()}
                      className="w-full mt-4 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl transition-colors font-prompt"
                    >
                      ← กลับไปหน้ารายละเอียดรถ
                    </button>
                  )}
                </div>
              </div>

              {/* Result Section */}
              <div>
                <h2 className="text-2xl font-bold text-primary mb-6 font-prompt">ผลการคำนวน</h2>

                {result ? (
                  <div className="bg-white/50 rounded-xl p-6 space-y-4">
                    <div className="text-center border-b border-gray-200 pb-4">
                      <h3 className="text-lg font-bold text-primary mb-2 font-prompt">
                        สรุปข้อมูล
                      </h3>
                      <p className="text-sm text-gray-600">
                        ราคารถ: ฿{formatNumber(result.carPrice)}
                      </p>
                      <p className="text-sm text-gray-600">
                        จำนวนเงินกู้: ฿{formatNumber(result.loanAmount)}
                      </p>
                    </div>

                    <div className="space-y-3">
                      {result.calculations.map((calc, index) => (
                        <div
                          key={calc.years}
                          className={`p-4 rounded-lg border ${
                            calc.years === 6
                              ? 'bg-orange-50 border-orange-200'
                              : 'bg-gray-50 border-gray-200'
                          }`}
                        >
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-bold text-gray-700">{calc.label}</span>
                            {calc.years === 6 && (
                              <span className="text-xs bg-orange-200 text-orange-700 px-2 py-1 rounded-full">
                                แนะนำ
                              </span>
                            )}
                          </div>
                          <div className="text-xl font-bold text-primary mb-1">
                            ฿{formatNumber(calc.monthlyPaymentWithVatAndInsurance)}/เดือน
                          </div>
                          <div className="text-xs text-gray-600 space-y-1">
                            <p>ค่างวดเฉพาะ: ฿{formatNumber(calc.monthlyPayment)}</p>
                            <p>VAT 7%: ฿{formatNumber(calc.vat)}</p>
                            <p>ประกัน: ฿{formatNumber(calc.insurance)}</p>
                            <p>ดอกเบี้ยรวม: ฿{formatNumber(calc.totalInterest)}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="text-xs text-gray-500 text-center mt-4 font-prompt">
                      * ผลการคำนวณเป็นเพียงการประมาณการเบื้องต้น
                      <br />
                      อัตราดอกเบี้ยและเงื่อนไขจริงขึ้นอยู่กับธนาคารและการอนุมัติ
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-xl p-8 text-center">
                    <div className="text-4xl mb-4">🧮</div>
                    <p className="text-gray-600 font-prompt">
                      กรอกข้อมูลและกดปุ่ม "คำนวนค่างวด" เพื่อดูผลการคำนวน
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-accent text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 font-prompt">
            ต้องการคำปรึกษาเพิ่มเติม?
          </h2>
          <p className="text-xl mb-8 font-prompt">
            ทีมงานผู้เชี่ยวชาญพร้อมให้คำแนะนำเรื่องสินเชื่อและการเลือกรถ
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://lin.ee/8ugfzstD"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-primary hover:bg-primary-600 text-white px-8 py-3 rounded-full font-semibold transition-colors duration-300 font-prompt"
            >
              สอบถามผ่าน LINE
            </a>
            <a
              href="tel:094-0649018"
              className="bg-white text-accent hover:bg-gray-100 px-8 py-3 rounded-full font-semibold transition-colors duration-300 font-prompt"
            >
              โทร 094-064-9018
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
