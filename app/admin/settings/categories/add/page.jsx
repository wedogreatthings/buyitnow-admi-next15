import React from 'react';
import dynamic from 'next/dynamic';
import Loading from '@/app/loading';

const AddCategory = dynamic(() => import('@/components/settings/AddCategory'), {
  loading: () => <Loading />,
});

export const metadata = {
  title: 'Dashboard - Add Category',
};

const AddCategoriesPage = () => {
  return <AddCategory />;
};

export default AddCategoriesPage;