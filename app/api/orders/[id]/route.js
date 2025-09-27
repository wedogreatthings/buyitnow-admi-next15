/* eslint-disable no-unused-vars */
import Order from '@/backend/models/order';
import Address from '@/backend/models/address';
import User from '@/backend/models/user';
import Category from '@/backend/models/category';
import { NextResponse } from 'next/server';
import dbConnect from '@/backend/config/dbConnect';
import Product from '@/backend/models/product';

export async function GET(req, { params }) {
  const { id } = params;

  await dbConnect();

  const order = await Order.findById(id).populate('shippingInfo user');

  if (!order) {
    return NextResponse.json({ message: 'No Order found' }, { status: 404 });
  }

  return NextResponse.json({ order }, { status: 200 });
}

export async function PUT(req, { params }) {
  const { id } = params;

  await dbConnect();

  let order = await Order.findById(id);

  if (!order) {
    return NextResponse.json({ message: 'No Order found' }, { status: 404 });
  }

  if (req.body.orderStatus) {
    order = await Order.findByIdAndUpdate(id, {
      orderStatus: req.body.orderStatus,
    });
  }

  if (req.body.paymentStatus) {
    const currentStatus = order.paymentStatus;
    const newStatus = req.body.paymentStatus;

    // Définir les transitions autorisées
    const allowedTransitions = {
      unpaid: ['paid', 'cancelled'],
      paid: ['refunded'],
      refunded: [], // Aucune transition autorisée
      cancelled: [], // Aucune transition autorisée
    };

    // Vérifier si la transition est autorisée
    if (!allowedTransitions[currentStatus].includes(newStatus)) {
      return NextResponse.json(
        {
          success: false,
          message: `Cannot change payment status from '${currentStatus}' to '${newStatus}'`,
        },
        { status: 400 },
      );
    }

    // Gestion des mises à jour de stock et sold selon le changement de statut
    try {
      // Si on passe de 'unpaid' à 'paid' : ajouter aux ventes
      if (currentStatus === 'unpaid' && newStatus === 'paid') {
        // Récupérer les produits avec leurs catégories
        const productIds = order.orderItems.map((item) => item.product);
        const products = await Product.find({
          _id: { $in: productIds },
        }).populate('category');

        // Créer un map pour associer productId -> categoryId et quantity
        const categoryUpdates = new Map();

        order.orderItems.forEach((item) => {
          const product = products.find(
            (p) => p._id.toString() === item.product.toString(),
          );
          if (product && product.category) {
            const categoryId = product.category._id.toString();
            if (categoryUpdates.has(categoryId)) {
              categoryUpdates.set(
                categoryId,
                categoryUpdates.get(categoryId) + item.quantity,
              );
            } else {
              categoryUpdates.set(categoryId, item.quantity);
            }
          }
        });

        // Mise à jour des produits
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

        // Mise à jour des catégories
        const bulkOpsForCategories = Array.from(categoryUpdates.entries()).map(
          ([categoryId, quantity]) => ({
            updateOne: {
              filter: { _id: categoryId },
              update: {
                $inc: {
                  sold: quantity,
                },
              },
            },
          }),
        );

        // Exécuter les mises à jour en parallèle
        const promises = [];
        if (bulkOpsForPaid.length > 0) {
          promises.push(Product.bulkWrite(bulkOpsForPaid));
        }
        if (bulkOpsForCategories.length > 0) {
          promises.push(Category.bulkWrite(bulkOpsForCategories));
        }

        await Promise.all(promises);
      }

      // Si on passe de 'paid' à 'refunded' : annuler les ventes et restaurer le stock
      else if (currentStatus === 'paid' && newStatus === 'refunded') {
        // Récupérer les produits avec leurs catégories
        const productIds = order.orderItems.map((item) => item.product);
        const products = await Product.find({
          _id: { $in: productIds },
        }).populate('category');

        // Créer un map pour associer productId -> categoryId et quantity
        const categoryUpdates = new Map();

        order.orderItems.forEach((item) => {
          const product = products.find(
            (p) => p._id.toString() === item.product.toString(),
          );
          if (product && product.category) {
            const categoryId = product.category._id.toString();
            if (categoryUpdates.has(categoryId)) {
              categoryUpdates.set(
                categoryId,
                categoryUpdates.get(categoryId) + item.quantity,
              );
            } else {
              categoryUpdates.set(categoryId, item.quantity);
            }
          }
        });

        // Mise à jour des produits
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

        // Mise à jour des catégories (décrémenter)
        const bulkOpsForCategories = Array.from(categoryUpdates.entries()).map(
          ([categoryId, quantity]) => ({
            updateOne: {
              filter: { _id: categoryId },
              update: {
                $inc: {
                  sold: -quantity,
                },
              },
            },
          }),
        );

        // Exécuter les mises à jour en parallèle
        const promises = [];
        if (bulkOpsForRefunded.length > 0) {
          promises.push(Product.bulkWrite(bulkOpsForRefunded));
        }
        if (bulkOpsForCategories.length > 0) {
          promises.push(Category.bulkWrite(bulkOpsForCategories));
        }

        await Promise.all(promises);
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du stock/sold:', error);
      return NextResponse.json(
        {
          success: false,
          message:
            'Erreur lors de la mise à jour du stock des produits et catégories',
          error: error.message,
        },
        { status: 500 },
      );
    }

    // Effectuer la mise à jour si la transition est valide
    order = await Order.findByIdAndUpdate(
      id,
      {
        paymentStatus: newStatus,
      },
      { new: true },
    ); // Ajout de { new: true } pour retourner l'ordre mis à jour
  }

  return NextResponse.json(
    {
      success: true,
      order,
    },
    { status: 200 },
  );
}
