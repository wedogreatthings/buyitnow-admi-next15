/* eslint-disable react/prop-types */
'use client';

import React, { useContext } from 'react';
import { arrayHasData } from '@/helpers/helpers';
import Image from 'next/image';
import Link from 'next/link';
import ProductContext from '@/context/ProductContext';

const ProductsTable = ({ products, itemCount, deleteHandler }) => {
  const { setProductImages } = useContext(ProductContext);

  return (
    <div>
      <h3 className="text-xl my-2 ml-4 font-bold">{itemCount} Product(s)</h3>
      {arrayHasData(products) ? (
        <div className="w-full">
          <p className="font-bold text-xl text-center">No Products found</p>
        </div>
      ) : (
        <table className="w-full text-sm text-left">
          <thead className="text-l text-gray-700 uppercase">
            <tr>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                Stock
              </th>
              <th scope="col" className="px-6 py-3">
                Sold
              </th>
              <th scope="col" className="px-6 py-3">
                Category
              </th>
              <th scope="col" className="px-6 py-3">
                Price
              </th>
              <th scope="col" className="px-6 py-3">
                Status
              </th>
              <th scope="col" className="px-6 py-3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {products?.map((product) => (
              <tr className="bg-white" key={product._id}>
                <td className="flex items-end px-6 py-2">
                  <Image
                    className="w-7 h-7 rounded-full mr-4"
                    src={
                      product?.images[0] !== undefined
                        ? product?.images[0]?.url
                        : '/images/default_product.png'
                    }
                    alt={product?.name}
                    title={product?.name}
                    width={7}
                    height={7}
                  />
                  {product?.name}
                </td>
                <td
                  className={`px-6 py-1 ${product?.stock <= 5 && 'bg-red-500'}`}
                >
                  {product?.stock}
                </td>
                <td className="px-6 py-2">{product?.sold || 0}</td>
                <td className="px-6 py-2">{product?.category?.categoryName}</td>
                <td className="px-6 py-2">${product?.price}</td>
                <td className="px-6 py-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      product?.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {product?.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-2">
                  <div>
                    <Link
                      href={`/admin/products/${product?._id}/profile`}
                      className="px-2 py-2 inline-block text-blue-600 bg-white shadow-xs border border-gray-200 rounded-md hover:bg-gray-100 cursor-pointer mr-2"
                    >
                      <i className="fa fa-eye" aria-hidden="true"></i>
                    </Link>

                    <Link
                      href={`/admin/products/${product?._id}/upload_images`}
                      onClick={() => setProductImages(product?.images)}
                      className="px-2 py-2 inline-block text-green-600 bg-white shadow-xs border border-gray-200 rounded-md hover:bg-gray-100 cursor-pointer mr-2"
                    >
                      <i className="fa fa-image" aria-hidden="true"></i>
                    </Link>

                    <Link
                      href={`/admin/products/${product?._id}`}
                      className="px-2 py-2 inline-block text-yellow-600 bg-white shadow-xs border border-gray-200 rounded-md hover:bg-gray-100 cursor-pointer mr-2"
                    >
                      <i className="fa fa-pencil" aria-hidden="true"></i>
                    </Link>
                    <a
                      className="px-2 py-2 inline-block text-red-600 bg-white shadow-xs border border-gray-200 rounded-md hover:bg-gray-100 cursor-pointer"
                      onClick={() => deleteHandler(product?._id)}
                    >
                      <i className="fa fa-trash" aria-hidden="true"></i>
                    </a>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ProductsTable;
