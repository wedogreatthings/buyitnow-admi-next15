'use client';

import React, { memo, useState } from 'react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { useParams, usePathname } from 'next/navigation';

const Sidebar = memo(() => {
  const pathName = usePathname();
  const params = useParams();

  const [activePart, setActivePart] = useState(null);
  const [openProducts, setOpenProducts] = useState(false);
  const [openOrders, setOpenOrders] = useState(false);
  const [openUsers, setOpenUsers] = useState(false);

  const isSettings = () => {
    let isTrue;

    switch (pathName) {
      case '/admin/settings':
        isTrue = true;
        break;
      case '/admin/settings/categories/add':
        isTrue = true;
        break;
      case '/admin/settings/paymentType/add':
        isTrue = true;
        break;

      default:
        isTrue = false;
        break;
    }

    return isTrue;
  };

  const isProductsInfo = () => {
    let isTrue;

    switch (pathName) {
      case '/admin/products':
        isTrue = true;
        break;
      case `/admin/products/${params?.id}/upload_images`:
        isTrue = true;
        break;
      case `/admin/products/${params?.id}`:
        isTrue = true;
        break;

      default:
        isTrue = false;
        break;
    }

    return isTrue;
  };

  const isOrders = () => {
    let isTrue;

    switch (pathName) {
      case '/admin/orders':
        isTrue = true;
        break;
      case `/admin/orders/${params?.id}`:
        isTrue = true;
        break;

      default:
        isTrue = false;
        break;
    }

    return isTrue;
  };

  const isUsers = () => {
    let isTrue;

    switch (pathName) {
      case '/admin/users':
        isTrue = true;
        break;
      case `/admin/users/${params?.id}`:
        isTrue = true;
        break;

      default:
        isTrue = false;
        break;
    }

    return isTrue;
  };

  const logoutHandler = () => {
    signOut();
  };

  return (
    <aside className="px-2">
      <ul className="sidebar">
        <>
          <li>
            {' '}
            <Link
              onClick={() => setActivePart('')}
              href="/admin"
              className={`flex gap-2 text-sm px-3 py-2 text-gray-800 hover:bg-blue-100 hover:text-blue-500 rounded-md ${pathName === '/admin' && 'bg-blue-100'}`}
            >
              <span>
                <i className="fa fa-house" aria-hidden="true"></i>
              </span>
              <span>Overview</span>
            </Link>
          </li>

          <li>
            {' '}
            <Link
              onClick={() => setActivePart('')}
              href="/admin/settings"
              className={`flex gap-2 text-sm px-3 py-2 text-gray-800 hover:bg-blue-100 hover:text-blue-500 rounded-md ${isSettings() && 'bg-blue-100'}`}
            >
              <span>
                <i className="fa fa-gear" aria-hidden="true"></i>
              </span>
              <span>Settings</span>
            </Link>
          </li>

          <li className="block px-3 py-2 text-gray-800 rounded-md">
            <p
              onClick={() => {
                setActivePart('products');
                setOpenProducts((prev) => !prev);
              }}
              className={`flex gap-2 mb-2 text-sm font-semibold cursor-pointer hover:bg-blue-100 hover:text-blue-500 ${activePart === 'products' && 'bg-blue-100'}`}
            >
              <span>
                <i className="fa fa-warehouse" aria-hidden="true"></i>
              </span>
              <span>Products</span>
            </p>{' '}
            <ul className={`${!openProducts && 'hidden'}`}>
              <li>
                {' '}
                <Link
                  onClick={() => setActivePart('products')}
                  href="/admin/products/new"
                  className={`flex gap-2 text-xs justify-start pl-4 py-1 text-gray-800 hover:bg-blue-100 hover:text-blue-500 rounded-md ${pathName === '/admin/products/new' && 'bg-blue-100'}`}
                >
                  <span>
                    <i className="fa fa-plus" aria-hidden="true"></i>
                  </span>
                  <span>New</span>
                </Link>
              </li>
              <li>
                <Link
                  onClick={() => setActivePart('products')}
                  href="/admin/products"
                  className={`flex gap-2 text-xs justify-start pl-4 py-1 text-gray-800 hover:bg-blue-100 hover:text-blue-500 rounded-md ${isProductsInfo() && 'bg-blue-100'}`}
                >
                  <span>
                    <i className="fa fa-file-lines" aria-hidden="true"></i>
                  </span>
                  <span>Info</span>
                </Link>
              </li>
              <li>
                <Link
                  onClick={() => setActivePart('products')}
                  href="/admin/products/sales"
                  className={`flex gap-2 text-xs justify-start pl-4 py-1 text-gray-800 hover:bg-blue-100 hover:text-blue-500 rounded-md ${pathName === '/admin/products/sales' && 'bg-blue-100'}`}
                >
                  <span>
                    <i className="fa fa-chart-column" aria-hidden="true"></i>
                  </span>
                  <span>Sales</span>
                </Link>
              </li>
            </ul>
          </li>

          <li className="block px-3 py-2 text-gray-800 rounded-md">
            <p
              onClick={() => {
                setActivePart('orders');
                setOpenOrders((prev) => !prev);
              }}
              className={`flex gap-2 mb-2 text-sm font-semibold cursor-pointer hover:bg-blue-100 hover:text-blue-500 ${activePart === 'orders' && 'bg-blue-100'}`}
            >
              <span>
                <i className="fa fa-cart-shopping" aria-hidden="true"></i>
              </span>
              <span>Orders</span>
            </p>{' '}
            <ul className={`${!openOrders && 'hidden'}`}>
              <li>
                <Link
                  onClick={() => setActivePart('orders')}
                  href="/admin/orders"
                  className={`flex gap-2 text-xs justify-start pl-4 py-1 text-gray-800 hover:bg-blue-100 hover:text-blue-500 rounded-md ${isOrders() && 'bg-blue-100'}`}
                >
                  <span>
                    <i className="fa fa-file-lines" aria-hidden="true"></i>
                  </span>
                  <span>Info</span>
                </Link>
              </li>
              <li>
                <Link
                  onClick={() => setActivePart('orders')}
                  href="/admin/orders/purchasings"
                  className={`flex gap-2 text-xs justify-start pl-4 py-1 text-gray-800 hover:bg-blue-100 hover:text-blue-500 rounded-md ${pathName === '/admin/orders/purchasings' && 'bg-blue-100'}`}
                >
                  <span>
                    <i className="fa fa-chart-column" aria-hidden="true"></i>
                  </span>
                  <span>Purchases</span>
                </Link>
              </li>
            </ul>
          </li>

          <li className="block px-3 py-2 text-gray-800 rounded-md">
            <p
              onClick={() => {
                setActivePart('users');
                setOpenUsers((prev) => !prev);
              }}
              className={`flex gap-2 mb-2 text-sm font-semibold cursor-pointer hover:bg-blue-100 hover:text-blue-500 ${activePart === 'users' && 'bg-blue-100'}`}
            >
              <span>
                <i className="fa fa-user" aria-hidden="true"></i>
              </span>
              <span>Users</span>
            </p>{' '}
            <ul className={`${!openUsers && 'hidden'}`}>
              <li>
                <Link
                  onClick={() => setActivePart('users')}
                  href="/admin/users"
                  className={`flex gap-2 text-xs justify-start pl-4 py-1 text-gray-800 hover:bg-blue-100 hover:text-blue-500 rounded-md ${isUsers() && 'bg-blue-100'}`}
                >
                  <span>
                    <i className="fa fa-file-lines" aria-hidden="true"></i>
                  </span>
                  <span>Info</span>
                </Link>
              </li>
              <li>
                <Link
                  onClick={() => setActivePart('users')}
                  href="/admin/users/stats"
                  className={`flex gap-2 text-xs justify-start pl-4 py-1 text-gray-800 hover:bg-blue-100 hover:text-blue-500 rounded-md ${pathName === '/admin/users/stats' && 'bg-blue-100'}`}
                >
                  <span>
                    <i className="fa fa-chart-column" aria-hidden="true"></i>
                  </span>
                  <span>Users Stats</span>
                </Link>
              </li>
            </ul>
          </li>

          <hr />
        </>

        <li>
          {' '}
          <a
            className="block px-3 py-2 text-red-800 hover:bg-red-100 hover:text-white-500 rounded-md cursor-pointer"
            onClick={logoutHandler}
          >
            Logout
          </a>
        </li>
      </ul>
    </aside>
  );
});

Sidebar.displayName = 'Sidebar';

export default Sidebar;
