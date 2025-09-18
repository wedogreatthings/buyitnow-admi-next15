/* eslint-disable react/prop-types */
'use client';

import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { createContext, useState } from 'react';
import { toast } from 'react-toastify';

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

  // MISE À JOUR : Accepter maintenant un objet avec categoryName et isActive
  const newCategory = async (categoryData) => {
    try {
      setLoading(true);

      // Gérer le cas où on reçoit juste une string (compatibilité descendante)
      const requestData =
        typeof categoryData === 'string'
          ? { categoryName: categoryData, isActive: false }
          : categoryData;

      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/settings/category`,
        requestData,
      );

      if (data?.success) {
        router.push('/admin/settings');
        router.refresh();
        toast.success('Category added successfully');
        setLoading(false);
      }
    } catch (error) {
      setError(error?.response?.data?.error || error?.response?.data?.message);
    }
  };

  // NOUVELLE MÉTHODE : Basculer le statut isActive d'une catégorie
  const toggleCategoryStatus = async (categoryId) => {
    try {
      setLoading(true);

      const { data } = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/settings/category/toggle-status/${categoryId}`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      if (data.success) {
        // Mettre à jour la liste des catégories localement
        setCategories((prevCategories) =>
          prevCategories.map((category) =>
            category._id === categoryId
              ? { ...category, isActive: !category.isActive }
              : category,
          ),
        );

        toast.success(data.message);
        router.refresh();
      }
    } catch (error) {
      setError(
        error?.response?.data?.message || 'Failed to update category status',
      );
      toast.error(
        error?.response?.data?.message || 'Failed to update category status',
      );
    } finally {
      setLoading(false);
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
        toast.success('Delivery price deleted successfully');
      }
    } catch (error) {
      setError(error?.response?.data?.message);
      toast.error(
        error?.response?.data?.message || 'Failed to delete delivery price',
      );
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
        toast.success('Category deleted successfully');
      } else if (data?.error) {
        // Gérer le cas où la catégorie a des produits associés
        setError(data.error);
        toast.error(data.error);
      }
    } catch (error) {
      setError(error?.response?.data?.message);
      toast.error(
        error?.response?.data?.message || 'Failed to delete category',
      );
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
        toast.success('Payment type deleted successfully');
      }
    } catch (error) {
      setError(error?.response?.data?.message);
      toast.error(
        error?.response?.data?.message || 'Failed to delete payment type',
      );
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
        toggleCategoryStatus, // NOUVELLE MÉTHODE AJOUTÉE
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
