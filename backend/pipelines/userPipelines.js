import User from '../models/user';
import Order from '../models/order';

export const usersRegisteredPerMonthPipeline = async (month, year) => {
  const aggregation = await User.aggregate([
    {
      $match: {
        role: 'user',
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
      $count: 'totalUsers',
    },
  ]);

  return aggregation;
};

export const totalUsersThatBoughtPipeline = async () => {
  const aggregation = await Order.aggregate([
    {
      $match: {
        paymentStatus: 'paid',
      },
    },
    {
      $group: {
        _id: '$user',
      },
    },
    {
      $count: 'totalUsers',
    },
  ]);

  return aggregation;
};

export const totalUsersThatBoughtThisMonthPipeline = async (month, year) => {
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
      $group: {
        _id: '$user',
      },
    },
    {
      $count: 'totalUsers',
    },
  ]);

  return aggregation;
};

export const userThatBoughtMostSinceBeginningPipeline = async () => {
  const aggregation = await Order.aggregate([
    {
      $match: {
        paymentStatus: 'paid',
      },
    },
    {
      $group: {
        _id: '$user',
        totalPurchases: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'result',
      },
    },
    {
      $sort: {
        totalPurchases: -1,
      },
    },
    {
      $limit: 1,
    },
  ]);

  return aggregation;
};

export const usersThatBoughtMostThisMonthPipeline = async (month, year) => {
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
      $group: {
        _id: '$user',
        totalPurchases: { $sum: '$paymentInfo.amountPaid' },
        totalTaxes: { $sum: '$paymentInfo.taxPaid' },
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'result',
      },
    },
    {
      $sort: {
        totalPurchases: -1,
      },
    },
  ]);

  return aggregation;
};
