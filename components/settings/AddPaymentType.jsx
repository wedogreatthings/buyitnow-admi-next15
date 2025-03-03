'use client';

import SettingsContext from '@/context/SettingsContext';
import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const AddPaymentType = () => {
  const { newPaymentType, error, clearErrors } = useContext(SettingsContext);

  const [platformName, setPlatformName] = useState('');
  const [platformNumber, setPlatformNumber] = useState('');

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearErrors();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  const submitHandler = (e) => {
    e.preventDefault();

    newPaymentType(platformName, platformNumber);
  };

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <div className="flex justify-between my-5">
        <h1 className="text-xl ml-4 font-bold">Payment Type</h1>
      </div>
      <hr className="my-2 mx-9" />

      <form
        onSubmit={submitHandler}
        className="flex flex-col justify-center items-center"
      >
        <h2 className="mb-5 text-2xl font-semibold w-fit">Add Payment Type</h2>

        <div className="mb-4 w-1/2">
          <label className="block mb-1"> Platform Name </label>
          <input
            className="appearance-none border border-gray-200 bg-gray-100 rounded-md py-2 px-3 hover:border-gray-400 focus:outline-hidden focus:border-gray-400 w-full"
            type="text"
            placeholder="Type platform name"
            minLength={3}
            required
            value={platformName}
            onChange={(e) => setPlatformName(e.target.value)}
          />
        </div>

        <div className="mb-4 w-1/2">
          <label className="block mb-1"> Platform Number </label>
          <input
            className="appearance-none border border-gray-200 bg-gray-100 rounded-md py-2 px-3 hover:border-gray-400 focus:outline-hidden focus:border-gray-400 w-full"
            type="tel"
            placeholder="Type platform number"
            minLength={6}
            required
            value={platformNumber}
            onChange={(e) => setPlatformNumber(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="my-2 px-4 py-2 text-center w-1/2 inline-block text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
        >
          Add Payment
        </button>
      </form>
    </div>
  );
};

export default AddPaymentType;
