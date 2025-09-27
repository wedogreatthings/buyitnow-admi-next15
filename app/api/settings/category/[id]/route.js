import dbConnect from '@/backend/config/dbConnect';
import Category from '@/backend/models/category';
import Product from '@/backend/models/product';
import { NextResponse } from 'next/server';

export async function DELETE(req, { params }) {
  const { id } = params;

  await dbConnect();

  const deletingCategory = await Category.findById(id);

  if (!deletingCategory) {
    return NextResponse.json(
      { message: 'Category not found.' },
      { status: 404 },
    );
  }

  if (deletingCategory.isActive) {
    return NextResponse.json(
      {
        message:
          'You cannot delete an active category. Please deactivate it first.',
      },
      { status: 400 },
    );
  }

  const productsWithThatCategory = await Product.countDocuments({
    category: deletingCategory?._id,
  });

  if (productsWithThatCategory > 0) {
    return NextResponse.json(
      {
        message:
          'You cannot delete this category because there are products associated with it.',
      },
      { status: 400 },
    );
  } else {
    await deletingCategory.deleteOne();

    return NextResponse.json(
      { message: 'Category deleted successfully.' },
      { status: 200 },
    );
  }
}
