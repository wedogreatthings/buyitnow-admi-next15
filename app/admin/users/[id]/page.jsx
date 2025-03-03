import React from 'react';
import dynamic from 'next/dynamic';
import Loading from '@/app/loading';

const UpdateUser = dynamic(() => import('@/components/users/UpdateUser'), {
  loading: () => <Loading />,
});

import { getSingleUser } from '@/backend/utils/server-only-methods';

// eslint-disable-next-line react/prop-types
const AdminUserDetailsPage = async ({ params }) => {
  const data = await getSingleUser((await params)?.id);

  return <UpdateUser user={data?.user} />;
};

export default AdminUserDetailsPage;
