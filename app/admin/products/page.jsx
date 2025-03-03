import React from 'react';
import dynamic from 'next/dynamic';
import Loading from '@/app/loading';

const Products = dynamic(() => import('@/components/products/Products'), {
  loading: () => <Loading />,
});

import { getAllProducts } from '@/backend/utils/server-only-methods';

export const metadata = {
  title: 'Dashboard - Products Info',
};

// eslint-disable-next-line react/prop-types
const ProductsPage = async ({ searchParams }) => {
  const products = await getAllProducts(await searchParams);

  return <Products data={products} />;
};

export default ProductsPage;
