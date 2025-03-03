/* eslint-disable react/prop-types */
'use client';

import React from 'react';
import { arrayHasData } from '@/helpers/helpers';
import OverviewStatCard from './OverviewStatCard';

const OverviewAllStats = ({
  open,
  ordersCount,
  totalOrdersThisMonth,
  totalOrdersPaidThisMonth,
  totalOrdersUnpaidThisMonth,
  bestProductSoldSinceBeginning,
  bestCategorySoldSinceBeginning,
  bestProductSoldThisMonth,
  userThatBoughtMostSinceBeginning,
}) => {
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const dataOrders = [
    {
      title: 'All Orders',
      content: `${ordersCount === undefined || ordersCount === null ? '0 order' : `${ordersCount} order(s)`}`,
      indication: 'Since the beginning',
    },
    {
      title: 'Orders for this Month',
      content: `${totalOrdersThisMonth[0]?.totalOrders === undefined || totalOrdersThisMonth[0]?.totalOrders === null ? '0 order' : `${totalOrdersThisMonth[0]?.totalOrders} order(s)`}`,
      indication: `${currentMonth}/${currentYear}`,
    },
    {
      title: 'Orders Paid This Month',
      content: `${totalOrdersPaidThisMonth[0] === undefined ? '0 order' : `${totalOrdersPaidThisMonth[0]?.totalOrdersPaid} order(s)`}`,
      indication: `${currentMonth}/${currentYear}`,
    },
    {
      title: 'Orders Unpaid This Month',
      content: `${totalOrdersUnpaidThisMonth[0] === undefined ? '0 order' : `${totalOrdersUnpaidThisMonth[0]?.totalOrdersUnpaid} order(s)`}`,
      indication: `${currentMonth}/${currentYear}`,
      color: 'red',
    },
  ];

  const dataOthers = [
    {
      title: 'Best Product Sold',
      content: arrayHasData(bestProductSoldSinceBeginning?.productName)
        ? 'None'
        : bestProductSoldSinceBeginning?.productName[0].substring(0, 12) +
          '...',
      indication: 'Since the beginning',
      amount: bestProductSoldSinceBeginning?.totalAmount,
      quantity: bestProductSoldSinceBeginning?.totalQuantity,
    },
    {
      title: 'Best Category Sold',
      content: bestCategorySoldSinceBeginning?._id,
      indication: 'Since the beginning',
      amount: bestCategorySoldSinceBeginning?.totalAmount,
      quantity: bestCategorySoldSinceBeginning?.totalQuantity,
    },
    {
      title: 'Best Product Sold',
      content: arrayHasData(bestProductSoldThisMonth?.productName)
        ? 'None'
        : bestProductSoldThisMonth?.productName[0].substring(0, 12) + '...',
      indication: `${currentMonth}/${currentYear}`,
      amount: bestProductSoldThisMonth?.totalAmount,
      quantity: bestProductSoldThisMonth?.totalQuantity,
    },
    {
      title: 'Best Client',
      content: `${
        arrayHasData(userThatBoughtMostSinceBeginning)
          ? 'No one'
          : `${
              userThatBoughtMostSinceBeginning[0]?.result[0]?.name.substring(
                0,
                12,
              ) + '...'
            }`
      }`,
      indication: 'Since the beginning',
    },
  ];

  return (
    <div className={`${!open && 'hidden'}`}>
      <div className="flex flex-col mb-7">
        <h4 className="text-lg ml-2 mb-4 font-bold w-full text-center underline">
          Orders Stats
        </h4>
        <div className="flex justify-evenly">
          {dataOrders?.map((item, index) => (
            <OverviewStatCard
              key={index}
              title={item?.title}
              content={item?.content}
              indication={item?.indication}
              color={item?.color}
            />
          ))}
        </div>
      </div>
      <div className="flex flex-col">
        <h4 className="text-lg ml-2 mb-4 font-bold w-full text-center underline">
          Products/Users Stats
        </h4>
        <div className="flex justify-evenly">
          {dataOthers?.map((item, index) => (
            <OverviewStatCard
              key={index}
              title={item?.title}
              content={item?.content}
              indication={item?.indication}
              color={item?.color}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default OverviewAllStats;
