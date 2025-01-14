import React from 'react';
import dynamic from 'next/dynamic';
import Loading from '@/app/loading';

const Users = dynamic(() => import('@/components/users/Users'), {
  loading: () => <Loading />,
});

import { getAllUsers } from '@/backend/utils/server-only-methods';

export const metadata = {
  title: 'Dashboard - Users Info',
};

const AdminUsersPage = async ({ searchParams }) => {
  const users = await getAllUsers(searchParams);

  return <Users data={users} />;
};

export default AdminUsersPage;