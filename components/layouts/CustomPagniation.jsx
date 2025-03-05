/* eslint-disable react/prop-types */
'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ResponsivePaginationComponent from 'react-responsive-pagination';
import 'react-responsive-pagination/themes/classic.css';

const CustomPagination = ({ totalPages }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  let page = searchParams.get('page') || 1;
  page = Number(page);

  let queryParams;

  const handlePageChange = (currentPage) => {
    if (typeof window !== 'undefined') {
      queryParams = new URLSearchParams(window.location.search);

      if (queryParams.has('page')) {
        queryParams.set('page', currentPage);
      } else {
        queryParams.append('page', currentPage);
      }

      const path = window.location.pathname + '?' + queryParams.toString();

      router.push(path);
    }
  };

  return (
    <div className="flex mt-20 justify-center">
      <ResponsivePaginationComponent
        current={page}
        total={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default CustomPagination;
