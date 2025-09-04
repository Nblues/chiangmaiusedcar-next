// Example server component with ISR for App Router migration
// This demonstrates how to fetch data server-side with caching

import { Metadata } from 'next';

// Revalidate this page every 2 minutes
export const revalidate = 120;

// Generate metadata server-side
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'หน้าแรก - ครูหนึ่งรถสวย',
    description: 'รถมือสองคุณภาพเชียงใหม่ ราคาดี บริการเป็นกันเอง',
  };
}

// Server-side data fetching with caching
async function getHomeData() {
  try {
    // Example: Fetch from CMS or API with caching
    const response = await fetch(`${process.env.SITE_URL}/api/home-data`, {
      next: { 
        revalidate: 120, // Cache for 2 minutes
        tags: ['home', 'featured-cars'] // Tag for selective revalidation
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch home data');
    }
    
    return response.json();
  } catch (error) {
    console.error('Error fetching home data:', error);
    // Return fallback data
    return {
      title: 'ครูหนึ่งรถสวย - รถมือสองเชียงใหม่คุณภาพ',
      featuredCars: [],
      promotions: []
    };
  }
}

// Server Component - no 'use client' needed
export default async function HomePage() {
  // This runs on the server, reducing client-side JS
  const homeData = await getHomeData();
  
  return (
    <main className="min-h-screen bg-white">
      {/* Hero section */}
      <section className="relative bg-gradient-to-r from-primary to-blue-800 text-white py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {homeData.title}
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            รถมือสองคุณภาพ ราคาดี บริการเป็นกันเอง
          </p>
          
          {/* Search form - this could be a Client Component if interactive */}
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 max-w-4xl">
            <form className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <select className="form-select bg-white text-gray-900">
                <option>เลือกยี่ห้อ</option>
                <option>Toyota</option>
                <option>Honda</option>
                <option>Nissan</option>
              </select>
              <select className="form-select bg-white text-gray-900">
                <option>เลือกรุ่น</option>
              </select>
              <select className="form-select bg-white text-gray-900">
                <option>ช่วงราคา</option>
                <option>ต่ำกว่า 300,000</option>
                <option>300,000 - 500,000</option>
                <option>500,000 - 800,000</option>
                <option>มากกว่า 800,000</option>
              </select>
              <button type="submit" className="btn-primary">
                ค้นหา
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Featured cars section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-primary">
            รถแนะนำ
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {homeData.featuredCars?.map((car: any) => (
              <div key={car.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                {/* Car image */}
                <div className="aspect-video bg-gray-200">
                  {/* Use next/image with proper optimization */}
                  <img 
                    src={car.image || '/images/placeholder-car.jpg'} 
                    alt={car.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                
                {/* Car details */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{car.title}</h3>
                  <p className="text-2xl font-bold text-accent mb-2">
                    ฿{car.price?.toLocaleString()}
                  </p>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>ปี: {car.year}</p>
                    <p>เลขไมล์: {car.mileage?.toLocaleString()} กม.</p>
                    <p>เกียร์: {car.transmission}</p>
                  </div>
                  <button className="mt-4 w-full btn-secondary">
                    ดูรายละเอียด
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Promotions section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-primary">
            โปรโมชั่นพิเศษ
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {homeData.promotions?.map((promo: any) => (
              <div key={promo.id} className="bg-gradient-to-r from-accent to-yellow-500 text-white rounded-lg p-8">
                <h3 className="text-2xl font-bold mb-4">{promo.title}</h3>
                <p className="text-lg mb-6">{promo.description}</p>
                <button className="btn-primary bg-white text-accent hover:bg-gray-100">
                  เรียนรู้เพิ่มเติม
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
