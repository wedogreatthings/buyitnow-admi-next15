import React from 'react';
import dynamic from 'next/dynamic';
import Loading from '@/app/loading';

const AddPaymentType = dynamic(
  () => import('@/components/settings/AddPaymentType'),
  {
    loading: () => <Loading />,
  },
);

export const metadata = {
  title: 'Dashboard - Add Payment Type',
};

const AddPaymentPage = () => {
  return <AddPaymentType />;
};

export default AddPaymentPage;