/* eslint-disable react/prop-types */
import React from 'react';
import { arrayHasData } from '@/helpers/helpers';
import UserStatCard from './UserStatCard';

const UserPurchasingsStats = ({
  open,
  totalUsersThatBought,
  totalUsersThatBoughtThisMonth,
  userThatBoughtMostSinceBeginning,
  usersThatBoughtMostThisMonth,
}) => {
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const data = [
    {
      title: 'Those who Bought ',
      content: `${arrayHasData(totalUsersThatBought) ? '0 client' : `${totalUsersThatBought[0]?.totalUsers} client(s)`}`,
      indication: 'Since the beginning',
    },
    {
      title: 'Best Client',
      content: `${arrayHasData(userThatBoughtMostSinceBeginning) ? 'No one' : `${userThatBoughtMostSinceBeginning[0]?.result[0]?.name.substring(0, 13)} ...`}`,
      indication: `${userThatBoughtMostSinceBeginning[0]?.totalPurchases} Purchases`,
    },
    {
      title: 'Best This Month',
      content: `${arrayHasData(totalUsersThatBoughtThisMonth) ? '0 client' : `${totalUsersThatBoughtThisMonth[0]?.totalUsers} client(s)`}`,
      indication: `${currentMonth}/${currentYear}`,
    },
    {
      title: 'Best This Month',
      content: `${usersThatBoughtMostThisMonth === null || usersThatBoughtMostThisMonth?.result[0] === undefined ? 'No one' : `${usersThatBoughtMostThisMonth?.result[0]?.name}`}`,
      indication: `${currentMonth}/${currentYear}: $ ${usersThatBoughtMostThisMonth === null || usersThatBoughtMostThisMonth?.result[0] === undefined ? 'Nothing' : usersThatBoughtMostThisMonth?.totalPurchases.toFixed(2)}`,
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

export default UserPurchasingsStats;
