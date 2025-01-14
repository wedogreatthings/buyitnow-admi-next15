'use client';

import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const ReadBox = ({ id, readStatus }) => {
  const [read, setRead] = useState(readStatus);
  const router = useRouter();

  const handleChange = async () => {
    const { data } = await axios.put(
      `${process.env.NEXT_PUBLIC_API_URL}/api/contact/${id}`,
      {
        read: !read,
      },
    );

    if (data?.success) {
      setRead(!read);
      router.refresh('/admin/contact');
    }
  };
  return (
    <div className="px-6 py-2">
      <label className="flex items-center">
        <input
          name="read"
          type="checkbox"
          value={read}
          defaultChecked={!read && false}
          className={`h-4 w-4 ${!read && 'accent-green-500 border-green-500'}`}
          onChange={handleChange}
        />
        <span className={`ml-2 text-xs ${!read && 'font-bold'}`}>
          {' '}
          {!read && 'Nouveau'}{' '}
        </span>
      </label>
    </div>
  );
};

export default ReadBox;