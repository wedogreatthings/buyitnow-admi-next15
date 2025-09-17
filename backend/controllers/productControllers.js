import Product from '../models/product';
import User from '../models/user';
import APIFilters from '../utils/APIFilters';
import { cloudinary, uploads } from '../utils/cloudinary';
import fs from 'fs';
import ErrorHandler from '../utils/errorHandler';
import {
  getProductSalesAnalytics,
  orderIDsForProductPipeline,
  revenuesGeneratedPerProduct,
} from '../pipelines/productPipelines';
import Category from '../models/category';
import Cart from '../models/cart';

export const newProduct = async (req, res, next) => {
  const user = await User.findOne({ email: req.user.email }).select('_id');

  if (!user) {
    return next(new ErrorHandler('No User found', 404));
  }

  req.body.user = user._id;

  const product = await Product.create(req.body);
  res.status(201).json({
    product,
  });
};

export const getProducts = async (req, res) => {
  const resPerPage = 2;
  const productsCount = await Product.countDocuments();

  const apiFilters = new APIFilters(Product.find(), req.query)
    .search()
    .filter();

  let products = await apiFilters.query.populate('category');
  const filteredProductsCount = products.length;

  apiFilters.pagination(resPerPage);

  products = await apiFilters.query.clone();

  const result = filteredProductsCount / resPerPage;
  const totalPages = Number.isInteger(result) ? result : Math.ceil(result);

  const categories = await Category.find();

  res.status(200).json({
    categories,
    totalPages,
    productsCount,
    filteredProductsCount,
    products,
  });
};

export const getProduct = async (req, res, next) => {
  const product = await Product.findById(req.query.id).populate('category');

  if (!product) {
    return next(new ErrorHandler('Product not found.', 404));
  }

  const idsOfOrders = await orderIDsForProductPipeline(product?._id);
  const revenuesGenerated = await revenuesGeneratedPerProduct(product?.id);

  let updatable;

  // Un produit est updatable s'il n'a pas de commandes ET a au moins une image
  if (idsOfOrders[0] !== undefined) {
    if (
      idsOfOrders.length === 0 &&
      product.images &&
      product.images.length > 0
    ) {
      updatable = true;
    } else {
      updatable = false;
    }
  } else if (product.images && product.images.length > 0) {
    updatable = true;
  } else {
    updatable = false;
  }

  res.status(200).json({
    product,
    updatable,
    idsOfOrders,
    revenuesGenerated,
  });
};

export const uploadProductImages = async (req, res, next) => {
  try {
    let product = await Product.findById(req.query.id);

    if (!product) {
      return next(new ErrorHandler('Product not found.', 404));
    }

    const uploader = async (path) => await uploads(path, 'buyitnow/products');

    const urls = [];
    const files = req.files;

    for (const file of files) {
      const { path } = file;
      const imgUrl = await uploader(path);
      urls.push(imgUrl);
      fs.unlinkSync(path);
    }

    // Append new images to existing images
    const updatedImages = [...product.images, ...urls];

    product = await Product.findByIdAndUpdate(
      req.query.id,
      { images: updatedImages },
      { new: true }, // This ensures the updated document is returned
    );

    res.status(200).json({
      data: updatedImages,
      product,
    });
  } catch (error) {
    next(error);
  }
};

// In your product controllers
export const removeProductImage = async (req, res, next) => {
  try {
    const { productId, imageId } = req.query;

    // Find the product
    let product = await Product.findById(productId);

    if (!product) {
      return next(new ErrorHandler('Product not found.', 404));
    }

    // Find the image to remove
    const imageToRemove = product.images.find(
      (img) => img._id.toString() === imageId,
    );

    if (!imageToRemove) {
      return next(new ErrorHandler('Image not found.', 404));
    }

    // Remove from Cloudinary
    await cloudinary.uploader.destroy(imageToRemove.public_id);

    // Remove from product images
    product.images = product.images.filter(
      (img) => img._id.toString() !== imageId,
    );

    // Save the updated product
    await product.save();

    res.status(200).json({
      success: true,
      data: product.images,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  let product = await Product.findById(req.query.id);

  if (!product) {
    return next(new ErrorHandler('Product not found.', 404));
  }

  product = await Product.findByIdAndUpdate(req.query.id, req.body);

  res.status(200).json({
    product,
  });
};

export const deleteProduct = async (req, res, next) => {
  let product = await Product.findById(req.query.id);

  if (!product) {
    return next(new ErrorHandler('Product not found.', 404));
  }

  const cartContainingThisProduct = await Cart.countDocuments({
    product: product?._id,
  });

  if (cartContainingThisProduct > 0) {
    res.json({
      error:
        'There are users that added this product to their cart! If you want to delete it, delete first all the carts containing this product.',
    });
  } else {
    // Deleting images associated with the product
    for (let i = 0; i < product.images.length; i++) {
      await cloudinary.v2.uploader.destroy(product.images[i].public_id);
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
    });
  }
};

// Remplacer la méthode getProductSales par :
export const getProductSales = async (req, res) => {
  try {
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    // Une seule requête pour toutes les stats du mois
    const monthlyAnalytics = await getProductSalesAnalytics(
      currentMonth,
      currentYear,
    );

    // Une seule requête pour toutes les stats globales
    const globalAnalytics = await getProductSalesAnalytics();

    res.status(200).json({
      // Stats globales (depuis le début)
      descListProductSoldSinceBeginning: globalAnalytics.productStats,
      descListCategorySoldSinceBeginning: globalAnalytics.categoryStats,

      // Stats du mois
      descListProductSoldThisMonth: monthlyAnalytics.productStats,
      descListCategorySoldThisMonth: monthlyAnalytics.categoryStats,

      // Nouvelles métriques bonus
      totalProductsSold: globalAnalytics.productStats.reduce(
        (acc, p) => acc + p.totalQuantity,
        0,
      ),
      totalRevenue: globalAnalytics.productStats.reduce(
        (acc, p) => acc + p.totalAmount,
        0,
      ),
      topSellingCategory: globalAnalytics.categoryStats[0] || null,
    });
  } catch (error) {
    console.error('Error in getProductSales:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
