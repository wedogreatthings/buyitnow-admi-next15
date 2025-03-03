import React from 'react';
import dynamic from 'next/dynamic';
import Loading from '../loading';

const Overview = dynamic(() => import('@/components/overview/Overview'), {
  loading: () => <Loading />,
});

import { getAllOrders } from '@/backend/utils/server-only-methods';

export const metadata = {
  title: 'Dashboard - Overview',
};

// eslint-disable-next-line react/prop-types
const HomePage = async ({ searchParams }) => {
  const orders = await getAllOrders(await searchParams);

  return <Overview orders={orders} />;
};

export default HomePage;
