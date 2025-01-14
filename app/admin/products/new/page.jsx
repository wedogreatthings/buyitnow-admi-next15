import React from 'react';
import dynamic from 'next/dynamic';
import Loading from '@/app/loading';

const NewProduct = dynamic(() => import('@/components/products/NewProduct'), {
  loading: () => <Loading />,
});

export const metadata = {
  title: 'Dashboard - Add New Product',
};

const NewProductPage = () => {
  return <NewProduct />;
};

export default NewProductPage;