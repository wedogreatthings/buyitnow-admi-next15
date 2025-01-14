'use client';

import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { createContext, useState } from 'react';

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [deliveryPrice, setDeliveryPrice] = useState(0);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(null);

  const router = useRouter();

  const newDeliveryPrice = async (price) => {
    try {
      setLoading(true);

      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/settings/deliveryPrice`,
        { deliveryPrice: price },
      );

      if (data) {
        router.push('/admin/settings');
        router.refresh();
        setLoading(false);
      }
    } catch (error) {
      setError(error?.response?.data?.message);
    }
  };

  const newPaymentType = async (platformName, platformNumber) => {
    try {
      setLoading(true);

      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/settings/paymentType`,
        { paymentName: platformName, paymentNumber: platformNumber },
      );

      if (data) {
        router.push('/admin/settings');
        router.refresh();
        setLoading(false);
      }
    } catch (error) {
      setError(error?.response?.data?.message);
    }
  };

  const newCategory = async (categoryName) => {
    try {
      setLoading(true);

      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/settings/category`,
        { categoryName },
      );

      if (data) {
        router.push('/admin/settings');
        router.refresh();
        setLoading(false);
      }
    } catch (error) {
      setError(error?.response?.data?.message);
    }
  };

  const deleteDeliveryPrice = async (id) => {
    try {
      const { data } = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/settings/deliveryPrice/${id}`,
      );

      if (data?.success) {
        router.push('/admin/settings');
        router.refresh();
      }
    } catch (error) {
      setError(error?.response?.data?.message);
    }
  };

  const deleteCategory = async (id) => {
    try {
      const { data } = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/settings/category/${id}`,
      );

      if (data?.success) {
        router.push('/admin/settings');
        router.refresh();
      }
    } catch (error) {
      setError(error?.response?.data?.message);
    }
  };

  const deletePayment = async (id) => {
    try {
      const { data } = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/settings/paymentType/${id}`,
      );

      if (data?.success) {
        router.push('/admin/settings');
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
    <SettingsContext.Provider
      value={{
        categories,
        deliveryPrice,
        error,
        loading,
        setCategories,
        setDeliveryPrice,
        newDeliveryPrice,
        newPaymentType,
        newCategory,
        deleteDeliveryPrice,
        deleteCategory,
        deletePayment,
        clearErrors,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export default SettingsContext;
