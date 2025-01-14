import 'server-only';

import { cookies } from 'next/headers';
import queryString from 'query-string';
import axios from 'axios';
import { getCookieName } from '@/helpers/helpers';

export const getAllOrders = async (searchParams) => {
  const nextCookies = await cookies();

  /***** In Development Mode, cookie name is "next-auth.session-token" *****/
  /***** In Production Mode, cookie name is "__Secure-next-auth.session-token" *****/

  const nextAuthSessionToken = nextCookies.get(
    '__Secure-next-auth.session-token',
  );

  const urlParams = {
    keyword: (await searchParams).keyword,
    page: (await searchParams).page || 1,
    paymentStatus: (await searchParams).paymentStatus,
    orderStatus: (await searchParams).orderStatus,
  };

  const searchQuery = queryString.stringify(urlParams);

  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/overview?${searchQuery}`,
    {
      headers: {
        Cookie: `__Secure-next-auth.session-token=${nextAuthSessionToken?.value}`,
      },
    },
  );

  return data;
};

export const getContactData = async () => {
  const nextCookies = await cookies();

  const cookieName = getCookieName();
  const nextAuthSessionToken = nextCookies.get(cookieName);

  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/contact`,
    {
      headers: {
        Cookie: `${nextAuthSessionToken?.name}=${nextAuthSessionToken?.value}`,
      },
    },
  );

  return data;
};

export const getOrdersInfo = async (searchParams) => {
  const nextCookies = await cookies();

  /***** In Development Mode, cookie name is "next-auth.session-token" *****/
  /***** In Production Mode, cookie name is "__Secure-next-auth.session-token" *****/

  const nextAuthSessionToken = nextCookies.get(
    '__Secure-next-auth.session-token',
  );

  const urlParams = {
    keyword: (await searchParams).keyword,
    page: (await searchParams).page || 1,
    paymentStatus: (await searchParams).paymentStatus,
    orderStatus: (await searchParams).orderStatus,
  };

  const searchQuery = queryString.stringify(urlParams);

  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/orders?${searchQuery}`,
    {
      headers: {
        Cookie: `__Secure-next-auth.session-token=${nextAuthSessionToken?.value}`,
      },
    },
  );

  return data;
};

export const getOrdersPurchasedData = async () => {
  const nextCookies = await cookies();

  const cookieName = getCookieName();
  const nextAuthSessionToken = nextCookies.get(cookieName);

  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/orders/purchasingStats`,
    {
      headers: {
        Cookie: `${nextAuthSessionToken?.name}=${nextAuthSessionToken?.value}`,
      },
    },
  );

  return data;
};

export const getSingleOrder = async (id) => {
  const nextCookies = await cookies();

  const nextAuthSessionToken = nextCookies.get(
    '__Secure-next-auth.session-token',
  );

  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/orders/${id}`,
    {
      headers: {
        Cookie: `__Secure-next-auth.session-token=${nextAuthSessionToken?.value}`,
      },
    },
  );

  return data;
};

export const getAllProducts = async (searchParams) => {
  const nextCookies = await cookies();

  const cookieName = getCookieName();
  const nextAuthSessionToken = nextCookies.get(cookieName);

  let urlParams = {
    keyword: (await searchParams).keyword,
    page: (await searchParams).page || 1,
    category: (await searchParams).category,
  };

  if ((await searchParams).stock === 'less') {
    urlParams = {
      ...urlParams,
      'stock[lte]': 5,
    };
  } else if ((await searchParams).stock === 'more') {
    urlParams = {
      ...urlParams,
      'stock[gt]': 5,
    };
  }

  const searchQuery = queryString.stringify(urlParams);

  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/products?${searchQuery}`,
    {
      headers: {
        Cookie: `${nextAuthSessionToken?.name}=${nextAuthSessionToken?.value}`,
      },
    },
  );

  return data;
};

export const getProductSalesData = async () => {
  const nextCookies = await cookies();

  const cookieName = getCookieName();
  const nextAuthSessionToken = nextCookies.get(cookieName);

  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/products/sales`,
    {
      headers: {
        Cookie: `${nextAuthSessionToken?.name}=${nextAuthSessionToken?.value}`,
      },
    },
  );

  return data;
};

export const getSingleProduct = async (id) => {
  const nextCookies = await cookies();

  const nextAuthSessionToken = nextCookies.get('next-auth.session-token');

  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}`,
    {
      headers: {
        Cookie: `__Secure-next-auth.session-token=${nextAuthSessionToken?.value}`,
      },
    },
  );

  return data;
};

export const getDeliveryPrice = async () => {
  const nextCookies = await cookies();

  const cookieName = getCookieName();
  const nextAuthSessionToken = nextCookies.get(cookieName);

  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/settings/deliveryPrice`,
    {
      headers: {
        Cookie: `${nextAuthSessionToken?.name}=${nextAuthSessionToken?.value}`,
      },
    },
  );

  return data;
};

export const getPaymentTypeData = async () => {
  const nextCookies = await cookies();

  const cookieName = getCookieName();
  const nextAuthSessionToken = nextCookies.get(cookieName);

  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/settings/paymentType`,
    {
      headers: {
        Cookie: `${nextAuthSessionToken?.name}=${nextAuthSessionToken?.value}`,
      },
    },
  );

  return data;
};

export const getCategoryData = async () => {
  const nextCookies = await cookies();

  const cookieName = getCookieName();
  const nextAuthSessionToken = nextCookies.get(cookieName);

  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/settings/category`,
    {
      headers: {
        Cookie: `${nextAuthSessionToken?.name}=${nextAuthSessionToken?.value}`,
      },
    },
  );

  return data;
};

export const getAllUsers = async (searchParams) => {
  const nextCookies = await cookies();

  const cookieName = getCookieName();
  const nextAuthSessionToken = nextCookies.get(cookieName);

  const urlParams = {
    keyword: (await searchParams).keyword,
    page: (await searchParams).page || 1,
  };

  const searchQuery = queryString.stringify(urlParams);

  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/users?${searchQuery}`,
    {
      headers: {
        Cookie: `${nextAuthSessionToken?.name}=${nextAuthSessionToken?.value}`,
      },
    },
  );

  return data;
};

export const getUsersPurchasingsData = async () => {
  const nextCookies = await cookies();

  const cookieName = getCookieName();
  const nextAuthSessionToken = nextCookies.get(cookieName);

  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/users/purchasingStats`,
    {
      headers: {
        Cookie: `${nextAuthSessionToken?.name}=${nextAuthSessionToken?.value}`,
      },
    },
  );

  return data;
};

export const getSingleUser = async (id) => {
  const nextCookies = await cookies();

  const cookieName = getCookieName();
  const nextAuthSessionToken = nextCookies.get(cookieName);

  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/users/${id}`,
    {
      headers: {
        Cookie: `${nextAuthSessionToken?.name}=${nextAuthSessionToken?.value}`,
      },
    },
  );

  return data;
};
