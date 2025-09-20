import User from '../models/user';
import Order from '../models/order';

/**
 * Helper pour générer les ranges de dates pour un mois donné
 * @param {number} month - Le mois (1-12)
 * @param {number} year - L'année
 * @returns {Object} - { startDate, endDate }
 */
const getMonthDateRange = (month, year) => {
  // Validation des paramètres
  if (month < 1 || month > 12) {
    throw new Error('Month must be between 1 and 12');
  }

  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 1);
  return { startDate, endDate };
};

/**
 * Méthode principale pour obtenir toutes les statistiques utilisateurs
 * Utilise $facet pour optimiser les performances
 */
export const getUserAnalytics = async (month = null, year = null) => {
  try {
    const pipeline = [];

    // Filtre de base pour les commandes payées
    const matchStage = { paymentStatus: 'paid' };

    // Ajouter le filtre de date si fourni
    if (month && year) {
      const { startDate, endDate } = getMonthDateRange(month, year);
      matchStage.createdAt = { $gte: startDate, $lt: endDate };
    }

    pipeline.push(
      { $match: matchStage },
      {
        $facet: {
          // Total des utilisateurs uniques ayant acheté
          uniqueBuyers: [
            { $group: { _id: '$user' } },
            { $count: 'totalUsers' },
          ],

          // Top acheteur(s) avec détails
          topBuyers: [
            {
              $group: {
                _id: '$user',
                totalSpent: { $sum: '$totalAmount' },
                totalOrders: { $sum: 1 },
                avgOrderValue: { $avg: '$totalAmount' },
                totalTaxes: { $sum: '$taxAmount' },
                totalShipping: { $sum: '$shippingAmount' },
                firstPurchase: { $min: '$createdAt' },
                lastPurchase: { $max: '$createdAt' },
              },
            },
            { $sort: { totalSpent: -1 } },
            { $limit: 10 },
            {
              $lookup: {
                from: 'users',
                localField: '_id',
                foreignField: '_id',
                as: 'userInfo',
              },
            },
            {
              $project: {
                _id: 1,
                totalSpent: 1,
                totalOrders: 1,
                avgOrderValue: 1,
                totalTaxes: 1,
                totalShipping: 1,
                firstPurchase: 1,
                lastPurchase: 1,
                result: { $arrayElemAt: ['$userInfo', 0] },
              },
            },
          ],

          // Stats par période (mensuelle si dates fournies, globale sinon)
          periodStats: [
            {
              $group: {
                _id: null,
                totalRevenue: { $sum: '$totalAmount' },
                totalOrders: { $sum: 1 },
                avgOrderValue: { $avg: '$totalAmount' },
                uniqueBuyers: { $addToSet: '$user' },
              },
            },
            {
              $project: {
                _id: 0,
                totalRevenue: 1,
                totalOrders: 1,
                avgOrderValue: 1,
                uniqueBuyersCount: { $size: '$uniqueBuyers' },
              },
            },
          ],
        },
      },
    );

    const result = await Order.aggregate(pipeline, { allowDiskUse: true });
    return result[0] || { uniqueBuyers: [], topBuyers: [], periodStats: [] };
  } catch (error) {
    console.error('Error in getUserAnalytics:', error);
    throw error;
  }
};

/**
 * Obtenir les statistiques d'inscription des utilisateurs
 */
export const getUserRegistrationStats = async (month = null, year = null) => {
  try {
    const pipeline = [];

    // Filtre de base pour les utilisateurs clients
    const matchStage = { role: 'user' };

    // Ajouter le filtre de date si fourni
    if (month && year) {
      const { startDate, endDate } = getMonthDateRange(month, year);
      matchStage.createdAt = { $gte: startDate, $lt: endDate };
    }

    pipeline.push(
      { $match: matchStage },
      {
        $facet: {
          // Total des inscriptions
          totalRegistrations: [{ $count: 'totalUsers' }],

          // Tendance par jour (pour le mois en cours)
          dailyTrend:
            month && year
              ? [
                  {
                    $group: {
                      _id: { $dayOfMonth: '$createdAt' },
                      count: { $sum: 1 },
                    },
                  },
                  { $sort: { _id: 1 } },
                ]
              : [],

          // Stats détaillées
          registrationDetails: [
            {
              $group: {
                _id: null,
                total: { $sum: 1 },
                verified: {
                  $sum: { $cond: ['$verified', 1, 0] },
                },
                unverified: {
                  $sum: { $cond: ['$verified', 0, 1] },
                },
                active: {
                  $sum: { $cond: ['$isActive', 1, 0] },
                },
                firstRegistration: { $min: '$createdAt' },
                lastRegistration: { $max: '$createdAt' },
              },
            },
          ],
        },
      },
    );

    const result = await User.aggregate(pipeline);
    return (
      result[0] || {
        totalRegistrations: [],
        dailyTrend: [],
        registrationDetails: [],
      }
    );
  } catch (error) {
    console.error('Error in getUserRegistrationStats:', error);
    throw error;
  }
};

