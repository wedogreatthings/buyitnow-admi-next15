/* eslint-disable react/prop-types */
import React from 'react';
import { arrayHasData } from '@/helpers/helpers';
import Image from 'next/image';

const UsersWithMostPurchasesThisMonthTable = ({
  usersThatBoughtMostThisMonth,
}) => {
  return arrayHasData(usersThatBoughtMostThisMonth) ? (
    <div className="w-full">
      <p className="font-bold text-xl text-center">
        No Users purchasings this month
      </p>
    </div>
  ) : (
    <table className="w-full text-sm text-left">
      <thead className="text-l text-gray-700 uppercase">
        <tr>
          <th scope="col" className="px-6 py-3">
            Name
          </th>
          <th scope="col" className="px-6 py-3">
            Email
          </th>
          <th scope="col" className="px-6 py-3">
            Phone
          </th>
          <th scope="col" className="px-6 py-3">
            Amount
          </th>
        </tr>
      </thead>
      <tbody>
        {usersThatBoughtMostThisMonth?.map((user) => (
          <tr key={user?._id} className="bg-white">
            <td className="flex items-end px-6 py-2">
              <Image
                className="w-7 h-7 rounded-full mr-4"
                src={
                  user?.result[0]?.avatar
                    ? user?.result[0]?.avatar?.url
                    : '/images/default.png'
                }
                alt={user?.result[0]?.name}
                width={7}
                height={7}
              />
              <span>{user?.result[0]?.name}</span>
            </td>
            <td className="px-6 py-2">{user?.result[0]?.email}</td>
            <td className="px-6 py-2">{user?.result[0]?.phone}</td>
            <td className="px-6 py-2">$ {user?.totalPurchases.toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UsersWithMostPurchasesThisMonthTable;
