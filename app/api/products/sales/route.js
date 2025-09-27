import dbConnect from '@/backend/config/dbConnect';
import {
  descListCategorySoldSinceBeginningPipeline,
  descListCategorySoldThisMonthPipeline,
  descListProductSoldSinceBeginningPipeline,
  descListProductSoldThisMonthPipeline,
} from '@/backend/pipelines/productPipelines';
import { NextResponse } from 'next/server';

export async function GET() {
  await dbConnect();

  // GETTING LAST MONTH INDEX, CURRENT MONTH and CURRENT YEAR
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  // Descendant List of Product Sold Since The Beginning
  const descListProductSoldSinceBeginning =
    await descListProductSoldSinceBeginningPipeline();

  // Descendant List of Category Sold Since The Beginning
  const descListCategorySoldSinceBeginning =
    await descListCategorySoldSinceBeginningPipeline();

  const descListProductSoldThisMonth =
    await descListProductSoldThisMonthPipeline(currentMonth, currentYear);

  const descListCategorySoldThisMonth =
    await descListCategorySoldThisMonthPipeline(currentMonth, currentYear);

  return NextResponse.json(
    {
      descListProductSoldSinceBeginning,
      descListCategorySoldSinceBeginning,
      descListProductSoldThisMonth,
      descListCategorySoldThisMonth,
    },
    { status: 200 },
  );
}
