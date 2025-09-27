import dbConnect from '@/backend/config/dbConnect';
import PaymentType from '@/backend/models/paymentType';
import { NextResponse } from 'next/server';

export async function DELETE(req, { params }) {
  const { id } = params;

  await dbConnect();

  const payment = await PaymentType.findById(id);

  if (!payment) {
    return NextResponse.json(
      { message: 'Payment platform not found.' },
      { status: 404 },
    );
  }

  await payment.deleteOne();

  return NextResponse.json(
    {
      message: 'Payment platform deleted successfully.',
    },
    { status: 200 },
  );
}
