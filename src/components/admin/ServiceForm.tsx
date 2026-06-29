'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminTabs } from '@/components/admin/ui/AdminTabs';
import { AdminInput } from '@/components/admin/ui/AdminInput';
import { AdminTextarea } from '@/components/admin/ui/AdminTextarea';
import { AdminSelect } from '@/components/admin/ui/AdminSelect';
import { AdminToggle } from '@/components/admin/ui/AdminToggle';
import { AdminButton } from '@/components/admin/ui/AdminButton';
import { UploadField } from '@/components/admin/UploadField';
import { SeoPanel, type SeoData } from '@/components/admin/SeoPanel';
import { FeatureBuilder, type Feature } from '@/components/admin/FeatureBuilder';
import { ComparisonTableBuilder, type ComparisonData } from '@/components/admin/ComparisonTableBuilder';
import { MultiImageUpload, type GalleryItem } from '@/components/admin/MultiImageUpload';
import { RichTextEditor } from '@/components/admin/RichTextEditor';
import { saveService } from '@/app/admin/(dashboard)/services/actions';
import { showToast } from '@/components/admin/ui/AdminToast';
import {
  FileText, Settings, Layers, Columns, Images, Link2, Search as SearchIcon, Download
} from 'lucide-react';

type Category = { id: string; name: string };
type ServiceData = Record<string, any>;

