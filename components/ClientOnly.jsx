import { useState, useEffect } from 'react';

/**
 * ClientOnly - Higher Order Component
 * ป้องกัน hydration mismatch โดยการ render component เฉพาะบน client
 * ใช้สำหรับ wrap component ที่มีปัญหา hydration
 */
export default function ClientOnly({ children, fallback = null }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // แสดง fallback หรือ loading ระหว่างรอ client mount
  if (!mounted) {
    return fallback || null;
  }

  return children;
}