/**
 * MÉTHODES DE COMPATIBILITÉ - À DÉPRÉCIER PROGRESSIVEMENT
 * Ces méthodes gardent la même signature que l'ancienne version
 */

export const usersRegisteredPerMonthPipeline = async (month, year) => {
  const stats = await getUserRegistrationStats(month, year);
  return stats.totalRegistrations || [{ totalUsers: 0 }];
};

export const totalUsersThatBoughtPipeline = async () => {
  const analytics = await getUserAnalytics();
  return analytics.uniqueBuyers || [{ totalUsers: 0 }];
};

export const totalUsersThatBoughtThisMonthPipeline = async (month, year) => {
  const analytics = await getUserAnalytics(month, year);
  return analytics.uniqueBuyers || [{ totalUsers: 0 }];
};

export const userThatBoughtMostSinceBeginningPipeline = async () => {
  const analytics = await getUserAnalytics();

  // Retourner le format attendu (le premier top buyer)
  if (analytics.topBuyers && analytics.topBuyers.length > 0) {
    const topBuyer = analytics.topBuyers[0];
    return [
      {
        _id: topBuyer._id,
        totalPurchases: topBuyer.totalOrders,
        result: topBuyer.result ? [topBuyer.result] : [],
      },
    ];
  }

  return [];
};

export const usersThatBoughtMostThisMonthPipeline = async (month, year) => {
  const analytics = await getUserAnalytics(month, year);

  // Retourner le format attendu (tous les top buyers du mois)
  if (analytics.topBuyers && analytics.topBuyers.length > 0) {
    return analytics.topBuyers.map((buyer) => ({
      _id: buyer._id,
      totalPurchases: buyer.totalSpent, // Montant total et non nombre de commandes
      totalTaxes: buyer.totalTaxes || 0,
      result: buyer.result ? [buyer.result] : [],
    }));
  }

  return [];
};

/**
 * NOUVELLES MÉTHODES OPTIMISÉES
 */

/**
 * Obtenir un rapport complet sur les utilisateurs
 */
export const getUsersComprehensiveReport = async (options = {}) => {
  const { startDate, endDate, limit = 20 } = options;

  try {
    const pipeline = [];

    // Filtre de date si fourni
    if (startDate && endDate) {
      pipeline.push({
        $match: {
          createdAt: { $gte: startDate, $lt: endDate },
        },
      });
    }

    pipeline.push({
      $facet: {
        // Stats utilisateurs
        userStats: [
          {
            $group: {
              _id: '$role',
              count: { $sum: 1 },
            },
          },
        ],

        // Utilisateurs récents
        recentUsers: [
          { $sort: { createdAt: -1 } },
          { $limit: limit },
          {
            $project: {
              _id: 1,
              name: 1,
              email: 1,
              phone: 1,
              role: 1,
              verified: 1,
              isActive: 1,
              createdAt: 1,
              lastLogin: 1,
            },
          },
        ],

        // Stats de vérification
        verificationStats: [
          {
            $group: {
              _id: null,
              total: { $sum: 1 },
              verified: {
                $sum: { $cond: ['$verified', 1, 0] },
              },
              verificationRate: {
                $avg: { $cond: ['$verified', 1, 0] },
              },
            },
          },
        ],

        // Stats d'activité
        activityStats: [
          {
            $group: {
              _id: null,
              total: { $sum: 1 },
              active: {
                $sum: { $cond: ['$isActive', 1, 0] },
              },
              hasLoggedIn: {
                $sum: {
                  $cond: [{ $ne: ['$lastLogin', null] }, 1, 0],
                },
              },
              loggedInLast30Days: {
                $sum: {
                  $cond: [
                    {
                      $gte: [
                        '$lastLogin',
                        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                      ],
                    },
                    1,
                    0,
                  ],
                },
              },
            },
          },
        ],
      },
    });

    const result = await User.aggregate(pipeline);
    return result[0] || {};
  } catch (error) {
    console.error('Error in getUsersComprehensiveReport:', error);
    throw error;
  }
};

/**
 * Obtenir les meilleurs clients avec leurs statistiques d'achat détaillées
 */
