/* eslint-disable no-unused-vars */
import dbConnect from '@/backend/config/dbConnect';
import DeliveryPrice from '@/backend/models/deliveryPrice';
import Address from '@/backend/models/address';
import Order from '@/backend/models/order';
import { getMonthlyOrdersAnalytics } from '@/backend/pipelines/orderPipelines';
import {
  descListCategorySoldSinceBeginningPipeline,
  descListProductSoldSinceBeginningPipeline,
  descListProductSoldThisMonthPipeline,
} from '@/backend/pipelines/productPipelines';
import { userThatBoughtMostSinceBeginningPipeline } from '@/backend/pipelines/userPipelines';
import APIFilters from '@/backend/utils/APIFilters';
import { NextResponse } from 'next/server';

export async function GET(req) {
  // Connexion DB
  await dbConnect();

  const resPerPage = 2;
  const ordersCount = await Order.countDocuments();

  let orders;
  let filteredOrdersCount = 0;
  let totalPages = 0;
  let result = 0;

  const searchParams = req.nextUrl.searchParams;

  if (searchParams?.get('keyword')) {
    const orderNumber = searchParams?.get('keyword');
    orders = await Order.findOne({ orderNumber: orderNumber }).populate(
      'shippingInfo user',
    );

    if (orders) filteredOrdersCount = 1;
  } else {
    const apiFilters = new APIFilters(Order.find(), searchParams).filter();

    orders = await apiFilters.query
      .populate('shippingInfo user')
      .sort({ createdAt: -1 });
    filteredOrdersCount = orders.length;

    apiFilters.pagination(resPerPage);
    orders = await apiFilters.query
      .clone()
      .populate('shippingInfo user')
      .sort({ createdAt: -1 });

    result = ordersCount / resPerPage;
    totalPages = Number.isInteger(result) ? result : Math.ceil(result);
  }

  // NOUVELLE IMPLÉMENTATION : Une seule requête pour toutes les stats
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  // Obtenir toutes les stats en une seule requête
  const monthlyStats = await getMonthlyOrdersAnalytics(
    currentMonth,
    currentYear,
  );

  // Stats supplémentaires (depuis le début, pas seulement ce mois)
  const deliveredOrdersCount = await Order.countDocuments({
    paymentStatus: 'paid',
    orderStatus: 'Delivered',
  });

  // Descendant List of Product Sold Since The Beginning
  const descListProductSoldSinceBeginning =
    await descListProductSoldSinceBeginningPipeline();

  // Descendant List of Category Sold Since The Beginning
  const descListCategorySoldSinceBeginning =
    await descListCategorySoldSinceBeginningPipeline();

  const descListProductSoldThisMonth =
    await descListProductSoldThisMonthPipeline(currentMonth, currentYear);

  const userThatBoughtMostSinceBeginning =
    await userThatBoughtMostSinceBeginningPipeline();

  const deliveryPrice = await DeliveryPrice.find();

  const overviewPattern = /overview/;

  if (overviewPattern.test(req?.url)) {
    return NextResponse.json(
      {
        deliveryPrice,
        userThatBoughtMostSinceBeginning,
        descListProductSoldThisMonth,
        descListCategorySoldSinceBeginning,
        descListProductSoldSinceBeginning,
        // Utilisation des nouvelles stats
        totalOrdersUnpaidThisMonth: [
          { totalOrdersUnpaid: monthlyStats.totalOrdersUnpaid },
        ],
        totalOrdersPaidThisMonth: [
          { totalOrdersPaid: monthlyStats.totalOrdersPaid },
        ],
        totalOrdersThisMonth: [{ totalOrders: monthlyStats.totalOrders }],
        ordersCount,
        totalPages,
        filteredOrdersCount,
        orders,
      },
      { status: 200 },
    );
  } else {
    return NextResponse.json(
      {
        deliveryPrice,
        // Utilisation des nouvelles stats
        totalOrdersDeliveredThisMonth: [
          { totalOrdersDelivered: monthlyStats.totalOrdersDelivered },
        ],
        deliveredOrdersCount,
        totalOrdersThisMonth: [{ totalOrders: monthlyStats.totalOrders }],
        totalPages,
        ordersCount,
        filteredOrdersCount,
        orders,
      },
      { status: 200 },
    );
  }
}
