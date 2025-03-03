/* eslint-disable react/prop-types */
'use client';

import dynamic from 'next/dynamic';
import React, { memo, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Loading from '@/app/loading';

const CustomPagination = dynamic(
  () => import('@/components/layouts/CustomPagniation'),
);
import ProductContext from '@/context/ProductContext';

const ProductsTable = dynamic(() => import('./table/ProductsTable'), {
  loading: () => <Loading />,
});

import Search from '../layouts/Search';
import ProductsFilter from './ProductsFilter';

const Products = memo(({ data }) => {
  const { deleteProduct, error, loading, setLoading, clearErrors } =
    useContext(ProductContext);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (loading) {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearErrors();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  const deleteHandler = (id) => {
    deleteProduct(id);
  };

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <div className="flex justify-between">
        <h1 className="text-3xl my-5 ml-4 font-bold">List of Products</h1>
        <div className="flex justify-center items-baseline mr-4">
          <button
            onClick={() => setOpen((prev) => !prev)}
            className="px-2 inline-block text-blue-500 bg-white shadow-xs border border-blue-600 rounded-md hover:bg-gray-100 cursor-pointer mr-4"
          >
            <i className="fa fa-sliders" aria-hidden="true"></i>
          </button>
          <Search setLoading={setLoading} />
        </div>
      </div>
      <hr className="my-2 mx-9" />

      <ProductsFilter
        open={open}
        setLoading={setLoading}
        categories={data?.categories}
      />
      <hr className="my-2 mx-9" />

      {loading ? (
        <Loading />
      ) : (
        <ProductsTable
          products={data?.products}
          itemCount={data?.filteredProductsCount}
          deleteHandler={deleteHandler}
        />
      )}

      <div className="mb-6">
        <CustomPagination totalPages={data?.totalPages} />
      </div>
    </div>
  );
});

Products.displayName = 'Products';

export default Products;
