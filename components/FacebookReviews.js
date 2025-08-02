import React, { useEffect, useState } from 'react';

export default function FacebookReviews() {
  const [showReviews, setShowReviews] = useState(false);

  useEffect(() => {
    setShowReviews(true); // render เฉพาะ client
  }, []);

  if (!showReviews) return null;

  return (
    <section aria-label="รีวิวลูกค้าจริง Facebook" className="w-full">
      <h2 className="text-2xl md:text-3xl font-bold text-primary text-center mb-6 font-prompt">
        รีวิวจากลูกค้าจริง
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
        <iframe
          src="https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2Foonmaxx%2Fposts%2Fpfbid0YcUhHBngfrZmqz4SWWF5rKkVFzrTSMyw4dzayqhbcnEFviMCEwWPc9vhqcQ5Fnzvl&show_text=true&width=500"
          width="100%"
          height="152"
          style={{ border: 'none', overflow: 'hidden', maxWidth: 500 }}
          scrolling="no"
          frameBorder="0"
          allowFullScreen={true}
          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
          title="Facebook Review 1"
          loading="lazy"
        ></iframe>
        {/* เพิ่ม iframe อื่นๆ ได้ตามต้องการ */}
      </div>
    </section>
  );
}
