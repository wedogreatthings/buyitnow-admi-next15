/* eslint-disable react/prop-types */
'use client';

import React from 'react';
import { arrayHasData } from '@/helpers/helpers';
import Link from 'next/link';

const OrdersPage = ({ orders }) => {
  return (
    <div>
      <div className="flex justify-between my-4">
        <h1 className="text-lg ml-4 font-bold">
          All recent orders including this product
        </h1>
        <p className="mr-4 font-bold text-lg">{orders?.length} Order(s)</p>
      </div>
      {arrayHasData(orders) ? (
        <div className="w-full mt-8">
          <p className="font-bold text-xl text-center">No Orders Found</p>
        </div>
      ) : (
        <table className="w-full text-sm text-left">
          <thead className="text-l text-gray-700 uppercase">
            <tr>
              <th scope="col" className="px-6 py-3">
                ID
              </th>
              <th scope="col" className="px-6 py-3">
                Date
              </th>
              <th scope="col" className="px-6 py-3">
                Payment Status
              </th>
              <th scope="col" className="px-6 py-3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {orders?.map((order) => (
              <tr className="bg-white" key={order?._id}>
                <td className="px-6 py-2">{order?._id}</td>
                <td className="px-6 py-2">
                  {order?.details?.date.substring(0, 10)}
                </td>
                <td
                  className={`px-6 py-2 ${order?.details?.payment === 'unpaid' ? 'text-red-500' : 'text-green-500'}`}
                >
                  {order?.details?.payment}
                </td>
                <td className="px-6 py-2">
                  <div>
                    <Link
                      href={`/admin/orders/${order?._id}`}
                      className="px-2 py-2 inline-block text-yellow-600 bg-white shadow-xs border border-gray-200 rounded-md hover:bg-gray-100 cursor-pointer mr-2"
                    >
                      <i className="fa fa-pencil" aria-hidden="true"></i>
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OrdersPage;
