import React from 'react'
import Link from 'next/link';
import PaymentBox from './PaymentBox';

//77066621

const OrderItem = ({ order, deleteHandler }) => {
  return (
    <tr className="bg-white">
      <td className="px-3 py-2">{order?._id}</td>
      <td className="px-3 py-2">${order?.paymentInfo?.amountPaid}</td>
      <PaymentBox order={order} />
      <td className="px-3 py-2">
        {order?.paymentInfo?.typePayment?.toUpperCase()}
      </td>
      <td
        className={`px-3 py-2 ${order?.shippingInfo === undefined ? 'text-red-500' : 'text-green-500'}`}
      >
        {order?.shippingInfo === undefined ? 'No' : 'Delivery'}
      </td>
      {order?.shippingInfo !== undefined ? (
        <td
          className={`px-3 py-2 ${order?.orderStatus === 'Processing' ? 'text-red-500' : 'text-green-500'}`}
        >
          {order?.orderStatus}
        </td>
      ) : (
        <td className="px-3 py-2">None</td>
      )}
      <td className="px-3 py-2">
        <div>
          <Link
            href={`/admin/orders/${order?._id}`}
            className="px-2 py-2 inline-block text-yellow-600 bg-white shadow-sm border border-gray-200 rounded-md hover:bg-gray-100 cursor-pointer mr-2"
          >
            <i className="fa fa-pencil" aria-hidden="true"></i>
          </Link>
          <a
            className="px-2 py-2 inline-block text-red-600 bg-white shadow-sm border border-gray-200 rounded-md hover:bg-gray-100 cursor-pointer"
            onClick={() => deleteHandler(order?._id)}
          >
            <i className="fa fa-trash" aria-hidden="true"></i>
          </a>
        </div>
      </td>
    </tr>
  );
};

export default OrderItem;