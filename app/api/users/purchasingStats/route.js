/* eslint-disable no-unused-vars */
import dbConnect from '@/backend/config/dbConnect';
import { getUserAnalytics } from '@/backend/pipelines/userPipelines';

export async function GET(req) {
  try {
    await dbConnect();
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    // Une seule requête pour les stats globales et mensuelles
    const [globalAnalytics, monthlyAnalytics] = await Promise.all([
      getUserAnalytics(),
      getUserAnalytics(currentMonth, currentYear),
    ]);

    return new Response(
      JSON.stringify({
        // Stats globales
        totalUsersThatBought: globalAnalytics.uniqueBuyers,
        userThatBoughtMostSinceBeginning:
          globalAnalytics.topBuyers.length > 0
            ? [
                {
                  _id: globalAnalytics.topBuyers[0]._id,
                  totalPurchases: globalAnalytics.topBuyers[0].totalOrders,
                  result: [globalAnalytics.topBuyers[0].result],
                },
              ]
            : [],
        // Stats mensuelles
        totalUsersThatBoughtThisMonth: monthlyAnalytics.uniqueBuyers,
        usersThatBoughtMostThisMonth: monthlyAnalytics.topBuyers.map(
          (buyer) => ({
            _id: buyer._id,
            totalPurchases: buyer.totalSpent,
            totalTaxes: buyer.totalTaxes,
            result: [buyer.result],
          }),
        ),
        // Bonus : statistiques détaillées
        monthlyRevenue: monthlyAnalytics.periodStats[0]?.totalRevenue || 0,
        monthlyAvgOrderValue:
          monthlyAnalytics.periodStats[0]?.avgOrderValue || 0,
        topBuyersDetails: globalAnalytics.topBuyers.slice(0, 5), // Top 5 acheteurs avec détails
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
  } catch (error) {
    console.error('Error in getPurchasingsStats:', error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
}
