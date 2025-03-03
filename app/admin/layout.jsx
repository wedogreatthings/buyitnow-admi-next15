import React from 'react';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
const Sidebar = dynamic(() => import('@/components/layouts/Sidebar'));

// eslint-disable-next-line react/prop-types
const AdminLayout = ({ children }) => {
  return (
    <>
      <section className="hidden py-5 sm:py-7 bg-blue-100">
        <div className="container max-w-(--breakpoint-xl) mx-auto px-4">
          <h1 className="text-bold text-2xl">Admin Dashboard</h1>
        </div>
      </section>

      <section className="py-10">
        <div className="container max-w-(--breakpoint-xl) mx-auto px-4">
          <div className="flex flex-col md:flex-row -mx-4">
            <Sidebar />
            <main className="w-full px-4">
              <article className="border border-gray-200 bg-white shadow-xs rounded-sm mb-5 p-3 lg:p-5">
                <Suspense>{children}</Suspense>
              </article>
            </main>
          </div>
        </div>
      </section>
    </>
  );
};

export default AdminLayout;
