/* eslint-disable react/prop-types */
import React from 'react';
import Link from 'next/link';
import PaymentBox from './PaymentBox';

const OrderItem = ({ order }) => {
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
    <tr className="bg-white hover:bg-gray-50 transition-colors">
      <td className="px-3 py-2 font-mono text-sm">
        {order?.orderNumber || order?._id}
      </td>
      <td className="px-3 py-2 font-semibold">
        ${order?.totalAmount?.toFixed(2) || '0.00'}
      </td>
      <PaymentBox order={order} />
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
          {order?.shippingInfo === undefined ? 'Pickup' : 'Delivery'}
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
  );
};

export default OrderItem;
