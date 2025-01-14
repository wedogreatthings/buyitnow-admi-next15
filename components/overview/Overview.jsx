'use client';

import dynamic from 'next/dynamic';
import React, { useContext, useEffect, useState } from 'react';
import OrdersFilter from '../orders/OrdersFilter';
import OrderContext from '@/context/OrderContext';
import Loading from '@/app/loading';

const CustomPagination = dynamic(
  () => import('@/components/layouts/CustomPagniation'),
);

const OrdersTable = dynamic(() => import('../orders/table/OrdersTable'), {
  loading: () => <Loading />,
});

import Search from '../layouts/Search';
import SettingsContext from '@/context/SettingsContext';

const OverviewAllStats = dynamic(() => import('./OverviewAllStats'), {
  loading: () => <Loading />,
});

const Overview = ({ orders }) => {
  const { deleteOrder, error, loading, setLoading, clearErrors } =
    useContext(OrderContext);
  const { setDeliveryPrice } = useContext(SettingsContext);

  const [open, setOpen] = useState(false);
  const [openStats, setOpenStats] = useState(false);

  useEffect(() => {
    if (loading || orders !== null) {
      setLoading(false);
      setDeliveryPrice(orders?.deliveryPrice[0]?.deliveryPrice);
    }
  }, [orders]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearErrors();
    }
  }, [error]);

  const deleteHandler = (id) => {
    deleteOrder(id);
  };

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <div className="flex justify-between my-5">
        <h1 className="text-3xl ml-4 font-bold">Business Overview</h1>
        <div className="flex justify-center items-baseline mr-4">
          <button
            onClick={() => setOpenStats((prev) => !prev)}
            className="px-2 inline-block text-blue-500 bg-white shadow-sm border border-blue-600 rounded-md hover:bg-gray-100 cursor-pointer mr-4"
          >
            <i className="fa fa-chart-simple" aria-hidden="true"></i>
          </button>
          <button
            onClick={() => setOpen((prev) => !prev)}
            className="px-2 inline-block text-blue-500 bg-white shadow-sm border border-blue-600 rounded-md hover:bg-gray-100 cursor-pointer mr-4"
          >
            <i className="fa fa-sliders" aria-hidden="true"></i>
          </button>
          <Search setLoading={setLoading} />
        </div>
      </div>
      <hr className="my-2 mx-9" />

      <OverviewAllStats
        open={openStats}
        ordersCount={orders?.ordersCount}
        totalOrdersThisMonth={orders?.totalOrdersThisMonth}
        totalOrdersPaidThisMonth={orders?.totalOrdersPaidThisMonth}
        totalOrdersUnpaidThisMonth={orders?.totalOrdersUnpaidThisMonth}
        bestProductSoldSinceBeginning={
          orders?.descListProductSoldSinceBeginning[0] !== undefined &&
          orders?.descListProductSoldSinceBeginning[0]
        }
        bestCategorySoldSinceBeginning={
          orders?.descListCategorySoldSinceBeginning[0] !== undefined &&
          orders?.descListCategorySoldSinceBeginning[0]
        }
        bestProductSoldThisMonth={
          orders?.descListProductSoldThisMonth[0] !== undefined &&
          orders?.descListProductSoldThisMonth[0]
        }
        userThatBoughtMostSinceBeginning={
          orders?.userThatBoughtMostSinceBeginning
        }
      />

      <hr className="my-2 mx-9" />

      <OrdersFilter open={open} setLoading={setLoading} />

      {loading ? (
        <Loading />
      ) : (
        <OrdersTable
          orders={orders?.orders}
          itemCount={orders?.filteredOrdersCount}
          deleteHandler={deleteHandler}
        />
      )}

      <div className="mb-6">
        <CustomPagination
          resPerPage={orders?.resPerPage}
          listCount={orders?.filteredOrdersCount}
        />
      </div>
    </div>
  );
};

export default Overview;