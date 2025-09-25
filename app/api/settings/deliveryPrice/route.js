import dbConnect from '@/backend/config/dbConnect';
import DeliveryPrice from '@/backend/models/deliveryPrice';
import { NextResponse } from 'next/server';

export async function GET() {
  // Connexion DB
  await dbConnect();

  const deliveryPrice = await DeliveryPrice.find();

  return NextResponse.json(
    {
      deliveryPrice,
    },
    { status: 200 },
  );
}

export async function POST(req) {
  // Connexion DB
  await dbConnect();

  const deliveryPrice = await DeliveryPrice.countDocuments();

  if (deliveryPrice < 1) {
    const deliveryPriceAdded = await DeliveryPrice.create(req.body);

    return NextResponse.json(
      {
        deliveryPriceAdded,
      },
      { status: 201 },
    );
  } else {
    const error =
      'You have already set a delivery price. Please delete it first to insert new one';

    return NextResponse.json(
      {
        error,
      },
      { status: 401 },
    );
  }
}
