/* eslint-disable react/prop-types */
import React from 'react';
import InfoPage from './InfoPage';
import OrdersPage from './OrdersPage';
import RevenuePage from './RevenuePage';

const ParentTab = ({ tabs, product, orders, revenues }) => {
  switch (tabs) {
    case 'infos':
      return <InfoPage product={product} />;
    case 'orders':
      return <OrdersPage orders={orders} />;
    case 'revenue':
      return <RevenuePage revenues={revenues?.details} />;

    default:
      return <InfoPage />;
  }
};

export default ParentTab;
