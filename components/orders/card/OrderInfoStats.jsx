/* eslint-disable react/prop-types */
'use client';

import React from 'react';
import OrderStatCard from './OrderStatCard';

const OrderInfoStats = ({
  open,
  ordersCount,
  totalOrdersThisMonth,
  deliveredOrdersCount,
  totalOrdersDeliveredThisMonth,
}) => {
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const data = [
    {
      title: 'All',
      content: `${ordersCount === undefined || ordersCount === null ? '0 order' : `${ordersCount} order(s)`}`,
      indication: 'Since the beginning',
    },
    {
      title: 'This Month',
      content: `${totalOrdersThisMonth[0]?.totalOrders === undefined || totalOrdersThisMonth[0]?.totalOrders === null ? '0 order' : `${totalOrdersThisMonth[0]?.totalOrders} order(s)`}`,
      indication: `${currentMonth}/${currentYear}`,
    },
    {
      title: 'Total Delivered',
      content: `${deliveredOrdersCount === undefined ? ' 0 order' : `${deliveredOrdersCount} order(s)`}`,
      indication: 'Since the beginning',
    },
    {
      title: 'Delivered this Month',
      content: `${totalOrdersDeliveredThisMonth[0]?.totalOrdersDelivered === undefined ? ' 0 order' : `${totalOrdersDeliveredThisMonth[0]?.totalOrdersDelivered} order(s)`}`,
      indication: `${currentMonth}/${currentYear}`,
    },
  ];
  return (
    <div className={`${!open && 'hidden'} flex justify-evenly`}>
      {data?.map((item, index) => (
        <OrderStatCard
          key={index}
          title={item?.title}
          content={item?.content}
          indication={item?.indication}
          color={item?.color}
        />
      ))}
    </div>
  );
};

export default OrderInfoStats;
