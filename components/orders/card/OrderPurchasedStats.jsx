/* eslint-disable react/prop-types */
import React from 'react';
import OrderStatCard from './OrderStatCard';

const OrderPurchasedStats = ({
  open,
  ordersPaidCount,
  ordersUnpaidCount,
  processingOrdersCount,
  shippedOrdersCount,
  totalOrdersPaidThisMonth,
  totalOrdersUnpaidThisMonth,
  totalOrdersProcessingThisMonth,
  totalOrdersShippedThisMonth,
}) => {
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const data = [
    {
      title: 'All Paid',
      content: `${ordersPaidCount === undefined ? '0 order' : `${ordersPaidCount} order(s)`}`,
      indication: 'Since the beginning',
    },
    {
      title: 'Orders Unpaid',
      content: `${ordersUnpaidCount === undefined ? '0 order' : `${ordersUnpaidCount} order(s)`}`,
      indication: 'Since the beginning',
      color: 'red',
    },
    {
      title: 'Orders Processing',
      content: `${processingOrdersCount === undefined ? '0 order' : `${processingOrdersCount} order(s)`}`,
      indication: 'Since the beginning',
      color: 'red',
    },
    {
      title: 'Orders Shipped',
      content: `${shippedOrdersCount === undefined ? '0 order' : `${shippedOrdersCount} order(s)`}`,
      indication: 'Since the beginning',
    },
    {
      title: 'Paid This Month',
      content: `${totalOrdersPaidThisMonth[0] === undefined ? '0 order' : `${totalOrdersPaidThisMonth[0]?.totalOrdersPaid} order(s)`}`,
      indication: `${currentMonth}/${currentYear}`,
    },
    {
      title: 'Unpaid This Month',
      content: `${totalOrdersUnpaidThisMonth[0] === undefined ? '0 order' : `${totalOrdersUnpaidThisMonth[0]?.totalOrdersUnpaid} order(s)`}`,
      indication: `${currentMonth}/${currentYear}`,
      color: 'red',
    },
    {
      title: 'Processing This Month',
      content: `${totalOrdersProcessingThisMonth[0] === undefined ? '0 order' : `${totalOrdersProcessingThisMonth[0]?.totalOrdersProcessing} order(s)`}`,
      indication: `${currentMonth}/${currentYear}`,
      color: 'red',
    },
    {
      title: 'Shipped This Month',
      content: `${totalOrdersShippedThisMonth[0] === undefined ? '0 order' : `${totalOrdersShippedThisMonth[0]?.totalOrdersShipped} order(s)`}`,
      indication: `${currentMonth}/${currentYear}`,
    },
  ];
  return (
    <div className={`${!open && 'hidden'} flex flex-wrap justify-evenly`}>
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

export default OrderPurchasedStats;
