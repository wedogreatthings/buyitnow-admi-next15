/* eslint-disable react/prop-types */
'use client';

import dynamic from 'next/dynamic';
import Loading from '@/app/loading';
import React, { useState } from 'react';

const UserPurchasingsStats = dynamic(
  () => import('./card/UserPurchasingsStats'),
  {
    loading: () => <Loading />,
  },
);

const UsersWithMostPurchasesThisMonthTable = dynamic(
  () => import('./table/UsersWithMostPurchasesThisMonthTable'),
  {
    loading: () => <Loading />,
  },
);
import { arrayHasData } from '@/helpers/helpers';

const UsersPurchasings = ({ data }) => {
  const [open, setOpen] = useState(false);

  const totalAmout = arrayHasData(data?.usersThatBoughtMostThisMonth)
    ? 0
    : data?.usersThatBoughtMostThisMonth?.reduce(
        (acc, currentValue) => acc + currentValue?.totalPurchases,
        0,
      );

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <div className="flex justify-between my-5">
        <h1 className="text-3xl ml-4 font-bold">Users Purchasings Stats</h1>
        <button
          title="Statistiques"
          onClick={() => setOpen((prev) => !prev)}
          className="px-2 inline-block text-blue-500 bg-white shadow-xs border border-blue-600 rounded-md hover:bg-gray-100 cursor-pointer my-1 mr-4"
        >
          <i className="fa fa-chart-simple" aria-hidden="true"></i>
        </button>
      </div>
      <hr className="my-2 mx-9" />

      <UserPurchasingsStats
        open={open}
        totalUsersThatBought={data?.totalUsersThatBought}
        totalUsersThatBoughtThisMonth={data?.totalUsersThatBoughtThisMonth}
        userThatBoughtMostSinceBeginning={
          data?.userThatBoughtMostSinceBeginning
        }
        usersThatBoughtMostThisMonth={
          data?.usersThatBoughtMostThisMonth !== null &&
          data?.usersThatBoughtMostThisMonth?.length !== undefined &&
          data?.usersThatBoughtMostThisMonth[0]
        }
      />

      <hr className="my-2 mx-9" />

      <div className="flex mb-3 justify-between">
        <h1 className="text-sm ml-4 font-bold">
          Users with the most purchasings This Month
        </h1>
        <h4 className="mr-4 text-sm font-semibold">
          Total Amount: ${totalAmout.toFixed(2)}
        </h4>
      </div>
      <UsersWithMostPurchasesThisMonthTable
        usersThatBoughtMostThisMonth={data?.usersThatBoughtMostThisMonth}
      />
    </div>
  );
};

export default UsersPurchasings;
