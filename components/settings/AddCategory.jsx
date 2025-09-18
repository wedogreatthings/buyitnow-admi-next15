'use client';

import SettingsContext from '@/context/SettingsContext';
import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const AddCategory = () => {
  const { newCategory, error, clearErrors } = useContext(SettingsContext);

  const [category, setCategory] = useState('');
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearErrors();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  const submitHandler = (e) => {
    e.preventDefault();

    const categoryData = {
      categoryName: category,
      isActive: isActive,
    };

    newCategory(categoryData);
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

        <div className="mb-4 w-1/2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="text-sm font-medium text-gray-900">
              Activate category immediately
            </span>
          </label>
          <p className="text-xs text-gray-500 mt-1">
            {isActive
              ? 'Category will be active and visible to customers'
              : 'Category will be inactive and hidden from customers'}
          </p>
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
