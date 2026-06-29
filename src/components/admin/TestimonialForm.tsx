'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminTabs } from '@/components/admin/ui/AdminTabs';
import { AdminInput } from '@/components/admin/ui/AdminInput';
import { AdminTextarea } from '@/components/admin/ui/AdminTextarea';
import { AdminToggle } from '@/components/admin/ui/AdminToggle';
import { AdminButton } from '@/components/admin/ui/AdminButton';
import { UploadField } from '@/components/admin/UploadField';
import { SeoPanel, type SeoData } from '@/components/admin/SeoPanel';
import { MultiImageUpload, type GalleryItem } from '@/components/admin/MultiImageUpload';
import { showToast } from '@/components/admin/ui/AdminToast';
import { saveTestimonial } from '@/app/admin/(dashboard)/testimonials/actions';
import { UserCircle, FileText, Image, Search } from 'lucide-react';

export function TestimonialForm({ testimonial }: { testimonial?: any }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const [patientImage, setPatientImage] = useState(testimonial?.patientImage || '');
  const [beforeImage, setBeforeImage] = useState(testimonial?.beforeImage || '');
  const [afterImage, setAfterImage] = useState(testimonial?.afterImage || '');
  const [gallery, setGallery] = useState<GalleryItem[]>(testimonial?.gallery || []);
  const [enabled, setEnabled] = useState(testimonial?.enabled ?? true);
  const [featured, setFeatured] = useState(testimonial?.featured ?? false);

  const [seo, setSeo] = useState<SeoData>({
    metaTitle: testimonial?.seoTitle || '',
    metaDesc: testimonial?.seoDesc || '',
    keywords: testimonial?.seoKeywords || '',
    ogTitle: testimonial?.ogTitle || '',
    ogDesc: testimonial?.ogDesc || '',
    ogImage: testimonial?.ogImage || '',
    focusKeyword: testimonial?.focusKeyword || '',
  });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData(e.currentTarget);
      fd.set('patientImage', patientImage);
      fd.set('beforeImage', beforeImage);
      fd.set('afterImage', afterImage);
      fd.set('gallery', JSON.stringify(gallery));
      fd.set('enabled', enabled ? 'on' : '');
      fd.set('featured', featured ? 'on' : '');
      
      // SEO
      fd.set('seoTitle', seo.metaTitle || '');
      fd.set('seoDesc', seo.metaDesc || '');
      fd.set('seoKeywords', seo.keywords || '');
      fd.set('focusKeyword', seo.focusKeyword || '');
      fd.set('ogTitle', seo.ogTitle || '');
      fd.set('ogDesc', seo.ogDesc || '');
      fd.set('ogImage', seo.ogImage || '');

      await saveTestimonial(fd);
      showToast({ type: 'success', title: 'Testimonial saved' });
      router.push('/admin/testimonials');
    } catch (err) {
      showToast({ type: 'error', title: 'Save failed', description: String(err) });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {testimonial?.id && <input type="hidden" name="id" defaultValue={testimonial.id} />}

      <AdminTabs
        tabs={[
          {
            value: 'general',
            label: 'General',
            icon: <UserCircle className="h-4 w-4" />,
            content: (
              <div className="space-y-5 max-w-3xl">
                <div className="grid gap-4 sm:grid-cols-2">
                  <AdminInput name="patientName" label="Patient Name" defaultValue={testimonial?.patientName} required />
                  <AdminInput name="slug" label="URL Slug" defaultValue={testimonial?.slug} placeholder="Leave blank to auto-generate" />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <AdminInput name="patientLocation" label="Location (Optional)" defaultValue={testimonial?.patientLocation} />
                  <AdminInput name="treatment" label="Treatment Received" defaultValue={testimonial?.treatment} />
                </div>
                <div className="grid gap-4 sm:grid-cols-2 items-center">
                  <AdminInput name="rating" label="Rating (1-5)" type="number" min="1" max="5" defaultValue={String(testimonial?.rating || 5)} required />
                  <AdminInput name="order" label="Display Order" type="number" defaultValue={String(testimonial?.order || 0)} />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <AdminToggle label="Published" description="Visible on website" checked={enabled} onChange={setEnabled} />
                  <AdminToggle label="Featured" description="Highlight on homepage" checked={featured} onChange={setFeatured} />
                </div>
                <UploadField label="Patient Photo" value={patientImage} onChange={setPatientImage} />
              </div>
            ),
          },
          {
            value: 'content',
            label: 'Review Content',
            icon: <FileText className="h-4 w-4" />,
            content: (
              <div className="space-y-5 max-w-3xl">
                <AdminTextarea name="review" label="Written Review" defaultValue={testimonial?.review} rows={6} required />
                <AdminInput name="videoUrl" label="Video Review URL (YouTube/Vimeo)" defaultValue={testimonial?.videoUrl} />
                <UploadField label="Direct Video Upload (Optional)" value={testimonial?.videoReview || ''} onChange={() => {}} accept="video/*" helpText="Upload a short video file if not using a URL." />
                <input type="hidden" name="videoReview" value={testimonial?.videoReview || ''} />
              </div>
            ),
          },
          {
            value: 'images',
            label: 'Gallery & Before/After',
            icon: <Image className="h-4 w-4" />,
            content: (
              <div className="space-y-6 max-w-3xl">
                <div className="grid gap-4 sm:grid-cols-2">
                  <UploadField label="Before Treatment Image" value={beforeImage} onChange={setBeforeImage} />
                  <UploadField label="After Treatment Image" value={afterImage} onChange={setAfterImage} />
                </div>
                <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                  <MultiImageUpload images={gallery} onChange={setGallery} label="Patient Gallery" />
                </div>
              </div>
            ),
          },
          {
            value: 'seo',
            label: 'SEO',
            icon: <Search className="h-4 w-4" />,
            content: (
              <div className="max-w-3xl">
                <SeoPanel data={seo} onChange={setSeo} slug={testimonial?.slug || ''} content={testimonial?.review} />
              </div>
            ),
          },
        ]}
      />

      <div className="flex items-center gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
        <AdminButton type="submit" loading={saving}>
          {testimonial?.id ? 'Update Testimonial' : 'Create Testimonial'}
        </AdminButton>
        <AdminButton type="button" variant="ghost" onClick={() => router.push('/admin/testimonials')}>
          Cancel
        </AdminButton>
      </div>
    </form>
  );
}
