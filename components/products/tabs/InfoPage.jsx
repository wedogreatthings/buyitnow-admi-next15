/* eslint-disable react/prop-types */
import { arrayHasData } from '@/helpers/helpers';
import Image from 'next/image';
import React from 'react';

const InfoPage = ({ product }) => {
  return (
    <>
      <div className="flex">
        <div className="flex ml-4 my-3">
          <p className="font-semibold mr-2">Stock Left: </p>{' '}
          <p>{product?.stock}</p>
        </div>
        <div className="flex ml-4 my-3">
          <p className="font-semibold mr-2">Unit Price: </p>{' '}
          <p>${product?.price}</p>
        </div>
      </div>

      <hr className="my-2 mx-9" />

      <div className="ml-4 my-3">
        <p className="my-2 font-semibold">Description: </p>
        <p>{product?.description}</p>
      </div>

      <hr className="my-2 mx-9" />

      <div className="ml-4 my-3">
        <p className="my-2 font-semibold">Pictures</p>
        {arrayHasData(product?.images) ? (
          <div className="ml-4 my-3">
            <p className="font-bold text-xl">No pictures for this product !</p>
          </div>
        ) : (
          <div className="flex gap-6 rounded-lg">
            {product?.images?.map((image) => (
              <Image
                key={image?._id}
                className="h-58 p-5 shadow-lg rounded-md"
                priority
                src={image ? image?.url : '/images/default_product.png'}
                alt={product?.name}
                title={product?.name}
                width="100"
                height="150"
                placeholder="blur-sm"
                blurDataURL="/images/default_product.png"
                style={{ objectFit: 'fill' }}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default InfoPage;
