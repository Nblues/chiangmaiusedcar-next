const fs = require('fs');
const content = fs.readFileSync('pages/contact.jsx', 'utf8');

const oldStr = \<div className="bg-white border-2 border-primary/20 hover:border-primary p-6 rounded-xl shadow-lg transition-all duration-300 md:col-span-2 lg:col-span-1">
                <h3 className="font-bold text-primary mb-3 text-lg">เวลาทำการ</h3>
                <p className="text-gray-700 font-medium">จันทร์ - อาทิตย์ เวลา 9:00 - 20:00 น.</p>
              </div>\;

const newStr = \<div className="bg-white border-2 border-primary/20 hover:border-primary p-6 rounded-xl shadow-lg transition-all duration-300 md:col-span-2 lg:col-span-1">
                <h3 className="font-bold text-primary mb-3 text-lg">เวลาทำการ</h3>
                <p className="text-gray-700 font-medium">จันทร์ - อาทิตย์ เวลา 9:00 - 20:00 น.</p>
              </div>
              <div className="bg-white border-2 border-primary/20 hover:border-primary p-6 rounded-xl shadow-lg transition-all duration-300 md:col-span-2 lg:col-span-1">
                <h3 className="font-bold text-primary mb-3 text-lg">อีเมล (Email)</h3>
                <a href="mailto:info@chiangmaiusedcar.com" className="text-blue-600 font-medium hover:text-blue-800 transition-colors">info@chiangmaiusedcar.com</a>
              </div>\;

const updatedContent = content.replace(oldStr, newStr);

fs.writeFileSync('pages/contact.jsx', updatedContent, 'utf8');
console.log('Replacement done.');
