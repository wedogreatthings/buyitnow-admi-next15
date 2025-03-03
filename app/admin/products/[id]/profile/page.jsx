import React from 'react';
import { getSingleProduct } from '@/backend/utils/server-only-methods';
import dynamic from 'next/dynamic';
import Loading from '@/app/loading';

const ProductProfile = dynamic(
  () => import('@/components/products/ProductProfile'),
  {
    loading: () => <Loading />,
  },
);

// eslint-disable-next-line react/prop-types
const ProductProfilePage = async ({ params }) => {
  const singleProduct = await getSingleProduct((await params)?.id);

  return <>{singleProduct && <ProductProfile data={singleProduct} />}</>;
};

export default ProductProfilePage;
