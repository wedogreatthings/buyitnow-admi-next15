/* eslint-disable react/prop-types */
import React from 'react';
import InfoPage from './tabs/InfoPage';
import OrdersPage from './tabs/OrdersPage';
import Image from 'next/image';

const UserProfile = ({ data }) => {
  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <div className="flex flex-col justify-center items-center">
        <Image
          className="w-24 h-24 rounded-full mr-4"
          src={
            data?.user?.avatar ? data?.user?.avatar?.url : '/images/default.png'
          }
          alt={data?.user?.name}
          width={24}
          height={24}
        />
        <h1 className="text-3xl my-5 ml-4 font-bold">{data?.user?.name}</h1>
      </div>

      <hr className="my-2 mx-9" />

      <InfoPage user={data?.user} />

      <hr className="my-2 mx-9" />

      <OrdersPage orders={data?.orders} />
    </div>
  );
};

export default UserProfile;
