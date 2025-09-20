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
    // Créer la catégorie avec les données envoyées (incluant isActive)
    const categoryData = {
      categoryName: req.body.categoryName,
      isActive: req.body.isActive || false, // Par défaut false si non spécifié
    };

    const categoryAdded = await Category.create(categoryData);

    res.status(201).json({
      success: true,
      categoryAdded,
    });
  } else {
    const error =
      'You have reached the maximum limit, 6, of category. To add another category, delete one.';

    res.status(401).json({
      success: false,
      error,
    });
  }
};

// Modifier la méthode getCategories existante
export const getCategories = async (req, res) => {
  // Récupérer toutes les catégories triées par statut (actives d'abord)
  const categories = await Category.find().sort({
    isActive: -1,
    categoryName: 1,
  });

  res.status(200).json({
    categories,
  });
};

export const toggleCategoryStatus = async (req, res) => {
  try {
    const category = await Category.findById(req.query.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found.',
      });
    }

    // Basculer le statut isActive
    category.isActive = !category.isActive;
    await category.save();

    res.status(200).json({
      success: true,
      message: `Category ${category.isActive ? 'activated' : 'deactivated'} successfully`,
      category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

export const deleteCategory = async (req, res, next) => {
  const deletingCategory = await Category.findById(req.query.id);

  if (!deletingCategory) {
    return new ErrorHandler('Category not found.', 404);
  }

  if (deletingCategory.isActive) {
    return next(
      new ErrorHandler(
        'You cannot delete an active category. Please deactivate it first.',
        400,
      ),
    );
  }

  const productsWithThatCategory = await Product.countDocuments({
    category: deletingCategory?._id,
  });

  if (productsWithThatCategory > 0) {
    return next(
      new ErrorHandler(
        'You cannot delete this category because there are products associated with it.',
        400,
      ),
    );
  } else {
    await deletingCategory.deleteOne();

    res.status(200).json({
      success: true,
    });
  }
};
