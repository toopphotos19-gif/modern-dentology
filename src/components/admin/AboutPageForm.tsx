'use client';

import { useState } from 'react';
import { AdminTabs } from '@/components/admin/ui/AdminTabs';
import { AdminInput } from '@/components/admin/ui/AdminInput';
import { AdminTextarea } from '@/components/admin/ui/AdminTextarea';
import { AdminButton } from '@/components/admin/ui/AdminButton';
import { UploadField } from '@/components/admin/UploadField';
import { RichTextEditor } from '@/components/admin/RichTextEditor';
import { SeoPanel, type SeoData } from '@/components/admin/SeoPanel';
import { MultiImageUpload, type GalleryItem } from '@/components/admin/MultiImageUpload';
import { showToast } from '@/components/admin/ui/AdminToast';
import { saveAboutPage } from '@/app/admin/(dashboard)/about/actions';
import { Image, FileText, Layers, Target, Search } from 'lucide-react';

export function AboutPageForm({ page }: { page: any }) {
  const [saving, setSaving] = useState(false);
  
  const [bannerImage, setBannerImage] = useState(page?.bannerImage || '');
  const [aboutImage, setAboutImage] = useState(page?.aboutImage || '');
  const [ownerImage, setOwnerImage] = useState(page?.ownerImage || '');
  const [ctaImage, setCtaImage] = useState(page?.ctaImage || '');
  
  const [clinicImages, setClinicImages] = useState<GalleryItem[]>(page?.clinicImages || []);
  
  const [mission, setMission] = useState(page?.mission || '');
  const [vision, setVision] = useState(page?.vision || '');
  const [history, setHistory] = useState(page?.history || '');

  const [seo, setSeo] = useState<SeoData>({
    metaTitle: page?.metaTitle || '',
    metaDesc: page?.metaDesc || '',
    keywords: page?.keywords || '',
    ogTitle: page?.ogTitle || '',
    ogDesc: page?.ogDesc || '',
    ogImage: page?.ogImage || '',
  });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData(e.currentTarget);
      fd.set('bannerImage', bannerImage);
      fd.set('aboutImage', aboutImage);
      fd.set('ownerImage', ownerImage);
      fd.set('ctaImage', ctaImage);
      fd.set('clinicImages', JSON.stringify(clinicImages));
      
      fd.set('mission', mission);
      fd.set('vision', vision);
      fd.set('history', history);
      
      // SEO
      Object.entries(seo).forEach(([k, v]) => fd.set(k, v || ''));

      await saveAboutPage(fd);
      showToast({ type: 'success', title: 'About page saved', description: 'Changes have been published.' });
    } catch (err) {
      showToast({ type: 'error', title: 'Save failed', description: String(err) });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <AdminTabs
        tabs={[
          {
            value: 'images',
            label: 'Images',
            icon: <Image className="h-4 w-4" />,
            content: (
              <div className="space-y-6 max-w-3xl">
                <div className="grid gap-4 sm:grid-cols-2">
                  <UploadField label="Banner Image" value={bannerImage} onChange={setBannerImage} />
                  <UploadField label="About Image" value={aboutImage} onChange={setAboutImage} />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <UploadField label="Owner/Founder Image" value={ownerImage} onChange={setOwnerImage} />
                </div>
                <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                  <MultiImageUpload images={clinicImages} onChange={setClinicImages} label="Clinic Gallery" />
                </div>
              </div>
            ),
          },
          {
            value: 'content',
            label: 'Content',
            icon: <FileText className="h-4 w-4" />,
            content: (
              <div className="space-y-6 max-w-3xl">
                <RichTextEditor label="Mission" content={mission} onChange={setMission} />
                <RichTextEditor label="Vision" content={vision} onChange={setVision} />
                <RichTextEditor label="History" content={history} onChange={setHistory} />
              </div>
            ),
          },
          {
            value: 'sections',
            label: 'Sections (JSON)',
            icon: <Layers className="h-4 w-4" />,
            content: (
              <div className="space-y-5 max-w-3xl">
                <AdminTextarea name="timeline" label="Timeline (JSON)" defaultValue={JSON.stringify(page?.timeline || [])} rows={4} helpText='[{"year":"2020", "title":"Founded", "desc":"..."}]' />
                <AdminTextarea name="statistics" label="Statistics (JSON)" defaultValue={JSON.stringify(page?.statistics || [])} rows={3} helpText='[{"label":"Happy Patients", "value":"10k+", "icon":"Smile"}]' />
                <AdminTextarea name="awards" label="Awards (JSON)" defaultValue={JSON.stringify(page?.awards || [])} rows={3} />
                <AdminTextarea name="certificates" label="Certificates (JSON)" defaultValue={JSON.stringify(page?.certificates || [])} rows={3} />
                <AdminTextarea name="whyChooseUs" label="Why Choose Us (JSON)" defaultValue={JSON.stringify(page?.whyChooseUs || [])} rows={4} />
              </div>
            ),
          },
          {
            value: 'cta',
            label: 'Call to Action',
            icon: <Target className="h-4 w-4" />,
            content: (
              <div className="space-y-5 max-w-3xl">
                <AdminInput name="ctaTitle" label="CTA Title" defaultValue={page?.ctaTitle} />
                <AdminTextarea name="ctaDescription" label="CTA Description" defaultValue={page?.ctaDescription} rows={3} />
                <div className="grid gap-4 sm:grid-cols-2">
                  <AdminInput name="ctaButtonText" label="Button Text" defaultValue={page?.ctaButtonText} />
                  <AdminInput name="ctaButtonLink" label="Button Link" defaultValue={page?.ctaButtonLink} />
                </div>
                <UploadField label="CTA Background Image" value={ctaImage} onChange={setCtaImage} />
              </div>
            ),
          },
          {
            value: 'seo',
            label: 'SEO',
            icon: <Search className="h-4 w-4" />,
            content: (
              <div className="max-w-3xl">
                <SeoPanel data={seo} onChange={setSeo} slug="about" />
              </div>
            ),
          },
        ]}
      />

      <div className="flex items-center gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
        <AdminButton type="submit" loading={saving}>
          Save About Page
        </AdminButton>
      </div>
    </form>
  );
}
