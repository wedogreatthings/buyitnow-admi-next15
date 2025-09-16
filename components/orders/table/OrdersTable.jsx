/* eslint-disable react/prop-types */
import React from 'react';
import OrderItem from './OrderItem';

const OrdersTable = ({ orders, itemCount }) => {
  // Vérifier si orders est un array valide avec des données
  const hasOrders = Array.isArray(orders) && orders.length > 0;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg ml-4 font-bold">Latest Orders from Clients</h1>
        <p className="mr-4 font-bold text-lg">{itemCount || 0} Order(s)</p>
      </div>

      {itemCount === 0 && (
        <div className="w-full mt-8 py-12 bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="mx-auto w-24 h-24 mb-4 text-gray-300">
              <svg fill="currentColor" viewBox="0 0 24 24">
                <path d="M7 4V2C7 1.45 7.45 1 8 1H16C16.55 1 17 1.45 17 2V4H20C20.55 4 21 4.45 21 5S20.55 6 20 6H19V19C19 20.1 18.1 21 17 21H7C5.9 21 5 20.1 5 19V6H4C3.45 6 3 5.55 3 5S3.45 4 4 4H7ZM9 3V4H15V3H9ZM7 6V19H17V6H7Z" />
                <path d="M9 8V17H11V8H9ZM13 8V17H15V8H13Z" />
              </svg>
            </div>
            <p className="font-bold text-xl text-gray-600 mb-2">
              No Orders Found
            </p>
            <p className="text-gray-500">
              Orders will appear here when customers place them.
            </p>
          </div>
        </div>
      )}

      {hasOrders ? (
        <div className="overflow-x-auto shadow-sm border border-gray-200 rounded-lg">
          <table className="w-full text-sm text-left bg-white">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
              <tr>
                <th scope="col" className="px-6 py-4 font-semibold">
                  Order Number
                </th>
                <th scope="col" className="px-6 py-4 font-semibold">
                  Total Amount
                </th>
                <th scope="col" className="px-6 py-4 font-semibold">
                  Payment Status
                </th>
                <th scope="col" className="px-6 py-4 font-semibold">
                  Payment Method
                </th>
                <th scope="col" className="px-6 py-4 font-semibold">
                  Shipping Type
                </th>
                <th scope="col" className="px-6 py-4 font-semibold">
                  Order Status
                </th>
                <th scope="col" className="px-6 py-4 font-semibold text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order) => (
                <OrderItem key={order?._id} order={order} />
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="overflow-x-auto shadow-sm border border-gray-200 rounded-lg">
          <table className="w-full text-sm text-left bg-white">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
              <tr>
                <th scope="col" className="px-6 py-4 font-semibold">
                  Order Number
                </th>
                <th scope="col" className="px-6 py-4 font-semibold">
                  Total Amount
                </th>
                <th scope="col" className="px-6 py-4 font-semibold">
                  Payment Status
                </th>
                <th scope="col" className="px-6 py-4 font-semibold">
                  Payment Method
                </th>
                <th scope="col" className="px-6 py-4 font-semibold">
                  Shipping Type
                </th>
                <th scope="col" className="px-6 py-4 font-semibold">
                  Order Status
                </th>
                <th scope="col" className="px-6 py-4 font-semibold text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <OrderItem key={orders?._id} order={orders} />
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrdersTable;
