/* eslint-disable no-console */
import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import SEO from '../components/SEO';
import A11yImage from '../components/A11yImage';
import Swal from 'sweetalert2';
import emailjs from 'emailjs-com';
import { SEO_KEYWORD_MAP } from '../config/seo-keyword-map';

export default function CreditCheck() {
  const seoCreditCheck = SEO_KEYWORD_MAP.creditCheck;
  const formRef = useRef();
  const [career, setCareer] = useState('');
  const [downOption, setDownOption] = useState('');
  const [showDownInput, setShowDownInput] = useState(false);
  const [sending, setSending] = useState(false);
  const [honeypot, setHoneypot] = useState('');

  // Prevent hydration mismatch (kept for other dynamic content)
  useEffect(() => {
    // Any other initialization logic can go here
  }, []);

  const careerText = {
    government: 'ข้าราชการ',
    company: 'พนักงานบริษัท',
    freelance: 'ฟรีแลนซ์',
    business: 'เจ้าของกิจการ',
    farmer: 'เกษตรกร',
    other: 'อื่นๆ',
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (sending) return;

    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.log('Form submission started');
    }

    // Honeypot: if filled, likely bot
    if (honeypot && honeypot.trim().length > 0) {
      Swal.fire({
        icon: 'error',
        title: 'ไม่สามารถส่งข้อมูลได้',
        text: 'โปรดลองใหม่อีกครั้ง',
      });
      return;
    }

    setSending(true);
    Swal.fire({
      title: 'กำลังส่งข้อมูล...',
      text: 'โปรดรอสักครู่',
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.log('EmailJS config:', {
          serviceId,
          templateId,
          publicKey: publicKey ? 'SET' : 'NOT SET',
        });
      }

      if (!serviceId || !templateId || !publicKey) {
        Swal.close();
        if (process.env.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.error('EmailJS configuration missing:', {
            serviceId: !!serviceId,
            templateId: !!templateId,
            publicKey: !!publicKey,
          });
        }
        Swal.fire({
          icon: 'error',
          title: 'ระบบไม่พร้อม',
          text: 'กรุณาติดต่อ 094-064-9018 โดยตรง ระบบส่งอีเมลขัดข้อง',
          confirmButtonText: 'ตกลง',
        });
        setSending(false);
        return;
      }

      // Validate required form fields
      const requiredFields = ['name', 'phone', 'gender', 'age', 'province', 'creditStatus'];
      for (const field of requiredFields) {
        if (!formRef.current[field] || !formRef.current[field].value.trim()) {
          Swal.close();
          Swal.fire({
            icon: 'warning',
            title: 'กรุณากรอกข้อมูลให้ครบถ้วน',
            text: `กรุณากรอก${
              field === 'name'
                ? 'ชื่อ-นามสกุล'
                : field === 'phone'
                  ? 'เบอร์โทรศัพท์'
                  : field === 'gender'
                    ? 'เพศ'
                    : field === 'age'
                      ? 'อายุ'
                      : field === 'province'
                        ? 'จังหวัด'
                        : field === 'creditStatus'
                          ? 'สถานะเครดิต'
                          : field
            }`,
            confirmButtonText: 'ตกลง',
          });
          setSending(false);
          return;
        }
      }

      // Validate career selection
      if (!career) {
        Swal.close();
        Swal.fire({
          icon: 'warning',
          title: 'กรุณาเลือกอาชีพ',
          text: 'กรุณาระบุอาชีพของท่าน',
          confirmButtonText: 'ตกลง',
        });
        setSending(false);
        return;
      }

      // Validate privacy consent
      if (!formRef.current.privacyConsent.checked) {
        Swal.close();
        Swal.fire({
          icon: 'warning',
          title: 'กรุณายืนยันการยอมรับข้อกำหนด',
          text: 'กรุณาอ่านและยอมรับนโยบายความเป็นส่วนตัว',
          confirmButtonText: 'ตกลง',
        });
        setSending(false);
        return;
      }

      // Create form data object manually
      const formData = {
        name: formRef.current.name.value,
        phone: formRef.current.phone.value,
        gender: formRef.current.gender.value,
        age: formRef.current.age.value,
        career: career,
        careerText: careerText[career] || career,
        province: formRef.current.province.value,
        creditStatus: formRef.current.creditStatus.value,
        downOption: downOption,
        downOptionText: downOption,
        submittedAt: new Date().toLocaleString('th-TH'),
        privacyConsent: formRef.current.privacyConsent.checked ? 'Yes' : 'No',
      };

      // Add career-specific fields
      if (career === 'government') {
        formData.govAgency = formRef.current.govAgency?.value || '';
        formData.govPosition = formRef.current.govPosition?.value || '';
        formData.govYears = formRef.current.govYears?.value || '';
        formData.govIncome = formRef.current.govIncome?.value || '';
      } else if (career === 'company') {
        formData.companyName = formRef.current.companyName?.value || '';
        formData.companyPosition = formRef.current.companyPosition?.value || '';
        formData.companyYears = formRef.current.companyYears?.value || '';
        formData.companyIncome = formRef.current.companyIncome?.value || '';
        formData.companySalaryProof = formRef.current.companySalaryProof?.value || '';
      } else if (career === 'freelance') {
        formData.freelanceField = formRef.current.freelanceField?.value || '';
        formData.freelanceYears = formRef.current.freelanceYears?.value || '';
        formData.freelanceIncome = formRef.current.freelanceIncome?.value || '';
      } else if (career === 'business') {
        formData.businessName = formRef.current.businessName?.value || '';
        formData.businessYears = formRef.current.businessYears?.value || '';
        formData.businessIncome = formRef.current.businessIncome?.value || '';
        formData.businessLicense = formRef.current.businessLicense?.value || '';
      } else if (career === 'farmer') {
        formData.farmType = formRef.current.farmType?.value || '';
        formData.farmArea = formRef.current.farmArea?.value || '';
        formData.farmIncome = formRef.current.farmIncome?.value || '';
        formData.farmerBook = formRef.current.farmerBook?.value || '';
      } else if (career === 'other') {
        formData.otherCareer = formRef.current.otherCareer?.value || '';
        formData.otherIncome = formRef.current.otherIncome?.value || '';
      }

      // Add custom down payment amount if applicable
      if (downOption === 'วางเงินดาวน์') {
        formData.customDown = formRef.current.customDown?.value || '';
      }

      // Debug: Log form data (development only)
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.log('Sending EmailJS request');
      }

      // Initialize EmailJS (ensure it's properly initialized)
      emailjs.init(publicKey);

      // Send email using EmailJS with template params
      const result = await emailjs.send(serviceId, templateId, formData, publicKey);

      // Debug: Log result (development only)
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.log('EmailJS result:', result);
      }

      if (result.status === 200 || result.text === 'OK') {
        Swal.fire({
          icon: 'success',
          title: 'ส่งข้อมูลเรียบร้อยแล้ว!',
          text: 'ทีมงานจะติดต่อกลับภายใน 24 ชั่วโมง',
          confirmButtonText: 'ตกลง',
        });

        // Reset form
        formRef.current.reset();
        setCareer('');
        setDownOption('');
        setShowDownInput(false);
      } else {
        throw new Error(`EmailJS response error: ${JSON.stringify(result)}`);
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.error('Form submission error:', error);
      }

      let errorMessage = 'ไม่สามารถส่งข้อมูลได้ กรุณาลองใหม่ หรือติดต่อ 094-064-9018';

      // Detailed error handling
      if (
        error.name === 'TypeError' &&
        error.message &&
        error.message.includes('Cannot read properties of null')
      ) {
        errorMessage = 'เกิดข้อผิดพลาดในการอ่านข้อมูลฟอร์ม กรุณากรอกข้อมูลให้ครบถ้วนและลองใหม่';
      } else if (
        error.message &&
        (error.message.includes('Failed to fetch') || error.message.includes('Network'))
      ) {
        errorMessage = 'เกิดข้อผิดพลาดในการเชื่อมต่อเครือข่าย กรุณาตรวจสอบอินเทอร์เน็ตและลองใหม่';
      } else if (error.status === 0) {
        errorMessage = 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาตรวจสอบอินเทอร์เน็ตและลองใหม่';
      } else if (error.status === 400) {
        errorMessage = 'ข้อมูลที่ส่งไม่ถูกต้อง กรุณาตรวจสอบข้อมูลและลองใหม่';
      } else if (error.status === 401 || error.status === 403) {
        errorMessage = 'ไม่ได้รับอนุญาตให้ส่งข้อมูล กรุณาติดต่อ 094-064-9018 โดยตรง';
      } else if (error.text) {
        console.log('EmailJS error text:', error.text);
        errorMessage = `เกิดข้อผิดพลาด: ${error.text}`;
      }

      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: errorMessage,
        confirmButtonText: 'ตกลง',
        footer: 'หากปัญหายังไม่หายใจ กรุณาติดต่อ LINE: @chiangmaiusedcar',
      });
    } finally {
      setSending(false);
    }
  };

  const handleCareerChange = e => {
    setCareer(e.target.value);
  };

  const handleDownOptionChange = e => {
    const value = e.target.value;
    setDownOption(value);
    setShowDownInput(value === 'วางเงินดาวน์');
  };

  return (
    <>
      <SEO
        title={seoCreditCheck.title}
        description={seoCreditCheck.description}
        url="/credit-check"
        image="https://www.chiangmaiusedcar.com/herobanner/outdoorbanner.webp"
        locale="th_TH"
        pageType="credit-check"
        breadcrumbs={[
          { name: 'หน้าแรก', url: '/' },
          { name: 'บริการจัดไฟแนนซ์', url: '/credit-check' },
        ]}
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: 'ประเมินคุณสมบัติเบื้องต้นในการขอสินเชื่อ',
          description:
            'บริการประเมินคุณสมบัติเบื้องต้นในการขอสินเชื่อรถยนต์ฟรี รู้เงื่อนไขล่วงหน้า',
          provider: {
            '@type': 'Organization',
            name: 'ครูหนึ่งรถสวย',
            url: 'https://www.chiangmaiusedcar.com',
          },
          areaServed: 'เชียงใหม่',
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'THB',
          },
        }}
      />

      {/* Hero Section */}
      <section className="relative w-full min-h-[280px] sm:min-h-[340px] md:min-h-[400px] lg:min-h-[440px] xl:min-h-[480px] overflow-hidden bg-gradient-to-br from-blue-50 to-orange-50">
        <A11yImage
          src="/herobanner/outdoorbanner.webp"
          alt="ครูหนึ่งรถสวย - ประเมินคุณสมบัติเบื้องต้นในการขอสินเชื่อ บริการตรวจสภาพครบถ้วน"
          fill
          className="object-cover object-center"
          priority
          quality={90}
          sizes="100vw"
        />

        {/* Content over banner */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 px-4 sm:px-6 py-10 sm:py-12">
          <div className="text-center text-white w-full max-w-5xl mx-auto bg-black/20 backdrop-blur-sm rounded-2xl p-6 sm:p-7 md:p-9 lg:p-10 border border-white/10">
            <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold mb-4 md:mb-5 font-prompt drop-shadow-2xl leading-normal sm:leading-snug">
              <span className="text-white drop-shadow-2xl">
                ประเมินคุณสมบัติเบื้องต้น
              </span>
            </h1>

            <div className="space-y-3 sm:space-y-4 mb-5 md:mb-7">
              <p className="text-sm sm:text-base md:text-lg lg:text-xl font-prompt drop-shadow-2xl font-medium leading-relaxed">
                ไม่มีผลต่อเครดิตของคุณ ประเมินฟรี
              </p>
            </div>

            <div className="bg-white/90 backdrop-blur-md rounded-xl p-4 md:p-5 inline-block border-2 border-white/40 shadow-xl max-w-full">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-3 h-3 bg-accent rounded-full shadow-sm"></div>
                <p className="text-sm sm:text-base md:text-lg font-bold text-gray-900">
                  รับคำปรึกษาสินเชื่อทันที
                </p>
              </div>
              <p className="text-xs sm:text-sm md:text-base text-gray-800 font-medium leading-relaxed">
                คำแนะนำจากผู้เชี่ยวชาญ • เงื่อนไขชัดเจน • ปลอดภัยและเป็นกลาง
              </p>
            </div>
          </div>
        </div>
      </section>

      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 sm:py-12 md:py-16 px-4 sm:px-6 font-prompt">
        <div className="max-w-5xl mx-auto">
          {/* Form Container */}
          <div className="bg-white rounded-3xl shadow-xl p-4 sm:p-6 md:p-10 lg:p-12 border border-primary/10">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-4 leading-tight">
                แบบฟอร์มประเมินสิทธิ์สินเชื่อ
              </h2>
              <h3 className="absolute -left-[9999px] w-[1px] h-[1px] overflow-hidden">
                บริการจัดไฟแนนซ์ ฟรีดาวน์ รับประกัน อนุมัติง่าย
              </h3>
              <div className="flex justify-center mb-4">
                <div className="w-24 h-1.5 bg-gradient-to-r from-accent to-orange-500 rounded-full"></div>
              </div>
              <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                กรอกข้อมูลเพื่อประเมิน
              </p>
            </div>

            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
              {/* ข้อมูลทั่วไป */}
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-primary mb-4 sm:mb-6 flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold">
                    1
                  </div>
                  ข้อมูลส่วนตัว
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="sm:col-span-1">
                    <label
                      htmlFor="name"
                      className="form-label text-base sm:text-lg font-semibold block mb-2"
                    >
                      ชื่อ-นามสกุล <span className="text-accent">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      className="form-input w-full px-4 sm:px-5 py-3 sm:py-4 text-base sm:text-lg border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      maxLength={120}
                      inputMode="text"
                      autoComplete="name"
                      placeholder="เช่น นายสมชาย ใจดี"
                    />
                  </div>

                  <div className="sm:col-span-1">
                    <label
                      htmlFor="phone"
                      className="form-label text-base sm:text-lg font-semibold block mb-2"
                    >
                      เบอร์โทรศัพท์ <span className="text-accent">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      pattern="0[0-9]{9}"
                      placeholder="เช่น 0812345678"
                      required
                      className="form-input w-full px-4 sm:px-5 py-3 sm:py-4 text-base sm:text-lg border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      inputMode="tel"
                      autoComplete="tel"
                    />
                  </div>

                  <div className="sm:col-span-1">
                    <label
                      htmlFor="gender"
                      className="form-label text-base sm:text-lg font-semibold block mb-2"
                    >
                      เพศ <span className="text-accent">*</span>
                    </label>
                    <select
                      id="gender"
                      name="gender"
                      required
                      className="form-select w-full px-4 sm:px-5 py-3 sm:py-4 text-base sm:text-lg border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
                    >
                      <option value="">-- เลือกเพศ --</option>
                      <option value="ชาย">ชาย</option>
                      <option value="หญิง">หญิง</option>
                      <option value="อื่นๆ">อื่นๆ</option>
                    </select>
                  </div>

                  <div className="sm:col-span-1">
                    <label
                      htmlFor="age"
                      className="form-label text-base sm:text-lg font-semibold block mb-2"
                    >
                      อายุ <span className="text-accent">*</span>
                    </label>
                    <input
                      type="number"
                      id="age"
                      name="age"
                      required
                      min="18"
                      max="80"
                      className="form-input w-full px-4 sm:px-5 py-3 sm:py-4 text-base sm:text-lg border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="เช่น 30"
                      inputMode="numeric"
                    />
                  </div>
                </div>
              </div>
              {/* อาชีพ */}
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-primary mb-4 sm:mb-6 flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold">
                    2
                  </div>
                  อาชีพ
                </h3>
                <label
                  htmlFor="career"
                  className="form-label text-base sm:text-lg font-semibold block mb-2"
                >
                  เลือกอาชีพของคุณ <span className="text-accent">*</span>
                </label>
                <select
                  id="career"
                  name="career"
                  value={career}
                  onChange={handleCareerChange}
                  required
                  className="form-select w-full px-4 sm:px-5 py-3 sm:py-4 text-base sm:text-lg border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
                >
                  <option value="">-- เลือกอาชีพ --</option>
                  <option value="government">ข้าราชการ</option>
                  <option value="company">พนักงานบริษัท</option>
                  <option value="freelance">ฟรีแลนซ์</option>
                  <option value="business">เจ้าของกิจการ</option>
                  <option value="farmer">เกษตรกร</option>
                  <option value="other">อื่นๆ</option>
                </select>
              </div>
              {/* Career-specific fields */}
              {career && (
                <div className="bg-gradient-to-br from-accent/10 to-accent/5 p-6 rounded-2xl border border-accent/20">
                  <h3 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
                    <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    ข้อมูลเพิ่มเติม - {careerText[career]}
                  </h3>

                  {career === 'government' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div className="sm:col-span-1">
                        <label
                          htmlFor="govAgency"
                          className="form-label text-base sm:text-lg font-semibold block mb-2"
                        >
                          หน่วยงานที่ทำงาน
                        </label>
                        <input
                          type="text"
                          id="govAgency"
                          name="govAgency"
                          className="form-input w-full px-4 sm:px-5 py-3 sm:py-4 text-base sm:text-lg border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                      <div className="sm:col-span-1">
                        <label
                          htmlFor="govPosition"
                          className="form-label text-base sm:text-lg font-semibold block mb-2"
                        >
                          ตำแหน่ง
                        </label>
                        <input
                          type="text"
                          id="govPosition"
                          name="govPosition"
                          className="form-input w-full px-4 sm:px-5 py-3 sm:py-4 text-base sm:text-lg border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                      <div className="sm:col-span-1">
                        <label
                          htmlFor="govYears"
                          className="form-label text-base sm:text-lg font-semibold block mb-2"
                        >
                          อายุราชการ (ปี)
                        </label>
                        <input
                          type="number"
                          id="govYears"
                          name="govYears"
                          className="form-input w-full px-4 sm:px-5 py-3 sm:py-4 text-base sm:text-lg border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                      <div className="sm:col-span-1">
                        <label
                          htmlFor="govIncome"
                          className="form-label text-base sm:text-lg font-semibold block mb-2"
                        >
                          รายได้ต่อเดือน (บาท)
                        </label>
                        <input
                          type="number"
                          id="govIncome"
                          name="govIncome"
                          className="form-input w-full px-4 sm:px-5 py-3 sm:py-4 text-base sm:text-lg border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                    </div>
                  )}

                  {career === 'company' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div className="sm:col-span-1">
                        <label
                          htmlFor="companyName"
                          className="form-label text-base sm:text-lg font-semibold block mb-2"
                        >
                          บริษัทที่ทำงาน
                        </label>
                        <input
                          type="text"
                          id="companyName"
                          name="companyName"
                          className="form-input w-full px-4 sm:px-5 py-3 sm:py-4 text-base sm:text-lg border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                      <div className="sm:col-span-1">
                        <label
                          htmlFor="companyPosition"
                          className="form-label text-base sm:text-lg font-semibold block mb-2"
                        >
                          ตำแหน่ง
                        </label>
                        <input
                          type="text"
                          id="companyPosition"
                          name="companyPosition"
                          className="form-input w-full px-4 sm:px-5 py-3 sm:py-4 text-base sm:text-lg border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                      <div className="sm:col-span-1">
                        <label
                          htmlFor="companyYears"
                          className="form-label text-base sm:text-lg font-semibold block mb-2"
                        >
                          อายุงาน (ปี)
                        </label>
                        <input
                          type="number"
                          id="companyYears"
                          name="companyYears"
                          className="form-input w-full px-4 sm:px-5 py-3 sm:py-4 text-base sm:text-lg border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                      <div className="sm:col-span-1">
                        <label
                          htmlFor="companyIncome"
                          className="form-label text-base sm:text-lg font-semibold block mb-2"
                        >
                          รายได้ต่อเดือน (บาท)
                        </label>
                        <input
                          type="number"
                          id="companyIncome"
                          name="companyIncome"
                          className="form-input w-full px-4 sm:px-5 py-3 sm:py-4 text-base sm:text-lg border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label
                          htmlFor="companySalaryProof"
                          className="form-label text-base sm:text-lg font-semibold block mb-2"
                        >
                          ประเภทเอกสารรายได้
                        </label>
                        <select
                          id="companySalaryProof"
                          name="companySalaryProof"
                          className="form-select w-full px-4 sm:px-5 py-3 sm:py-4 text-base sm:text-lg border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
                        >
                          <option value="">-- เลือกประเภท --</option>
                          <option value="มีสลิปเงินเดือน">มีสลิปเงินเดือน</option>
                          <option value="หนังสือรับรองเงินเดือน">หนังสือรับรองเงินเดือน</option>
                          <option value="รับเงินสด">รับเงินสด</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {career === 'freelance' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div className="sm:col-span-1">
                        <label
                          htmlFor="freelanceField"
                          className="form-label text-base sm:text-lg font-semibold block mb-2"
                        >
                          สาขางานที่ทำ
                        </label>
                        <input
                          type="text"
                          id="freelanceField"
                          name="freelanceField"
                          className="form-input w-full px-4 sm:px-5 py-3 sm:py-4 text-base sm:text-lg border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                      <div className="sm:col-span-1">
                        <label
                          htmlFor="freelanceYears"
                          className="form-label text-base sm:text-lg font-semibold block mb-2"
                        >
                          อายุงาน (ปี)
                        </label>
                        <input
                          type="number"
                          id="freelanceYears"
                          name="freelanceYears"
                          className="form-input w-full px-4 sm:px-5 py-3 sm:py-4 text-base sm:text-lg border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label
                          htmlFor="freelanceIncome"
                          className="form-label text-base sm:text-lg font-semibold block mb-2"
                        >
                          รายได้ต่อเดือน (บาท)
                        </label>
                        <input
                          type="number"
                          id="freelanceIncome"
                          name="freelanceIncome"
                          className="form-input w-full px-4 sm:px-5 py-3 sm:py-4 text-base sm:text-lg border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                    </div>
                  )}

                  {career === 'business' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div className="sm:col-span-1">
                        <label
                          htmlFor="businessName"
                          className="form-label text-base sm:text-lg font-semibold block mb-2"
                        >
                          ชื่อกิจการ
                        </label>
                        <input
                          type="text"
                          id="businessName"
                          name="businessName"
                          className="form-input w-full px-4 sm:px-5 py-3 sm:py-4 text-base sm:text-lg border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                      <div className="sm:col-span-1">
                        <label
                          htmlFor="businessYears"
                          className="form-label text-base sm:text-lg font-semibold block mb-2"
                        >
                          อายุกิจการ (ปี)
                        </label>
                        <input
                          type="number"
                          id="businessYears"
                          name="businessYears"
                          className="form-input w-full px-4 sm:px-5 py-3 sm:py-4 text-base sm:text-lg border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                      <div className="sm:col-span-1">
                        <label
                          htmlFor="businessIncome"
                          className="form-label text-base sm:text-lg font-semibold block mb-2"
                        >
                          รายได้ต่อเดือน (บาท)
                        </label>
                        <input
                          type="number"
                          id="businessIncome"
                          name="businessIncome"
                          className="form-input w-full px-4 sm:px-5 py-3 sm:py-4 text-base sm:text-lg border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                      <div className="sm:col-span-1">
                        <label
                          htmlFor="businessLicense"
                          className="form-label text-base sm:text-lg font-semibold block mb-2"
                        >
                          ทะเบียนพาณิชย์
                        </label>
                        <select
                          id="businessLicense"
                          name="businessLicense"
                          className="form-select w-full px-4 sm:px-5 py-3 sm:py-4 text-base sm:text-lg border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
                        >
                          <option value="">-- มีทะเบียนพาณิชย์ไหม --</option>
                          <option value="มี">มี</option>
                          <option value="ไม่มี">ไม่มี</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {career === 'farmer' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div className="sm:col-span-1">
                        <label
                          htmlFor="farmType"
                          className="form-label text-base sm:text-lg font-semibold block mb-2"
                        >
                          ประเภทการเกษตร
                        </label>
                        <input
                          type="text"
                          id="farmType"
                          name="farmType"
                          className="form-input w-full px-4 sm:px-5 py-3 sm:py-4 text-base sm:text-lg border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                      <div className="sm:col-span-1">
                        <label
                          htmlFor="farmArea"
                          className="form-label text-base sm:text-lg font-semibold block mb-2"
                        >
                          จำนวนไร่
                        </label>
                        <input
                          type="number"
                          id="farmArea"
                          name="farmArea"
                          className="form-input w-full px-4 sm:px-5 py-3 sm:py-4 text-base sm:text-lg border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                      <div className="sm:col-span-1">
                        <label
                          htmlFor="farmIncome"
                          className="form-label text-base sm:text-lg font-semibold block mb-2"
                        >
                          รายได้ต่อปี (บาท)
                        </label>
                        <input
                          type="number"
                          id="farmIncome"
                          name="farmIncome"
                          className="form-input w-full px-4 sm:px-5 py-3 sm:py-4 text-base sm:text-lg border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                      <div className="sm:col-span-1">
                        <label
                          htmlFor="farmBook"
                          className="form-label text-base sm:text-lg font-semibold block mb-2"
                        >
                          สมุดเกษตรกร
                        </label>
                        <select
                          id="farmBook"
                          name="farmerBook"
                          className="form-select w-full px-4 sm:px-5 py-3 sm:py-4 text-base sm:text-lg border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
                        >
                          <option value="">-- มีสมุดเกษตรกรไหม --</option>
                          <option value="มี">มี</option>
                          <option value="ไม่มี">ไม่มี</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {career === 'other' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div className="sm:col-span-1">
                        <label
                          htmlFor="otherCareer"
                          className="form-label text-base sm:text-lg font-semibold block mb-2"
                        >
                          ระบุอาชีพ
                        </label>
                        <input
                          type="text"
                          id="otherCareer"
                          name="otherCareer"
                          className="form-input w-full px-4 sm:px-5 py-3 sm:py-4 text-base sm:text-lg border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                      <div className="sm:col-span-1">
                        <label
                          htmlFor="otherIncome"
                          className="form-label text-base sm:text-lg font-semibold block mb-2"
                        >
                          รายได้ต่อเดือน (บาท)
                        </label>
                        <input
                          type="number"
                          id="otherIncome"
                          name="otherIncome"
                          className="form-input w-full px-4 sm:px-5 py-3 sm:py-4 text-base sm:text-lg border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
              {/* ข้อมูลเพิ่มเติม */}
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-primary mb-4 sm:mb-6 flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold">
                    3
                  </div>
                  ข้อมูลเพิ่มเติม
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="sm:col-span-1">
                    <label
                      htmlFor="province"
                      className="form-label text-base sm:text-lg font-semibold block mb-2"
                    >
                      จังหวัดที่อาศัย <span className="text-accent">*</span>
                    </label>
                    <input
                      type="text"
                      id="province"
                      name="province"
                      required
                      className="form-input w-full px-4 sm:px-5 py-3 sm:py-4 text-base sm:text-lg border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      maxLength={60}
                      autoComplete="address-level1"
                      placeholder="เช่น เชียงใหม่"
                    />
                  </div>

                  <div className="sm:col-span-1">
                    <label
                      htmlFor="creditStatus"
                      className="form-label text-base sm:text-lg font-semibold block mb-2"
                    >
                      สถานะเครดิต <span className="text-accent">*</span>
                    </label>
                    <select
                      id="creditStatus"
                      name="creditStatus"
                      required
                      className="form-select w-full px-4 sm:px-5 py-3 sm:py-4 text-base sm:text-lg border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
                    >
                      <option value="">-- เลือกสถานะเครดิต --</option>
                      <option value="เครดิตดีมาก">เครดิตดีมาก</option>
                      <option value="ไม่เคยมีเครดิต">ไม่เคยมีเครดิต</option>
                      <option value="ติดบูโร">ติดบูโร</option>
                      <option value="ติดล่าช้า">ติดล่าช้า</option>
                      <option value="ปรับโครงสร้างหนี้">ปรับโครงสร้างหนี้</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="downOption"
                      className="form-label text-base sm:text-lg font-semibold block mb-2"
                    >
                      เงินดาวน์ <span className="text-accent">*</span>
                    </label>
                    <select
                      id="downOption"
                      name="downOption"
                      value={downOption}
                      onChange={handleDownOptionChange}
                      required
                      className="form-select w-full px-4 sm:px-5 py-3 sm:py-4 text-base sm:text-lg border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
                    >
                      <option value="">-- เลือกรูปแบบเงินดาวน์ --</option>
                      <option value="ฟรีดาวน์">ฟรีดาวน์</option>
                      <option value="วางเงินดาวน์">วางเงินดาวน์</option>
                    </select>
                  </div>

                  {showDownInput && (
                    <div className="sm:col-span-2">
                      <label
                        htmlFor="customDown"
                        className="form-label text-base sm:text-lg font-semibold block mb-2"
                      >
                        จำนวนเงินวางดาวน์ (บาท)
                      </label>
                      <input
                        type="number"
                        id="customDown"
                        name="customDown"
                        className="form-input w-full px-4 sm:px-5 py-3 sm:py-4 text-base sm:text-lg border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        min="0"
                        step="1000"
                        inputMode="numeric"
                        placeholder="เช่น 50000"
                      />
                    </div>
                  )}
                </div>
              </div>
              {/* Consent */}
              <div className="bg-primary/5 border-2 border-primary/20 rounded-2xl p-4 sm:p-6">
                <div className="flex items-start gap-3 sm:gap-4">
                  <input
                    type="checkbox"
                    id="privacyConsent"
                    name="privacyConsent"
                    required
                    className="mt-2 w-5 h-5 sm:w-6 sm:h-6 accent-primary cursor-pointer flex-shrink-0"
                  />
                  <label
                    htmlFor="privacyConsent"
                    className="text-base sm:text-lg text-gray-700 leading-relaxed cursor-pointer"
                  >
                    ฉันยินยอมตาม{' '}
                    <Link
                      href="/privacy-policy"
                      className="text-primary font-semibold hover:text-accent-800 underline transition-colors"
                    >
                      นโยบายความเป็นส่วนตัว
                    </Link>{' '}
                    และได้อ่านข้อมูลต่างๆ แล้ว
                  </label>
                </div>
              </div>
              {/* Honeypot (anti-bot) */}
              <div className="hidden" aria-hidden="true">
                <label>
                  เว็บไซต์
                  <input
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    value={honeypot}
                    onChange={e => setHoneypot(e.target.value)}
                  />
                </label>
              </div>
              {/* Submit Button */}
              <div className="pt-4 sm:pt-6">
                <button
                  type="submit"
                  disabled={sending}
                  className="w-full py-4 sm:py-5 px-6 rounded-2xl font-bold text-white text-lg sm:text-xl bg-gradient-to-r from-primary to-primary-600 hover:from-primary-600 hover:to-primary-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-2xl transform hover:-translate-y-1 active:translate-y-0"
                >
                  {sending ? (
                    <span className="flex items-center justify-center gap-3">
                      <svg
                        className="animate-spin h-6 w-6 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span>กำลังส่งข้อมูล...</span>
                    </span>
                  ) : (
                    'ส่งข้อมูลเพื่อประเมินเครดิต'
                  )}
                </button>
              </div>
            </form>

            {/* Links */}
            <div className="mt-10 sm:mt-14 md:mt-16 text-center space-y-8 sm:space-y-10">
              {/* Credit Benefits Section */}
              <div className="bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 rounded-3xl p-6 sm:p-8 md:p-10 shadow-lg">
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-8 md:mb-10 tracking-wide">
                  สิทธิพิเศษสำหรับเครดิตดี
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
                  <div className="group bg-white rounded-2xl p-5 sm:p-6 md:p-8 border-2 border-primary/20 hover:border-primary hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center gap-3 sm:gap-4 mb-3">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 bg-primary rounded-full flex-shrink-0"></div>
                      <div className="font-bold text-primary text-lg sm:text-xl">
                        อัตราดอกเบี้ยพิเศษ
                      </div>
                    </div>
                    <div className="text-gray-700 text-base sm:text-lg font-medium">
                      สำหรับลูกค้าเครดิตดี
                    </div>
                  </div>
                  <div className="group bg-white rounded-2xl p-5 sm:p-6 md:p-8 border-2 border-accent/20 hover:border-accent hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center gap-3 sm:gap-4 mb-3">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 bg-accent rounded-full flex-shrink-0"></div>
                      <div className="font-bold text-accent-800 text-lg sm:text-xl">ผ่อนยาวสุด</div>
                    </div>
                    <div className="text-gray-700 text-base sm:text-lg font-medium">84 เดือน</div>
                  </div>
                  <div className="group bg-white rounded-2xl p-5 sm:p-6 md:p-8 border-2 border-primary/20 hover:border-primary hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center gap-3 sm:gap-4 mb-3">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 bg-primary rounded-full flex-shrink-0"></div>
                      <div className="font-bold text-primary text-lg sm:text-xl">อนุมัติเร็ว</div>
                    </div>
                    <div className="text-gray-700 text-base sm:text-lg font-medium">
                      ภายใน 1 วัน
                    </div>
                  </div>
                  <div className="group bg-white rounded-2xl p-5 sm:p-6 md:p-8 border-2 border-accent/20 hover:border-accent hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center gap-3 sm:gap-4 mb-3">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 bg-accent rounded-full flex-shrink-0"></div>
                      <div className="font-bold text-accent-800 text-lg sm:text-xl">ไม่ต้องค้ำ</div>
                    </div>
                    <div className="text-gray-700 text-base sm:text-lg font-medium">
                      สำหรับเครดิต AAA
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-5">
                <Link
                  href="/all-cars"
                  className="group relative overflow-hidden bg-accent hover:bg-accent/90 text-white font-bold px-6 sm:px-8 py-3 sm:py-4 rounded-2xl transition-all duration-300 hover:shadow-xl hover:scale-105 inline-flex items-center justify-center gap-3 text-base sm:text-lg"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-accent to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 relative z-10 transition-transform duration-300 group-hover:rotate-12"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h6m-6 4h6m-2 8l-2-2-2 2"
                    />
                  </svg>
                  <span className="relative z-10">ดูรถทั้งหมด</span>
                </Link>
                <Link
                  href="/payment-calculator"
                  className="group relative overflow-hidden bg-white hover:bg-gray-50 text-accent-800 border-2 border-accent font-bold px-6 sm:px-8 py-3 sm:py-4 rounded-2xl transition-all duration-300 hover:shadow-xl hover:scale-105 inline-flex items-center justify-center gap-3 text-base sm:text-lg"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-accent/10 to-orange-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 relative z-10 transition-transform duration-300 group-hover:scale-110"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="relative z-10">คำนวนค่างวด</span>
                </Link>
              </div>

              {/* Direct Contact Section */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 md:p-10 border-2 border-accent/20 shadow-xl">
                <p className="text-gray-700 mb-6 sm:mb-8 font-semibold text-lg sm:text-xl text-center">
                  หรือติดต่อโดยตรง:
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-5">
                  <a
                    href="https://lin.ee/8ugfzstD"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-accent hover:bg-accent/90 text-white font-bold px-6 sm:px-8 py-4 sm:py-5 rounded-2xl transition-all duration-300 hover:shadow-xl hover:scale-105 inline-flex items-center justify-center gap-3 text-base sm:text-lg"
                    aria-label="แชท LINE ครูหนึ่งรถสวย"
                  >
                    <svg
                      className="w-6 h-6 sm:w-7 sm:h-7 transition-transform duration-300 hover:bounce"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.630.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.630 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12.017.572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
                    </svg>
                    <span>สอบถามเลย LINE</span>
                  </a>
                  <a
                    href="tel:0940649018"
                    className="bg-primary hover:bg-primary-600 text-white font-bold px-6 sm:px-8 py-4 sm:py-5 rounded-2xl transition-all duration-300 hover:shadow-xl hover:scale-105 inline-flex items-center justify-center gap-3 text-base sm:text-lg"
                    aria-label="โทร 094-064-9018"
                  >
                    <svg
                      className="w-6 h-6 sm:w-7 sm:h-7"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    <span>โทร 094-064-9018</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <section className="mt-14 sm:mt-16 md:mt-20">
            <div className="text-center mb-10 sm:mb-12 md:mb-14">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-4 leading-tight">
                คำถามที่พบบ่อย
              </h2>
              <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
                ข้อมูลเพิ่มเติมที่คุณควรรู้
              </p>
            </div>
            <div className="space-y-4 sm:space-y-5">
              <details className="bg-white p-5 sm:p-6 md:p-8 rounded-2xl shadow-md border-2 border-primary/20 hover:border-primary hover:shadow-xl transition-all duration-300 group">
                <summary className="font-bold text-primary cursor-pointer hover:text-accent-800 flex items-center gap-3 text-base sm:text-lg md:text-xl">
                  <span className="text-accent text-xl sm:text-2xl font-extrabold group-open:hidden">
                    ➕
                  </span>
                  <span className="text-accent text-xl sm:text-2xl font-extrabold hidden group-open:inline">
                    ➖
                  </span>
                  <span className="flex-1 text-left">ประเมินไฟแนนซ์ฟรีจริงหรือไม่?</span>
                </summary>
                <div className="mt-5 sm:mt-6 pl-6 sm:pl-8 md:pl-10 border-l-4 border-accent bg-gradient-to-br from-accent/5 to-transparent p-4 sm:p-5 rounded-lg">
                  <p className="text-gray-700 text-base sm:text-lg leading-relaxed font-medium">
                    ฟรี 100% ไม่มีค่าใช้จ่ายใดๆ ไม่บังคับซื้อรถ รู้ผลทันที ทีมงานมีประสบการณ์กว่า 10
                    ปี
                  </p>
                </div>
              </details>

              <details className="bg-white p-5 sm:p-6 md:p-8 rounded-2xl shadow-md border-2 border-primary/20 hover:border-primary hover:shadow-xl transition-all duration-300 group">
                <summary className="font-bold text-primary cursor-pointer hover:text-accent-800 flex items-center gap-3 text-base sm:text-lg md:text-xl">
                  <span className="text-accent text-xl sm:text-2xl font-extrabold group-open:hidden">
                    ➕
                  </span>
                  <span className="text-accent text-xl sm:text-2xl font-extrabold hidden group-open:inline">
                    ➖
                  </span>
                  <span className="flex-1 text-left">ใช้เวลานานแค่ไหนถึงจะรู้ผล?</span>
                </summary>
                <div className="mt-5 sm:mt-6 pl-6 sm:pl-8 md:pl-10 border-l-4 border-accent bg-gradient-to-br from-accent/5 to-transparent p-4 sm:p-5 rounded-lg">
                  <p className="text-gray-700 text-base sm:text-lg leading-relaxed font-medium">
                    ภายใน 24 ชั่วโมง ทีมงานจะติดต่อกลับพร้อมผลการประเมินและแนะนำรถที่เหมาะสม
                  </p>
                </div>
              </details>

              <details className="bg-white p-5 sm:p-6 md:p-8 rounded-2xl shadow-md border-2 border-primary/20 hover:border-primary hover:shadow-xl transition-all duration-300 group">
                <summary className="font-bold text-primary cursor-pointer hover:text-accent-800 flex items-center gap-3 text-base sm:text-lg md:text-xl">
                  <span className="text-accent text-xl sm:text-2xl font-extrabold group-open:hidden">
                    ➕
                  </span>
                  <span className="text-accent text-xl sm:text-2xl font-extrabold hidden group-open:inline">
                    ➖
                  </span>
                  <span className="flex-1 text-left">เครดิตดีจะได้สิทธิพิเศษอะไรบ้าง?</span>
                </summary>
                <div className="mt-5 sm:mt-6 pl-6 sm:pl-8 md:pl-10 border-l-4 border-accent bg-gradient-to-br from-accent/5 to-transparent p-4 sm:p-5 rounded-lg">
                  <p className="text-gray-700 text-base sm:text-lg leading-relaxed font-medium">
                    อัตราดอกเบี้ยพิเศษ ผ่อนยาวสูงสุด 84 เดือน อนุมัติเร็ว ไม่ต้องค้ำประกัน
                    และเลือกรถได้มากกว่า
                  </p>
                </div>
              </details>

              <details className="bg-white p-5 sm:p-6 md:p-8 rounded-2xl shadow-md border-2 border-primary/20 hover:border-primary hover:shadow-xl transition-all duration-300 group">
                <summary className="font-bold text-primary cursor-pointer hover:text-accent-800 flex items-center gap-3 text-base sm:text-lg md:text-xl">
                  <span className="text-accent text-xl sm:text-2xl font-extrabold group-open:hidden">
                    ➕
                  </span>
                  <span className="text-accent text-xl sm:text-2xl font-extrabold hidden group-open:inline">
                    ➖
                  </span>
                  <span className="flex-1 text-left">รถที่ขายมีรับประกันไหม?</span>
                </summary>
                <div className="mt-5 sm:mt-6 pl-6 sm:pl-8 md:pl-10 border-l-4 border-accent bg-gradient-to-br from-accent/5 to-transparent p-4 sm:p-5 rounded-lg">
                  <p className="text-gray-700 text-base sm:text-lg leading-relaxed font-medium">
                    รับประกันเครื่องยนต์ เกียร์ 1 ปี ไม่จำกัดกิโลเมตรตามเงื่อนไข
                    และมีบริการฟรีตรวจเช็คระยะเปลี่ยนน้ำมันเครื่อง
                  </p>
                </div>
              </details>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}

// SSR for credit check security and real-time verification
export async function getServerSideProps() {
  return {
    props: {},
  };
}
