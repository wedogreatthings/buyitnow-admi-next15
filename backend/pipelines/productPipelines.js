import mongoose from 'mongoose';
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
 * Obtenir toutes les statistiques de ventes en une seule requête optimisée
 * Utilise $facet pour éviter les requêtes multiples
 */
export const getProductSalesAnalytics = async (month = null, year = null) => {
  try {
    const pipeline = [];

    // Filtre de base pour les commandes payées
    const matchStage = { paymentStatus: 'paid' };

    // Ajouter le filtre de date si fourni
    if (month && year) {
      const { startDate, endDate } = getMonthDateRange(month, year);
      matchStage.createdAt = { $gte: startDate, $lt: endDate };
    }

    pipeline.push({ $match: matchStage });

    // Utiliser $facet pour obtenir toutes les stats en une seule requête
    pipeline.push({
      $facet: {
        // Stats par produit
        productStats: [
          { $unwind: '$orderItems' },
          {
            $group: {
              _id: '$orderItems.product',
              totalAmount: {
                $sum: {
                  $multiply: ['$orderItems.price', '$orderItems.quantity'],
                },
              },
              totalQuantity: { $sum: '$orderItems.quantity' },
              productInfo: {
                $first: {
                  name: '$orderItems.name',
                  category: '$orderItems.category',
                  image: '$orderItems.image',
                },
              },
            },
          },
          { $sort: { totalAmount: -1 } },
          { $limit: 50 }, // Top 50 produits
        ],

        // Stats par catégorie
        categoryStats: [
          { $unwind: '$orderItems' },
          {
            $group: {
              _id: '$orderItems.category',
              totalAmount: {
                $sum: {
                  $multiply: ['$orderItems.price', '$orderItems.quantity'],
                },
              },
              totalQuantity: { $sum: '$orderItems.quantity' },
              productCount: { $addToSet: '$orderItems.product' },
              sampleProducts: {
                $push: {
                  $cond: [
                    { $lte: [{ $rand: {} }, 0.1] }, // Échantillon aléatoire
                    { name: '$orderItems.name', image: '$orderItems.image' },
                    null,
                  ],
                },
              },
            },
          },
          {
            $project: {
              _id: 1,
              totalAmount: 1,
              totalQuantity: 1,
              uniqueProductCount: { $size: '$productCount' },
              sampleProducts: {
                $filter: {
                  input: '$sampleProducts',
                  cond: { $ne: ['$$this', null] },
                },
              },
            },
          },
          { $sort: { totalAmount: -1 } },
        ],
      },
    });

    const result = await Order.aggregate(pipeline, { allowDiskUse: true });

    return result[0] || { productStats: [], categoryStats: [] };
  } catch (error) {
    console.error('Error in getProductSalesAnalytics:', error);
    throw error;
  }
};

/**
 * MÉTHODES DE COMPATIBILITÉ - À DÉPRÉCIER PROGRESSIVEMENT
 * Ces méthodes gardent la même signature que l'ancienne version
 */

export const descListProductSoldSinceBeginningPipeline = async () => {
  const analytics = await getProductSalesAnalytics();

  // Transformer pour matcher l'ancien format
  return analytics.productStats.map((item) => ({
    _id: item._id,
    totalAmount: item.totalAmount,
    totalQuantity: item.totalQuantity,
    productName: [item.productInfo.name],
    productCategory: [item.productInfo.category],
    productImage: [item.productInfo.image],
  }));
};

export const descListProductSoldThisMonthPipeline = async (month, year) => {
  const analytics = await getProductSalesAnalytics(month, year);

  // Transformer pour matcher l'ancien format
  return analytics.productStats.map((item) => ({
    _id: item._id,
    totalAmount: item.totalAmount,
    totalQuantity: item.totalQuantity,
    productName: [item.productInfo.name],
    productCategory: [item.productInfo.category],
    productImage: [item.productInfo.image],
  }));
};

export const descListCategorySoldSinceBeginningPipeline = async () => {
  const analytics = await getProductSalesAnalytics();

  // Transformer pour matcher l'ancien format
  return analytics.categoryStats.map((item) => ({
    _id: item._id,
    totalAmount: item.totalAmount,
    totalQuantity: item.totalQuantity,
    productName: item.sampleProducts.map((p) => p?.name).filter(Boolean),
    productImage: item.sampleProducts.map((p) => p?.image).filter(Boolean),
  }));
};

