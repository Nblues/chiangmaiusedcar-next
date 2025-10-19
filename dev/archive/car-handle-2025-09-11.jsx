// Backup of pages/car/[handle].jsx on 2025-09-11
// For restore: replace pages/car/[handle].jsx with this file

// --- START FULL BACKUP ---

import React, { useState } from 'react';
import Head from 'next/head';
import SEO from '../../components/SEO';
import Breadcrumb from '../../components/Breadcrumb';
import SimilarCars from '../../components/SimilarCars';
import { getAllCars } from '../../lib/shopify.mjs';
import { safeGet, safeFormatPrice } from '../../lib/safeFetch';
import Link from 'next/link';
import A11yImage from '../../components/A11yImage';
import { carAlt } from '../../utils/a11y';

export default function CarPage({ car, similarCars }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleEnquireClick = () => {
    setIsLoading(true);
    // Handle the enquiry click, e.g., open a form or redirect
  };

  return (
    <div>
      <Head>
        <title>{car.title} - Car Details</title>
        <meta name="description" content={`Details about the ${car.title}`} />
        <link rel="canonical" href={`https://www.example.com/car/${car.handle}`} />
      </Head>
      <SEO
        title={car.title}
        description={`Check out this ${car.title} available at our dealership.`}
        url={`https://www.example.com/car/${car.handle}`}
        image={car.images[0]?.src}
      />
      <Breadcrumb
        links={[
          { title: 'Home', url: '/' },
          { title: 'Cars', url: '/cars' },
          { title: car.title, url: `/car/${car.handle}` },
        ]}
      />
      <div className="car-details">
        <h1>{car.title}</h1>
        <A11yImage src={car.images[0]?.src} alt={carAlt(car.title)} width={800} height={600} />
        <p>{car.description}</p>
        <p>Price: {safeFormatPrice(car.price)}</p>
        <button onClick={handleEnquireClick} disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Enquire Now'}
        </button>
      </div>
      <SimilarCars cars={similarCars} />
    </div>
  );
}

export async function getStaticPaths() {
  const cars = await getAllCars();
  const paths = cars.map(car => ({
    params: { handle: car.handle },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const cars = await getAllCars();
  const car = cars.find(car => car.handle === params.handle);
  const similarCars = cars.filter(c => c.id !== car.id).slice(0, 4);

  return {
    props: {
      car,
      similarCars,
    },
  };
}

// (Paste full content from pages/car/[handle].jsx below this line)
