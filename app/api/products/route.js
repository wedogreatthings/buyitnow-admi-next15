import Category from '@/backend/models/category';
import Product from '@/backend/models/product';
import APIFilters from '@/backend/utils/APIFilters';
import { NextResponse } from 'next/server';

export async function GET(req) {
  console.log('In products route');
  console.log(req.nextUrl.searchParams);
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
