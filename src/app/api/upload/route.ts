import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { cloudinary, cloudinaryEnabled } from '@/lib/cloudinary';

// Receives a file from the admin and uploads it to Cloudinary.
// Handles images, videos, and documents (CV PDFs). Returns the secure URL.
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!cloudinaryEnabled) {
    return NextResponse.json(
      { error: 'Cloudinary is not configured. Add CLOUDINARY_* keys to .env.' },
      { status: 500 }
    );
  }

  const form = await req.formData();
  const file = form.get('file') as File | null;
  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 });

  const bytes = Buffer.from(await file.arrayBuffer());
  const dataUri = `data:${file.type};base64,${bytes.toString('base64')}`;

  const result = await cloudinary.uploader.upload(dataUri, {
    folder: 'modern-dentology',
    resource_type: 'auto'
  });

  return NextResponse.json({ url: result.secure_url });
}
