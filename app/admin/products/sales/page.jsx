import React from 'react';
import dynamic from 'next/dynamic';
import Loading from '@/app/loading';

const ProductSales = dynamic(
  () => import('@/components/products/ProductSales'),
  {
    loading: () => <Loading />,
  },
);
import { getProductSalesData } from '@/backend/utils/server-only-methods';

export const metadata = {
  title: 'Dashboard - Products Sales Stat',
};

const ProductsSalesPage = async () => {
  const productSalesData = await getProductSalesData();

  return <ProductSales data={productSalesData} />;
};

export default ProductsSalesPage;