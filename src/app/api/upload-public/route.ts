import { NextRequest, NextResponse } from 'next/server';
import { cloudinary, cloudinaryEnabled } from '@/lib/cloudinary';

// Public upload used only for job-application resumes. Restricted to documents.
export async function POST(req: NextRequest) {
  if (!cloudinaryEnabled) {
    return NextResponse.json({ error: 'Uploads not configured' }, { status: 500 });
  }
  const form = await req.formData();
  const file = form.get('file') as File | null;
  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 });

  const allowed = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  if (!allowed.includes(file.type)) {
    return NextResponse.json({ error: 'Only PDF/DOC files allowed' }, { status: 400 });
  }
  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: 'File too large (max 5MB)' }, { status: 400 });
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const dataUri = `data:${file.type};base64,${bytes.toString('base64')}`;
  const result = await cloudinary.uploader.upload(dataUri, { folder: 'modern-dentology/resumes', resource_type: 'auto' });
  return NextResponse.json({ url: result.secure_url });
}
