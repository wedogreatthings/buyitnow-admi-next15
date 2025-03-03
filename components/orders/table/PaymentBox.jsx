/* eslint-disable react/prop-types */
'use client';

import OrderContext from '@/context/OrderContext';
import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const PaymentBox = ({ order }) => {
  const { updateOrder, error, clearErrors, updatedOrder, updated, setUpdated } =
    useContext(OrderContext);

  const [paymentStatus, setPaymentStatus] = useState(order?.paymentStatus);

  useEffect(() => {
    if (updated) {
      setUpdated(false);

      if (updatedOrder._id === order?._id) {
        toast.success('Order Updated');
      }
    }

    if (error) {
      toast.error(error);
      clearErrors();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, updated]);

  const handleChange = () => {
    let newStatus;

    if (paymentStatus === 'unpaid') {
      newStatus = 'paid';
      setPaymentStatus(newStatus);
    } else {
      newStatus = 'unpaid';
      setPaymentStatus(newStatus);
    }

    const orderData = { paymentStatus: newStatus };
    updateOrder(order?._id, orderData);
  };

  return (
    <td className="px-6 py-2">
      <label className="flex items-center">
        <input
          name="paymentStatus"
          type="checkbox"
          value={paymentStatus}
          defaultChecked={paymentStatus === 'paid' ? true : false}
          className={`h-4 w-4 ${paymentStatus === 'paid' ? 'accent-green-500 border-green-500' : 'accent-red-500 border-red-700'}`}
          onChange={handleChange}
        />
        <span
          className={`ml-2 ${paymentStatus === 'paid' ? 'text-green-500' : 'text-red-500'}`}
        >
          {' '}
          {paymentStatus}{' '}
        </span>
      </label>
    </td>
  );
};

export default PaymentBox;
