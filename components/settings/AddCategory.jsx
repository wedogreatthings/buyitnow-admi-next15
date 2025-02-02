'use client';

import SettingsContext from '@/context/SettingsContext';
import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const AddCategory = () => {
  const { newCategory, error, clearErrors } = useContext(SettingsContext);

  const [category, setCategory] = useState('');

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearErrors();
    }
  }, [error]);

  const submitHandler = (e) => {
    e.preventDefault();

    newCategory(category);
  };

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <div className="flex justify-between my-5">
        <h1 className="text-xl ml-4 font-bold">Product Category</h1>
      </div>
      <hr className="my-2 mx-9" />

      <form
        onSubmit={submitHandler}
        className="flex flex-col justify-center items-center"
      >
        <h2 className="mb-5 text-2xl font-semibold w-fit">
          Add Product Category
        </h2>

        <div className="mb-4 w-1/2">
          <label className="block mb-1"> Category Name </label>
          <input
            className="appearance-none border border-gray-200 bg-gray-100 rounded-md py-2 px-3 hover:border-gray-400 focus:outline-hidden focus:border-gray-400 w-full"
            type="text"
            placeholder="Type category name"
            minLength={3}
            required
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="my-2 px-4 py-2 text-center w-1/2 inline-block text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
        >
          Add Category
        </button>
      </form>
    </div>
  );
};

export default AddCategory;