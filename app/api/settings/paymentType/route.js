import dbConnect from '@/backend/config/dbConnect';
import PaymentType from '@/backend/models/paymentType';
import { NextResponse } from 'next/server';

export async function GET() {
  // Connexion DB
  await dbConnect();

  const paymentTypes = await PaymentType.find();

  return NextResponse.json(
    {
      paymentTypes,
    },
    { status: 200 },
  );
}

export async function POST(req) {
  // Connexion DB
  await dbConnect();

  const totalPaymentType = await PaymentType.countDocuments();

  if (totalPaymentType < 4) {
    const paymentType = await PaymentType.create(req.body);

    return NextResponse.json(
      {
        paymentType,
      },
      { status: 201 },
    );
  } else {
    const error =
      'You have reached the maximum limit, 4, of payment types. To add another payment platform, delete one.';

    return NextResponse.json(
      {
        error,
      },
      { status: 401 },
    );
  }
}
