import React from 'react';
import dynamic from 'next/dynamic';

const UploadImages = dynamic(
  () => import('@/components/products/UploadImages'),
);

export const metadata = {
  title: 'Dashboard - Add Picture',
};

// eslint-disable-next-line react/prop-types
const HomePage = async ({ params }) => {
  return <UploadImages id={(await params)?.id} />;
};

export default HomePage;
