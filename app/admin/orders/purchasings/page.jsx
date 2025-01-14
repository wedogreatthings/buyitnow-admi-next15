import React from 'react';
import dynamic from 'next/dynamic';
import Loading from '@/app/loading';

const OrderPurchased = dynamic(
  () => import('@/components/orders/OrderPurchased'),
  {
    loading: () => <Loading />,
  },
);
import { getOrdersPurchasedData } from '@/backend/utils/server-only-methods';

export const metadata = {
  title: 'Dashboard - Orders Stats',
};

const PurchasingsPage = async () => {
  const ordersPurchasedData = await getOrdersPurchasedData();

  return <OrderPurchased data={ordersPurchasedData} />;
};

export default PurchasingsPage;