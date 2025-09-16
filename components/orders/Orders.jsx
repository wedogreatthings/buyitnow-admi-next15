/* eslint-disable react/prop-types */
'use client';

import React, { memo, useContext, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Loading from '@/app/loading';

const CustomPagination = dynamic(
  () => import('@/components/layouts/CustomPagniation'),
);

import OrderContext from '@/context/OrderContext';

const OrdersTable = dynamic(() => import('./table/OrdersTable'), {
  loading: () => <Loading />,
});

import Search from '../layouts/Search';
import OrdersFilter from './OrdersFilter';
import { toast } from 'react-toastify';

const OrderInfoStats = dynamic(() => import('./card/OrderInfoStats'), {
  loading: () => <Loading />,
});

const Orders = memo(({ orders }) => {
  const { error, loading, setLoading, clearErrors } = useContext(OrderContext);
  const [open, setOpen] = useState(false);
  const [openStats, setOpenStats] = useState(false);

  useEffect(() => {
    if (loading) {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orders]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearErrors();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);
  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <div className="flex justify-between">
        <h1 className="text-3xl my-5 ml-4 font-bold">List of Orders</h1>
        <div className="flex justify-center items-baseline mr-4">
          <button
            onClick={() => setOpenStats((prev) => !prev)}
            className="px-2 inline-block text-blue-500 bg-white shadow-xs border border-blue-600 rounded-md hover:bg-gray-100 cursor-pointer mr-4"
          >
            <i className="fa fa-chart-simple" aria-hidden="true"></i>
          </button>
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

      <OrderInfoStats
        open={openStats}
        ordersCount={orders?.ordersCount}
        totalOrdersThisMonth={orders?.totalOrdersThisMonth}
        deliveredOrdersCount={orders?.deliveredOrdersCount}
        totalOrdersDeliveredThisMonth={orders?.totalOrdersDeliveredThisMonth}
      />

      <hr className="my-2 mx-9" />

      <OrdersFilter open={open} setLoading={setLoading} />

      {loading ? (
        <Loading />
      ) : (
        <OrdersTable
          orders={orders?.orders}
          itemCount={orders?.filteredOrdersCount}
        />
      )}

      {orders?.totalPages > 1 && (
        <div className="mb-6">
          <CustomPagination totalPages={orders?.totalPages} />
        </div>
      )}
    </div>
  );
});

Orders.displayName = 'Orders';

export default Orders;
