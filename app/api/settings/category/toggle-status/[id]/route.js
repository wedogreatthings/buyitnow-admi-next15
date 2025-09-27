import dbConnect from '@/backend/config/dbConnect';
import Category from '@/backend/models/category';
import { NextResponse } from 'next/server';

export async function PUT(req, { params }) {
  try {
    const { id } = params;
    await dbConnect();
    const category = await Category.findById(id);

    if (!category) {
      return NextResponse.json(
        {
          success: false,
          message: 'Category not found.',
        },
        { status: 404 },
      );
    }

    // Basculer le statut isActive
    category.isActive = !category.isActive;
    await category.save();

    return NextResponse.json(
      {
        success: true,
        message: `Category ${category.isActive ? 'activated' : 'deactivated'} successfully`,
        category,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Server error',
        error: error.message,
      },
      { status: 500 },
    );
  }
}
