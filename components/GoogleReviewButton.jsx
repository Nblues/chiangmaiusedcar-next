import React from 'react';
import { Star } from 'lucide-react';

const GoogleReviewButton = ({ reviewUrl = 'https://g.page/r/Ccu3ZhBBWbWcEBM/review' }) => {
  return (
    <a
      href={reviewUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="relative flex items-center justify-center w-full px-5 py-4 sm:px-8 sm:py-4 bg-white hover:bg-slate-50 shadow-[0_12px_24px_rgba(0,0,0,0.08)] sm:shadow-[0_12px_30px_rgb(0,0,0,0.06)] border-[1.5px] border-slate-200/80 rounded-[1.25rem] sm:rounded-full hover:shadow-[0_15px_40px_-5px_rgba(66,133,244,0.15)] hover:-translate-y-1 hover:border-blue-300 transition-all duration-500 ease-out group overflow-hidden"
    >
      <div className="absolute inset-0 -translate-x-[150%] bg-gradient-to-r from-transparent via-blue-50/50 to-transparent group-hover:translate-x-[150%] transition-transform duration-[1.5s] ease-in-out pointer-events-none" />
      <svg
        className="w-[32px] h-[32px] sm:w-[38px] sm:h-[38px] mr-3 sm:mr-5 drop-shadow-sm group-hover:scale-110 transition-transform duration-500 ease-out z-10 shrink-0"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          fill="#4285F4"
        />
        <path
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          fill="#34A853"
        />
        <path
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          fill="#FBBC05"
        />
        <path
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          fill="#EA4335"
        />
      </svg>

      <div className="text-left flex flex-col z-10 items-start">
        <span className="text-[12px] sm:text-[13px] font-semibold text-slate-500 uppercase tracking-[0.1em] sm:tracking-[0.14em] group-hover:text-blue-600 transition-colors duration-300 font-sans">
          รีวิวให้เราบน
        </span>
        <div className="flex items-center gap-2 sm:gap-3 mt-0.5 sm:mt-1">
          <span className="text-[20px] sm:text-[22px] font-bold text-slate-800 tracking-tight leading-none group-hover:text-slate-900 font-sans whitespace-nowrap">
            Google
          </span>

          <div className="flex text-yellow-400 gap-[1.5px] sm:gap-0.5 opacity-95 group-hover:opacity-100 transition-opacity">
            <Star className="w-[16px] h-[16px] sm:w-[18px] sm:h-[18px] fill-current drop-shadow-sm" />
            <Star className="w-[16px] h-[16px] sm:w-[18px] sm:h-[18px] fill-current drop-shadow-sm" />
            <Star className="w-[16px] h-[16px] sm:w-[18px] sm:h-[18px] fill-current drop-shadow-sm" />
            <Star className="w-[16px] h-[16px] sm:w-[18px] sm:h-[18px] fill-current drop-shadow-sm" />
            <Star className="w-[16px] h-[16px] sm:w-[18px] sm:h-[18px] fill-current drop-shadow-sm" />
          </div>
        </div>
      </div>
    </a>
  );
};

export default GoogleReviewButton;
