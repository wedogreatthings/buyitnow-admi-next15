/* eslint-disable no-unused-vars */
import dbConnect from '@/backend/config/dbConnect';
import Product from '@/backend/models/product';
import Category from '@/backend/models/category';
import { NextResponse } from 'next/server';
import {
  orderIDsForProductPipeline,
  revenuesGeneratedPerProduct,
} from '@/backend/pipelines/productPipelines';
import Cart from '@/backend/models/cart';
import { cloudinary } from '@/backend/utils/cloudinary';

export async function GET(req) {
  await dbConnect();

  const product = await Product.findById(req.query.id).populate('category');

  if (!product) {
    return NextResponse.json(
      { message: 'Product not found.' },
      { status: 404 },
    );
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

  return NextResponse.json(
    { product, updatable, idsOfOrders, revenuesGenerated },
    { status: 200 },
  );
}

export async function PUT(req) {
  let product = await Product.findById(req.query.id);

  if (!product) {
    return NextResponse.json(
      { message: 'Product not found.' },
      { status: 404 },
    );
  }

  // Pseudo-code de la logique
  let warningMessage = null;

  // 1. Vérifier si on veut activer le produit
  if (req.body.isActive === true) {
    // 2. Récupérer le produit avec sa catégorie
    const productWithCategory = await Product.findById(req.query.id).populate(
      'category',
    );

    // 3. Vérifier si la catégorie est inactive
    if (!productWithCategory.category.isActive) {
      // 4. Supprimer isActive de la mise à jour
      delete req.body.isActive;

      // 5. Préparer le message d'avertissement
      warningMessage = `Product updated successfully, but cannot be activated because the category "${productWithCategory.category.categoryName}" is inactive. Activate the category first.`;
    }
  }

  // 6. Continuer avec la mise à jour normale
  product = await Product.findByIdAndUpdate(req.query.id, req.body, {
    new: true,
  });

  return NextResponse.json(
    { success: true, product, warning: warningMessage },
    { status: 200 },
  );
}

export async function DELETE(req) {
  let product = await Product.findById(req.query.id);

  if (!product) {
    return NextResponse.json(
      { message: 'Product not found.' },
      { status: 404 },
    );
  }

  const cartContainingThisProduct = await Cart.countDocuments({
    product: product?._id,
  });

  if (cartContainingThisProduct > 0) {
    return NextResponse.json(
      {
        message: 'Cannot delete product. It is present in one or more carts.',
      },
      { status: 400 },
    );
  }

  if (product.isActive) {
    return NextResponse.json(
      {
        message:
          'You cannot delete an active product. Please deactivate it first.',
      },
      { status: 400 },
    );
  }

  // Deleting images associated with the product
  for (let i = 0; i < product.images.length; i++) {
    await cloudinary.v2.uploader.destroy(product.images[i].public_id);
  }

  await product.deleteOne();

  return NextResponse.json(
    { message: 'Product deleted successfully.' },
    { status: 200 },
  );
}
