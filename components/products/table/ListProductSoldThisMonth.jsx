/* eslint-disable react/prop-types */
import React from 'react';
import { arrayHasData, customLoader } from '@/helpers/helpers';
import Image from 'next/image';

const ListProductSoldThisMonth = ({ productSoldThisMonth }) => {
  return arrayHasData(productSoldThisMonth) ? (
    <div className="w-full">
      <p className="font-bold text-xl text-center">
        No Products sold this month
      </p>
    </div>
  ) : (
    <table className="w-full text-sm text-left">
      <thead className="text-l text-gray-700 uppercase">
        <tr>
          <th scope="col" className="px-6 py-3">
            Name
          </th>
          <th scope="col" className="px-6 py-3">
            Amount
          </th>
          <th scope="col" className="px-6 py-3">
            Quantity
          </th>
          <th scope="col" className="px-6 py-3">
            Category
          </th>
        </tr>
      </thead>
      <tbody>
        {productSoldThisMonth?.map((product) => (
          <tr className="bg-white" key={product._id}>
            <td className="flex items-end px-6 py-2">
              <Image
                loader={customLoader}
                className="w-7 h-7 rounded-full mr-4"
                src={
                  product?.productImage?.[0] !== undefined
                    ? product?.productImage[0]
                    : '/images/default_product.png'
                }
                alt={product?.productName?.[0] || 'Product'}
                title={product?.productName?.[0] || 'Product'}
                width={7}
                height={7}
              />
              {product?.productName?.[0] || 'N/A'}
            </td>
            <td className="px-6 py-2">
              $ {product?.totalAmount?.toFixed(2) || 0}
            </td>
            <td className="px-6 py-2">{product?.totalQuantity || 0}</td>
            <td className="px-6 py-2">
              {product?.productCategory?.[0] || 'N/A'}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ListProductSoldThisMonth;
