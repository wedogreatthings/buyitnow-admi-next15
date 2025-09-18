/* eslint-disable react/prop-types */
'use client';

import dynamic from 'next/dynamic';
import Loading from '@/app/loading';
import React, { useContext, useState } from 'react';

const OrderPurchasedStats = dynamic(
  () => import('./card/OrderPurchasedStats'),
  {
    loading: () => <Loading />,
  },
);

const OrdersPaidList = dynamic(() => import('./table/OrdersPaidList'), {
  loading: () => <Loading />,
});

const OrdersUnpaidList = dynamic(() => import('./table/OrdersUnpaidList'), {
  loading: () => <Loading />,
});

import { arrayHasData } from '@/helpers/helpers';
import SettingsContext from '@/context/SettingsContext';

const OrderPurchased = ({ data }) => {
  const { deliveryPrice } = useContext(SettingsContext);
  const [open, setOpen] = useState(false);

  // Calcul des montants totaux avec totalAmount au lieu de amountPaid
  const totalAmountUnpaid = arrayHasData(data?.listOrdersUnpaidThisMonth)
    ? 0
    : data?.listOrdersUnpaidThisMonth?.reduce(
        (acc, currentValue) => acc + (currentValue?.totalAmount || 0),
        0,
      );

  const totalAmountPaid = arrayHasData(data?.listOrdersPaidThisMonth)
    ? 0
    : data?.listOrdersPaidThisMonth?.reduce(
        (acc, currentValue) => acc + (currentValue?.totalAmount || 0),
        0,
      );

  // Calcul du nombre total d'articles
  const totalItemsUnpaid = arrayHasData(data?.listOrdersUnpaidThisMonth)
    ? 0
    : data?.listOrdersUnpaidThisMonth?.reduce(
        (acc, currentValue) =>
          acc +
          (currentValue?.itemCount ||
            currentValue?.orderItems?.reduce(
              (sum, item) => sum + item.quantity,
              0,
            ) ||
            0),
        0,
      );

  const totalItemsPaid = arrayHasData(data?.listOrdersPaidThisMonth)
    ? 0
    : data?.listOrdersPaidThisMonth?.reduce(
        (acc, currentValue) =>
          acc +
          (currentValue?.itemCount ||
            currentValue?.orderItems?.reduce(
              (sum, item) => sum + item.quantity,
              0,
            ) ||
            0),
        0,
      );

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <div className="flex justify-between my-5">
        <h1 className="text-3xl ml-4 font-bold">Orders Purchased Stats</h1>
        <button
          title="Statistiques"
          onClick={() => setOpen((prev) => !prev)}
          className="px-2 inline-block text-blue-500 bg-white shadow-xs border border-blue-600 rounded-md hover:bg-gray-100 cursor-pointer my-1 mr-4"
        >
          <i className="fa fa-chart-simple" aria-hidden="true"></i>
        </button>
      </div>
      <hr className="my-2 mx-9" />

      <OrderPurchasedStats
        open={open}
        ordersPaidCount={data?.ordersPaidCount}
        ordersUnpaidCount={data?.ordersUnpaidCount}
        processingOrdersCount={data?.processingOrdersCount}
        shippedOrdersCount={data?.shippedOrdersCount}
        totalOrdersPaidThisMonth={data?.totalOrdersPaidThisMonth}
        totalOrdersUnpaidThisMonth={data?.totalOrdersUnpaidThisMonth}
        totalOrdersProcessingThisMonth={data?.totalOrdersProcessingThisMonth}
        totalOrdersShippedThisMonth={data?.totalOrdersShippedThisMonth}
      />

      <hr className="my-2 mx-9" />

      <div className="flex justify-between items-center">
        <h1 className="text-lg ml-4 font-bold text-green-600">
          List of Orders Paid This Month
        </h1>
        <div className="mr-4 text-sm">
          <p className="font-semibold text-green-600">
            Total Amount: ${totalAmountPaid.toFixed(2)}
          </p>
          <p className="text-gray-600">
            Total Items: {totalItemsPaid} • Orders:{' '}
            {data?.listOrdersPaidThisMonth?.length || 0}
          </p>
        </div>
      </div>

      <OrdersPaidList
        listOrdersPaidThisMonth={data?.listOrdersPaidThisMonth}
        deliveryPrice={deliveryPrice}
      />

      <hr className="my-2 mx-9" />

      <div className="flex justify-between items-center">
        <h1 className="text-lg ml-4 font-bold text-red-500">
          List of Orders Unpaid This Month
        </h1>
        <div className="mr-4 text-sm">
          <p className="font-semibold text-red-500">
            Total Amount: ${totalAmountUnpaid.toFixed(2)}
          </p>
          <p className="text-gray-600">
            Total Items: {totalItemsUnpaid} • Orders:{' '}
            {data?.listOrdersUnpaidThisMonth?.length || 0}
          </p>
        </div>
      </div>

      <OrdersUnpaidList
        listOrdersUnpaidThisMonth={data?.listOrdersUnpaidThisMonth}
        deliveryPrice={deliveryPrice}
      />
    </div>
  );
};

export default OrderPurchased;
