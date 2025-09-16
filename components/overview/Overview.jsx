/* eslint-disable react/prop-types */
'use client';

import dynamic from 'next/dynamic';
import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
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

const Overview = ({ orders, deliveryPrices, categories, paymentTypes }) => {
  const { deleteOrder, error, loading, setLoading, clearErrors } =
    useContext(OrderContext);
  const { setDeliveryPrice, setCategories } = useContext(SettingsContext);

  const [open, setOpen] = useState(false);
  const [openStats, setOpenStats] = useState(false);
  const [openAdditionalData, setOpenAdditionalData] = useState(false);

  useEffect(() => {
    if (loading || orders !== null) {
      setLoading(false);
      setDeliveryPrice(orders?.deliveryPrice[0]?.deliveryPrice);
      setCategories(categories);
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

  const deleteHandler = (id) => {
    deleteOrder(id);
  };

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <div className="flex justify-between my-5">
        <h1 className="text-3xl ml-4 font-bold">Business Overview</h1>
        <div className="flex justify-center items-baseline mr-4">
          <button
            onClick={() => setOpenAdditionalData((prev) => !prev)}
            className="px-2 inline-block text-blue-500 bg-white shadow-xs border border-blue-600 rounded-md hover:bg-gray-100 cursor-pointer mr-4"
          >
            <i className="fa fa-info-circle" aria-hidden="true"></i>
          </button>
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

      {/* Additional Data Section */}
      <div className={`${!openAdditionalData && 'hidden'}`}>
        <div className="flex flex-col mb-7">
          <h4 className="text-lg ml-2 mb-4 font-bold w-full text-center underline">
            Additional Business Information
          </h4>

          {/* Delivery Prices */}
          <div className="mb-4">
            <h5 className="text-md ml-4 font-semibold">Delivery Prices</h5>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 px-4">
              {deliveryPrices?.map((price, index) => (
                <div
                  key={index}
                  className="p-2 bg-blue-100 rounded-md text-center"
                >
                  <span className="font-bold">₦{price.deliveryPrice}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div className="mb-4">
            <h5 className="text-md ml-4 font-semibold">Categories</h5>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 px-4">
              {categories?.map((category, index) => (
                <div
                  key={index}
                  className="p-2 bg-green-100 rounded-md text-center"
                >
                  <span>{category.categoryName}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Types */}
          <div>
            <h5 className="text-md ml-4 font-semibold">Payment Platforms</h5>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 px-4">
              {paymentTypes?.map((payment, index) => (
                <div
                  key={index}
                  className="p-2 bg-purple-100 rounded-md text-center"
                >
                  <span className="block font-bold">{payment.paymentName}</span>
                  <span className="text-sm text-gray-600">
                    {payment.paymentNumber}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

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
        <CustomPagination totalPages={orders?.totalPages} />
      </div>
    </div>
  );
};

export default Overview;
