import dbConnect from '@/backend/config/dbConnect';
import Category from '@/backend/models/category';
import Product from '@/backend/models/product';
import User from '@/backend/models/user';
import APIFilters from '@/backend/utils/APIFilters';
import { NextResponse } from 'next/server';

export async function GET(req) {
  // Connexion DB
  await dbConnect();

  const resPerPage = 2;
  const productsCount = await Product.countDocuments();

  const apiFilters = new APIFilters(Product.find(), req.nextUrl.searchParams)
    .search()
    .filter();

  let products = await apiFilters.query.populate('category');
  const filteredProductsCount = products.length;

  apiFilters.pagination(resPerPage);

  products = await apiFilters.query.clone();

  const result = filteredProductsCount / resPerPage;
  const totalPages = Number.isInteger(result) ? result : Math.ceil(result);

  const categories = await Category.find();

  return NextResponse.json(
    {
      categories,
      totalPages,
      productsCount,
      filteredProductsCount,
      products,
    },
    {
      status: 200,
    },
  );
}

export async function POST(req) {
  // Connexion DB
  await dbConnect();

  const user = await User.findOne({ email: req.user.email }).select('_id');

  if (!user) {
    return NextResponse.json(
      {
        success: false,
        message: 'User not found',
      },
      { status: 404 },
    );
  }

  req.body.user = user._id;

  const product = await Product.create(req.body);

  return NextResponse.json(
    {
      product,
    },
    {
      status: 201,
    },
  );
}
