import React from 'react';
import dynamic from 'next/dynamic';
import Loading from '../loading';

const Overview = dynamic(() => import('@/components/overview/Overview'), {
  loading: () => <Loading />,
});

import {
  getAllOrders,
  getCategoryData,
  getDeliveryPrice,
  getPaymentTypeData,
} from '@/backend/utils/server-only-methods';

export const metadata = {
  title: 'Dashboard - Overview',
};

// eslint-disable-next-line react/prop-types
const HomePage = async ({ searchParams }) => {
  const orders = await getAllOrders(await searchParams);
  const deliveryPriceData = await getDeliveryPrice();
  const categoryData = await getCategoryData();
  const paymentTypeData = await getPaymentTypeData();

  console.log('HomePage Orders:', orders);

  return (
    <Overview
      orders={orders}
      deliveryPrices={deliveryPriceData?.deliveryPrice}
      categories={categoryData?.categories}
      paymentTypes={paymentTypeData?.paymentTypes}
    />
  );
};

export default HomePage;
