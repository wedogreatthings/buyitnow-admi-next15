import dbConnect from '@/backend/config/dbConnect';
import User from '@/backend/models/user';
import { getUserRegistrationStats } from '@/backend/pipelines/userPipelines';
import APIFilters from '@/backend/utils/APIFilters';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    await dbConnect();

    const resPerPage = 2;

    // Pagination et filtrage existants
    const usersCount = await User.countDocuments();
    const apiFilters = new APIFilters(User.find(), req.nextUrl.searchParams)
      .search()
      .filter();

    let users = await apiFilters.query.sort({ createdAt: -1 });
    const filteredUsers = users?.length;

    apiFilters.pagination(resPerPage);
    users = await apiFilters.query.clone().sort({ createdAt: -1 });

    const result = filteredUsers / resPerPage;
    const totalPages = Number.isInteger(result) ? result : Math.ceil(result);

    // Dates pour les stats
    const lastMonth = new Date().getMonth();
    const currentMonth = lastMonth + 1;
    const currentYear = new Date().getFullYear();

    // Une seule requête pour toutes les stats d'inscription
    const [currentMonthStats, lastMonthStats, clientUsersCount] =
      await Promise.all([
        getUserRegistrationStats(currentMonth, currentYear),
        getUserRegistrationStats(lastMonth, currentYear),
        User.countDocuments({ role: 'user' }),
      ]);

    return NextResponse.json({
      usersRegisteredLastMonth: lastMonthStats.totalRegistrations,
      usersRegisteredThisMonth: currentMonthStats.totalRegistrations,
      clientUsersCount,
      totalPages,
      usersCount,
      filteredUsers,
      users,
      // Bonus : tendance quotidienne du mois en cours
      dailyRegistrationTrend: currentMonthStats.dailyTrend || [],
    });
  } catch (error) {
    console.error('Error in getUsers:', error);

    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
