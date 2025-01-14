import React from 'react';
import dynamic from 'next/dynamic';
import { getOrdersInfo } from '@/backend/utils/server-only-methods';
import Loading from '@/app/loading';

const Orders = dynamic(() => import('@/components/orders/Orders'), {
  loading: () => <Loading />,
});

export const metadata = {
  title: 'Dashboard - Orders Info',
};

const OrdersPage = async ({ searchParams }) => {
  const orders = await getOrdersInfo(searchParams);

  return <Orders orders={orders} />;
};

export default OrdersPage;