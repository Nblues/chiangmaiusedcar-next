import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import SEO from '../components/SEO';
import A11yImage from '../components/A11yImage';

export default function PaymentCalculator() {
  const router = useRouter();
  const [carPrice, setCarPrice] = useState('');
  const [downPayment, setDownPayment] = useState('');
  const [interestRate, setInterestRate] = useState('7.50');
  const [loanTerm, setLoanTerm] = useState('72');
  const [customerAge, setCustomerAge] = useState('35');
  const [result, setResult] = useState(null);

  const calculatePayment = (price = carPrice) => {
    const carPriceValue = parseFloat(price);
    const down = parseFloat(downPayment) || 0;
    const rate = parseFloat(interestRate) / 100 / 12; // Monthly interest rate
    const age = parseInt(customerAge) || 35;

    if (!carPriceValue || carPriceValue <= 0) {
      alert('กรุณาใส่ราคารถที่ถูกต้อง');
      return;
    }

    const loanAmount = carPriceValue - down;

    if (loanAmount <= 0) {
      alert('จำนวนเงินดาวน์ต้องน้อยกว่าราคารถ');
      return;
    }

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

      // คำนวณค่าประกันตามอายุ และ VAT 7%
      const baseInsurance = age > 40 ? 500 : 200;
      const insurance = baseInsurance + baseInsurance * 0.07; // รวม VAT 7%
      const vat = monthlyPayment * 0.07;
      const monthlyPaymentWithVatAndInsurance = monthlyPayment + vat + insurance;

      return {
        ...period,
        monthlyPayment,
        totalPayment,
        totalInterest,
        vat,
        insurance,
        baseInsurance,
        monthlyPaymentWithVatAndInsurance,
      };
    });

    setResult({
      carPrice: carPriceValue,
      loanAmount,
      customerAge: age,
      calculations,
    });
  };

  // ดึงราคาจาก URL parameter เมื่อมาจากหน้ารายละเอียดรถ (พร้อม sanitize)
  useEffect(() => {
    const qp = router.query?.price;
    if (qp) {
      const sanitized = String(qp)
        .replace(/[^0-9.]/g, '')
        .slice(0, 12);
      setCarPrice(sanitized);
      // Auto calculate เมื่อมีราคามาแล้ว - คำนวณทันทีสำหรับ 5-6-7 ปี
      if (sanitized && !isNaN(sanitized)) {
        setTimeout(() => {
          const carPriceValue = parseFloat(sanitized);
          const down = 0; // เริ่มต้นเงินดาวน์ 0
          const rate = 7.5 / 100 / 12; // ดอกเบี้ย 7.50%
          const age = 35; // อายุเริ่มต้น 35 ปี

          if (carPriceValue > 0) {
            const loanAmount = carPriceValue - down;

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

              // คำนวณค่าประกันตามอายุ และ VAT 7%
              const baseInsurance = age > 40 ? 500 : 200;
              const insurance = baseInsurance + baseInsurance * 0.07; // รวม VAT 7%
              const vat = monthlyPayment * 0.07;
              const monthlyPaymentWithVatAndInsurance = monthlyPayment + vat + insurance;

              return {
                ...period,
                monthlyPayment,
                totalPayment,
                totalInterest,
                vat,
                insurance,
                baseInsurance,
                monthlyPaymentWithVatAndInsurance,
              };
            });

            setResult({
              carPrice: carPriceValue,
              loanAmount,
              customerAge: age,
              calculations,
            });
          }
        }, 300);
      }
    }
  }, [router.query.price]);

  const formatNumber = num => {
    return new Intl.NumberFormat('th-TH').format(Math.round(num));
  };

  return (
    <div>
      <SEO
        title="คำนวนค่างวดรถยนต์ - ครูหนึ่งรถสวย | รถมือสองเชียงใหม่"
        description="เครื่องมือคำนวนค่างวดรถยนต์ คำนวนค่าผ่อนรายเดือน ดอกเบี้ย และยอดชำระรวม ครูหนึ่งรถสวย รถมือสองเชียงใหม่"
        url="https://chiangmaiusedcar.com/payment-calculator"
        image="https://chiangmaiusedcar.com/herobanner/paymentcalculator.webp"
        pageType="payment-calculator"
      />

      {/* Hero Section */}
      <section className="relative bg-primary text-white py-8 md:py-16 border-t border-gray-200">
        <A11yImage
          src="/herobanner/paymentcalculator.webp"
          alt="ครูหนึ่งรถสวย - คำนวนค่างวดรถยนต์ เครื่องมือคำนวนเงินดาวน์และค่างวดรายเดือน"
          width={1920}
          height={400}
          priority
          className="absolute inset-0 w-full h-full object-cover object-center md:object-[center_20%]"
        />
        <div className="relative z-10 py-8 md:py-16">
          <div className="max-w-7xl mx-auto px-4 md:px-6 text-center">
            <div className="bg-black bg-opacity-40 rounded-2xl p-4 md:p-6 mb-4 md:mb-6 backdrop-blur-sm border border-white border-opacity-20">
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-4 font-prompt text-accent drop-shadow-2xl">
                คำนวนค่างวดรถยนต์
              </h1>
              <p
                className="text-sm md:text-lg lg:text-xl max-w-4xl mx-auto font-prompt text-white font-medium leading-relaxed"
                style={{
                  textShadow:
                    '3px 3px 6px rgba(0,0,0,0.9), -2px -2px 4px rgba(0,0,0,0.9), 2px -2px 4px rgba(0,0,0,0.9), -2px 2px 4px rgba(0,0,0,0.9)',
                }}
              >
                คำนวนค่าผ่อนรายเดือนและดอกเบี้ยได้ง่ายๆ
              </p>
            </div>

            {/* แสดงข้อความและผลคำนวณเมื่อมาจากหน้ารายละเอียดรถ */}
            {router.query.price && (
              <div className="mt-4 md:mt-6 bg-white bg-opacity-15 backdrop-blur-md border border-white border-opacity-40 rounded-2xl p-4 md:p-6 max-w-5xl mx-auto shadow-2xl">
                <div className="bg-black bg-opacity-30 rounded-xl p-3 md:p-4 mb-3 md:mb-4">
                  <p className="text-sm md:text-lg font-prompt text-center text-white font-medium">
                    {router.query.carTitle &&
                      `${(typeof router.query.carTitle === 'string' ? router.query.carTitle : '').replace(/</g, '&lt;').replace(/>/g, '&gt;')} - `}
                    <span className="block md:inline mt-1 md:mt-0">
                      ราคา:{' '}
                      <span className="font-bold text-accent text-lg md:text-xl drop-shadow-lg">
                        ฿{Number(carPrice || 0).toLocaleString()}
                      </span>{' '}
                      บาท
                    </span>
                  </p>
                </div>

                {/* ผลการคำนวณ 5-6-7 ปี แบบกะทัดรัด */}
                {result && (
                  <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-xl border border-gray-200">
                    <div className="flex items-center justify-center mb-3 md:mb-4">
                      <h3 className="text-base md:text-xl font-bold text-primary text-center font-prompt">
                        ค่างวดรายเดือน (รวม VAT + ประกัน)
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                      {result.calculations.map((calc, index) => (
                        <div
                          key={calc.years}
                          className={`text-center p-3 md:p-4 rounded-xl transition-all duration-300 hover:scale-105 ${
                            index === 1
                              ? 'bg-gradient-to-br from-accent/20 to-orange-100 border-2 border-accent shadow-lg'
                              : 'bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 hover:shadow-md'
                          }`}
                        >
                          <div
                            className={`text-sm md:text-lg font-bold mb-2 ${
                              index === 1 ? 'text-accent' : 'text-gray-800'
                            }`}
                          >
                            {calc.label}
                          </div>
                          <div
                            className={`text-xl md:text-2xl font-bold mb-1 ${
                              index === 1 ? 'text-green-600' : 'text-primary'
                            }`}
                          >
                            ฿{formatNumber(calc.monthlyPaymentWithVatAndInsurance)}
                          </div>
                          <div className="text-xs text-gray-600 mb-2">ต่อเดือน</div>
                          {index === 1 && (
                            <div className="inline-flex items-center gap-1 text-xs bg-accent bg-opacity-20 text-accent px-3 py-1 rounded-full font-semibold">
                              แนะนำ
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="text-center mt-4">
                      <p className="text-xs md:text-sm text-gray-600 font-prompt bg-blue-50 rounded-lg p-2 md:p-3 border border-blue-200">
                        ผลการคำนวณพร้อมแล้ว - สามารถปรับแต่งข้อมูลเพิ่มเติมด้านล่างได้
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="py-8 md:py-16 bg-white border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="bg-blue-50 rounded-2xl shadow-lg p-4 md:p-8">
            <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
              {/* Input Form */}
              <div className="order-2 lg:order-1">
                <h2 className="text-xl md:text-2xl font-bold text-primary mb-4 md:mb-6 font-prompt">
                  ข้อมูลการคำนวน
                </h2>

                <div className="space-y-4 md:space-y-6">
                  <div>
                    <label htmlFor="carPrice" className="form-label text-sm md:text-base">
                      ราคารถ (บาท) *
                    </label>
                    <input
                      type="text"
                      id="carPrice"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      className="form-input text-sm md:text-base"
                      placeholder="เช่น 500,000"
                      value={carPrice ? Number(carPrice).toLocaleString('th-TH') : ''}
                      onChange={e => {
                        // ลบเครื่องหมายจุลภาคและอนุญาตเฉพาะตัวเลข
                        const numericValue = e.target.value
                          .replace(/,/g, '')
                          .replace(/[^0-9]/g, '');
                        setCarPrice(numericValue);
                      }}
                    />
                    {carPrice && (
                      <p className="text-xs md:text-sm text-gray-600 mt-1">
                        ราคา: ฿{Number(carPrice).toLocaleString('th-TH')} บาท
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="downPayment" className="form-label text-sm md:text-base">
                      เงินดาวน์ (บาท)
                    </label>
                    <input
                      type="text"
                      id="downPayment"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      className="form-input text-sm md:text-base"
                      placeholder="เช่น 50,000"
                      value={downPayment ? Number(downPayment).toLocaleString('th-TH') : ''}
                      onChange={e => {
                        const numericValue = e.target.value
                          .replace(/,/g, '')
                          .replace(/[^0-9]/g, '');
                        setDownPayment(numericValue);
                      }}
                    />
                    {downPayment && (
                      <p className="text-xs md:text-sm text-gray-600 mt-1">
                        เงินดาวน์: ฿{Number(downPayment).toLocaleString('th-TH')} บาท
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="interestRate" className="form-label text-sm md:text-base">
                        อัตราดอกเบี้ย (% ต่อปี)
                      </label>
                      <select
                        id="interestRate"
                        className="form-select text-sm md:text-base"
                        value={interestRate}
                        onChange={e => setInterestRate(e.target.value)}
                      >
                        <option value="4.50">4.50%</option>
                        <option value="5.00">5.00%</option>
                        <option value="5.50">5.50%</option>
                        <option value="6.00">6.00%</option>
                        <option value="6.50">6.50%</option>
                        <option value="7.00">7.00%</option>
                        <option value="7.50">7.50%</option>
                        <option value="8.00">8.00%</option>
                        <option value="8.50">8.50%</option>
                        <option value="9.00">9.00%</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="customerAge" className="form-label text-sm md:text-base">
                        อายุผู้กู้ (ปี)
                      </label>
                      <select
                        id="customerAge"
                        className="form-select text-sm md:text-base"
                        value={customerAge}
                        onChange={e => setCustomerAge(e.target.value)}
                      >
                        <option value="25">25 ปี</option>
                        <option value="30">30 ปี</option>
                        <option value="35">35 ปี</option>
                        <option value="40">40 ปี</option>
                        <option value="45">45 ปี</option>
                        <option value="50">50 ปี</option>
                        <option value="55">55 ปี</option>
                        <option value="60">60 ปี</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs md:text-sm text-gray-600 mb-2">
                      {parseInt(customerAge) > 40
                        ? 'ค่าประกัน: 500 + VAT (รวม 535 บาท/เดือน)'
                        : 'ค่าประกัน: 200 + VAT (รวม 214 บาท/เดือน)'}
                    </p>
                  </div>

                  <div>
                    <label htmlFor="loanTerm" className="form-label text-sm md:text-base">
                      ระยะเวลาผ่อน (เดือน)
                    </label>
                    <select
                      id="loanTerm"
                      className="form-select text-sm md:text-base"
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
                    type="button"
                    onClick={() => calculatePayment()}
                    className="w-full text-sm md:text-base py-3 md:py-4 bg-primary hover:bg-primary/90 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 font-prompt disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
                    disabled={!carPrice}
                  >
                    คำนวนค่างวด
                  </button>

                  {/* ปุ่มกลับไปหน้ารถ (ถ้ามาจากหน้ารายละเอียดรถ) */}
                  {router.query.from && (
                    <button
                      type="button"
                      onClick={() => router.back()}
                      className="w-full mt-2 md:mt-4 px-4 py-2 md:py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl transition-colors font-prompt text-sm md:text-base"
                    >
                      ← กลับไปหน้ารายละเอียดรถ
                    </button>
                  )}
                </div>
              </div>

              {/* Results Display */}
              <div className="order-1 lg:order-2">
                {result && (
                  <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 sticky top-4">
                    <h3 className="text-xl md:text-2xl font-bold text-primary mb-4 md:mb-6 font-prompt">
                      ผลการคำนวน
                    </h3>

                    {/* Quick Summary Card */}
                    <div className="mb-4 md:mb-6 p-3 md:p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-blue-200">
                      <div className="grid grid-cols-2 gap-2 md:gap-4 text-xs md:text-sm">
                        <div>
                          <span className="text-gray-600 block">ราคารถ:</span>
                          <div className="font-bold text-primary text-sm md:text-base">
                            ฿{formatNumber(result.carPrice)}
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-600 block">จำนวนเงินกู้:</span>
                          <div className="font-bold text-primary text-sm md:text-base">
                            ฿{formatNumber(result.loanAmount)}
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-600 block">อายุผู้กู้:</span>
                          <div className="font-bold text-primary text-sm md:text-base">
                            {result.customerAge} ปี
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-600 block">ค่าประกัน:</span>
                          <div className="font-bold text-primary text-sm md:text-base">
                            ฿{formatNumber(result.calculations[0]?.insurance || 0)}/เดือน
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 md:space-y-4">
                      <h4 className="text-base md:text-lg font-bold text-primary font-prompt">
                        ตัวเลือกการผ่อนชำระ:
                      </h4>
                      {result.calculations.map((calc, index) => (
                        <div
                          key={calc.years}
                          className={`p-3 md:p-4 rounded-lg border ${
                            index === 1
                              ? 'bg-orange-50 border-orange-200 border-2'
                              : 'bg-gray-50 border-gray-200'
                          }`}
                        >
                          <div className="flex justify-between items-center mb-2">
                            <h4
                              className={`font-bold text-sm md:text-base ${
                                index === 1 ? 'text-orange-600' : 'text-primary'
                              }`}
                            >
                              {calc.label} ({calc.months} เดือน)
                              {index === 1 && (
                                <span className="ml-2 text-xs bg-orange-200 text-orange-700 px-2 py-1 rounded-full">
                                  แนะนำ
                                </span>
                              )}
                            </h4>
                          </div>

                          {/* Mobile Layout: Stack vertically */}
                          <div className="space-y-2 md:hidden">
                            <div className="flex justify-between items-center p-2 bg-white rounded border">
                              <span className="text-xs text-gray-600">ค่างวดต่อเดือน:</span>
                              <div className="font-bold text-sm text-primary">
                                ฿{formatNumber(calc.monthlyPayment)}
                              </div>
                            </div>
                            <div className="flex justify-between items-center p-2 bg-green-50 rounded border border-green-200">
                              <span className="text-xs text-gray-600">รวม VAT + ประกัน:</span>
                              <div className="font-bold text-sm text-green-600">
                                ฿{formatNumber(calc.monthlyPaymentWithVatAndInsurance)}
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-1 text-xs">
                              <div className="text-center p-1 bg-white rounded">
                                <span className="text-gray-600 block">ประกัน:</span>
                                <div className="font-semibold text-gray-700">
                                  ฿{formatNumber(calc.insurance)}
                                </div>
                              </div>
                              <div className="text-center p-1 bg-white rounded">
                                <span className="text-gray-600 block">VAT:</span>
                                <div className="font-semibold text-gray-700">
                                  ฿{formatNumber(calc.vat)}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Desktop Layout: Grid */}
                          <div className="hidden md:grid md:grid-cols-2 gap-3 text-sm">
                            <div>
                              <span className="text-gray-600">ค่างวดต่อเดือน:</span>
                              <div className="font-bold text-lg text-primary">
                                ฿{formatNumber(calc.monthlyPayment)}
                              </div>
                            </div>
                            <div>
                              <span className="text-gray-600">รวม VAT + ประกัน:</span>
                              <div className="font-bold text-lg text-green-600">
                                ฿{formatNumber(calc.monthlyPaymentWithVatAndInsurance)}
                              </div>
                            </div>
                            <div>
                              <span className="text-gray-600">ค่าประกัน/เดือน:</span>
                              <div className="font-semibold text-gray-700">
                                ฿{formatNumber(calc.baseInsurance)} + VAT = ฿
                                {formatNumber(calc.insurance)}
                              </div>
                            </div>
                            <div>
                              <span className="text-gray-600">VAT ค่างวด:</span>
                              <div className="font-semibold text-gray-700">
                                ฿{formatNumber(calc.vat)}
                              </div>
                            </div>
                            <div>
                              <span className="text-gray-600">ดอกเบี้ยรวม:</span>
                              <div className="font-semibold text-gray-700">
                                ฿{formatNumber(calc.totalInterest)}
                              </div>
                            </div>
                            <div>
                              <span className="text-gray-600">ยอดชำระรวม:</span>
                              <div className="font-semibold text-gray-700">
                                ฿{formatNumber(calc.totalPayment)}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 md:mt-6 p-3 md:p-4 bg-blue-50 rounded-lg">
                      <p className="text-xs md:text-sm text-gray-600 font-prompt">
                        <strong>หมายเหตุ:</strong> ผลการคำนวณนี้เป็นเพียงการประมาณการ
                        ค่าใช้จ่ายจริงอาจแตกต่างขึ้นอยู่กับเงื่อนไขของแต่ละธนาคาร
                        <br />
                        <strong>ค่าประกัน:</strong> อายุ ≤ 40 ปี = 200 บาท + VAT 7% = 214 บาท/เดือน
                        | อายุ &gt; 40 ปี = 500 บาท + VAT 7% = 535 บาท/เดือน
                      </p>
                    </div>
                  </div>
                )}

                {!result && (
                  <div className="bg-gray-50 rounded-xl p-6 md:p-8 text-center sticky top-4">
                    <div className="text-gray-400 text-4xl md:text-6xl mb-4 font-bold">
                      เครื่องคิดเลข
                    </div>
                    <h3 className="text-lg md:text-xl font-bold text-gray-600 mb-2 font-prompt">
                      พร้อมคำนวณค่างวด
                    </h3>
                    <p className="text-sm md:text-base text-gray-500 font-prompt">
                      กรอกข้อมูลด้านซ้ายและกดปุ่ม &quot;คำนวนค่างวด&quot;
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-8 md:py-16 bg-accent text-white">
        <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
          <h2 className="text-xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6 font-prompt">
            ต้องการคำปรึกษาเพิ่มเติม?
          </h2>
          <p className="text-sm md:text-xl mb-6 md:mb-8 font-prompt">
            ทีมงานผู้เชี่ยวชาญพร้อมให้คำแนะนำเรื่องสินเชื่อและการเลือกรถ
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
            <a
              href="https://lin.ee/8ugfzstD"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-primary hover:bg-primary/90 text-white px-6 md:px-8 py-3 rounded-2xl font-semibold transition-all duration-300 font-prompt text-sm md:text-base shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
              aria-label="แชท LINE ครูหนึ่งรถสวย"
            >
              สอบถามผ่าน LINE
            </a>
            <a
              href="tel:094-0649018"
              className="bg-white text-accent hover:bg-gray-50 border-2 border-accent hover:border-accent/80 px-6 md:px-8 py-3 rounded-2xl font-semibold transition-all duration-300 font-prompt text-sm md:text-base shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
              aria-label="โทร 094-064-9018"
            >
              โทร 094-064-9018
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export async function getServerSideProps() {
  return {
    props: {},
  };
}
