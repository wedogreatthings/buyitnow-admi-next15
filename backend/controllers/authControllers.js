import User from '../models/user';
import ErrorHandler from '../utils/errorHandler';
import APIFilters from '../utils/APIFilters';
import {
  getUserAnalytics,
  getUserRegistrationStats,
} from '../pipelines/userPipelines';
import Order from '../models/order';
import mongoose from 'mongoose';

export const getUsers = async (req, res) => {
  try {
    const resPerPage = 2;

    // Pagination et filtrage existants
    const usersCount = await User.countDocuments();
    const apiFilters = new APIFilters(User.find(), req.query).search().filter();

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

    res.status(200).json({
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
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const getUser = async (req, res, next) => {
  try {
    let user = await User.findById(req.query.id);

    if (!user) {
      return next(new ErrorHandler('No user found', 404));
    }

    // Utiliser la projection pour limiter les champs retournés
    const orders = await Order.find({
      user: new mongoose.Types.ObjectId(user?._id),
    })
      .select(
        'orderNumber totalAmount shippingInfo orderStatus paymentInfo.typePayment paymentStatus createdAt',
      )
      .sort({ createdAt: -1 })
      .limit(50); // Limiter aux 50 dernières commandes

    // Si l'utilisateur a des stats pré-calculées, les inclure
    const userObj = user.toObject();
    if (user.purchaseStats && user.purchaseStats.totalOrders > 0) {
      userObj.purchaseStatsCalculated = true;
    }

    res.status(200).json({
      success: true,
      user: userObj,
      orders,
      orderCount: orders.length,
    });
  } catch (error) {
    console.error('Error in getUser:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const updateUser = async (req, res, next) => {
  let user = await User.findById(req.query.id);

  if (!user) {
    return next(new ErrorHandler('No user found', 404));
  }

  user = await User.findByIdAndUpdate(req.query.id, req.body.userData);

  res.status(200).json({
    success: true,
    user,
  });
};

export const deleteUser = async (req, res, next) => {
  let user = await User.findById(req.query.id);

  if (!user) {
    return next(new ErrorHandler('No User found', 404));
  }

  await user.deleteOne();

  res.status(200).json({
    success: true,
  });
};

export const getPurchasingsStats = async (req, res) => {
  try {
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    // Une seule requête pour les stats globales et mensuelles
    const [globalAnalytics, monthlyAnalytics] = await Promise.all([
      getUserAnalytics(),
      getUserAnalytics(currentMonth, currentYear),
    ]);

    res.status(200).json({
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
      usersThatBoughtMostThisMonth: monthlyAnalytics.topBuyers.map((buyer) => ({
        _id: buyer._id,
        totalPurchases: buyer.totalSpent,
        totalTaxes: buyer.totalTaxes,
        result: [buyer.result],
      })),

      // Bonus : statistiques détaillées
      monthlyRevenue: monthlyAnalytics.periodStats[0]?.totalRevenue || 0,
      monthlyAvgOrderValue: monthlyAnalytics.periodStats[0]?.avgOrderValue || 0,
      topBuyersDetails: globalAnalytics.topBuyers.slice(0, 5), // Top 5 acheteurs avec détails
    });
  } catch (error) {
    console.error('Error in getPurchasingsStats:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// ========================================
// NOUVELLE MÉTHODE : Rapport complet des utilisateurs
// ========================================
// export const getUsersReport = async (req, res) => {
//   try {
//     const { startDate, endDate, limit = 20 } = req.query;

//     const options = {};
//     if (startDate) options.startDate = new Date(startDate);
//     if (endDate) options.endDate = new Date(endDate);
//     if (limit) options.limit = parseInt(limit);

//     const report = await getUsersComprehensiveReport(options);

//     res.status(200).json({
//       success: true,
//       data: report
//     });
//   } catch (error) {
//     console.error('Error in getUsersReport:', error);
//     res.status(500).json({
//       success: false,
//       error: error.message
//     });
//   }
// };

// ========================================
// NOUVELLE MÉTHODE : Top clients avec détails
// ========================================
// export const getTopCustomers = async (req, res) => {
//   try {
//     const {
//       limit = 10,
//       minOrders = 0,
//       startDate,
//       endDate,
//       includeProducts = false
//     } = req.query;

//     const options = {
//       limit: parseInt(limit),
//       minOrders: parseInt(minOrders),
//       includeProducts: includeProducts === 'true'
//     };

//     if (startDate) options.startDate = new Date(startDate);
//     if (endDate) options.endDate = new Date(endDate);

//     const topCustomers = await getTopCustomersWithDetails(options);

//     res.status(200).json({
//       success: true,
//       count: topCustomers.length,
//       data: topCustomers
//     });
//   } catch (error) {
//     console.error('Error in getTopCustomers:', error);
//     res.status(500).json({
//       success: false,
//       error: error.message
//     });
//   }
// };

// ========================================
// NOUVELLE MÉTHODE : Analyse comportement utilisateur
// ========================================
// export const analyzeUserBehavior = async (req, res) => {
//   try {
//     const userId = req.params.id || req.query.id;

//     if (!userId) {
//       return res.status(400).json({
//         success: false,
//         error: 'User ID is required'
//       });
//     }

//     const { analyzeUserPurchaseBehavior } = require('../pipelines/userPipelines');
//     const behavior = await analyzeUserPurchaseBehavior(
//       new mongoose.Types.ObjectId(userId)
//     );

//     res.status(200).json({
//       success: true,
//       data: behavior
//     });
//   } catch (error) {
//     console.error('Error in analyzeUserBehavior:', error);
//     res.status(500).json({
//       success: false,
//       error: error.message
//     });
//   }
// };
