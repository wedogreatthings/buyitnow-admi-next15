import React from 'react';
import dynamic from 'next/dynamic';
import Loading from '@/app/loading';

const Settings = dynamic(() => import('@/components/settings/Settings'), {
  loading: () => <Loading />,
});

import {
  getCategoryData,
  getDeliveryPrice,
  getPaymentTypeData,
} from '@/backend/utils/server-only-methods';

export const metadata = {
  title: 'Dashboard - Settings',
};

const SettingsPage = async () => {
  const deliveryPriceData = await getDeliveryPrice();
  const categoryData = await getCategoryData();
  const paymentTypeData = await getPaymentTypeData();

  return (
    <Settings
      dataCategory={categoryData}
      dataPayment={paymentTypeData}
      dataDeliveryPrice={deliveryPriceData}
    />
  );
};

export default SettingsPage;