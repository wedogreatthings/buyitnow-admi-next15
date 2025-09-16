'use client';

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { searchSchema } from '@/helpers/schemas';

// eslint-disable-next-line react/prop-types
const Search = ({ setLoading }) => {
  const [keyword, setKeyword] = useState('');

  const router = useRouter();
  const pathName = usePathname();

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await searchSchema.validate(
        { keyword },
        { abortEarly: false },
      );

      if (result.keyword) {
        router.push(`${pathName}/?keyword=${keyword}`);
      } else {
        router.push(`${pathName}`);
      }
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <form
      className="flex flex-nowrap items-center justify-end order-last md:order-none mt-5"
      onSubmit={submitHandler}
    >
      <input
        className="appearance-none border border-gray-200 bg-gray-100 rounded-md mr-2 py-1 px-1 hover:border-gray-400 focus:outline-hidden focus:border-gray-400"
        type="text"
        placeholder="Enter your keyword"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        required
      />
      <button
        type="button"
        className="px-1 py-1 inline-block text-white border border-transparent bg-blue-600  rounded-md hover:bg-blue-700"
        onClick={submitHandler}
      >
        Search
      </button>
    </form>
  );
};

export default Search;