export function ServiceForm({
  service,
  categories = [],
}: {
  service?: ServiceData;
  categories?: Category[];
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  // State
  const [image, setImage] = useState(service?.image || '');
  const [banner, setBanner] = useState(service?.banner || '');
  const [downloadPdf, setDownloadPdf] = useState(service?.downloadPdf || '');
  const [enabled, setEnabled] = useState(service?.enabled ?? true);
  const [featured, setFeatured] = useState(service?.featured ?? false);
  const [description, setDescription] = useState(service?.description || '');
  const [introduction, setIntroduction] = useState(service?.introduction || '');
  const [recovery, setRecovery] = useState(service?.recovery || '');
  const [aftercare, setAftercare] = useState(service?.aftercare || '');
  const [features, setFeatures] = useState<Feature[]>((service?.features as Feature[]) || []);
  const [gallery, setGallery] = useState<GalleryItem[]>((service?.gallery as GalleryItem[]) || []);
  const [comparison, setComparison] = useState<ComparisonData>(
    (service?.comparisonTable as ComparisonData) || { columns: [], rows: [], enabled: false }
  );
  const [seo, setSeo] = useState<SeoData>({
    metaTitle: service?.metaTitle || '',
    metaDesc: service?.metaDesc || '',
    keywords: service?.keywords || '',
    canonicalUrl: service?.canonicalUrl || '',
    robotsMeta: service?.robotsMeta || '',
    focusKeyword: service?.focusKeyword || '',
    ogTitle: service?.ogTitle || '',
    ogDesc: service?.ogDesc || '',
    ogImage: service?.ogImage || '',
    twitterTitle: service?.twitterTitle || '',
    twitterDesc: service?.twitterDesc || '',
    twitterImage: service?.twitterImage || '',
    breadcrumb: service?.breadcrumb || '',
  });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData(e.currentTarget);
      fd.set('image', image);
      fd.set('banner', banner);
      fd.set('downloadPdf', downloadPdf);
      fd.set('enabled', enabled ? 'on' : '');
      fd.set('featured', featured ? 'on' : '');
      fd.set('description', description);
      fd.set('introduction', introduction);
      fd.set('recovery', recovery);
      fd.set('aftercare', aftercare);
      fd.set('features', JSON.stringify(features));
      fd.set('gallery', JSON.stringify(gallery));
      fd.set('comparisonTable', JSON.stringify(comparison));
      // SEO fields
      Object.entries(seo).forEach(([k, v]) => fd.set(k, v || ''));

      await saveService(fd);
      showToast({ type: 'success', title: 'Service saved', description: 'Changes published to the website.' });
      router.push('/admin/services');
    } catch (err) {
      showToast({ type: 'error', title: 'Save failed', description: String(err) });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {service?.id && <input type="hidden" name="id" defaultValue={service.id} />}

      <AdminTabs
        tabs={[
          {
            value: 'general',
            label: 'General',
            icon: <Settings className="h-4 w-4" />,
            content: (
              <div className="space-y-5 max-w-3xl">
                <div className="grid gap-4 sm:grid-cols-2">
                  <AdminInput name="name" label="Service Name" defaultValue={service?.name} required />
                  <AdminInput name="slug" label="URL Slug" defaultValue={service?.slug} placeholder="auto-generated" />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <AdminSelect
                    name="categoryId"
                    label="Category"
                    defaultValue={service?.categoryId || ''}
                    options={categories.map((c) => ({ value: c.id, label: c.name }))}
                  />
                  <AdminInput name="order" label="Sort Order" type="number" defaultValue={String(service?.order ?? 0)} />
                </div>
                <AdminInput name="shortDesc" label="Short Description" defaultValue={service?.shortDesc} required helpText="Displayed on cards and listings" />
                <UploadField label="Card Image" value={image} onChange={setImage} />
                <UploadField label="Banner Image" value={banner} onChange={setBanner} />
                <div className="flex gap-6">
                  <AdminToggle label="Enabled" description="Visible on website" checked={enabled} onChange={setEnabled} />
                  <AdminToggle label="Featured" description="Show in featured section" checked={featured} onChange={setFeatured} />
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
                <RichTextEditor label="Full Description" content={description} onChange={setDescription} />
                <RichTextEditor label="Introduction" content={introduction} onChange={setIntroduction} placeholder="Treatment introduction..." />
                <AdminTextarea name="benefits" label="Benefits (one per line)" defaultValue={Array.isArray(service?.benefits) ? (service.benefits as string[]).join('\n') : ''} rows={5} helpText="Each line becomes a bullet point" />
                <AdminTextarea name="procedure" label="Procedure Steps (JSON)" defaultValue={JSON.stringify(service?.procedure || [], null, 2)} rows={5} helpText="[{ step, title, desc }]" />
                <RichTextEditor label="Recovery" content={recovery} onChange={setRecovery} placeholder="Recovery information..." />
                <RichTextEditor label="Aftercare" content={aftercare} onChange={setAftercare} placeholder="Aftercare instructions..." />
                <AdminTextarea name="faqs" label="FAQs (JSON)" defaultValue={JSON.stringify(service?.faqs || [], null, 2)} rows={5} helpText='[{ "q": "Question", "a": "Answer" }]' />
              </div>
            ),
          },
          {
            value: 'features',
            label: 'Features',
            icon: <Layers className="h-4 w-4" />,
            badge: features.length ? String(features.length) : undefined,
            content: (
              <div className="max-w-3xl">
                <FeatureBuilder features={features} onChange={setFeatures} />
              </div>
            ),
          },
          {
            value: 'comparison',
            label: 'Comparison',
            icon: <Columns className="h-4 w-4" />,
            content: (
              <div className="max-w-4xl">
                <ComparisonTableBuilder data={comparison} onChange={setComparison} />
              </div>
            ),
          },
          {
            value: 'gallery',
            label: 'Gallery',
            icon: <Images className="h-4 w-4" />,
            badge: gallery.length ? String(gallery.length) : undefined,
            content: (
              <div className="max-w-3xl">
                <MultiImageUpload images={gallery} onChange={setGallery} label="Service Gallery" />
              </div>
            ),
          },
          {
            value: 'relations',
            label: 'Relations',
            icon: <Link2 className="h-4 w-4" />,
            content: (
              <div className="space-y-4 max-w-3xl">
                <AdminTextarea name="relatedTreatments" label="Related Treatment IDs (JSON)" defaultValue={JSON.stringify(service?.relatedTreatments || [])} rows={3} helpText="Array of service IDs" />
                <AdminTextarea name="relatedBlogs" label="Related Blog IDs (JSON)" defaultValue={JSON.stringify(service?.relatedBlogs || [])} rows={3} />
                <AdminTextarea name="relatedDoctors" label="Related Doctor IDs (JSON)" defaultValue={JSON.stringify(service?.relatedDoctors || [])} rows={3} />
              </div>
            ),
          },
          {
            value: 'pdf',
            label: 'PDF',
            icon: <Download className="h-4 w-4" />,
            content: (
              <div className="max-w-3xl">
                <UploadField label="Downloadable PDF" value={downloadPdf} onChange={setDownloadPdf} accept="application/pdf" />
              </div>
            ),
          },
          {
            value: 'seo',
            label: 'SEO',
            icon: <SearchIcon className="h-4 w-4" />,
            content: (
              <div className="max-w-3xl">
                <SeoPanel data={seo} onChange={setSeo} slug={service?.slug} content={description} />
              </div>
            ),
          },
        ]}
      />

      <div className="flex items-center gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
        <AdminButton type="submit" loading={saving}>
          {service?.id ? 'Update Service' : 'Create Service'}
        </AdminButton>
        <AdminButton type="button" variant="ghost" onClick={() => router.push('/admin/services')}>
          Cancel
        </AdminButton>
      </div>
    </form>
  );
}
