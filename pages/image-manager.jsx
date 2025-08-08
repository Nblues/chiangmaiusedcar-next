import React, { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import SEO from '../components/SEO';

// Dynamic import เพื่อป้องกัน SSR issues
const ImageManager = dynamic(() => Promise.resolve(ImageManagerComponent), { ssr: false });

function ImageManagerComponent() {
  const [uploadStatus, setUploadStatus] = useState('');
  const [processing, setProcessing] = useState(false);
  const [results, setResults] = useState(null);
  const [batchProcessing, setBatchProcessing] = useState(false);

  // Upload และแปลงรูปเดี่ยว
  const handleImageUpload = useCallback(async event => {
    const file = event.target.files[0];
    if (!file) return;

    setProcessing(true);
    setUploadStatus('กำลังอัปโหลดและแปลงรูป...');

    const formData = new FormData();
    formData.append('image', file);
    formData.append('quality', '85');
    formData.append('responsive', 'true');
    formData.append('context', 'car');

    try {
      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setUploadStatus('✅ แปลงรูปสำเร็จ!');
        setResults(result.data);
      } else {
        setUploadStatus(`❌ เกิดข้อผิดพลาด: ${result.error}`);
      }
    } catch (error) {
      setUploadStatus(`❌ การอัปโหลดล้มเหลว: ${error.message}`);
    } finally {
      setProcessing(false);
    }
  }, []);

  // ประมวลผลรูปทั้งหมดในโฟลเดอร์
  const handleBatchProcess = useCallback(async () => {
    setBatchProcessing(true);
    setUploadStatus('กำลังประมวลผลรูปทั้งหมด...');

    try {
      const response = await fetch('/api/process-images', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_IMAGE_PROCESS_TOKEN || 'demo-token'}`,
        },
        body: JSON.stringify({
          directory: 'public',
          recursive: true,
          deleteOriginals: false,
          generateResponsive: true,
          quality: 85,
          context: 'car',
        }),
      });

      const result = await response.json();

      if (result.data?.success) {
        setUploadStatus(`✅ ประมวลผลเสร็จสิ้น! แปลง ${result.data.processed} ไฟล์`);
        setResults(result.data);
      } else {
        setUploadStatus(`❌ เกิดข้อผิดพลาด: ${result.error}`);
      }
    } catch (error) {
      setUploadStatus(`❌ การประมวลผลล้มเหลว: ${error.message}`);
    } finally {
      setBatchProcessing(false);
    }
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 font-prompt">
          🖼️ ระบบจัดการรูปภาพอัตโนมัติ
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 font-prompt">📤 อัปโหลดรูปใหม่</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="dropzone-file"
                  className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg
                      className="w-8 h-8 mb-4 text-gray-500"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 16"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                      />
                    </svg>
                    <p className="mb-2 text-sm text-gray-500 font-prompt">
                      <span className="font-semibold">คลิกเพื่ือเลือกไฟล์</span> หรือลากไฟล์มาวาง
                    </p>
                    <p className="text-xs text-gray-500 font-prompt">PNG, JPG, JPEG (MAX. 10MB)</p>
                  </div>
                  <input
                    id="dropzone-file"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={processing}
                  />
                </label>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2 font-prompt">ฟีเจอร์อัตโนมัติ:</h3>
                <ul className="text-sm text-blue-800 space-y-1 font-prompt">
                  <li>✅ แปลงเป็น WebP อัตโนมัติ</li>
                  <li>✅ สร้างขนาดต่างๆ (Responsive)</li>
                  <li>✅ ปรับปรุงคุณภาพ (85%)</li>
                  <li>✅ สร้าง Alt Text อัตโนมัติ</li>
                  <li>✅ ลดขนาดไฟล์ถึง 70%</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Batch Processing Section */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 font-prompt">
              ⚡ ประมวลผลรูปทั้งหมด
            </h2>
            <div className="space-y-4">
              <p className="text-gray-600 font-prompt">
                แปลงรูปทั้งหมดในโฟลเดอร์ public เป็น WebP รูปแบบ responsive
              </p>

              <button
                onClick={handleBatchProcess}
                disabled={batchProcessing}
                className="w-full bg-primary hover:bg-primary-600 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:bg-gray-400 font-prompt"
              >
                {batchProcessing ? '🔄 กำลังประมวลผล...' : '🚀 เริ่มประมวลผล'}
              </button>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <h3 className="font-semibold text-amber-900 mb-2 font-prompt">คำเตือน:</h3>
                <ul className="text-sm text-amber-800 space-y-1 font-prompt">
                  <li>⚠️ การประมวลผลอาจใช้เวลานาน</li>
                  <li>⚠️ ตรวจสอบพื้นที่เก็บข้อมูล</li>
                  <li>⚠️ สำรองข้อมูลก่อนดำเนินการ</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Status Section */}
        {uploadStatus && (
          <div className="mt-8">
            <div
              className={`p-4 rounded-lg font-prompt ${
                uploadStatus.includes('✅')
                  ? 'bg-green-50 border border-green-200 text-green-800'
                  : uploadStatus.includes('❌')
                    ? 'bg-red-50 border border-red-200 text-red-800'
                    : 'bg-blue-50 border border-blue-200 text-blue-800'
              }`}
            >
              {uploadStatus}
            </div>
          </div>
        )}

        {/* Results Section */}
        {results && (
          <div className="mt-8 bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 font-prompt">📊 ผลลัพธ์</h3>

            {results.converted && results.converted.length > 0 && (
              <div className="mb-4">
                <h4 className="font-semibold text-gray-800 mb-2 font-prompt">ไฟล์ที่แปลงแล้ว:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {results.converted.map((item, index) => (
                    <div key={index} className="bg-white p-3 rounded-lg border">
                      <p className="text-sm font-medium text-gray-900 font-prompt">
                        {item.url ? `📁 ${item.url}` : `📁 ${item.webp || item.original}`}
                      </p>
                      {item.width && (
                        <p className="text-xs text-gray-600 font-prompt">📐 ขนาด: {item.width}px</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {results.altText && (
              <div className="mb-4">
                <h4 className="font-semibold text-gray-800 mb-2 font-prompt">Alt Text:</h4>
                <p className="text-sm text-gray-600 bg-white p-3 rounded-lg border font-prompt">
                  {results.altText}
                </p>
              </div>
            )}

            {results.processed !== undefined && (
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-green-100 p-3 rounded-lg">
                  <div className="text-2xl font-bold text-green-800">{results.processed}</div>
                  <div className="text-sm text-green-600 font-prompt">แปลงสำเร็จ</div>
                </div>
                <div className="bg-red-100 p-3 rounded-lg">
                  <div className="text-2xl font-bold text-red-800">{results.failed}</div>
                  <div className="text-sm text-red-600 font-prompt">ล้มเหลว</div>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <div className="text-2xl font-bold text-blue-800">{results.cleaned}</div>
                  <div className="text-sm text-blue-600 font-prompt">ลบไฟล์เดิม</div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Information Section */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4 font-prompt">💡 ข้อมูลเพิ่มเติม</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2 font-prompt">ข้อดีของ WebP:</h4>
              <ul className="text-sm text-gray-600 space-y-1 font-prompt">
                <li>🔹 ไฟล์เล็กกว่า JPEG ถึง 25-35%</li>
                <li>🔹 รองรับความโปร่งใส</li>
                <li>🔹 คุณภาพดีกว่าในขนาดเดียวกัน</li>
                <li>🔹 รองรับ Google PageSpeed</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2 font-prompt">คำสั่ง CLI:</h4>
              <div className="bg-gray-800 text-green-400 p-3 rounded text-xs font-mono">
                <div>pnpm process-images</div>
                <div>pnpm process-images:responsive</div>
                <div>pnpm cleanup-images</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ImageManagerPage() {
  return (
    <>
      <SEO
        title="ระบบจัดการรูปภาพ | ครูหนึ่งรถสวย"
        description="ระบบแปลงรูปภาพเป็น WebP อัตโนมัติ ปรับขนาด สร้าง responsive images และสร้าง alt text"
        keywords="image optimization, webp conversion, responsive images, รูปภาพเว็บ"
        url="/image-manager"
        type="website"
      />
      <main className="min-h-screen bg-gray-50 py-8">
        <ImageManager />
      </main>
    </>
  );
}
