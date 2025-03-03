/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
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

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <div className="flex justify-between">
        <h1 className="text-3xl my-5 ml-4 font-bold">{data?.product?.name}</h1>
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

      <ParentTab
        tabs={tabs}
        product={data?.product}
        orders={data?.idsOfOrders}
        revenues={data?.revenuesGenerated[0]}
      />
    </div>
  );
});

export default ProductProfile;
