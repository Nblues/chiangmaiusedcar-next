// Mock Articles Database
// ในการใช้งานจริงจะเชื่อมต่อกับ Database หรือ CMS
export const mockArticles = [
  {
    id: 1,
    title: 'Honda City 2024 ใหม่ เปิดราคาเริ่มต้น 599,000 บาท',
    excerpt:
      'Honda City รุ่นใหม่ล่าสุดเพิ่มฟีเจอร์ใหม่ ประหยัดน้ำมันยิ่งขึ้น เหมาะสำหรับครอบครัวยุคใหม่',
    content: `<h2>Honda City 2024 โฉมใหม่พร้อมเทคโนโลยีล้ำสมัย</h2>

<p>Honda City รุ่นปี 2024 เปิดตัวอย่างเป็นทางการแล้ว พร้อมฟีเจอร์ใหม่ที่น่าสนใจมากมาย และราคาที่แข่งขันได้ในตลาดรถ Eco Car</p>

<div class="alert alert-info" role="alert">
  <strong>ราคาเริ่มต้น:</strong> 599,000 บาท (รุ่น S) ถึง 729,000 บาท (รุ่น RS)
</div>

<h3>ฟีเจอร์เด่นของ Honda City 2024</h3>

<ul class="list-unstyled">
  <li>✅ เครื่องยนต์ 1.0 ลิตร VTEC TURBO ประหยัดน้ำมัน 23.8 กม./ลิตร</li>
  <li>✅ Honda SENSING ระบบความปลอดภัยมาตรฐาน</li>
  <li>✅ จอ Infotainment ขนาด 8 นิ้ว รองรับ Apple CarPlay/Android Auto</li>
  <li>✅ ห้องโดยสารกว้างขวาง เบาะหนังแท้ในรุ่นท็อป</li>
</ul>

<div class="row">
  <div class="col-md-6">
    <h4>ข้อดี</h4>
    <p>• ประหยัดน้ำมันดีเยี่ยม<br>
    • ห้องโดยสารกว้างขวาง<br>
    • ระบบความปลอดภัยครบครัน</p>
  </div>
  <div class="col-md-6">
    <h4>ข้อควรพิจารณา</h4>
    <p>• เครื่องยนต์ขนาดเล็ก อาจไม่เหมาะกับการขับขี่หนัก<br>
    • ราคาสูงกว่าคู่แข่งเล็กน้อย</p>
  </div>
</div>

<blockquote class="blockquote">
  <p>"Honda City 2024 เป็นตัวเลือกที่ดีสำหรับครอบครัวที่ต้องการรถประหยัดน้ำมัน พร้อมความปลอดภัยระดับสูง"</p>
  <footer class="blockquote-footer">ทีมผู้เชี่ยวชาญ ครูหนึ่งรถสวย</footer>
</blockquote>`,
    image: '/herobanner/promotioncar.webp',
    category: 'ข่าวรถใหม่',
    status: 'published',
    featured: true,
    keywords: 'Honda City 2024, รถใหม่, Eco Car, Honda SENSING',
    author: 'ครูหนึ่งรถสวย',
    date: '2025-01-15',
    readTime: '3 นาที',
  },
  {
    id: 2,
    title: 'Toyota Vios vs Honda City 2024 เปรียบเทียบรถ Eco Car ยอดนิยม',
    excerpt: 'เปรียบเทียบ Spec และราคา Toyota Vios กับ Honda City รุ่นล่าสุด ช่วยตัดสินใจเลือกซื้อ',
    content: `<h2>เปรียบเทียบ Toyota Vios vs Honda City 2024</h2>

<p>สำหรับใครที่กำลังมองหารถ Eco Car ย่อมต้องคิดถึง 2 รุ่นนี้เป็นอันดับต้นๆ ไปดูกันว่าแต่ละรุ่นมีจุดเด่นอย่างไร</p>

<div class="table-responsive">
  <table class="table table-striped">
    <thead>
      <tr>
        <th>รายการ</th>
        <th>Toyota Vios</th>
        <th>Honda City</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>ราคาเริ่มต้น</td>
        <td>579,000 บาท</td>
        <td>599,000 บาท</td>
      </tr>
      <tr>
        <td>เครื่องยนต์</td>
        <td>1.5L Dual VVT-i</td>
        <td>1.0L VTEC TURBO</td>
      </tr>
      <tr>
        <td>ระบบส่งกำลัง</td>
        <td>CVT</td>
        <td>CVT</td>
      </tr>
      <tr>
        <td>อัตราสิ้นเปลือง</td>
        <td>21.3 กม./ลิตร</td>
        <td>23.8 กม./ลิตร</td>
      </tr>
    </tbody>
  </table>
</div>

<div class="alert alert-success" role="alert">
  <strong>ผลสรุป:</strong> Honda City เหนือกว่าในเรื่องประหยัดน้ำมัน ขณะที่ Toyota Vios มีราคาถูกกว่า
</div>`,
    image: '/herobanner/promotioncar.webp',
    category: 'เปรียบเทียบ',
    status: 'published',
    featured: true,
    keywords: 'Toyota Vios, Honda City, เปรียบเทียบ, Eco Car',
    author: 'ครูหนึ่งรถสวย',
    date: '2025-01-14',
    readTime: '5 นาที',
  },
  {
    id: 3,
    title: '5 วิธีดูแลรถมือสอง ให้อายุยืนและใช้งานได้นาน',
    excerpt: 'เทคนิคดูแลรถมือสองจากผู้เชี่ยวชาญ รับรองรถใช้งานได้นาน ประหยัดค่าซ่อม',
    content: `<h2>5 วิธีดูแลรถมือสอง ให้อายุยืนและใช้งานได้นาน</h2>

<p>การดูแลรถมือสองให้อยู่ในสภาพดีไม่ใช่เรื่องยาก หากคุณทำตามคำแนะนำเหล่านี้</p>

<div class="card mb-4">
  <div class="card-body">
    <h5 class="card-title">1. เปลี่ยนน้ำมันเครื่องสม่ำเสมอ</h5>
    <p class="card-text">เปลี่ยนน้ำมันเครื่องทุก 5,000-10,000 กิโลเมตร หรือทุก 6 เดือน เพื่อหล่อลื่นเครื่องยนต์</p>
  </div>
</div>

<div class="card mb-4">
  <div class="card-body">
    <h5 class="card-title">2. ตรวจสอบระบบเบรก</h5>
    <p class="card-text">ตรวจสอบผ้าเบรกและน้ำมันเบรกเป็นประจำ เพื่อความปลอดภัยในการขับขี่</p>
  </div>
</div>

<div class="card mb-4">
  <div class="card-body">
    <h5 class="card-title">3. ดูแลระบบไฟฟ้า</h5>
    <p class="card-text">ทำความสะอาดขั้วแบตเตอรี่ ตรวจสอบสายไฟ และเปลี่ยนหลอดไฟที่ชำรุด</p>
  </div>
</div>

<div class="card mb-4">
  <div class="card-body">
    <h5 class="card-title">4. ล้างรถสม่ำเสมอ</h5>
    <p class="card-text">ล้างรถอย่างน้อยสัปดาหละครั้ง และแว็กซ์เคลือบสีทุก 3 เดือน</p>
  </div>
</div>

<div class="card mb-4">
  <div class="card-body">
    <h5 class="card-title">5. บริการตามระยะ</h5>
    <p class="card-text">นำรถเข้าบริการตามระยะที่กำหนดในคู่มือ เพื่อตรวจสอบระบบต่างๆ</p>
  </div>
</div>

<span class="badge bg-success">เคล็ดลับ</span> การดูแลเชิงป้องกันจะประหยัดค่าใช้จ่ายในระยะยาว`,
    image: '/herobanner/promotioncar.webp',
    category: 'คำแนะนำ',
    status: 'published',
    featured: false,
    keywords: 'ดูแลรถมือสอง, บำรุงรักษารถ, เทคนิคดูแลรถ',
    author: 'ครูหนึ่งรถสวย',
    date: '2025-01-13',
    readTime: '4 นาที',
  },
  {
    id: 4,
    title: 'เครดิตไม่ผ่าน ติดบูโร ยังซื้อรถได้อย่างไร?',
    excerpt:
      'แนวทางและวิธีการสำหรับคนเครดิตไม่ผ่าน ให้สามารถซื้อรถมือสองได้ พร้อมเทคนิคปรับปรุงเครดิต',
    content: `<h2>เครดิตไม่ผ่าน ติดบูโร ยังซื้อรถได้อย่างไร?</h2>

<p>หลายคนคิดว่าเครดิตไม่ผ่านแล้วซื้อรถไม่ได้ แต่จริงๆ แล้วยังมีทางออกให้อีกหลายวิธี</p>

<div class="alert alert-warning" role="alert">
  <strong>ข้อสำคัญ:</strong> อย่ารีบร้อน ศึกษาข้อมูลให้ดีก่อนตัดสินใจ
</div>

<ol>
  <li><strong>หาผู้ค้ำประกัน</strong> - ให้ครอบครัวหรือเพื่อนที่มีเครดิตดีเป็นผู้ค้ำ</li>
  <li><strong>เพิ่มเงินดาวน์</strong> - จ่ายเงินดาวน์สูงขึ้น 30-50% เพื่อลดความเสี่ยงของเจ้าหนี้</li>
  <li><strong>หาบริษัทไฟแนนซ์เฉพาะทาง</strong> - มีบริษัทที่รับลูกค้าเครดิตไม่ดี แต่ดอกเบี้ยสูงกว่า</li>
  <li><strong>ซื้อเงินสด</strong> - ถ้าเก็บเงินได้ ซื้อเงินสดจะคุ้มที่สุด</li>
</ol>

<div class="row">
  <div class="col-md-6">
    <h4>วิธีปรับปรุงเครดิต</h4>
    <ul class="list-unstyled">
      <li>💳 ใช้บัตรเครดิตให้ตรงเวลา</li>
      <li>📅 จ่ายค่างวดต่างๆ ไม่ให้เลยกำหนด</li>
      <li>💰 ลดยอดหนี้ที่มีอยู่</li>
      <li>📊 ตรวจเครดิตเป็นประจำ</li>
    </ul>
  </div>
  <div class="col-md-6">
    <h4>เอกสารที่ต้องเตรียม</h4>
    <ul class="list-unstyled">
      <li>📋 สลิปเงินเดือน 3 เดือน</li>
      <li>🏦 สำเนาบัญชีเงินฝาก</li>
      <li>🆔 บัตรประชาชน</li>
      <li>📄 ทะเบียนบ้าน</li>
    </ul>
  </div>
</div>`,
    image: '/herobanner/promotioncar.webp',
    category: 'การเงิน',
    status: 'draft',
    featured: false,
    keywords: 'เครดิตไม่ผ่าน, ติดบูโร, สินเชื่อรถยนต์',
    author: 'ครูหนึ่งรถสวย',
    date: '2025-01-12',
    readTime: '6 นาที',
  },
];

