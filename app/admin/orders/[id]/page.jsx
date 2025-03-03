import React from 'react';
import dynamic from 'next/dynamic';
import { getSingleOrder } from '@/backend/utils/server-only-methods';
import Loading from '@/app/loading';

const UpdateOrder = dynamic(() => import('@/components/orders/UpdateOrder'), {
  loading: () => <Loading />,
});

// eslint-disable-next-line react/prop-types
const OrderDetailsPage = async ({ params }) => {
  const data = await getSingleOrder((await params)?.id);

  return <UpdateOrder order={data?.order} />;
};

export default OrderDetailsPage;
