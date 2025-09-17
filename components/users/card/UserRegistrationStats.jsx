/* eslint-disable react/prop-types */
import React from 'react';
import { arrayHasData } from '@/helpers/helpers';
import UserStatCard from './UserStatCard';

const UserRegistrationStats = ({
  open,
  totalUsers,
  totalClientUsers,
  totalUsersRegisteredThisMonth,
  totalUsersRegisteredLastMonth,
}) => {
  const lastMonth = new Date().getMonth();
  const currentMonth = lastMonth + 1;
  const currentYear = new Date().getFullYear();

  const data = [
    {
      title: 'All',
      content: `${totalUsers === undefined || totalUsers === null ? '0 user' : `${totalUsers} user(s)`}`,
      indication: 'Admin/Client',
    },
    {
      title: 'Normal',
      content: `${totalClientUsers === undefined || totalClientUsers === null ? '0 user' : `${totalClientUsers} user(s)`}`,
      indication: 'Client',
    },
    {
      title: 'New This Month',
      content: `${arrayHasData(totalUsersRegisteredThisMonth) ? ' 0 user' : `${totalUsersRegisteredThisMonth[0]?.totalUsers} user(s)`}`,
      indication: `${currentMonth}/${currentYear}`,
    },
    {
      title: 'New Last Month',
      content: `${arrayHasData(totalUsersRegisteredLastMonth) ? ' 0 user' : `${totalUsersRegisteredLastMonth[0]?.totalUsers} user(s)`}`,
      indication: `${lastMonth === 0 ? '12' : lastMonth}/${currentYear}`,
      color: 'red',
    },
  ];

  return (
    <div className={`${!open && 'hidden'} flex justify-evenly`}>
      {data?.map((item, index) => (
        <UserStatCard
          key={index}
          title={item?.title}
          content={item?.content}
          indication={item?.indication}
          color={item?.color}
        />
      ))}
    </div>
  );
};

export default UserRegistrationStats;
