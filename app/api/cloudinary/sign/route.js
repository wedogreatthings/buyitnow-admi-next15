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

// GET - Récupérer les paramètres de configuration pour l'upload
export async function GET() {
  try {
    const timestamp = Math.round(new Date().getTime() / 1000);

    // Paramètres d'upload
    const uploadParams = {
      timestamp: timestamp,
      folder: 'buyitnow/products',
      resource_type: 'image',
      allowed_formats: 'jpg,jpeg,png,webp',
      max_file_size: 5000000, // 5MB
      transformation: 'w_800,h_800,c_limit,q_auto,f_auto',
    };

    // Générer la signature
    const signature = cloudinary.utils.api_sign_request(
      uploadParams,
      process.env.CLOUDINARY_API_SECRET,
    );

    return NextResponse.json({
      signature,
      timestamp,
      cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
      uploadParams,
    });
  } catch (error) {
    console.error('Error getting upload config:', error);
    return NextResponse.json(
      { error: 'Failed to get upload configuration' },
      { status: 500 },
    );
  }
}
