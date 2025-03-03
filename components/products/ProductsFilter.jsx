/* eslint-disable react/prop-types */
import React from 'react';
import { arrayHasData } from '@/helpers/helpers';
import { useRouter, useSearchParams } from 'next/navigation';

const ProductsFilter = ({ open, setLoading, categories }) => {
  const router = useRouter();
  const params = useSearchParams();

  const stockFilter = params.get('stock');
  const categoryFilter = params.get('category');

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
                name="stock"
                type="checkbox"
                value="less"
                className="h-4 w-4"
                defaultChecked={stockFilter === 'less' && true}
                onClick={(e) => handleClick(e.target)}
              />
              <span className="ml-2">Stock &#8804; 5 </span>
            </label>
          </li>
          <li>
            <label className="flex items-center">
              <input
                name="stock"
                type="checkbox"
                value="more"
                className="h-4 w-4"
                defaultChecked={stockFilter === 'more' && true}
                onClick={(e) => handleClick(e.target)}
              />
              <span className="ml-2"> Stock &#62; 5 </span>
            </label>
          </li>
        </ul>

        <ul className="space-y-1">
          {arrayHasData(categories) ? (
            <div className="w-full">
              <p className="font-bold text-xl text-center">
                No categories found!
              </p>
            </div>
          ) : (
            categories?.map((category) => {
              return (
                <li key={category?._id}>
                  <label className="flex items-center">
                    <input
                      name="category"
                      type="checkbox"
                      value={category?._id}
                      className="h-4 w-4"
                      defaultChecked={categoryFilter === category?._id && true}
                      onClick={(e) => handleClick(e.target)}
                    />
                    <span className="ml-2"> {category?.categoryName} </span>
                  </label>
                </li>
              );
            })
          )}
        </ul>
      </div>
    </div>
  );
};

export default ProductsFilter;