export const descListCategorySoldThisMonthPipeline = async (month, year) => {
  const analytics = await getProductSalesAnalytics(month, year);

  // Transformer pour matcher l'ancien format
  return analytics.categoryStats.map((item) => ({
    _id: item._id,
    totalAmount: item.totalAmount,
    totalQuantity: item.totalQuantity,
    productName: item.sampleProducts.map((p) => p?.name).filter(Boolean),
    productImage: item.sampleProducts.map((p) => p?.image).filter(Boolean),
  }));
};

/**
 * Méthode optimisée pour obtenir les commandes contenant un produit spécifique
 * Évite le double $unwind de l'ancienne version
 */
export const orderIDsForProductPipeline = async (productId) => {
  try {
    const pipeline = [
      // D'abord matcher sur le produit dans l'array (utilise l'index si disponible)
      {
        $match: {
          'orderItems.product': new mongoose.Types.ObjectId(productId),
        },
      },
      // Limiter les champs pour optimiser la mémoire
      {
        $project: {
          _id: 1,
          createdAt: 1,
          paymentStatus: 1,
          orderItems: {
            $filter: {
              input: '$orderItems',
              cond: {
                $eq: ['$$this.product', new mongoose.Types.ObjectId(productId)],
              },
            },
          },
        },
      },
      // Trier par date de création
      { $sort: { createdAt: -1 } },
      // Formater la sortie pour compatibilité
      {
        $project: {
          _id: 1,
          details: [
            {
              date: '$createdAt',
              payment: '$paymentStatus',
            },
          ],
        },
      },
    ];

    return await Order.aggregate(pipeline);
  } catch (error) {
    console.error('Error in orderIDsForProductPipeline:', error);
    throw error;
  }
};

/**
 * Méthode optimisée pour calculer les revenus générés par un produit
 * Utilise $match avant $unwind pour réduire le dataset
 */
export const revenuesGeneratedPerProduct = async (productId) => {
  try {
    const pipeline = [
      // Filtrer d'abord les commandes payées
      { $match: { paymentStatus: 'paid' } },

      // Filtrer les commandes contenant ce produit (utilise l'index)
      {
        $match: {
          'orderItems.product': new mongoose.Types.ObjectId(productId),
        },
      },

      // Maintenant seulement, unwind les items
      { $unwind: '$orderItems' },

      // Garder seulement les items du produit recherché
      {
        $match: {
          'orderItems.product': new mongoose.Types.ObjectId(productId),
        },
      },

      // Grouper et calculer
      {
        $group: {
          _id: '$orderItems.product',
          totalRevenue: {
            $sum: { $multiply: ['$orderItems.price', '$orderItems.quantity'] },
          },
          totalQuantity: { $sum: '$orderItems.quantity' },
          orderCount: { $sum: 1 },
          details: {
            $push: {
              date: '$createdAt',
              quantity: '$orderItems.quantity',
              price: '$orderItems.price',
              subtotal: {
                $multiply: ['$orderItems.price', '$orderItems.quantity'],
              },
            },
          },
          avgOrderValue: {
            $avg: { $multiply: ['$orderItems.price', '$orderItems.quantity'] },
          },
          firstSale: { $min: '$createdAt' },
          lastSale: { $max: '$createdAt' },
        },
      },

      // Limiter le nombre de détails pour éviter la surcharge mémoire
      {
        $project: {
          _id: 1,
          totalRevenue: 1,
          totalQuantity: 1,
          orderCount: 1,
          avgOrderValue: 1,
          firstSale: 1,
          lastSale: 1,
          details: { $slice: ['$details', -100] }, // Garder les 100 dernières ventes
        },
      },
    ];

    const result = await Order.aggregate(pipeline);

    // Retourner dans le format attendu pour compatibilité
    if (result.length > 0) {
      return [
        {
          _id: result[0]._id,
          details: result[0].details,
        },
      ];
    }

    return [];
  } catch (error) {
    console.error('Error in revenuesGeneratedPerProduct:', error);
    throw error;
  }
};

/**
 * NOUVELLES MÉTHODES OPTIMISÉES
 */

