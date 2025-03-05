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

  console.log('dataCategory: ');
  console.log(dataCategory);
  console.log('dataPayment: ');
  console.log(dataPayment);
  console.log('dataDeliveryPrice: ');
  console.log(dataDeliveryPrice);

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
  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
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

      <div className="flex justify-between my-5">
        <h1 className="text-xl ml-4 font-bold underline">Product Categories</h1>
        <Link
          href="/admin/settings/categories/add"
          className="px-2 inline-block text-blue-500 bg-white shadow-xs border border-blue-600 rounded-md hover:bg-gray-100 cursor-pointer my-1 mr-4"
        >
          <i className="fa fa-plus" aria-hidden="true"></i>
        </Link>
      </div>

      <div className="flex gap-1 pb-4">
        {arrayHasData(dataCategory?.categories) ? (
          <div className="w-full">
            <p className="font-bold text-xl text-center">No Categories found</p>
          </div>
        ) : (
          dataCategory?.categories.map((category, index) => (
            <div
              key={category?._id}
              className={`relative w-30 p-8 rounded-sm ml-6 justify-center items-center ${colors[index]}`}
            >
              <div
                className="absolute top-0 right-1.5 cursor-pointer"
                onClick={() => deleteCategoryHandler(category?._id)}
              >
                <i className="fa fa-xmark" aria-hidden="true"></i>
              </div>
              <span className="text-white font-bold text-sm">
                {category?.categoryName}
              </span>
            </div>
          ))
        )}
      </div>

      <hr className="my-2 mx-9" />

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
