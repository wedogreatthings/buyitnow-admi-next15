/* eslint-disable react/prop-types */
import React from 'react';

const ProductStatCard = ({
  title,
  content,
  indication,
  amount,
  quantity,
  color,
}) => {
  return (
    <div className="h-59 p-2 w-1/5 ml-2 mb-3 border border-gray-400 bg-blue-200 rounded-sm flex flex-col justify-evenly">
      <div className="bg-white rounded-3xl pl-1 pr-6 w-fit">
        <p
          className={`${color !== undefined ? 'text-red-600' : 'text-green-600'} text-xs`}
        >
          {title ? title : 'None'}
        </p>
      </div>
      <p className="text-gray-900 font-bold text-sm pt-3 pl-3">
        {content ? content : 'None'}
      </p>
      <div className="pt-4 pl-2 pb-2">
        <p className="text-gray-500 text-xs leading-none pb-1">
          {indication ? indication : 'None'}
        </p>
        <p className="text-gray-500 text-xs leading-none pb-1">
          $ {amount ? amount : '0'}
        </p>
        <p className="text-gray-500 text-xs leading-none pb-1">
          {quantity ? quantity : '0'} item
        </p>
      </div>
    </div>
  );
};

export default ProductStatCard;
