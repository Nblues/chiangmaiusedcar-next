// Test EmailJS Configuration
const emailjs = require('emailjs-com');

// Configuration (hard-coded for testing)
const serviceId = 'service_qlcksif';
const templateId = 'template_zd6e3f6';
const publicKey = 'P3wnNJB_Y_PddrdBJ';

console.log('=== EmailJS Configuration Test ===');
console.log('Service ID:', serviceId ? '✅ SET' : '❌ NOT SET');
console.log('Template ID:', templateId ? '✅ SET' : '❌ NOT SET');
console.log('Public Key:', publicKey ? '✅ SET' : '❌ NOT SET');

if (!serviceId || !templateId || !publicKey) {
  console.log('\n❌ Missing EmailJS configuration!');
  console.log('Please check your .env.local file.');
  process.exit(1);
}

// Test data
const testData = {
  name: 'ทดสอบระบบ',
  phone: '0987654321',
  gender: 'ชาย',
  age: '30',
  career: 'company',
  careerText: 'พนักงานบริษัท',
  province: 'เชียงใหม่',
  creditStatus: 'เครดิตดี',
  downOption: 'ฟรีดาวน์',
  submittedAt: new Date().toLocaleString('th-TH'),
  privacyConsent: 'Yes',
  // Company fields
  companyName: 'บริษัททดสอบ จำกัด',
  companyPosition: 'พนักงาน',
  companyYears: '2',
  companyIncome: '25000',
  companySalaryProof: 'มีสลิปเงินเดือน',
};

console.log('\n=== Sending Test Email ===');
console.log('Test data:', JSON.stringify(testData, null, 2));

// Send test email
emailjs
  .send(serviceId, templateId, testData, publicKey)
  .then(result => {
    console.log('\n✅ SUCCESS!');
    console.log('Result:', result);
    console.log('Status:', result.status);
    console.log('Text:', result.text);
  })
  .catch(error => {
    console.log('\n❌ ERROR!');
    console.error('Error details:', error);

    if (error.status) {
      console.log('HTTP Status:', error.status);
    }

    if (error.text) {
      console.log('Error message:', error.text);
    }

    // Common error solutions
    console.log('\n💡 Common Solutions:');
    console.log('1. Check EmailJS service ID, template ID, and public key');
    console.log('2. Verify EmailJS template variables match the data fields');
    console.log('3. Check EmailJS account is active and service is enabled');
    console.log('4. Ensure template is published in EmailJS dashboard');
    console.log('5. Check if domain is whitelisted in EmailJS settings');
  });
