/* eslint-disable no-unused-vars */
import Order from '../models/order';
import Address from '../models/address';
import Product from '../models/product';
import APIFilters from '../utils/APIFilters';
import { getMonthlyOrdersAnalytics } from '../pipelines/orderPipelines';
import { getProductSalesAnalytics } from '../pipelines/productPipelines';
import { getUserAnalytics } from '../pipelines/userPipelines';
import DeliveryPrice from '../models/deliveryPrice';
import ErrorHandler from '../utils/errorHandler';

// MÉTHODE getOrders OPTIMISÉE
export const getOrders = async (req, res) => {
  const resPerPage = 2;
  const ordersCount = await Order.countDocuments();

  let orders;
  let filteredOrdersCount = 0;
  let totalPages = 0;
  let result = 0;

  if (req.query.keyword) {
    const orderNumber = req.query.keyword;
    orders = await Order.findOne({ orderNumber: orderNumber }).populate(
      'shippingInfo user',
    );

    if (orders) filteredOrdersCount = 1;
  } else {
    const apiFilters = new APIFilters(Order.find(), req.query).filter();

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

  const [globalProductStats, monthlyProductStats, globalUserStats] =
    await Promise.all([
      getProductSalesAnalytics(), // Stats globales produits
      getProductSalesAnalytics(currentMonth, currentYear), // Stats mensuelles produits
      getUserAnalytics(), // Stats globales users
    ]);

  // Puis extraire les données
  const descListProductSoldSinceBeginning = globalProductStats.productStats;
  const descListCategorySoldSinceBeginning = globalProductStats.categoryStats;
  const descListProductSoldThisMonth = monthlyProductStats.productStats;
  const userThatBoughtMostSinceBeginning = globalUserStats.topBuyers[0]
    ? [
        {
          _id: globalUserStats.topBuyers[0]._id,
          totalPurchases: globalUserStats.topBuyers[0].totalOrders,
          result: [globalUserStats.topBuyers[0].result],
        },
      ]
    : [];

  const deliveryPrice = await DeliveryPrice.find();

  const overviewPattern = /overview/;

  if (overviewPattern.test(req?.url)) {
    res.status(200).json({
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
    });
  } else {
    res.status(200).json({
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
    });
  }
};

export const getOrder = async (req, res) => {
  const order = await Order.findById(req.query.id).populate(
    'shippingInfo user',
  );

  if (!order) {
    return new ErrorHandler('No Order found', 404);
  }

  res.status(200).json({
    order,
  });
};

export const updateOrder = async (req, res) => {
  let order = await Order.findById(req.query.id);

  if (!order) {
    return new ErrorHandler('No Order found', 404);
  }

  if (req.body.orderStatus) {
    order = await Order.findByIdAndUpdate(req.query.id, {
      orderStatus: req.body.orderStatus,
    });
  }

  if (req.body.paymentStatus) {
    const currentStatus = order.paymentStatus;
    const newStatus = req.body.paymentStatus;

    // Définir les transitions autorisées
    const allowedTransitions = {
      unpaid: ['paid', 'cancelled'],
      paid: ['refunded', 'cancelled'],
      refunded: [], // Aucune transition autorisée
      cancelled: [], // Aucune transition autorisée
    };

    // Vérifier si la transition est autorisée
    if (!allowedTransitions[currentStatus].includes(newStatus)) {
      return res.status(400).json({
        success: false,
        message: `Cannot change payment status from '${currentStatus}' to '${newStatus}'`,
      });
    }

    // Gestion des mises à jour de stock et sold selon le changement de statut
    try {
      // Si on passe de 'unpaid' à 'paid' : ajouter aux ventes
      if (currentStatus === 'unpaid' && newStatus === 'paid') {
        const bulkOpsForPaid = order.orderItems.map((item) => ({
          updateOne: {
            filter: { _id: item.product },
            update: {
              $inc: {
                sold: item.quantity,
              },
            },
          },
        }));

        if (bulkOpsForPaid.length > 0) {
          await Product.bulkWrite(bulkOpsForPaid);
        }
      }

      // Si on passe de 'paid' à 'refunded' : annuler les ventes et restaurer le stock
      else if (currentStatus === 'paid' && newStatus === 'refunded') {
        const bulkOpsForRefunded = order.orderItems.map((item) => ({
          updateOne: {
            filter: { _id: item.product },
            update: {
              $inc: {
                sold: -item.quantity,
                stock: item.quantity,
              },
            },
          },
        }));

        if (bulkOpsForRefunded.length > 0) {
          await Product.bulkWrite(bulkOpsForRefunded);
        }
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du stock/sold:', error);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la mise à jour du stock des produits',
        error: error.message,
      });
    }

    // Effectuer la mise à jour si la transition est valide
    order = await Order.findByIdAndUpdate(
      req.query.id,
      {
        paymentStatus: newStatus,
      },
      { new: true },
    ); // Ajout de { new: true } pour retourner l'ordre mis à jour
  }

  res.status(200).json({
    success: true,
    order,
  });
};

// export const deleteOrder = async (req, res) => {
//   let order = await Order.findById(req.query.id);

//   if (!order) {
//     return new ErrorHandler('No Order found', 404);
//   }

//   await order.deleteOne();

//   res.status(200).json({
//     success: true,
//   });
// };

// MÉTHODE getOrdersPurchasedStats OPTIMISÉE
export const getOrdersPurchasedStats = async (req, res) => {
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

  res.status(200).json({
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
  });
};

// NOUVELLE MÉTHODE BONUS : Endpoint pour des stats personnalisées
// export const getCustomOrderStats = async (req, res) => {
//   try {
//     const { filters } = req.body;
//     const stats = await getOrderStats(filters);

//     res.status(200).json({
//       success: true,
//       data: stats,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       error: error.message,
//     });
//   }
// };
