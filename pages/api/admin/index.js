// Admin route protection middleware
export default function handler(req, res) {
  // ส่งกลับ 404 สำหรับ route ที่ไม่มี admin access
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested page does not exist',
  });
}
