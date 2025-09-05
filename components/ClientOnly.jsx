import { useState, useEffect } from 'react';

/**
 * ClientOnly - Higher Order Component
 * ป้องกัน hydration mismatch โดยการ render component เฉพาะบน client
 * ใช้สำหรับ wrap component ที่มีปัญหา hydration
 */
export default function ClientOnly({
  children,
  fallback = null,
  className = '',
  loadingText = 'กำลังโหลด...',
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // แสดง fallback หรือ loading ระหว่างรอ client mount
  if (!mounted) {
    if (fallback) return fallback;

    return (
      <div className={`flex items-center justify-center p-4 ${className}`}>
        <div className="text-gray-500 text-sm">{loadingText}</div>
      </div>
    );
  }

  return children;
}
