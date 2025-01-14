import React from 'react';
import dynamic from 'next/dynamic';
import Loading from '@/app/loading';

const AddDeliveryPrice = dynamic(
  () => import('@/components/settings/AddDeliveryPrice'),
  {
    loading: () => <Loading />,
  },
);

export const metadata = {
  title: 'Dashboard - Add Delivery Price',
};

const AddDeliveryPricePage = () => {
  return <AddDeliveryPrice />;
};

export default AddDeliveryPricePage;