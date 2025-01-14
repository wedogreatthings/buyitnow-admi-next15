'use client';

import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { createContext, useState } from 'react';

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [updated, setUpdated] = useState(false);
  const [updatedOrder, setUpdatedOrder] = useState(null);

  const router = useRouter();

  const updateOrder = async (id, orderData) => {
    try {
      const { data } = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/orders/${id}`,
        orderData,
      );

      if (data?.success) {
        setUpdated(true);

        if (orderData?.orderStatus) {
          router.push(`/admin/orders/${id}`);
          router.refresh();
        }

        if (orderData?.paymentStatus) {
          setUpdatedOrder(data?.order);
          router.push('/admin/orders');
          router.refresh();
        }
      }
    } catch (error) {
      setError(error?.response?.data?.message);
    }
  };

  const deleteOrder = async (id) => {
    try {
      const { data } = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/orders/${id}`,
      );

      if (data?.success) {
        router.push(`/admin/orders`);
        router.refresh();
      }
    } catch (error) {
      setError(error?.response?.data?.message);
    }
  };

  const clearErrors = () => {
    setError(null);
  };

  return (
    <OrderContext.Provider
      value={{
        error,
        updated,
        loading,
        updatedOrder,
        setUpdated,
        setLoading,
        updateOrder,
        deleteOrder,
        clearErrors,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export default OrderContext;