export const getTopCustomersWithDetails = async (options = {}) => {
  const {
    limit = 10,
    minOrders = 0,
    startDate,
    endDate,
    includeProducts = false,
  } = options;

  try {
    const pipeline = [];

    // Filtre de base
    const matchStage = { paymentStatus: 'paid' };
    if (startDate && endDate) {
      matchStage.createdAt = { $gte: startDate, $lt: endDate };
    }

    pipeline.push(
      { $match: matchStage },
      {
        $group: {
          _id: '$user',
          totalSpent: { $sum: '$totalAmount' },
          orderCount: { $sum: 1 },
          avgOrderValue: { $avg: '$totalAmount' },
          maxOrderValue: { $max: '$totalAmount' },
          minOrderValue: { $min: '$totalAmount' },
          totalItems: { $sum: { $size: '$orderItems' } },
          firstPurchase: { $min: '$createdAt' },
          lastPurchase: { $max: '$createdAt' },
          orderIds: { $push: '$_id' },
          // Optionnel : collecter les produits achetés
          ...(includeProducts && {
            products: { $push: '$orderItems' },
          }),
        },
      },
    );

    // Filtrer par nombre minimum de commandes
    if (minOrders > 0) {
      pipeline.push({
        $match: { orderCount: { $gte: minOrders } },
      });
    }

    pipeline.push(
      { $sort: { totalSpent: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'userDetails',
        },
      },
      {
        $project: {
          _id: 1,
          totalSpent: 1,
          orderCount: 1,
          avgOrderValue: 1,
          maxOrderValue: 1,
          minOrderValue: 1,
          totalItems: 1,
          firstPurchase: 1,
          lastPurchase: 1,
          daysSinceFirstPurchase: {
            $divide: [
              { $subtract: ['$lastPurchase', '$firstPurchase'] },
              1000 * 60 * 60 * 24,
            ],
          },
          user: { $arrayElemAt: ['$userDetails', 0] },
          recentOrders: { $slice: ['$orderIds', -5] }, // 5 dernières commandes
          ...(includeProducts && {
            uniqueProducts: {
              $size: {
                $reduce: {
                  input: '$products',
                  initialValue: [],
                  in: { $setUnion: ['$$value', '$$this'] },
                },
              },
            },
          }),
        },
      },
    );

    return await Order.aggregate(pipeline, { allowDiskUse: true });
  } catch (error) {
    console.error('Error in getTopCustomersWithDetails:', error);
    throw error;
  }
};

/**
 * Analyser le comportement d'achat des utilisateurs
 */
export const analyzeUserPurchaseBehavior = async (userId) => {
  try {
    const pipeline = [
      {
        $match: {
          user: userId,
          paymentStatus: 'paid',
        },
      },
      {
        $facet: {
          // Stats globales
          summary: [
            {
              $group: {
                _id: null,
                totalSpent: { $sum: '$totalAmount' },
                orderCount: { $sum: 1 },
                avgOrderValue: { $avg: '$totalAmount' },
                totalItems: { $sum: { $size: '$orderItems' } },
                firstPurchase: { $min: '$createdAt' },
                lastPurchase: { $max: '$createdAt' },
              },
            },
          ],

          // Tendance mensuelle
          monthlyTrend: [
            {
              $group: {
                _id: {
                  year: { $year: '$createdAt' },
                  month: { $month: '$createdAt' },
                },
                spent: { $sum: '$totalAmount' },
                orders: { $sum: 1 },
              },
            },
            { $sort: { '_id.year': -1, '_id.month': -1 } },
            { $limit: 12 },
          ],

          // Produits favoris
          favoriteProducts: [
            { $unwind: '$orderItems' },
            {
              $group: {
                _id: '$orderItems.product',
                productName: { $first: '$orderItems.name' },
                category: { $first: '$orderItems.category' },
                timesPurchased: { $sum: 1 },
                totalQuantity: { $sum: '$orderItems.quantity' },
                totalSpent: {
                  $sum: {
                    $multiply: ['$orderItems.price', '$orderItems.quantity'],
                  },
                },
              },
            },
            { $sort: { timesPurchased: -1 } },
            { $limit: 5 },
          ],
        },
      },
    ];

    const result = await Order.aggregate(pipeline);
    return result[0] || {};
  } catch (error) {
    console.error('Error in analyzeUserPurchaseBehavior:', error);
    throw error;
  }
};

/**
 * Méthode pour obtenir les statistiques de performance avec explain
 */
export const getUserStatsWithExplain = async (month, year) => {
  const pipeline = [];
  const matchStage = { role: 'user' };

  if (month && year) {
    const { startDate, endDate } = getMonthDateRange(month, year);
    matchStage.createdAt = { $gte: startDate, $lt: endDate };
  }

  pipeline.push({ $match: matchStage }, { $count: 'total' });

  return await User.aggregate(pipeline).explain('executionStats');
};
