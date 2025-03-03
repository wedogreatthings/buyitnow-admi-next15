/* eslint-disable react/prop-types */
'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import Loading from '@/app/loading';

import { memo, useContext, useEffect, useState } from 'react';
const CustomPagination = dynamic(
  () => import('@/components/layouts/CustomPagniation'),
);
import AuthContext from '@/context/AuthContext';

const UsersTable = dynamic(() => import('./table/UsersTable'), {
  loading: () => <Loading />,
});

import Search from '../layouts/Search';
import { toast } from 'react-toastify';

const UserRegistrationStats = dynamic(
  () => import('./card/UserRegistrationStats'),
  {
    loading: () => <Loading />,
  },
);

const Users = memo(({ data }) => {
  const { error, deleteUser, loading, setLoading, clearErrors } =
    useContext(AuthContext);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (loading) {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearErrors();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  const deleteHandler = (id) => {
    deleteUser(id);
  };

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <div className="flex justify-between">
        <h1 className="text-3xl my-5 ml-4 font-bold">List of Users</h1>
        <div className="flex justify-center items-baseline mr-4">
          <button
            title="Statistiques"
            onClick={() => setOpen((prev) => !prev)}
            className="px-2 inline-block text-blue-500 bg-white shadow-xs border border-blue-600 rounded-md hover:bg-gray-100 cursor-pointer mr-4"
          >
            <i className="fa fa-chart-simple" aria-hidden="true"></i>
          </button>
          <Search setLoading={setLoading} />
        </div>
      </div>
      <hr className="my-2 mx-9" />

      <UserRegistrationStats
        open={open}
        totalUsers={data?.usersCount}
        totalClientUsers={data?.clientUsersCount}
        totalUsersRegisteredThisMonth={data?.usersRegisteredThisMonth}
        totalUsersRegisteredLastMonth={data?.usersRegisteredLastMonth}
      />

      <hr className="my-2 mx-9" />

      {loading ? (
        <Loading />
      ) : (
        <UsersTable users={data?.users} deleteHandler={deleteHandler} />
      )}

      {/* {data?.totalPages > 1 && (
        <div className="mb-6">
          <CustomPagination totalPages={data?.totalPages} />
        </div>
      )} */}
      <div className="mb-6">
        <CustomPagination totalPages={data?.totalPages} />
      </div>
    </div>
  );
});

Users.displayName = 'Users';

export default Users;
