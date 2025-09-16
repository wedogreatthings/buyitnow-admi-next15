/* eslint-disable react/prop-types */
import React from 'react';
import { arrayHasData } from '@/helpers/helpers';
import Link from 'next/link';

const OrdersUnpaidList = ({ listOrdersUnpaidThisMonth }) => {
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

  // Fonction pour calculer le temps écoulé
  const getTimeSinceCreation = (createdAt) => {
    if (!createdAt) return 'N/A';
    const now = new Date();
    const created = new Date(createdAt);
    const diffInHours = Math.floor((now - created) / (1000 * 60 * 60));

    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  // Fonction pour obtenir la couleur de l'urgence
  const getUrgencyColor = (createdAt) => {
    if (!createdAt) return 'text-gray-500';
    const now = new Date();
    const created = new Date(createdAt);
    const diffInHours = Math.floor((now - created) / (1000 * 60 * 60));

    if (diffInHours > 72) return 'text-red-600 font-bold'; // Plus de 3 jours
    if (diffInHours > 24) return 'text-orange-600 font-medium'; // Plus de 1 jour
    return 'text-gray-600'; // Récent
  };

  // Fonction pour obtenir la couleur du statut de paiement
  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'unpaid':
        return 'text-red-600 bg-red-100';
      case 'cancelled':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return arrayHasData(listOrdersUnpaidThisMonth) ? (
    <div className="w-full py-8">
      <div className="text-center">
        <div className="mx-auto w-16 h-16 mb-4 text-gray-300">
          <svg fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
          </svg>
        </div>
        <p className="font-bold text-xl text-gray-600">
          No Unpaid Orders This Month
        </p>
        <p className="text-gray-500 mt-2">
          All orders have been paid or none have been placed yet.
        </p>
      </div>
    </div>
  ) : (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left bg-white">
        <thead className="text-xs text-gray-700 uppercase bg-red-50 border-b-2 border-red-200">
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
              Payment Status
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              Payment Method
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              Shipping Type
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              Created At
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              Urgency
            </th>
            <th scope="col" className="px-4 py-3 font-semibold text-center">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {listOrdersUnpaidThisMonth?.map((item) => (
            <tr
              key={item?._id}
              className="bg-white hover:bg-red-25 transition-colors"
            >
              <td className="px-4 py-3 font-mono text-sm font-medium text-red-700">
                {item?.orderNumber || `#${item?._id?.slice(-8)}`}
              </td>
              <td className="px-4 py-3 font-semibold text-red-600">
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
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${getPaymentStatusColor(item?.paymentStatus)}`}
                >
                  {item?.paymentStatus?.toUpperCase() || 'UNPAID'}
                </span>
              </td>
              <td className="px-4 py-3">
                {item?.paymentInfo?.typePayment ? (
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                    {item?.paymentInfo?.typePayment?.toUpperCase()}
                  </span>
                ) : (
                  <span className="text-gray-400 italic text-xs">Not set</span>
                )}
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
              <td className="px-4 py-3 text-gray-600 text-xs">
                {formatDate(item?.createdAt)}
              </td>
              <td
                className={`px-4 py-3 text-xs ${getUrgencyColor(item?.createdAt)}`}
              >
                {getTimeSinceCreation(item?.createdAt)}
              </td>
              <td className="px-4 py-3 text-center">
                <Link
                  href={`/admin/orders/${item?._id}`}
                  className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-red-700 bg-red-100 border border-red-300 rounded-md hover:bg-red-200 hover:border-red-400 transition-colors duration-200"
                  title={`Manage order ${item?.orderNumber || item?._id}`}
                >
                  <i
                    className="fa fa-exclamation-triangle mr-1"
                    aria-hidden="true"
                  ></i>
                  Manage
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Résumé en bas de tableau avec alertes */}
      <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex justify-between items-center text-sm mb-2">
          <div className="text-red-700">
            <span className="font-semibold">
              {listOrdersUnpaidThisMonth?.length || 0}
            </span>{' '}
            unpaid orders this month
          </div>
          <div className="text-red-700 font-semibold">
            Potential Revenue: $
            {listOrdersUnpaidThisMonth
              ?.reduce((acc, order) => acc + (order?.totalAmount || 0), 0)
              .toFixed(2) || '0.00'}
          </div>
        </div>

        {/* Alertes d'urgence */}
        {(() => {
          const urgentOrders = listOrdersUnpaidThisMonth?.filter((order) => {
            const diffInHours = Math.floor(
              (new Date() - new Date(order.createdAt)) / (1000 * 60 * 60),
            );
            return diffInHours > 24;
          });

          if (urgentOrders?.length > 0) {
            return (
              <div className="text-xs text-red-600 bg-red-100 p-2 rounded border border-red-300">
                <i className="fa fa-warning mr-1"></i>
                <span className="font-semibold">
                  {urgentOrders.length}
                </span>{' '}
                orders need immediate attention (over 24h old)
              </div>
            );
          }
          return null;
        })()}
      </div>
    </div>
  );
};

export default OrdersUnpaidList;
