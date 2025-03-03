import React from 'react';
import { getSingleProduct } from '@/backend/utils/server-only-methods';
import dynamic from 'next/dynamic';
import Loading from '@/app/loading';

const UpdateProduct = dynamic(
  () => import('@/components/products/UpdateProduct'),
  {
    loading: () => <Loading />,
  },
);

// eslint-disable-next-line react/prop-types
const HomePage = async ({ params }) => {
  const singleProduct = await getSingleProduct((await params)?.id);

  return <>{singleProduct && <UpdateProduct data={singleProduct} />}</>;
};

export default HomePage;
