import React from 'react';
import dynamic from 'next/dynamic';
import Loading from '@/app/loading';

const UserProfile = dynamic(() => import('@/components/users/UserProfile'), {
  loading: () => <Loading />,
});

import { getSingleUser } from '@/backend/utils/server-only-methods';

const UserProfilePage = async ({ params }) => {
  const data = await getSingleUser((await params)?.id);

  return <UserProfile data={data} />;
};

export default UserProfilePage;