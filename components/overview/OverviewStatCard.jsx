/* eslint-disable react/prop-types */
import React from 'react';

const OverviewStatCard = ({ title, content, indication, color }) => {
  return (
    <div className="h-59 p-2 w-1/5 ml-2 mb-3 border border-gray-400 bg-blue-200 rounded-sm flex flex-col justify-evenly">
      <div className="bg-white rounded-3xl pl-1 pr-6 w-fit">
        <p
          className={`${color !== undefined ? 'text-red-600' : 'text-green-600'} text-xs`}
        >
          {title}
        </p>
      </div>
      <p className="text-gray-900 font-bold text-sm pt-3 pl-3">{content}</p>
      <p className="text-gray-500 text-xs leading-none pt-4 pl-2 pb-2">
        {indication}
      </p>
    </div>
  );
};

export default OverviewStatCard;
