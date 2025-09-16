/* eslint-disable react/prop-types */
'use client';

import dynamic from 'next/dynamic';
import React, { memo, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import OrderContext from '@/context/OrderContext';
import Loading from '@/app/loading';
import SettingsContext from '@/context/SettingsContext';

const SingleOrderInfo = dynamic(() => import('./SingleOrderInfo'), {
  loading: () => <Loading />,
});

const UpdateOrder = memo(({ order }) => {
  const { updateOrder, error, clearErrors, updated, setUpdated } =
    useContext(OrderContext);

  const { deliveryPrice } = useContext(SettingsContext);

  const [orderStatus, setOrderStatus] = useState(order?.orderStatus);

  useEffect(() => {
    if (updated) {
      setUpdated(false);
      toast.success('Order Updated');
    }

    if (error) {
      toast.error(error);
      clearErrors();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, updated]);

  const submitHandler = () => {
    const orderData = { orderStatus };
    updateOrder(order?._id, orderData);
  };

  return (
    <article className="p-3 lg:p-5 mb-5 bg-white border border-blue-600 rounded-md">
      <SingleOrderInfo order={order} deliveryPrice={deliveryPrice} />

      <hr />

      {order?.paymentStatus === 'paid' && order?.shippingInfo !== undefined && (
        <div className="my-8">
          <label className="block mb-3"> Update Order Status </label>
          <div className="relative">
            <select
              className="block appearance-none border border-gray-200 bg-gray-100 rounded-md py-2 px-3 hover:border-gray-400 focus:outline-hidden focus:border-gray-400 w-full"
              name="category"
              value={orderStatus}
              onChange={(e) => setOrderStatus(e.target.value)}
              required
            >
              {[
                'Unpaid',
                'Processing',
                'Shipped',
                'Delivered',
                'Cancelled',
                'Returned',
              ].map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <i className="absolute inset-y-0 right-0 p-2 text-gray-400">
              <svg
                width="22"
                height="22"
                className="fill-current"
                viewBox="0 0 20 20"
              >
                <path d="M7 10l5 5 5-5H7z"></path>
              </svg>
            </i>
          </div>
        </div>
      )}

      {order?.paymentStatus === 'refunded' ||
        (order?.paymentStatus === 'cancelled' &&
          order?.shippingInfo !== undefined && (
            <button
              type="submit"
              className="mb-2 px-4 py-2 text-center w-full inline-block text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
              onClick={() => submitHandler()}
            >
              Update
            </button>
          ))}
    </article>
  );
});

UpdateOrder.displayName = 'UpdateOrder';

export default UpdateOrder;
