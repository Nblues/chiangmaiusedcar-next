import React, { useState } from 'react';
import A11yImage from './A11yImage';

// Helper to clean up excessive hashtags and the TikTok music note for a cleaner UI and SEO title
const cleanVideoTitle = rawTitle => {
  if (!rawTitle) return 'คลิปวิดีโอ TikTok รีวิวรถ';
  // 1. Remove the "♬ เสียงต้นฉบับ..." text added by TikTok
  let cleaned = rawTitle.replace(/♬.*/g, '');
  // 2. Remove inline hashtags to make it look like a clean sentence
  cleaned = cleaned.replace(/#\S+/g, '');
  return cleaned.trim();
};

export default function TikTokFeed({ videos }) {
  const [selectedVideoUrl, setSelectedVideoUrl] = useState(null);

  if (!videos || videos.length === 0) return null;

  const displayVideos = videos.slice(0, 8);

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'รีวิวส่งมอบรถ และสาระดีๆ จาก TikTok',
    itemListElement: displayVideos.map((video, index) => {
      const cleanTitle = cleanVideoTitle(video.title);
      const url = video.url || 'https://www.tiktok.com/@krunueng_usedcar';
      return {
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'VideoObject',
          name: cleanTitle,
          description: video.content_text || cleanTitle,
          thumbnailUrl: [
            video.image || 'https://www.chiangmaiusedcar.com/herobanner/outdoorbanner-480w.webp',
          ],
          uploadDate: video.date_published || new Date().toISOString(),
          contentUrl: url,
          embedUrl: url,
        },
      };
    }),
  };

  return (
    <section className="py-16 bg-white w-full">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <h2 className="text-2xl xs:text-3xl sm:text-4xl font-extrabold text-primary font-prompt tracking-tight">
            <span className="block sm:inline">รีวิวส่งมอบรถ</span>{' '}
            <span className="block sm:inline mt-1 sm:mt-0">และสาระดีๆ จาก TikTok</span>
          </h2>
          <p className="mt-3 sm:mt-4 text-sm sm:text-lg text-gray-600 font-prompt leading-relaxed px-2">
            ติดตามคลิปอัปเดตรถเข้าใหม่ การส่งมอบรถให้ลูกค้า และความรู้เรื่องรถมือสอง
          </p>
        </div>

        {/* Feed Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {displayVideos.map((video, index) => {
            const title = cleanVideoTitle(video.title);
            const url = video.url || 'https://www.tiktok.com/@krunueng_usedcar';
            const rawImageUrl = video.image || null;
            const imageUrl = rawImageUrl
              ? `/api/tiktok-image?url=${encodeURIComponent(rawImageUrl)}`
              : '/herobanner/outdoorbanner-480w.webp';

            return (
              <button
                key={video.id || index}
                onClick={() => setSelectedVideoUrl(url)}
                type="button"
                className="group flex flex-col text-left bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
                aria-label={`ดูวิดีโอ TikTok: ${title.slice(0, 50)}...`}
              >
                {/* Thumbnail container (9:16 aspect ratio for TikTok) */}
                <div className="relative w-full aspect-[9/16] bg-black overflow-hidden flex-shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    referrerPolicy="no-referrer"
                    src={imageUrl}
                    alt={`หน้าปกวิดีโอ TikTok: ${title.slice(0, 100)}`}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                    loading="lazy"
                  />
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-14 h-14 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20 group-hover:bg-primary/90 transition-colors shadow-lg">
                      <svg
                        className="w-6 h-6 text-white ml-1"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>

                  {/* TikTok Icon indicator */}
                  <div className="absolute top-3 left-3 w-8 h-8 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1.04-.1z" />
                    </svg>
                  </div>
                </div>

                {/* Content / Title */}
                <div className="p-4 flex-1 flex flex-col justify-start bg-white">
                  <h3 className="text-sm sm:text-sm font-semibold text-gray-800 font-prompt line-clamp-3 leading-snug group-hover:text-primary transition-colors">
                    {title}
                  </h3>
                  {video.date_published && (
                    <p className="mt-2 text-xs text-gray-400 font-prompt mt-auto">
                      {new Date(video.date_published).toLocaleDateString('th-TH', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* View All Button */}
        <div className="mt-10 sm:mt-12 text-center">
          <a
            href="https://www.tiktok.com/@krunueng_usedcar"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-6 py-3 sm:px-8 sm:py-3.5 border border-transparent text-sm sm:text-base font-bold rounded-full text-white bg-gray-900 hover:bg-black hover:scale-105 transition-all shadow-md hover:shadow-lg font-prompt group"
          >
            <svg
              className="w-5 h-5 mr-2 group-hover:animate-pulse"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1.04-.1z" />
            </svg>
            ดูคลิปทั้งหมดบน TikTok
          </a>
        </div>
      </div>

      {/* Video Modal Overlay */}
      {selectedVideoUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={e => {
            e.preventDefault();
            setSelectedVideoUrl(null);
          }}
        >
          <div
            className="relative w-full max-w-[360px] h-[80vh] max-h-[750px] bg-black rounded-2xl overflow-hidden shadow-2xl flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            {/* Close Header */}
            <div className="flex justify-between items-center px-4 py-3 bg-gray-900 z-10 border-b border-gray-800">
              <span className="text-white font-prompt font-semibold text-sm">
                วิดีโอจากครูหนึ่งรถสวย
              </span>
              <button
                onClick={() => setSelectedVideoUrl(null)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                aria-label="ปิดวิดีโอ"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </div>

            {/* Video Iframe container (scrollable space inside if needed) */}
            <div className="flex-1 bg-black overflow-hidden relative">
              {(() => {
                const videoIdMatch = selectedVideoUrl.match(/\/video\/(\d+)/);
                const videoId = videoIdMatch ? videoIdMatch[1] : null;

                if (videoId) {
                  return (
                    <iframe
                      src={`https://www.tiktok.com/embed/v2/${videoId}?lang=th-TH&autoplay=1`}
                      className="w-full h-full border-none"
                      allowFullScreen
                      title="TikTok Video Player"
                      allow="autoplay; encrypted-media;"
                    ></iframe>
                  );
                } else {
                  return (
                    <div className="flex flex-col items-center justify-center h-full p-6 text-center text-white">
                      <p className="mb-4 font-prompt text-gray-300 text-sm">
                        วิดีโอนี้ดูเหมือนจะไม่มีรูปแบบ ID ปกติ
                      </p>
                      <a
                        href={selectedVideoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-2 bg-primary rounded-full hover:bg-primary-600 transition-colors font-prompt font-semibold"
                      >
                        เปิดดูในแอป TikTok
                      </a>
                    </div>
                  );
                }
              })()}
            </div>

            {/* CTA Button below video */}
            <div className="p-4 bg-gray-900 border-t border-gray-800 z-10">
              <a
                href="https://lin.ee/8ugfzstD"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-full py-3 space-x-2 text-white bg-[#00B900] rounded-xl font-bold font-prompt shadow-lg hover:bg-[#009900] transition-colors"
                onClick={e => e.stopPropagation()}
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 10.304c0-5.369-5.383-9.738-12-9.738-6.616 0-12 4.369-12 9.738 0 4.814 3.55 8.888 8.498 9.59.394.085.928.261 1.066.593.125.302.04.721.019.988-.027.34-.143 1.025-.143 1.025s-.044.269.135.378c.178.109.431-.059.431-.059l.86-.532c.86-.532 3.031-1.954 4.148-3.056 2.879-2.83 4.986-5.834 4.986-8.927zM9.544 13.914h-1.931a.576.576 0 0 1-.575-.575V8.528A.576.576 0 0 1 7.613 7.95h1.931a.575.575 0 0 1 .575.575v4.814a.576.576 0 0 1-.575.572zm3.834 0h-1.93a.576.576 0 0 1-.575-.575V8.528A.576.576 0 0 1 11.447 7.95h1.931a.577.577 0 0 1 .575.575v4.814a.577.577 0 0 1-.575.572zm4.568 0h-.843a.577.577 0 0 1-.575-.575V9.658l-1.32 1.34c-.118.12-.303.136-.441.037a.57.57 0 0 1-.035-.802l1.637-1.684a.578.578 0 0 1 .412-.178.576.576 0 0 1 .575.57h.59c.318 0 .576.258.576.576v4.815c0 .318-.258.582-.576.582z" />
                </svg>
                <span>สอบถามทัก LINE</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
