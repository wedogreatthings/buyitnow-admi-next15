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
 * Méthode générique pour obtenir des statistiques sur les commandes
 * Remplace toutes les méthodes individuelles précédentes
 * @param {Object} options - Options de filtrage et d'opération
 * @returns {Promise} - Résultat de l'agrégation
 */
export const getOrderStats = async (options = {}) => {
  const {
    month,
    year,
    paymentStatus,
    orderStatus,
    operation = 'count', // 'count' ou 'list'
    countFieldName = 'result',
    sort = { createdAt: -1 },
    limit,
  } = options;

  try {
    // Construction dynamique du pipeline
    const pipeline = [];

    // Construction du stage $match
    const matchStage = {};

    // Ajout du filtre de date si fourni
    if (month && year) {
      const { startDate, endDate } = getMonthDateRange(month, year);
      matchStage.createdAt = { $gte: startDate, $lt: endDate };
    }

    // Ajout des filtres conditionnels
    if (paymentStatus !== undefined) {
      matchStage.paymentStatus = paymentStatus;
    }

    if (orderStatus !== undefined) {
      matchStage.orderStatus = orderStatus;
    }

    // Ajouter le match seulement s'il y a des filtres
    if (Object.keys(matchStage).length > 0) {
      pipeline.push({ $match: matchStage });
    }

    // Opération finale selon le type demandé
    if (operation === 'count') {
      pipeline.push({ $count: countFieldName });
      const result = await Order.aggregate(pipeline);
      return result[0] || { [countFieldName]: 0 };
    } else if (operation === 'list') {
      pipeline.push({ $sort: sort });
      if (limit) {
        pipeline.push({ $limit: limit });
      }
      return await Order.aggregate(pipeline);
    }

    return [];
  } catch (error) {
    console.error('Error in getOrderStats:', error);
    throw error;
  }
};

/**
 * Obtenir toutes les statistiques mensuelles en une seule requête
 * Utilise $facet pour optimiser les performances
 * @param {number} month - Le mois
 * @param {number} year - L'année
 * @returns {Promise<Object>} - Objet contenant toutes les statistiques
 */
export const getMonthlyOrdersAnalytics = async (month, year) => {
  try {
    const { startDate, endDate } = getMonthDateRange(month, year);

    const result = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lt: endDate },
        },
      },
      {
        $facet: {
          // Total de toutes les commandes
          total: [{ $count: 'count' }],

          // Groupement par statut de paiement
          byPaymentStatus: [
            {
              $group: {
                _id: '$paymentStatus',
                count: { $sum: 1 },
              },
            },
          ],

          // Groupement par statut de livraison (seulement les payées)
          byShippingStatus: [
            { $match: { paymentStatus: 'paid' } },
            {
              $group: {
                _id: '$orderStatus',
                count: { $sum: 1 },
              },
            },
          ],

          // Les 20 dernières commandes payées COMPLÈTES
          recentPaidOrders: [
            { $match: { paymentStatus: 'paid' } },
            { $sort: { createdAt: -1 } },
            { $limit: 20 },
            // Pas de $project = document complet avec paidAt
          ],

          // Les 20 dernières commandes impayées COMPLÈTES
          recentUnpaidOrders: [
            { $match: { paymentStatus: 'unpaid' } },
            { $sort: { createdAt: -1 } },
            { $limit: 20 },
            // Pas de $project = document complet
          ],
        },
      },
    ]);

    // Extraire et formater les résultats
    const stats = result[0] || {};

    // Helper pour trouver une valeur dans un tableau groupé
    const findInGroup = (array, id) => {
      const item = array?.find((item) => item._id === id);
      return item?.count || 0;
    };

    return {
      // Totaux
      totalOrders: stats.total?.[0]?.count || 0,

      // Par statut de paiement
      totalOrdersPaid: findInGroup(stats.byPaymentStatus, 'paid'),
      totalOrdersUnpaid: findInGroup(stats.byPaymentStatus, 'unpaid'),
      totalOrdersRefunded: findInGroup(stats.byPaymentStatus, 'refunded'),
      totalOrdersCancelled: findInGroup(stats.byPaymentStatus, 'cancelled'),

      // Par statut de livraison (commandes payées uniquement)
      totalOrdersDelivered: findInGroup(stats.byShippingStatus, 'Delivered'),
      totalOrdersShipped: findInGroup(stats.byShippingStatus, 'Shipped'),
      totalOrdersProcessing: findInGroup(stats.byShippingStatus, 'Processing'),

      // Listes
      listOrdersPaidThisMonth: stats.recentPaidOrders || [],
      listOrdersUnpaidThisMonth: stats.recentUnpaidOrders || [],
    };
  } catch (error) {
    console.error('Error in getMonthlyOrdersAnalytics:', error);
    throw error;
  }
};

/**
 * Méthodes de compatibilité pour migration progressive
 * Ces méthodes utilisent la nouvelle architecture mais gardent l'ancienne signature
 * À DÉPRÉCIER progressivement
 */

export const totalOrdersThisMonthPipeline = async (month, year) => {
  const result = await getOrderStats({
    month,
    year,
    operation: 'count',
    countFieldName: 'totalOrders',
  });
  return [result];
};

export const totalOrdersPerShippementStatusThisMonthPipeline = async (
  shippmentValue,
  nameShippmentValue,
  month,
  year,
) => {
  const result = await getOrderStats({
    month,
    year,
    paymentStatus: 'paid',
    orderStatus: shippmentValue,
    operation: 'count',
    countFieldName: nameShippmentValue,
  });
  return [result];
};

export const totalOrdersPaidOrUnpaidForThisMonthPipeline = async (
  paymentValue,
  nameValue,
  month,
  year,
) => {
  const result = await getOrderStats({
    month,
    year,
    paymentStatus: paymentValue,
    operation: 'count',
    countFieldName: nameValue,
  });
  return [result];
};

export const listOrdersPaidorUnapidThisMonthPipeline = async (
  paymentValue,
  month,
  year,
) => {
  return await getOrderStats({
    month,
    year,
    paymentStatus: paymentValue,
    operation: 'list',
  });
};

/**
 * Nouvelle méthode pour obtenir des statistiques personnalisées
 * Permet de créer des requêtes complexes facilement
 */
export const getCustomOrderStats = async (pipeline) => {
  try {
    return await Order.aggregate(pipeline);
  } catch (error) {
    console.error('Error in getCustomOrderStats:', error);
    throw error;
  }
};

/**
 * Obtenir les statistiques de performance
 * Utilise explain pour déboguer les performances
 */
export const getOrderStatsWithExplain = async (options = {}) => {
  const { month, year, paymentStatus, orderStatus } = options;

  const pipeline = [];
  const matchStage = {};

  if (month && year) {
    const { startDate, endDate } = getMonthDateRange(month, year);
    matchStage.createdAt = { $gte: startDate, $lt: endDate };
  }

  if (paymentStatus) matchStage.paymentStatus = paymentStatus;
  if (orderStatus) matchStage.orderStatus = orderStatus;

  if (Object.keys(matchStage).length > 0) {
    pipeline.push({ $match: matchStage });
  }

  pipeline.push({ $count: 'total' });

  // Retourner le plan d'exécution pour analyse
  return await Order.aggregate(pipeline).explain('executionStats');
};
