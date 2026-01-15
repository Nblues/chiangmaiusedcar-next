/* eslint-disable prettier/prettier */
import React from 'react';
import dynamic from 'next/dynamic';
import SEO from '../components/SEO.jsx';

const Breadcrumb = dynamic(() => import('../components/Breadcrumb'), {
  ssr: false,
  loading: () => null,
});

export default function TermsPage() {
  return (
    <div>
      <SEO
        title="ข้อกำหนดการใช้งานและสิทธิ์รูปภาพ"
        description="ข้อกำหนดการใช้งานเว็บไซต์ครูหนึ่งรถสวย รวมถึงสิทธิ์การใช้งานรูปภาพสำหรับการแสดงผลในผลการค้นหา"
        url="/terms"
        type="website"
        pageType="about"
      />

      <header className="bg-gradient-to-r from-orange-100 to-blue-100 py-10">
        <div className="max-w-5xl mx-auto px-6">
          <h1 className="text-3xl md:text-4xl font-extrabold text-primary font-prompt">
            ข้อกำหนดการใช้งานและสิทธิ์รูปภาพ
          </h1>
          <p className="text-gray-700 mt-3 font-prompt">
            อัปเดตล่าสุด: {new Date().toISOString().slice(0, 10)}
          </p>
        </div>
      </header>

      <Breadcrumb />

      <main className="max-w-5xl mx-auto px-6 py-10 font-prompt text-gray-800 leading-relaxed">
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-primary">1. ขอบเขตการใช้งาน</h2>
          <p>
            เว็บไซต์นี้ให้ข้อมูลรถยนต์มือสองและบริการที่เกี่ยวข้อง
            ข้อมูลบนเว็บไซต์อาจมีการเปลี่ยนแปลงโดยไม่ต้องแจ้งล่วงหน้า
          </p>
        </section>

        <section className="space-y-4 mt-8">
          <h2 className="text-2xl font-bold text-primary">2. สิทธิ์ในรูปภาพและสื่อ</h2>
          <p>
            รูปภาพทั้งหมดบนเว็บไซต์ (รวมถึงรูปสินค้าและรูปแบนเนอร์)
            เป็นทรัพย์สินของครูหนึ่งรถสวยหรือได้รับอนุญาตให้ใช้งาน
            เพื่อการแสดงผลบนเว็บไซต์และการทำดัชนีของเครื่องมือค้นหา
          </p>
          <p>
            อนุญาตให้เครื่องมือค้นหา (เช่น Google, Bing)
            เข้าถึงและแสดงรูปภาพเพื่อการแสดงผลในผลการค้นหา โดยต้องอ้างอิงกลับมายังเว็บไซต์นี้ ผ่าน
            URL ต้นทางของรูปภาพเท่านั้น
          </p>
        </section>

        <section className="space-y-4 mt-8">
          <h2 className="text-2xl font-bold text-primary">3. การใช้งานข้อมูล</h2>
          <p>
            ห้ามคัดลอก ดัดแปลง
            หรือเผยแพร่ข้อมูลและรูปภาพเพื่อการพาณิชย์โดยไม่ได้รับอนุญาตเป็นลายลักษณ์อักษร
          </p>
        </section>

        <section className="space-y-4 mt-8">
          <h2 className="text-2xl font-bold text-primary">4. การติดต่อ</h2>
          <p>หากต้องการขออนุญาตใช้งานรูปภาพหรือข้อมูล โปรดติดต่อ:</p>
          <p className="font-semibold">โทร: 094-064-9018</p>
          <p className="font-semibold">LINE: @krunueng_usedcar</p>
        </section>
      </main>
    </div>
  );
}
