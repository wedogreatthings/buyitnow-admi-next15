/* eslint-disable react/prop-types */
'use client';

import React, { memo, useState } from 'react';
import ParentTab from './tabs/ParentTab';

const ProductProfile = memo(({ data }) => {
  const [tabs, setTabs] = useState('infos');
  const [active, setActive] = useState('infos');

  const handleClick = (tab) => {
    setTabs(tab);
    setActive(tab);
  };

  // Fonction pour formater les dates
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl my-5 ml-4 font-bold">{data?.product?.name}</h1>
        {/* Badge pour le statut isActive */}
        <div className="mr-4">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              data?.product?.isActive
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {data?.product?.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>

      <hr className="my-2 mx-9" />

      <div className="flex justify-evenly">
        <p
          className={`my-2 cursor-pointer ${active === 'infos' ? 'font-semibold text-blue-500' : 'text-gray-400'}`}
          onClick={() => handleClick('infos')}
        >
          Infos
        </p>
        <p
          className={`my-2 cursor-pointer ${active === 'orders' ? 'font-semibold text-blue-500' : 'text-gray-400'}`}
          onClick={() => handleClick('orders')}
        >
          Orders
        </p>
        <p
          className={`my-2 cursor-pointer ${active === 'revenue' ? 'font-semibold text-blue-500' : 'text-gray-400'}`}
          onClick={() => handleClick('revenue')}
        >
          Revenues
        </p>
      </div>

      <hr className="my-2 mx-9" />

      {/* Affichage des informations supplémentaires dans l'onglet Infos */}
      {tabs === 'infos' && (
        <div className="px-6 py-4 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-white p-3 rounded-lg shadow-sm">
              <p className="text-sm font-medium text-gray-500">Total Sold</p>
              <p className="text-2xl font-bold text-gray-900">
                {data?.product?.sold || 0}
              </p>
            </div>
            <div className="bg-white p-3 rounded-lg shadow-sm">
              <p className="text-sm font-medium text-gray-500">Created At</p>
              <p className="text-sm text-gray-900">
                {formatDate(data?.product?.createdAt)}
              </p>
            </div>
            <div className="bg-white p-3 rounded-lg shadow-sm">
              <p className="text-sm font-medium text-gray-500">Updated At</p>
              <p className="text-sm text-gray-900">
                {formatDate(data?.product?.updatedAt)}
              </p>
            </div>
          </div>
        </div>
      )}

      <ParentTab
        tabs={tabs}
        product={data?.product}
        orders={data?.idsOfOrders}
        revenues={data?.revenuesGenerated[0]}
      />
    </div>
  );
});

ProductProfile.displayName = 'ProductProfile';

export default ProductProfile;
