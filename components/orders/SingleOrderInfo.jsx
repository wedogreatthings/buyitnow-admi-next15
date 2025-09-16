/* eslint-disable react/prop-types */
import Image from 'next/image';
import React from 'react';

const SingleOrderInfo = ({ order }) => {
  // Fonction pour formater les dates
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <>
      <header className="lg:flex justify-between mb-4">
        <div className="mb-4 lg:mb-0">
          <p className="font-semibold">
            <span>Order Number: {order?.orderNumber || order?._id} </span>
            {order?.paymentStatus === 'paid' ? (
              <span className="text-green-500">
                • {order?.paymentStatus?.toUpperCase()}
              </span>
            ) : order?.paymentStatus === 'refunded' ? (
              <span className="text-orange-500">
                • {order?.paymentStatus?.toUpperCase()}
              </span>
            ) : order?.paymentStatus === 'cancelled' ? (
              <span className="text-red-500">
                • {order?.paymentStatus?.toUpperCase()}
              </span>
            ) : (
              <span className="text-red-500">
                • {order?.paymentStatus?.toUpperCase()}
              </span>
            )}{' '}
            {order?.shippingInfo !== undefined &&
              (order?.orderStatus == 'Unpaid' ||
              order?.orderStatus === 'Cancelled' ? (
                <span className="text-red-500">
                  • {order?.orderStatus.toUpperCase()}
                </span>
              ) : order?.orderStatus === 'Returned' ? (
                <span className="text-orange-500">
                  • {order?.orderStatus.toUpperCase()}
                </span>
              ) : (
                <span className="text-green-500">
                  • {order?.orderStatus.toUpperCase()}
                </span>
              ))}
          </p>
          <p className="text-gray-500">
            Created: {formatDate(order?.createdAt)}
          </p>
          <p className="text-gray-500">
            Last Updated: {formatDate(order?.updatedAt)}
          </p>
          <p className="text-sm text-gray-600">
            Total Items:{' '}
            {order?.itemCount ||
              order?.orderItems?.reduce(
                (total, item) => total + item.quantity,
                0,
              )}
          </p>
        </div>
      </header>

      <div className="grid md:grid-cols-4 gap-1 mb-6">
        <div>
          <p className="text-gray-400 mb-1">Person</p>
          <ul className="text-gray-600">
            <li>{order?.user?.name}</li>
            <li>Phone: {order?.user?.phone}</li>
            <li>Email: {order?.user?.email}</li>
          </ul>
        </div>
        {order?.shippingInfo !== undefined && (
          <div>
            <p className="text-gray-400 mb-1">Delivery address</p>
            <ul className="text-gray-600">
              <li>{order?.shippingInfo?.street}</li>
              <li>
                {order?.shippingInfo?.city}, {order?.shippingInfo?.state},{' '}
                {order?.shippingInfo?.zipCode}
              </li>
              <li>{order?.shippingInfo?.country}</li>
            </ul>
          </div>
        )}
        <div>
          <p className="text-gray-400 mb-1">Financial Details</p>
          <ul className="text-gray-600">
            <li>
              <span className="font-bold">Items Total:</span> $
              {(
                order?.totalAmount -
                (order?.shippingAmount || 0) -
                (order?.taxAmount || 0)
              ).toFixed(2)}
            </li>
            {order?.taxAmount > 0 && (
              <li>
                <span className="font-bold">Tax Amount:</span> $
                {order?.taxAmount?.toFixed(2)}
              </li>
            )}
            <li>
              <span className="font-bold">Shipping Cost:</span> $
              {order?.shippingAmount?.toFixed(2) || '0.00'}
            </li>
            <li>
              <span className="font-bold">Total Amount:</span> $
              {order?.totalAmount?.toFixed(2)}
            </li>
            <li>
              <span className="font-bold">Amount Paid:</span> $
              {order?.paymentInfo?.amountPaid?.toFixed(2)}
            </li>
          </ul>
        </div>
        <div>
          <p className="text-gray-400 mb-1">Payment Info</p>
          <ul className="text-gray-600">
            <li>
              <span className="font-bold">Mode:</span>{' '}
              {order?.paymentInfo?.typePayment}
            </li>
            <li>
              <span className="font-bold">Sender:</span>{' '}
              {order?.paymentInfo?.paymentAccountName}
            </li>
            <li>
              <span className="font-bold">Number:</span>{' '}
              {order?.paymentInfo?.paymentAccountNumber}
            </li>
            <li>
              <span className="font-bold">Payment Date:</span>{' '}
              {formatDate(order?.paymentInfo?.paymentDate)}
            </li>
          </ul>
        </div>
      </div>

      {/* Section Historique des dates */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <p className="text-gray-400 mb-2 font-semibold">Order Timeline</p>
        <div className="grid md:grid-cols-3 gap-4">
          {order?.paidAt && (
            <div>
              <span className="font-bold text-green-600">Paid At:</span>
              <p className="text-sm text-gray-600">
                {formatDate(order?.paidAt)}
              </p>
            </div>
          )}
          {order?.deliveredAt && (
            <div>
              <span className="font-bold text-blue-600">Delivered At:</span>
              <p className="text-sm text-gray-600">
                {formatDate(order?.deliveredAt)}
              </p>
            </div>
          )}
          {order?.cancelledAt && (
            <div>
              <span className="font-bold text-red-600">Cancelled At:</span>
              <p className="text-sm text-gray-600">
                {formatDate(order?.cancelledAt)}
              </p>
            </div>
          )}
        </div>
        {order?.cancelReason && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded">
            <span className="font-bold text-red-600">Cancellation Reason:</span>
            <p className="text-red-700 mt-1">{order?.cancelReason}</p>
          </div>
        )}
      </div>

      <hr className="my-4" />

      {/* Section des produits avec plus de détails */}
      <div>
        <p className="text-gray-400 mb-3 font-semibold">Order Items</p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2">
          {order?.orderItems?.map((item) => (
            <figure
              className="flex flex-row mb-4 p-3 border border-gray-200 rounded-lg"
              key={item?._id}
            >
              <div>
                <div className="block w-20 h-20 rounded-sm border border-gray-200 overflow-hidden p-3">
                  <Image
                    src={item?.image}
                    height={60}
                    width={60}
                    alt={item?.name}
                  />
                </div>
              </div>
              <figcaption className="ml-3 flex-1">
                <p className="font-semibold">{item?.name.substring(0, 35)}</p>
                <p className="text-sm text-gray-500">
                  Category: {item?.category}
                </p>
                <p className="text-sm italic">
                  Unit Price: ${item?.price?.toFixed(2)}
                </p>
                <p className="text-sm">Quantity: {item?.quantity}</p>
                <p className="mt-1 font-semibold text-blue-600">
                  Subtotal: $
                  {item?.subtotal?.toFixed(2) ||
                    (item?.price * item?.quantity).toFixed(2)}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      {/* Section récapitulatif final */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600">Order ID: {order?._id}</p>
            <p className="text-sm text-gray-600">
              Status:{' '}
              <span className="font-semibold">{order?.paymentStatus}</span>
              {order?.shippingInfo && (
                <>
                  {' '}
                  | <span className="font-semibold">{order?.orderStatus}</span>
                </>
              )}
            </p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-blue-600">
              Total: ${order?.totalAmount?.toFixed(2)}
            </p>
            <p className="text-sm text-gray-600">
              (
              {order?.orderItems?.reduce(
                (total, item) => total + item.quantity,
                0,
              )}{' '}
              items)
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default SingleOrderInfo;
