/* eslint-disable react/prop-types */
'use client';

import React, { memo, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import ProductContext from '@/context/ProductContext';
import SettingsContext from '@/context/SettingsContext';

const UpdateProduct = memo(({ data }) => {
  const { updateProduct, error, updated, setUpdated, clearErrors } =
    useContext(ProductContext);
  const { categories } = useContext(SettingsContext);

  const defaultCategory = categories?.find(
    (element) => element?._id === data?.product?.category?._id,
  );

  const [product, setProduct] = useState({
    name: data?.product?.name,
    description: data?.product?.description,
    price: data?.product?.price,
    stock: data?.product?.stock,
    category: defaultCategory?._id,
    isActive: data?.product?.isActive || false,
  });

  // Vérifier si le produit peut être activé (toutes les données requises + images)
  const canBeActivated =
    data?.product?.images && data?.product?.images.length > 0;

  useEffect(() => {
    if (updated) {
      toast.success('Product Updated');
      setUpdated(false);
    }

    if (error) {
      toast.error(error);
      clearErrors();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, updated]);

  const { name, description, price, stock, category, isActive } = product;

  const onChange = (e) => {
    const value =
      e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setProduct({ ...product, [e.target.name]: value });
  };

  const submitHandler = (e) => {
    e.preventDefault();

    // Convertir price et stock en nombres
    const updatedProduct = {
      ...product,
      price: Number(price),
      stock: Number(stock),
    };

    updateProduct(updatedProduct, data?.product?._id);
  };

  return (
    <section className="container max-w-3xl p-6 mx-auto">
      <h1 className="text-xl md:text-3xl font-semibold text-black mb-8">
        Update Product
      </h1>

      <form onSubmit={submitHandler}>
        <div className="mb-4">
          <label className="block mb-1"> Name </label>
          <input
            type="text"
            className="appearance-none border border-gray-200 bg-gray-100 rounded-md py-2 px-3 hover:border-gray-400 focus:outline-hidden focus:border-gray-400 w-full"
            placeholder="Product name"
            name="name"
            value={name}
            onChange={onChange}
            required
          />
        </div>

        <div className="mb-4 mt-5">
          <label className="block mb-1"> Description </label>
          <textarea
            rows="4"
            className="appearance-none border border-gray-200 bg-gray-100 rounded-md py-2 px-3 hover:border-gray-400 focus:outline-hidden focus:border-gray-400 w-full"
            placeholder="Product description"
            name="description"
            value={description}
            onChange={onChange}
            required
          ></textarea>
        </div>

        <div className="grid md:grid-cols-2 gap-x-2 mt-5">
          <div className="mb-4">
            <label className="block mb-1"> Price </label>
            <div className="relative">
              <div className="col-span-2">
                <input
                  type="text"
                  className="appearance-none border border-gray-200 bg-gray-100 rounded-md py-2 px-3 hover:border-gray-400 focus:outline-hidden focus:border-gray-400 w-full"
                  placeholder="0.00"
                  name="price"
                  value={price}
                  onChange={onChange}
                  required
                />
              </div>
            </div>
          </div>
          <div className="mb-4">
            <label className="block mb-1"> Category </label>
            <div className="relative">
              <select
                className="block appearance-none border border-gray-200 bg-gray-100 rounded-md py-2 px-3 hover:border-gray-400 focus:outline-hidden focus:border-gray-400 w-full"
                name="category"
                value={category}
                onChange={onChange}
                required
              >
                {categories.map((category) => (
                  <option key={category?._id} value={category?._id}>
                    {category?.categoryName}
                  </option>
                ))}
              </select>
              <i className="absolute inset-y-0 right-0 p-2 text-gray-400">
                <svg
                  width="22"
                  height="22"
                  className="fill-current"
                  viewBox="0 0 20 20"
                >
                  <path d="M7 10l5 5 5-5H7z"></path>
                </svg>
              </i>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-x-2 mt-5">
          <div className="mb-4">
            <label className="block mb-1"> Stock </label>
            <div className="relative">
              <div className="col-span-2">
                <input
                  type="text"
                  className="appearance-none border border-gray-200 bg-gray-100 rounded-md py-2 px-3 hover:border-gray-400 focus:outline-hidden focus:border-gray-400 w-full"
                  placeholder="0"
                  name="stock"
                  value={stock}
                  onChange={onChange}
                  required
                />
              </div>
            </div>
          </div>

          {/* Champ isActive - affiché seulement si le produit peut être activé */}
          {canBeActivated && (
            <div className="mb-4">
              <label className="block mb-1"> Status </label>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  name="isActive"
                  checked={isActive}
                  onChange={onChange}
                />
                <label className="text-sm font-medium text-gray-700">
                  Active Product
                </label>
              </div>
              {!canBeActivated && (
                <p className="text-xs text-gray-500 mt-1">
                  Product must have at least one image to be activated
                </p>
              )}
            </div>
          )}
        </div>

        <button
          type="submit"
          className="my-2 px-4 py-2 text-center inline-block text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 w-full"
        >
          Update Product
        </button>
      </form>
    </section>
  );
});

UpdateProduct.displayName = 'UpdateProduct';

export default UpdateProduct;
