import dbConnect from '@/backend/config/dbConnect';
import DeliveryPrice from '@/backend/models/deliveryPrice';
import { NextResponse } from 'next/server';

export async function DELETE(req) {
  await dbConnect();

  const deliveryPrice = await DeliveryPrice.findById(req.query.id);

  if (!deliveryPrice) {
    return NextResponse.json(
      { message: 'Delivery Price not found.' },
      { status: 404 },
    );
  }

  await deliveryPrice.deleteOne();

  return NextResponse.json(
    { message: 'Delivery Price deleted successfully.' },
    { status: 200 },
  );
}
