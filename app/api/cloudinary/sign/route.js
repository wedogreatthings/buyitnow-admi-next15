import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';

// Configuration Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function POST(req) {
  try {
    const body = await req.json();
    const { paramsToSign } = body;

    // Générer la signature pour les paramètres
    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET,
    );

    return NextResponse.json({ signature }, { status: 200 });
  } catch (error) {
    console.error('Error signing Cloudinary params:', error);
    return NextResponse.json(
      { error: 'Failed to sign upload parameters' },
      { status: 500 },
    );
  }
}
