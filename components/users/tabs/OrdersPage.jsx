/* eslint-disable react/prop-types */
'use client';

import React from 'react';
import Link from 'next/link';

const OrdersPage = ({ orders }) => {
  // Vérifier si orders est un array valide avec des données
  const hasOrders = Array.isArray(orders) && orders.length > 0;
  const orderCount = hasOrders ? orders.length : 0;

  // Fonction pour obtenir la couleur du statut de paiement
  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'unpaid':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'refunded':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'cancelled':
        return 'text-gray-600 bg-gray-50 border-gray-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  // Fonction pour obtenir la couleur du statut de commande
  const getOrderStatusColor = (status) => {
    switch (status) {
      case 'Unpaid':
        return 'text-red-500';
      case 'Processing':
        return 'text-black-500';
      case 'Shipped':
        return 'text-blue-500';
      case 'Delivered':
        return 'text-green-500';
      case 'Cancelled':
        return 'text-gray-500';
      case 'Returned':
        return 'text-orange-500';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg ml-4 font-bold">
          All recent orders made by this user
        </h1>
        <p className="mr-4 font-bold text-lg">{orderCount} Order(s)</p>
      </div>

      {orderCount === 0 && (
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
              This user hasn&apos;t placed any orders yet.
            </p>
          </div>
        </div>
      )}

      {hasOrders && (
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
                <tr
                  key={order?._id}
                  className="bg-white hover:bg-gray-50 transition-colors"
                >
                  <td className="px-3 py-2 font-mono text-sm">
                    {order?.orderNumber || order?._id}
                  </td>
                  <td className="px-3 py-2 font-semibold">
                    ${order?.totalAmount?.toFixed(2) || '0.00'}
                  </td>
                  <td className="px-3 py-2">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium border capitalize ${getPaymentStatusColor(order?.paymentStatus)}`}
                    >
                      {order?.paymentStatus || 'N/A'}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    {order?.paymentInfo?.typePayment?.toUpperCase() || 'N/A'}
                  </td>
                  <td className="px-3 py-2">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        order?.shippingInfo === undefined
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {order?.shippingInfo === undefined
                        ? 'Pickup'
                        : 'Delivery'}
                    </span>
                  </td>
                  {order?.shippingInfo !== undefined ? (
                    <td
                      className={`px-3 py-2 font-medium ${getOrderStatusColor(order?.orderStatus)}`}
                    >
                      {order?.orderStatus}
                    </td>
                  ) : (
                    <td className="px-3 py-2 text-gray-400 italic">None</td>
                  )}
                  <td className="px-3 py-2">
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/orders/${order?._id}`}
                        className="px-2 py-2 inline-block text-yellow-600 bg-white shadow-sm border border-gray-200 rounded-md hover:bg-yellow-50 hover:border-yellow-300 cursor-pointer transition-colors"
                        aria-label={`Edit order ${order?.orderNumber || order?._id}`}
                        title="Edit order"
                      >
                        <i className="fa fa-pencil" aria-hidden="true"></i>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