// API Functions สำหรับจำลอง Database Operations
export const getArticles = async () => {
  // จำลองการโหลดข้อมูลจาก Database
  return new Promise(resolve => {
    setTimeout(() => resolve(mockArticles), 500);
  });
};

export const getArticleById = async id => {
  return new Promise(resolve => {
    setTimeout(() => {
      const article = mockArticles.find(a => a.id === parseInt(id));
      resolve(article || null);
    }, 300);
  });
};

export const saveArticle = async articleData => {
  return new Promise(resolve => {
    setTimeout(() => {
      if (articleData.id) {
        // Update existing article
        const index = mockArticles.findIndex(a => a.id === articleData.id);
        if (index !== -1) {
          mockArticles[index] = { ...mockArticles[index], ...articleData };
          resolve(mockArticles[index]);
        } else {
          resolve(null);
        }
      } else {
        // Create new article
        const newId = Math.max(...mockArticles.map(a => a.id)) + 1;
        const newArticle = {
          id: newId,
          ...articleData,
          date: new Date().toISOString().split('T')[0],
        };
        mockArticles.push(newArticle);
        resolve(newArticle);
      }
    }, 1000);
  });
};

export const deleteArticle = async id => {
  return new Promise(resolve => {
    setTimeout(() => {
      const index = mockArticles.findIndex(a => a.id === parseInt(id));
      if (index !== -1) {
        mockArticles.splice(index, 1);
        resolve(true);
      } else {
        resolve(false);
      }
    }, 500);
  });
};
