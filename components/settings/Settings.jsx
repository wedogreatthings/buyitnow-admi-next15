/* eslint-disable react/prop-types */
'use client';

import SettingsContext from '@/context/SettingsContext';
import { arrayHasData } from '@/helpers/helpers';
import Link from 'next/link';
import React, { useContext, useEffect } from 'react';
import { toast } from 'react-toastify';

const Settings = ({ dataCategory, dataPayment, dataDeliveryPrice }) => {
  const {
    setCategories,
    deleteDeliveryPrice,
    deleteCategory,
    deletePayment,
    toggleCategoryStatus,
    error,
    clearErrors,
  } = useContext(SettingsContext);

  useEffect(() => {
    setCategories(dataCategory?.categories);
    if (error) {
      toast.error(error);
      clearErrors();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  const colors = [
    'bg-purple-500',
    'bg-red-500',
    'bg-slate-500',
    'bg-amber-500',
    'bg-teal-500',
    'bg-fuchsia-500',
  ];

  const deleteDeliveryPriceHandler = (id) => {
    deleteDeliveryPrice(id);
  };

  const deletePaymentHandler = (id) => {
    deletePayment(id);
  };

  const deleteCategoryHandler = (id) => {
    deleteCategory(id);
  };

  const toggleCategoryStatusHandler = (id) => {
    toggleCategoryStatus(id);
  };

  // Séparer les catégories actives et inactives
  const activeCategories =
    dataCategory?.categories?.filter((cat) => cat.isActive) || [];
  const inactiveCategories =
    dataCategory?.categories?.filter((cat) => !cat.isActive) || [];

  const renderCategoryCard = (category, index, isActive) => (
    <div
      key={category?._id}
      className={`relative min-w-32 p-4 rounded-sm ml-6 justify-center items-center ${
        isActive ? colors[index % colors.length] : 'bg-gray-400'
      } ${!isActive ? 'opacity-75' : ''}`}
    >
      {/* Bouton de suppression */}
      <div
        className="absolute top-1 right-2 cursor-pointer text-white hover:text-red-200"
        onClick={() => deleteCategoryHandler(category?._id)}
      >
        <i className="fa fa-xmark" aria-hidden="true"></i>
      </div>

      {/* Bouton de basculement du statut */}
      <div
        className="absolute top-1 left-2 cursor-pointer text-white hover:text-yellow-200"
        onClick={() => toggleCategoryStatusHandler(category?._id)}
        title={isActive ? 'Désactiver' : 'Activer'}
      >
        <i
          className={`fa ${isActive ? 'fa-toggle-on' : 'fa-toggle-off'}`}
          aria-hidden="true"
        ></i>
      </div>

      <div className="text-center mt-4">
        <span className="text-white font-bold text-sm block mb-2">
          {category?.categoryName}
        </span>
        <div className="bg-black bg-opacity-30 rounded px-2 py-1 mb-2">
          <span className="text-white text-xs font-semibold">
            Sold: {category?.sold || 0}
          </span>
        </div>
        <div
          className={`rounded px-2 py-1 text-xs font-bold ${
            isActive ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
          }`}
        >
          {isActive ? 'ACTIVE' : 'INACTIVE'}
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      {/* Section Delivery Price */}
      <div className="flex justify-between my-5">
        <h1 className="text-xl ml-4 font-bold underline">Delivery Price</h1>
        <Link
          href="/admin/settings/delivery-price/add"
          className="px-2 inline-block text-blue-500 bg-white shadow-xs border border-blue-600 rounded-md hover:bg-gray-100 cursor-pointer my-1 mr-4"
        >
          <i className="fa fa-plus" aria-hidden="true"></i>
        </Link>
      </div>

      <div className="flex gap-1 pb-4">
        {arrayHasData(dataDeliveryPrice?.deliveryPrice) ? (
          <div className="w-full">
            <p className="font-bold text-xl text-center">
              No Delivery Price found
            </p>
          </div>
        ) : (
          dataDeliveryPrice?.deliveryPrice.map((price) => (
            <div
              key={price?._id}
              className="relative w-30 p-8 rounded-sm ml-6 justify-center items-center bg-orange-950"
            >
              <div
                className="absolute top-0 right-1.5 cursor-pointer"
                onClick={() => deleteDeliveryPriceHandler(price?._id)}
              >
                <i className="fa fa-xmark" aria-hidden="true"></i>
              </div>
              <span className="text-white font-bold text-sm">
                $ {price?.deliveryPrice}
              </span>
            </div>
          ))
        )}
      </div>

      <hr className="my-2 mx-9" />

      {/* Section Product Categories */}
      <div className="flex justify-between my-5">
        <h1 className="text-xl ml-4 font-bold underline">Product Categories</h1>
        <Link
          href="/admin/settings/categories/add"
          className="px-2 inline-block text-blue-500 bg-white shadow-xs border border-blue-600 rounded-md hover:bg-gray-100 cursor-pointer my-1 mr-4"
        >
          <i className="fa fa-plus" aria-hidden="true"></i>
        </Link>
      </div>

      {/* Catégories Actives */}
      {activeCategories.length > 0 && (
        <>
          <div className="ml-4 mb-3">
            <h2 className="text-lg font-semibold text-green-600">
              Active Categories ({activeCategories.length})
            </h2>
          </div>
          <div className="flex gap-1 pb-4 flex-wrap">
            {activeCategories.map((category, index) =>
              renderCategoryCard(category, index, true),
            )}
          </div>
        </>
      )}

      {/* Catégories Inactives */}
      {inactiveCategories.length > 0 && (
        <>
          <div className="ml-4 mb-3">
            <h2 className="text-lg font-semibold text-red-600">
              Inactive Categories ({inactiveCategories.length})
            </h2>
          </div>
          <div className="flex gap-1 pb-4 flex-wrap">
            {inactiveCategories.map((category, index) =>
              renderCategoryCard(category, index, false),
            )}
          </div>
        </>
      )}

      {/* Message si aucune catégorie */}
      {activeCategories.length === 0 && inactiveCategories.length === 0 && (
        <div className="w-full pb-4">
          <p className="font-bold text-xl text-center">No Categories found</p>
        </div>
      )}

      <hr className="my-2 mx-9" />

      {/* Section Payment Types */}
      <div className="flex justify-between my-5">
        <h1 className="text-xl ml-4 font-bold underline">Payment Types</h1>
        <Link
          href="/admin/settings/paymentType/add"
          className="px-2 inline-block text-blue-500 bg-white shadow-xs border border-blue-600 rounded-md hover:bg-gray-100 cursor-pointer my-1 mr-4"
        >
          <i className="fa fa-plus" aria-hidden="true"></i>
        </Link>
      </div>

      <div className="flex gap-1 pb-4">
        {arrayHasData(dataPayment?.paymentTypes) ? (
          <div className="w-full">
            <p className="font-bold text-xl text-center">
              Payment Types is empty
            </p>
          </div>
        ) : (
          dataPayment?.paymentTypes.map((payment) => (
            <div
              key={payment?._id}
              className="relative w-30 p-8 rounded-sm ml-6 justify-center items-center bg-emerald-900 shadow-md"
            >
              <div
                className="absolute top-0 right-1.5 cursor-pointer"
                onClick={() => deletePaymentHandler(payment?._id)}
              >
                <i className="fa fa-xmark" aria-hidden="true"></i>
              </div>
              <span className="text-white font-bold text-sm italic underline">
                {payment?.paymentName}
              </span>
              <br />
              <span className="text-white font-bold text-sm">
                {payment?.paymentNumber}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Settings;
