import React from 'react';
import SEO from '../../components/SEO';
import { isAuthenticated } from '../../middleware/adminAuth';

function AdminAccessGuide() {
  return (
    <div className="min-h-screen bg-gray-100 font-prompt">
      <SEO
        title="คู่มือการใช้งานหลังบ้าน"
        description="คู่มือการใช้งานระบบหลังบ้าน ครูหนึ่งรถสวย"
        url="/admin/access-guide"
        noindex={true}
      />

      <main className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-primary mb-4">คู่มือการใช้งานหลังบ้าน</h1>
        <p className="text-gray-700 mb-6">
          หน้านี้เป็นคู่มือเบื้องต้นสำหรับผู้ดูแลระบบ เพื่อใช้งานแดชบอร์ดหลังบ้านอย่างถูกต้อง
        </p>

        <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-primary">1. การเข้าสู่ระบบ</h2>
            <p className="text-gray-700">
              เข้าใช้งานที่ <strong>/admin/login</strong> และใช้บัญชีผู้ดูแลระบบที่ได้รับมอบหมาย
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-primary">2. จัดการรถทั้งหมด</h2>
            <p className="text-gray-700">
              ไปที่เมนู “จัดการรถทั้งหมด” เพื่อปรับสถานะรถ (ว่าง/จองแล้ว) ให้ตรงกับหน้าบ้าน
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-primary">3. ความปลอดภัย</h2>
            <p className="text-gray-700">ห้ามแชร์บัญชีผู้ดูแล และควรเปลี่ยนรหัสผ่านเป็นระยะ</p>
          </div>
        </section>
      </main>
    </div>
  );
}

AdminAccessGuide.displayName = 'AdminAccessGuide';
AdminAccessGuide.getLayout = function getLayout(page) {
  return (
    <main id="main" role="main">
      {page}
    </main>
  );
};

export default AdminAccessGuide;

export async function getServerSideProps({ req }) {
  if (!isAuthenticated(req)) {
    return {
      redirect: {
        destination: '/admin/login',
        permanent: false,
      },
    };
  }

  return { props: {} };
}
