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
        toast.success('Delivery price added successfully');
        setLoading(false);
      }
    } catch (error) {
      setError(error?.response?.data?.message);
      toast.error(
        error?.response?.data?.message || 'Failed to add delivery price',
      );
      setLoading(false);
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
        toast.success('Payment type added successfully');
        setLoading(false);
      }
    } catch (error) {
      setError(error?.response?.data?.message);
      toast.error(
        error?.response?.data?.message || 'Failed to add payment type',
      );
      setLoading(false);
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
      toast.error(
        error?.response?.data?.error ||
          error?.response?.data?.message ||
          'Failed to add category',
      );
      setLoading(false);
    }
  };

  // AMÉLIORATION : Meilleure gestion des erreurs et feedback
  const toggleCategoryStatus = async (categoryId) => {
    try {
      const { data } = await axios.put(
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
        return { success: true, data };
      } else {
        throw new Error(data.message || 'Failed to update category status');
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error.message ||
        'Failed to update category status';
      setError(errorMessage);
      toast.error(errorMessage);
      throw error; // Re-throw pour que le composant puisse gérer l'état de loading
    }
  };

  // AMÉLIORATION : Meilleure gestion des retours et erreurs
  const deleteDeliveryPrice = async (id) => {
    try {
      const { data } = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/settings/deliveryPrice/${id}`,
      );

      // Vérifier si la réponse contient un message de succès
      if (data?.message && data.message.includes('successfully')) {
        router.push('/admin/settings');
        router.refresh();
        toast.success('Delivery price deleted successfully');
        return { success: true, data };
      } else {
        throw new Error(data?.message || 'Failed to delete delivery price');
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error.message ||
        'Failed to delete delivery price';
      setError(errorMessage);
      toast.error(errorMessage);
      throw error;
    }
  };

  // AMÉLIORATION : Meilleure gestion des retours et erreurs
  const deleteCategory = async (id) => {
    try {
      const { data } = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/settings/category/${id}`,
      );

      // Vérifier si la réponse contient un message de succès
      if (data?.message && data.message.includes('successfully')) {
        router.push('/admin/settings');
        router.refresh();
        toast.success('Category deleted successfully');
        return { success: true, data };
      } else {
        throw new Error(data?.message || 'Failed to delete category');
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error.message ||
        'Failed to delete category';
      setError(errorMessage);
      toast.error(errorMessage);
      throw error;
    }
  };

  // AMÉLIORATION : Meilleure gestion des retours et erreurs
  const deletePayment = async (id) => {
    try {
      const { data } = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/settings/paymentType/${id}`,
      );

      // Vérifier si la réponse contient un message de succès
      if (data?.message && data.message.includes('successfully')) {
        router.push('/admin/settings');
        router.refresh();
        toast.success('Payment type deleted successfully');
        return { success: true, data };
      } else {
        throw new Error(data?.message || 'Failed to delete payment type');
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error.message ||
        'Failed to delete payment type';
      setError(errorMessage);
      toast.error(errorMessage);
      throw error;
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
        toggleCategoryStatus,
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
