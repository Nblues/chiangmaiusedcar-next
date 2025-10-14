import React from 'react';

const menuItems = [
  { id: 'overview', icon: '📊', label: 'ภาพรวม', description: 'สถานะระบบทั้งหมด' },
  { id: 'cache', icon: '🗄️', label: 'จัดการ Cache', description: 'Cache & Revalidation' },
  { id: 'seo', icon: '🔍', label: 'SEO Tools', description: 'IndexNow & Sitemap' },
  { id: 'analytics', icon: '📈', label: 'Analytics', description: 'ข้อมูลสถิติ' },
  { id: 'settings', icon: '⚙️', label: 'ตั้งค่า', description: 'การตั้งค่าระบบ' },
];

export default function AdminSidebar({ activeTab, onTabChange }) {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-4 bg-primary text-white">
        <h2 className="font-bold text-lg font-prompt">เมนูจัดการ</h2>
      </div>

      <nav className="p-2">
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`w-full text-left px-4 py-3 rounded-lg mb-1 transition-all duration-200 ${
              activeTab === item.id
                ? 'bg-primary text-white shadow-md'
                : 'hover:bg-gray-100 text-gray-700'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{item.icon}</span>
              <div className="flex-1">
                <p
                  className={`font-semibold font-prompt ${activeTab === item.id ? 'text-white' : 'text-primary'}`}
                >
                  {item.label}
                </p>
                <p
                  className={`text-xs ${activeTab === item.id ? 'text-white/80' : 'text-gray-500'}`}
                >
                  {item.description}
                </p>
              </div>
            </div>
          </button>
        ))}
      </nav>
    </div>
  );
}
