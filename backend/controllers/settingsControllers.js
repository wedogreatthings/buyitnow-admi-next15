import Category from '../models/category';
import DeliveryPrice from '../models/deliveryPrice';
import PaymentType from '../models/paymentType';
import Product from '../models/product';
import ErrorHandler from '../utils/errorHandler';

export const newDeliveryPrice = async (req, res) => {
  const deliveryPrice = await DeliveryPrice.countDocuments();

  if (deliveryPrice < 1) {
    const deliveryPriceAdded = await DeliveryPrice.create(req.body);

    res.status(201).json({
      deliveryPriceAdded,
    });
  } else {
    const error =
      'You have already set a delivery price. Please delete it first to insert new one';

    res.status(401).json({
      error,
    });
  }
};

export const getDeliveryPrice = async (req, res) => {
  const deliveryPrice = await DeliveryPrice.find();

  res.status(200).json({
    deliveryPrice,
  });
};

export const deleteDeliveryPrice = async (req, res) => {
  const deliveryPrice = await DeliveryPrice.findById(req.query.id);

  if (!deliveryPrice) {
    return new ErrorHandler('Delivery Price not found.', 404);
  }

  await deliveryPrice.deleteOne();

  res.status(200).json({
    success: true,
  });
};

export const newPayment = async (req, res) => {
  const totalPaymentType = await PaymentType.countDocuments();

  if (totalPaymentType < 4) {
    const paymentType = await PaymentType.create(req.body);

    res.status(201).json({
      paymentType,
    });
  } else {
    const error =
      'You have reached the maximum limit, 4, of payment types. To add another payment platform, delete one.';

    res.status(401).json({
      error,
    });
  }
};

export const getPaymentType = async (req, res) => {
  const paymentTypes = await PaymentType.find();

  res.status(200).json({
    paymentTypes,
  });
};

export const deletePayment = async (req, res) => {
  const payment = await PaymentType.findById(req.query.id);

  if (!payment) {
    return new ErrorHandler('Category not found.', 404);
  }

  await payment.deleteOne();

  res.status(200).json({
    success: true,
  });
};

export const newCategory = async (req, res) => {
  const totalCategory = await Category.countDocuments();

  if (totalCategory < 6) {
    const categoryAdded = await Category.create(req.body);

    res.status(201).json({
      categoryAdded,
    });
  } else {
    const error =
      'You have reached the maximum limit, 5, of category. To add another category, delete one.';

    res.status(401).json({
      error,
    });
  }
};

export const getCategories = async (req, res) => {
  const categories = await Category.find();

  res.status(200).json({
    categories,
  });
};

export const deleteCategory = async (req, res) => {
  const deletingCategory = await Category.findById(req.query.id);

  if (!deletingCategory) {
    return new ErrorHandler('Category not found.', 404);
  }

  const productsWithThatCategory = await Product.countDocuments({
    category: deletingCategory?._id,
  });

  if (productsWithThatCategory > 0) {
    res.json({
      error:
        'There are products related to this category! If you want to delete it, delete first all the products related to that category.',
    });
  } else {
    await deletingCategory.deleteOne();

    res.status(200).json({
      success: true,
    });
  }
};
