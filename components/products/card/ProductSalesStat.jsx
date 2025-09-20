/* eslint-disable react/prop-types */
import React from 'react';
import ProductStatCard from './ProductStatCard';
import { arrayHasData } from '@/helpers/helpers';

const ProductSalesStat = ({
  open,
  bestProductSoldSinceBeginning,
  leastProductSoldSinceBeginning,
  bestCategorySoldSinceBeginning,
  leastCategorySoldSinceBeginning,
  bestProductSoldThisMonth,
  leastProductSoldThisMonth,
  bestCategorySoldThisMonth,
  leastCategorySoldThisMonth,
}) => {
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const data = [
    {
      title: 'Best One Sold',
      content: arrayHasData(bestProductSoldSinceBeginning?.productName)
        ? 'None'
        : bestProductSoldSinceBeginning?.productName[0]?.substring(0, 12) +
          '...',
      indication: 'Since the beginning',
      amount: bestProductSoldSinceBeginning?.totalAmount?.toFixed(2),
      quantity: bestProductSoldSinceBeginning?.totalQuantity,
    },
    {
      title: 'Least One Sold',
      content: arrayHasData(leastProductSoldSinceBeginning?.productName)
        ? 'None'
        : leastProductSoldSinceBeginning?.productName[0]?.substring(0, 12) +
          '...',
      indication: 'Since the beginning',
      amount: leastProductSoldSinceBeginning?.totalAmount?.toFixed(2),
      quantity: leastProductSoldSinceBeginning?.totalQuantity,
      color: 'red',
    },
    {
      title: 'Best Category Sold',
      content: bestCategorySoldSinceBeginning?._id?.substring(0, 12) + '...',
      indication: 'Since the beginning',
      amount: bestCategorySoldSinceBeginning?.totalAmount?.toFixed(2),
      quantity: bestCategorySoldSinceBeginning?.totalQuantity,
    },
    {
      title: 'Least Category Sold',
      content: leastCategorySoldSinceBeginning?._id,
      indication: 'Since the beginning',
      amount: leastCategorySoldSinceBeginning?.totalAmount?.toFixed(2),
      quantity: leastCategorySoldSinceBeginning?.totalQuantity,
      color: 'red',
    },
    {
      title: 'Best One Sold This Month',
      content: arrayHasData(bestProductSoldThisMonth?.productName)
        ? 'None'
        : bestProductSoldThisMonth?.productName[0],
      indication: `${currentMonth}/${currentYear}`,
      amount: bestProductSoldThisMonth?.totalAmount?.toFixed(2),
      quantity: bestProductSoldThisMonth?.totalQuantity,
    },
    {
      title: 'Least One Sold This Month',
      content: arrayHasData(leastProductSoldThisMonth?.productName)
        ? 'None'
        : leastProductSoldThisMonth?.productName[0],
      indication: `${currentMonth}/${currentYear}`,
      amount: leastProductSoldThisMonth?.totalAmount?.toFixed(2),
      quantity: leastProductSoldThisMonth?.totalQuantity,
      color: 'red',
    },
    {
      title: 'Best Category Sold This Month',
      content: bestCategorySoldThisMonth?._id,
      indication: `${currentMonth}/${currentYear}`,
      amount: bestCategorySoldThisMonth?.totalAmount?.toFixed(2),
      quantity: bestCategorySoldThisMonth?.totalQuantity,
    },
    {
      title: 'Least Category Sold This Month',
      content: leastCategorySoldThisMonth?._id,
      indication: `${currentMonth}/${currentYear}`,
      amount: leastCategorySoldThisMonth?.totalAmount?.toFixed(2),
      quantity: leastCategorySoldThisMonth?.totalQuantity,
      color: 'red',
    },
  ];

  return (
    <div className={`${!open && 'hidden'} flex flex-wrap justify-evenly`}>
      {data?.map((item, index) => (
        <ProductStatCard
          key={index}
          title={item?.title}
          content={item?.content}
          indication={item?.indication}
          amount={item?.amount}
          quantity={item?.quantity}
          color={item?.color}
        />
      ))}
    </div>
  );
};

export default ProductSalesStat;
