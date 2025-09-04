import React from 'react';
import { getAllCars } from '../../../lib/shopify';
import AllCarsComponent from '../../all-cars';

export default function AllCarsPage({ cars, currentPage, totalPages }) {
  // Next.js will handle fallback in getStaticPaths; avoid useRouter on server.
  return <AllCarsComponent cars={cars} currentPage={currentPage} totalPages={totalPages} />;
}

export async function getStaticPaths() {
  // สร้าง paths สำหรับ 10 หน้าแรก
  const paths = Array.from({ length: 10 }, (_, i) => ({
    params: { page: (i + 1).toString() },
  }));

  return {
    paths,
    fallback: 'blocking', // สำหรับหน้าที่ไม่ได้ pre-generate
  };
}

export async function getStaticProps({ params }) {
  try {
    const page = parseInt(params.page) || 1;
    const carsPerPage = 8;
    const allCars = await getAllCars();

    const startIndex = (page - 1) * carsPerPage;
    const endIndex = startIndex + carsPerPage;
    const cars = allCars.slice(startIndex, endIndex);
    const totalPages = Math.ceil(allCars.length / carsPerPage);

    // ถ้าหน้าไม่มีข้อมูล return 404
    if (page > totalPages || page < 1) {
      return { notFound: true };
    }

    return {
      props: {
        cars,
        currentPage: page,
        totalPages,
      },
      revalidate: 300, // ISR: อัปเดตทุก 5 นาที
    };
  } catch (error) {
    console.error('Error in getStaticProps:', error);
    return { notFound: true };
  }
}
