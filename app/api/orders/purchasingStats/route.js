import dbConnect from '@/backend/config/dbConnect';
import Order from '@/backend/models/order';
import { getMonthlyOrdersAnalytics } from '@/backend/pipelines/orderPipelines';
import { NextResponse } from 'next/server';

export async function GET() {
  // Connexion DB
  await dbConnect();
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  // Stats globales (depuis le début)
  const [
    ordersPaidCount,
    ordersUnpaidCount,
    processingOrdersCount,
    shippedOrdersCount,
  ] = await Promise.all([
    Order.countDocuments({ paymentStatus: 'paid' }),
    Order.countDocuments({ paymentStatus: 'unpaid' }),
    Order.countDocuments({ paymentStatus: 'paid', orderStatus: 'Processing' }),
    Order.countDocuments({ paymentStatus: 'paid', orderStatus: 'Shipped' }),
  ]);

  // Obtenir toutes les stats mensuelles en une seule requête
  const monthlyStats = await getMonthlyOrdersAnalytics(
    currentMonth,
    currentYear,
  );

  return NextResponse.json(
    {
      // Stats globales
      ordersPaidCount,
      ordersUnpaidCount,
      processingOrdersCount,
      shippedOrdersCount,

      // Stats mensuelles (formatées pour compatibilité)
      totalOrdersPaidThisMonth: [
        { totalOrdersPaid: monthlyStats.totalOrdersPaid },
      ],
      totalOrdersUnpaidThisMonth: [
        { totalOrdersUnpaid: monthlyStats.totalOrdersUnpaid },
      ],
      totalOrdersProcessingThisMonth: [
        { totalOrdersProcessing: monthlyStats.totalOrdersProcessing },
      ],
      totalOrdersShippedThisMonth: [
        { totalOrdersShipped: monthlyStats.totalOrdersShipped },
      ],

      // Listes
      listOrdersPaidThisMonth: monthlyStats.listOrdersPaidThisMonth,
      listOrdersUnpaidThisMonth: monthlyStats.listOrdersUnpaidThisMonth,
    },
    { status: 200 },
  );
}
