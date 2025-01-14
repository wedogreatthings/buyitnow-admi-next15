import React from 'react';
import { arrayHasData } from '@/helpers/helpers';
import Link from 'next/link';

const OrdersUnpaidList = ({ listOrdersUnpaidThisMonth, deliveryPrice }) => {
  return arrayHasData(listOrdersUnpaidThisMonth) ? (
    <div className="w-full">
      <p className="font-bold text-xl text-center">
        No Orders Unpaid This Month
      </p>
    </div>
  ) : (
    <table className="w-full text-sm text-left">
      <thead className="text-l text-gray-700 uppercase">
        <tr>
          <th scope="col" className="px-6 py-3">
            ID
          </th>
          <th scope="col" className="px-6 py-3">
            Amount Waiting
          </th>
          <th scope="col" className="px-6 py-3">
            Delivery Price
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
        {listOrdersUnpaidThisMonth?.map((item) => (
          <tr key={item?._id} className="bg-white">
            <td className="flex items-end px-6 py-2">{item._id}</td>
            <td className="px-6 py-2">$ {item?.paymentInfo?.amountPaid}</td>
            <td className="px-6 py-2">
              $ {item?.shippingInfo === undefined ? 0 : deliveryPrice}
            </td>
            <td className="px-6 py-2">{item?.paymentStatus}</td>
            <td className="px-6 py-2">
              {item?.paymentInfo?.typePayment?.toUpperCase()}
            </td>
            <td
              className={`px-3 py-2 ${item?.shippingInfo === undefined ? 'text-red-500' : 'text-green-500'}`}
            >
              {item?.shippingInfo === undefined ? 'No' : 'Delivery'}
            </td>
            {item?.shippingInfo !== undefined ? (
              <td
                className={`px-3 py-2 ${item?.orderStatus === 'Processing' ? 'text-red-500' : 'text-green-500'}`}
              >
                {item?.orderStatus}
              </td>
            ) : (
              <td className="px-3 py-2">None</td>
            )}
            <td className="px-6 py-2">
              <Link
                href={`/admin/orders/${item?._id}`}
                className="px-2 py-2 inline-block text-yellow-600 bg-white shadow-sm border border-gray-200 rounded-md hover:bg-gray-100 cursor-pointer mr-2"
              >
                <i className="fa fa-pencil" aria-hidden="true"></i>
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default OrdersUnpaidList;