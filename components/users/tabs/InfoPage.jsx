/* eslint-disable react/prop-types */
import React from 'react';

const InfoPage = ({ user }) => {
  return (
    <div>
      <div className="flex justify-between my-4">
        <div className="flex ml-4">
          <p className="font-semibold mr-2">Email: </p> <p>{user?.email}</p>
        </div>
        <div className="flex">
          <p className="font-semibold mr-2">Phone Number: </p>{' '}
          <p>{user?.phone}</p>
        </div>
        <div className="flex mr-4">
          <p className="font-semibold mr-2">User Role: </p> <p>{user?.role}</p>
        </div>
      </div>
    </div>
  );
};

export default InfoPage;
