/* eslint-disable react/prop-types */
import React from 'react';
import { arrayHasData } from '@/helpers/helpers';
import Link from 'next/link';
import Image from 'next/image';

const UsersTable = ({ users, deleteHandler }) => {
  return arrayHasData(users) ? (
    <div className="w-full">
      <p className="font-bold text-xl text-center">No Users found</p>
    </div>
  ) : (
    <table className="w-full text-sm text-left">
      <thead className="text-l text-gray-700 uppercase">
        <tr>
          <th scope="col" className="px-6 py-3">
            Name
          </th>
          <th scope="col" className="px-6 py-3">
            Email
          </th>
          <th scope="col" className="px-6 py-3">
            Phone
          </th>
          <th scope="col" className="px-6 py-3">
            Role
          </th>
          <th scope="col" className="px-6 py-3">
            Actions
          </th>
        </tr>
      </thead>
      <tbody>
        {users?.map((user) => (
          <tr key={user?._id} className="bg-white">
            <td className="flex items-end px-6 py-2">
              <Image
                className="w-7 h-7 rounded-full mr-4"
                src={user?.avatar ? user?.avatar?.url : '/images/default.png'}
                alt={user?.name}
                width={7}
                height={7}
              />
              <span>{user?.name}</span>
            </td>
            <td className="px-6 py-2">{user?.email}</td>
            <td className="px-6 py-2">{user?.phone}</td>
            <td className="px-6 py-2">{user?.role}</td>
            <td className="px-6 py-2">
              <div>
                <Link
                  href={`/admin/users/${user?._id}/profile`}
                  className="px-2 py-2 inline-block text-blue-600 bg-white shadow-xs border border-gray-200 rounded-md hover:bg-gray-100 cursor-pointer mr-2"
                >
                  <i className="fa fa-eye" aria-hidden="true"></i>
                </Link>

                <Link
                  href={`/admin/users/${user?._id}`}
                  className="px-2 py-2 inline-block text-yellow-600 bg-white shadow-xs border border-gray-200 rounded-md hover:bg-gray-100 cursor-pointer mr-2"
                >
                  <i className="fa fa-pencil" aria-hidden="true"></i>
                </Link>
                <a
                  className="px-2 py-2 inline-block text-red-600 bg-white shadow-xs border border-gray-200 rounded-md hover:bg-gray-100 cursor-pointer"
                  onClick={() => deleteHandler(user?._id)}
                >
                  <i className="fa fa-trash" aria-hidden="true"></i>
                </a>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UsersTable;
