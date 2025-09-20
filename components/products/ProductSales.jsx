/* eslint-disable react/prop-types */
'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import Loading from '@/app/loading';

const ProductSalesStat = dynamic(() => import('./card/ProductSalesStat'), {
  loading: () => <Loading />,
});

const ListProductSoldThisMonth = dynamic(
  () => import('./table/ListProductSoldThisMonth'),
  {
    loading: () => <Loading />,
  },
);

import { arrayHasData } from '@/helpers/helpers';

const ProductSales = ({ data }) => {
  const [open, setOpen] = useState(false);

  const totalAmout = arrayHasData(data?.descListProductSoldThisMonth)
    ? 0
    : data?.descListProductSoldThisMonth?.reduce(
        (acc, currentValue) => acc + currentValue?.totalAmount,
        0,
      );

  const totalQuantity = arrayHasData(data?.descListProductSoldThisMonth)
    ? 0
    : data?.descListProductSoldThisMonth?.reduce(
        (acc, currentValue) => acc + currentValue?.totalQuantity,
        0,
      );

  const getArrayLastIndex = (arrayLength) => {
    const lastIndex = arrayLength - 1;
    return lastIndex;
  };

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <div className="flex justify-between my-5">
        <h1 className="text-3xl ml-4 font-bold">Products Sales Stats</h1>
        <button
          title="Statistiques"
          onClick={() => setOpen((prev) => !prev)}
          className="px-2 inline-block text-blue-500 bg-white shadow-xs border border-blue-600 rounded-md hover:bg-gray-100 cursor-pointer my-1 mr-4"
        >
          <i className="fa fa-chart-simple" aria-hidden="true"></i>
        </button>
      </div>
      <hr className="my-2 mx-9" />

      <ProductSalesStat
        open={open}
        bestProductSoldSinceBeginning={
          data?.descListProductSoldSinceBeginning[0] !== undefined &&
          data?.descListProductSoldSinceBeginning[0]
        }
        leastProductSoldSinceBeginning={
          data?.descListProductSoldSinceBeginning[
            getArrayLastIndex(data?.descListProductSoldSinceBeginning.length)
          ] !== undefined &&
          data?.descListProductSoldSinceBeginning[
            getArrayLastIndex(data?.descListProductSoldSinceBeginning.length)
          ]
        }
        bestCategorySoldSinceBeginning={
          data?.descListCategorySoldSinceBeginning[0] !== undefined &&
          data?.descListCategorySoldSinceBeginning[0]
        }
        leastCategorySoldSinceBeginning={
          data?.descListCategorySoldSinceBeginning[
            getArrayLastIndex(data?.descListCategorySoldSinceBeginning.length)
          ] !== undefined &&
          data?.descListCategorySoldSinceBeginning[
            getArrayLastIndex(data?.descListCategorySoldSinceBeginning.length)
          ]
        }
        bestProductSoldThisMonth={
          data?.descListProductSoldThisMonth[0] !== undefined &&
          data?.descListProductSoldThisMonth[0]
        }
        leastProductSoldThisMonth={
          data?.descListProductSoldThisMonth[
            getArrayLastIndex(data?.descListProductSoldThisMonth.length)
          ] !== undefined &&
          data?.descListProductSoldThisMonth[
            getArrayLastIndex(data?.descListProductSoldThisMonth.length)
          ]
        }
        bestCategorySoldThisMonth={
          data?.descListCategorySoldThisMonth[0] !== undefined &&
          data?.descListCategorySoldThisMonth[0]
        }
        leastCategorySoldThisMonth={
          data?.descListCategorySoldThisMonth[
            getArrayLastIndex(data?.descListCategorySoldThisMonth.length)
          ] !== undefined &&
          data?.descListCategorySoldThisMonth[
            getArrayLastIndex(data?.descListCategorySoldThisMonth.length)
          ]
        }
      />

      <hr className="my-2 mx-9" />

      <div className="flex mb-3 justify-between">
        <h1 className="text-sm ml-4 font-bold">
          Products generating that most revenue This Month
        </h1>
        <div className="flex">
          <h4 className="mr-4 text-sm font-semibold">
            Total Amount: ${totalAmout.toFixed(2)}
          </h4>
          <h4 className="mr-4 text-sm font-semibold">
            Total Quantity: {totalQuantity}
          </h4>
        </div>
      </div>
      <ListProductSoldThisMonth
        productSoldThisMonth={data?.descListProductSoldThisMonth}
      />
    </div>
  );
};

export default ProductSales;
