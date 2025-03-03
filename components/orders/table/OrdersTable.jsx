/* eslint-disable react/prop-types */
import React from 'react';
import { arrayHasData } from '@/helpers/helpers';
import OrderItem from './OrderItem';

const OrdersTable = ({ orders, itemCount, deleteHandler }) => {
  return (
    <div>
      <div className="flex justify-between">
        <h1 className="text-lg ml-4 font-bold">Latest Orders from Clients</h1>
        <p className="mr-4 font-bold text-lg">{itemCount} Order(s)</p>
      </div>
      {itemCount === 0 ? (
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
                Amount Paid
              </th>
              <th scope="col" className="px-6 py-3">
                Payment Status
              </th>
              <th scope="col" className="px-6 py-3">
                Platform
              </th>
              <th scope="col" className="px-6 py-3">
                Shipping Status
              </th>
              <th scope="col" className="px-6 py-3">
                Order Status
              </th>
              <th scope="col" className="px-6 py-3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {!arrayHasData(orders) ? (
              orders?.map((order) => (
                <OrderItem
                  key={order?._id}
                  order={order}
                  deleteHandler={deleteHandler}
                />
              ))
            ) : (
              <OrderItem
                key={orders?._id}
                order={orders}
                deleteHandler={deleteHandler}
              />
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OrdersTable;
