/* eslint-disable react/prop-types */
'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const OrdersFilter = ({ open, setLoading }) => {
  const router = useRouter();
  const params = useSearchParams();
  const paymentFilter = params.get('paymentStatus');
  const shippingFilter = params.get('orderStatus');

  let queryParams;

  function handleClick(checkbox) {
    setLoading(true);

    if (typeof window !== 'undefined') {
      queryParams = new URLSearchParams(window.location.search);
    }

    const checkboxes = document.getElementsByName(checkbox.name);

    checkboxes.forEach((item) => {
      if (item !== checkbox) item.checked = false;
    });

    if (checkbox.checked === false) {
      // Delete the filter from query
      queryParams.delete(checkbox.name);
    } else {
      // Set filter in the query
      if (queryParams.has(checkbox.name)) {
        queryParams.set(checkbox.name, checkbox.value);
      } else {
        queryParams.append(checkbox.name, checkbox.value);
      }
    }
    const path = window.location.pathname + '?' + queryParams.toString();
    router.push(path);
  }

  return (
    <div
      className={`${open ? 'flex flex-col ml-4 py-2 mb-5 border border-blue-600 rounded-md' : 'hidden'}`}
    >
      <h4 className="ml-2 font-bold underline">Filter By:</h4>
      <div className="flex justify-evenly">
        <ul>
          <li className="mb-2">
            <label className="flex items-center">
              <input
                name="paymentStatus"
                type="checkbox"
                value="paid"
                className="h-4 w-4"
                defaultChecked={paymentFilter === 'paid' && true}
                onClick={(e) => handleClick(e.target)}
              />
              <span className="ml-2"> Paid </span>
            </label>
          </li>
          <li>
            <label className="flex items-center">
              <input
                name="paymentStatus"
                type="checkbox"
                value="unpaid"
                className="h-4 w-4"
                defaultChecked={paymentFilter === 'unpaid' && true}
                onClick={(e) => handleClick(e.target)}
              />
              <span className="ml-2"> Unpaid </span>
            </label>
          </li>
        </ul>
        <ul>
          <li>
            <label className="flex items-center">
              <input
                name="orderStatus"
                type="checkbox"
                value="Processing"
                className="h-4 w-4"
                defaultChecked={shippingFilter === 'Processing' && true}
                onClick={(e) => handleClick(e.target)}
              />
              <span className="ml-2"> Processing </span>
            </label>
          </li>
          <li>
            <label className="flex items-center">
              <input
                name="orderStatus"
                type="checkbox"
                value="Shipped"
                className="h-4 w-4"
                defaultChecked={shippingFilter === 'Shipped' && true}
                onClick={(e) => handleClick(e.target)}
              />
              <span className="ml-2"> Shipped </span>
            </label>
          </li>
          <li>
            <label className="flex items-center">
              <input
                name="orderStatus"
                type="checkbox"
                value="Delivered"
                className="h-4 w-4"
                defaultChecked={shippingFilter === 'Delivered' && true}
                onClick={(e) => handleClick(e.target)}
              />
              <span className="ml-2"> Delivered </span>
            </label>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default OrdersFilter;
