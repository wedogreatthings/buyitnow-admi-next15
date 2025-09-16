/* eslint-disable react/prop-types */
import React from 'react';
import { arrayHasData } from '@/helpers/helpers';
import Link from 'next/link';

const OrdersPaidList = ({ listOrdersPaidThisMonth }) => {
  // Fonction pour formater les dates
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Fonction pour obtenir la couleur du statut de commande
  const getOrderStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return 'text-green-600 bg-green-100';
      case 'Shipped':
        return 'text-blue-600 bg-blue-100';
      case 'Processing':
        return 'text-orange-600 bg-orange-100';
      case 'Returned':
        return 'text-purple-600 bg-purple-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return arrayHasData(listOrdersPaidThisMonth) ? (
    <div className="w-full py-8">
      <div className="text-center">
        <div className="mx-auto w-16 h-16 mb-4 text-green-300">
          <svg fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
          </svg>
        </div>
        <p className="font-bold text-xl text-green-600">
          No Paid Orders This Month
        </p>
        <p className="text-gray-500 mt-2">
          Paid orders will appear here when available.
        </p>
      </div>
    </div>
  ) : (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left bg-white">
        <thead className="text-xs text-gray-700 uppercase bg-green-50 border-b-2 border-green-200">
          <tr>
            <th scope="col" className="px-4 py-3 font-semibold">
              Order Number
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              Total Amount
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              Items
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              Payment Method
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              Shipping Type
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              Order Status
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              Created At
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              Paid At
            </th>
            <th scope="col" className="px-4 py-3 font-semibold text-center">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {listOrdersPaidThisMonth?.map((item) => (
            <tr
              key={item?._id}
              className="bg-white hover:bg-green-25 transition-colors"
            >
              <td className="px-4 py-3 font-mono text-sm font-medium text-green-700">
                {item?.orderNumber || `#${item?._id?.slice(-8)}`}
              </td>
              <td className="px-4 py-3 font-semibold text-green-600">
                ${item?.totalAmount?.toFixed(2) || '0.00'}
              </td>
              <td className="px-4 py-3 text-center">
                <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                  {item?.itemCount ||
                    item?.orderItems?.reduce(
                      (sum, orderItem) => sum + orderItem.quantity,
                      0,
                    ) ||
                    0}
                </span>
              </td>
              <td className="px-4 py-3">
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                  {item?.paymentInfo?.typePayment?.toUpperCase() || 'N/A'}
                </span>
              </td>
              <td className="px-4 py-3">
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    item?.shippingInfo === undefined
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  {item?.shippingInfo === undefined ? 'Pickup' : 'Delivery'}
                </span>
              </td>
              <td className="px-4 py-3">
                {item?.shippingInfo !== undefined ? (
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${getOrderStatusColor(item?.orderStatus)}`}
                  >
                    {item?.orderStatus}
                  </span>
                ) : (
                  <span className="text-gray-400 italic text-xs">N/A</span>
                )}
              </td>
              <td className="px-4 py-3 text-gray-600 text-xs">
                {formatDate(item?.createdAt)}
              </td>
              <td className="px-4 py-3 text-green-600 text-xs font-medium">
                {formatDate(item?.paidAt || item?.updatedAt)}
              </td>
              <td className="px-4 py-3 text-center">
                <Link
                  href={`/admin/orders/${item?._id}`}
                  className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-yellow-700 bg-yellow-100 border border-yellow-300 rounded-md hover:bg-yellow-200 hover:border-yellow-400 transition-colors duration-200"
                  title={`View order ${item?.orderNumber || item?._id}`}
                >
                  <i className="fa fa-eye mr-1" aria-hidden="true"></i>
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Résumé en bas de tableau */}
      <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex justify-between items-center text-sm">
          <div className="text-green-700">
            <span className="font-semibold">
              {listOrdersPaidThisMonth?.length || 0}
            </span>{' '}
            paid orders this month
          </div>
          <div className="text-green-700 font-semibold">
            Total Revenue: $
            {listOrdersPaidThisMonth
              ?.reduce((acc, order) => acc + (order?.totalAmount || 0), 0)
              .toFixed(2) || '0.00'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersPaidList;
