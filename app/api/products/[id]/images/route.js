import dbConnect from '@/backend/config/dbConnect';
import Product from '@/backend/models/product';
import { NextResponse } from 'next/server';
import { cloudinary } from '@/backend/utils/cloudinary';

// POST - Ajouter des images au produit (depuis Cloudinary Upload Widget)
export async function POST(req, { params }) {
  try {
    const { id } = params;
    await dbConnect();

    let product = await Product.findById(id);

    if (!product) {
      return NextResponse.json(
        { message: 'Product not found.' },
        { status: 404 },
      );
    }

    const body = await req.json();
    const { images } = body; // Array d'objets {public_id, url}

    if (!images || !Array.isArray(images)) {
      return NextResponse.json(
        { message: 'Invalid images data.' },
        { status: 400 },
      );
    }

    // Ajouter les nouvelles images aux images existantes
    const updatedImages = [...product.images, ...images];

    product = await Product.findByIdAndUpdate(
      id,
      { images: updatedImages },
      { new: true },
    );

    return NextResponse.json(
      {
        success: true,
        data: updatedImages,
        product,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error adding images:', error);
    return NextResponse.json(
      { message: 'Failed to add images to product.' },
      { status: 500 },
    );
  }
}

// DELETE - Supprimer une image du produit
export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    const url = new URL(req.url);
    const imageId = url.searchParams.get('imageId');

    if (!imageId) {
      return NextResponse.json(
        { message: 'Image ID is required.' },
        { status: 400 },
      );
    }

    await dbConnect();

    let product = await Product.findById(id);

    if (!product) {
      return NextResponse.json(
        { message: 'Product not found.' },
        { status: 404 },
      );
    }

    // Trouver l'image à supprimer
    const imageToRemove = product.images.find(
      (img) => img._id.toString() === imageId,
    );

    if (!imageToRemove) {
      return NextResponse.json(
        { message: 'Image not found.' },
        { status: 404 },
      );
    }

    // Supprimer de Cloudinary
    await cloudinary.v2.uploader.destroy(imageToRemove.public_id);

    // Supprimer de la base de données
    product.images = product.images.filter(
      (img) => img._id.toString() !== imageId,
    );

    await product.save();

    return NextResponse.json(
      {
        success: true,
        data: product.images,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error removing image:', error);
    return NextResponse.json(
      { message: 'Failed to remove image.' },
      { status: 500 },
    );
  }
}
