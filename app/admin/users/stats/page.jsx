import React from 'react';
import dynamic from 'next/dynamic';
import Loading from '@/app/loading';

const UsersPurchasings = dynamic(
  () => import('@/components/users/UsersPurchasings'),
  {
    loading: () => <Loading />,
  },
);

import { getUsersPurchasingsData } from '@/backend/utils/server-only-methods';

export const metadata = {
  title: 'Dashboard - Users Purchasings Stats',
};

const UsersPurchasingsPage = async () => {
  const usersPurchasingsData = await getUsersPurchasingsData();

  return <UsersPurchasings data={usersPurchasingsData} />;
};

export default UsersPurchasingsPage;