/**
 * Obtenir les top N produits par période
 */
export const getTopProducts = async (options = {}) => {
  const {
    limit = 10,
    month = null,
    year = null,
    sortBy = 'revenue', // 'revenue' ou 'quantity'
  } = options;

  try {
    const pipeline = [];

    // Filtre de base
    const matchStage = { paymentStatus: 'paid' };

    if (month && year) {
      const { startDate, endDate } = getMonthDateRange(month, year);
      matchStage.createdAt = { $gte: startDate, $lt: endDate };
    }

    pipeline.push(
      { $match: matchStage },
      { $unwind: '$orderItems' },
      {
        $group: {
          _id: '$orderItems.product',
          revenue: {
            $sum: { $multiply: ['$orderItems.price', '$orderItems.quantity'] },
          },
          quantity: { $sum: '$orderItems.quantity' },
          orderCount: { $sum: 1 },
          productInfo: {
            $first: {
              name: '$orderItems.name',
              category: '$orderItems.category',
              image: '$orderItems.image',
            },
          },
        },
      },
      { $sort: { [sortBy === 'quantity' ? 'quantity' : 'revenue']: -1 } },
      { $limit: limit },
    );

    return await Order.aggregate(pipeline);
  } catch (error) {
    console.error('Error in getTopProducts:', error);
    throw error;
  }
};

/**
 * Obtenir les statistiques détaillées d'un produit
 */
export const getProductDetailedStats = async (productId, options = {}) => {
  const { startDate, endDate } = options;

  try {
    const matchStage = {
      paymentStatus: 'paid',
      'orderItems.product': new mongoose.Types.ObjectId(productId),
    };

    if (startDate && endDate) {
      matchStage.createdAt = { $gte: startDate, $lt: endDate };
    }

    const pipeline = [
      { $match: matchStage },
      { $unwind: '$orderItems' },
      {
        $match: {
          'orderItems.product': new mongoose.Types.ObjectId(productId),
        },
      },
      {
        $facet: {
          // Stats globales
          summary: [
            {
              $group: {
                _id: null,
                totalRevenue: {
                  $sum: {
                    $multiply: ['$orderItems.price', '$orderItems.quantity'],
                  },
                },
                totalQuantity: { $sum: '$orderItems.quantity' },
                orderCount: { $sum: 1 },
                avgPrice: { $avg: '$orderItems.price' },
                avgQuantityPerOrder: { $avg: '$orderItems.quantity' },
              },
            },
          ],

          // Tendance par mois
          monthlyTrend: [
            {
              $group: {
                _id: {
                  year: { $year: '$createdAt' },
                  month: { $month: '$createdAt' },
                },
                revenue: {
                  $sum: {
                    $multiply: ['$orderItems.price', '$orderItems.quantity'],
                  },
                },
                quantity: { $sum: '$orderItems.quantity' },
                orders: { $sum: 1 },
              },
            },
            { $sort: { '_id.year': -1, '_id.month': -1 } },
            { $limit: 12 }, // Derniers 12 mois
          ],

          // Top clients
          topCustomers: [
            {
              $group: {
                _id: '$user',
                totalSpent: {
                  $sum: {
                    $multiply: ['$orderItems.price', '$orderItems.quantity'],
                  },
                },
                orderCount: { $sum: 1 },
              },
            },
            { $sort: { totalSpent: -1 } },
            { $limit: 5 },
          ],
        },
      },
    ];

    const result = await Order.aggregate(pipeline, { allowDiskUse: true });
    return result[0] || { summary: [], monthlyTrend: [], topCustomers: [] };
  } catch (error) {
    console.error('Error in getProductDetailedStats:', error);
    throw error;
  }
};

/**
 * Méthode pour obtenir les statistiques de performance avec explain
 */
export const getProductStatsWithExplain = async (productId) => {
  const pipeline = [
    {
      $match: {
        paymentStatus: 'paid',
        'orderItems.product': new mongoose.Types.ObjectId(productId),
      },
    },
    { $unwind: '$orderItems' },
    {
      $match: {
        'orderItems.product': new mongoose.Types.ObjectId(productId),
      },
    },
    { $count: 'total' },
  ];

  return await Order.aggregate(pipeline).explain('executionStats');
};
