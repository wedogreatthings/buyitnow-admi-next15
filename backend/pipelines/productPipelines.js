import mongoose from 'mongoose';
import Order from '../models/order';

export const descListProductSoldSinceBeginningPipeline = async () => {
  const aggregation = await Order.aggregate([
    {
      $match: {
        paymentStatus: 'paid',
      },
    },
    {
      $unwind: {
        path: '$orderItems',
      },
    },
    {
      $group: {
        _id: '$orderItems.product',
        totalAmount: {
          $sum: '$orderItems.price',
        },
        totalQuantity: {
          $sum: '$orderItems.quantity',
        },
        productName: { $push: '$orderItems.name' },
        productCategory: { $push: '$orderItems.category' },
        productImage: { $push: '$orderItems.image' },
      },
    },
    {
      $sort: {
        totalAmount: -1,
        totalQuantity: 1,
      },
    },
  ]);

  return aggregation;
};

export const descListProductSoldThisMonthPipeline = async (month, year) => {
  const aggregation = await Order.aggregate([
    {
      $match: {
        paymentStatus: 'paid',
        $expr: {
          $and: [
            {
              $eq: [
                year,
                {
                  $year: '$createdAt',
                },
              ],
            },
            {
              $eq: [
                month,
                {
                  $month: '$createdAt',
                },
              ],
            },
          ],
        },
      },
    },
    {
      $unwind: {
        path: '$orderItems',
      },
    },
    {
      $group: {
        _id: '$orderItems.product',
        totalAmount: {
          $sum: '$orderItems.price',
        },
        totalQuantity: {
          $sum: '$orderItems.quantity',
        },
        productName: { $push: '$orderItems.name' },
        productCategory: { $push: '$orderItems.category' },
        productImage: { $push: '$orderItems.image' },
      },
    },
    {
      $sort: {
        totalAmount: -1,
        totalQuantity: 1,
      },
    },
  ]);

  return aggregation;
};

export const descListCategorySoldSinceBeginningPipeline = async () => {
  const aggregation = await Order.aggregate([
    {
      $match: {
        paymentStatus: 'paid',
      },
    },
    {
      $unwind: {
        path: '$orderItems',
      },
    },
    {
      $group: {
        _id: '$orderItems.category',
        totalAmount: {
          $sum: '$orderItems.price',
        },
        totalQuantity: {
          $sum: '$orderItems.quantity',
        },
        productName: { $push: '$orderItems.name' },
        productImage: { $push: '$orderItems.image' },
      },
    },
    {
      $sort: {
        totalAmount: -1,
        totalQuantity: 1,
      },
    },
  ]);

  return aggregation;
};

export const descListCategorySoldThisMonthPipeline = async (month, year) => {
  const aggregation = await Order.aggregate([
    {
      $match: {
        paymentStatus: 'paid',
        $expr: {
          $and: [
            {
              $eq: [
                year,
                {
                  $year: '$createdAt',
                },
              ],
            },
            {
              $eq: [
                month,
                {
                  $month: '$createdAt',
                },
              ],
            },
          ],
        },
      },
    },
    {
      $unwind: {
        path: '$orderItems',
      },
    },
    {
      $group: {
        _id: '$orderItems.category',
        totalAmount: {
          $sum: '$orderItems.price',
        },
        totalQuantity: {
          $sum: '$orderItems.quantity',
        },
        productName: { $push: '$orderItems.name' },
        productImage: { $push: '$orderItems.image' },
      },
    },
    {
      $sort: {
        totalAmount: -1,
        totalQuantity: 1,
      },
    },
  ]);

  return aggregation;
};

export const orderIDsForProductPipeline = async (id) => {
  const aggregation = await Order.aggregate([
    {
      $unwind: {
        path: '$orderItems',
      },
    },
    {
      $match: {
        'orderItems.product': new mongoose.Types.ObjectId(id),
      },
    },
    {
      $group: {
        _id: '$_id',
        details: { $push: { date: '$createdAt', payment: '$paymentStatus' } },
      },
    },
    {
      $unwind: {
        path: '$details',
      },
    },
    {
      $sort: {
        'details.date': -1,
      },
    },
  ]);

  return aggregation;
};

export const revenuesGeneratedPerProduct = async (id) => {
  const aggregation = await Order.aggregate([
    {
      $unwind: {
        path: '$orderItems',
      },
    },
    {
      $match: {
        paymentStatus: 'paid',
        'orderItems.product': new mongoose.Types.ObjectId(id),
      },
    },
    {
      $sort: {
        createdAt: -1,
      },
    },
    {
      $group: {
        _id: '$orderItems.product',
        details: {
          $push: {
            date: '$createdAt',
            quantity: '$orderItems.quantity',
            price: '$orderItems.price',
          },
        },
      },
    },
  ]);

  return aggregation;
};
