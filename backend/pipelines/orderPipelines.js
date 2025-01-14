import Order from '../models/order';

export const totalOrdersThisMonthPipeline = async (month, year) => {
  const aggregation = await Order.aggregate([
    {
      $match: {
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
      $count: 'totalOrders',
    },
  ]);

  return aggregation;
};

export const totalOrdersPerShippementStatusThisMonthPipeline = async (
  shippmentValue,
  nameShippmentValue,
  month,
  year,
) => {
  const aggregation = await Order.aggregate([
    {
      $match: {
        paymentStatus: 'paid',
        orderStatus: shippmentValue,
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
      $count: nameShippmentValue,
    },
  ]);

  return aggregation;
};

export const totalOrdersPaidOrUnpaidForThisMonthPipeline = async (
  paymentValue,
  nameValue,
  month,
  year,
) => {
  const aggregation = await Order.aggregate([
    {
      $match: {
        paymentStatus: paymentValue,
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
      $count: nameValue,
    },
  ]);

  return aggregation;
};

export const listOrdersPaidorUnapidThisMonthPipeline = async (
  paymentValue,
  month,
  year,
) => {
  const aggregation = await Order.aggregate([
    {
      $match: {
        paymentStatus: paymentValue,
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
      $sort: { createdAt: -1 },
    },
  ]);

  return aggregation;
};
