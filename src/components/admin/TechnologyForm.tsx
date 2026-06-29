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
import { FeatureBuilder, type Feature } from '@/components/admin/FeatureBuilder';
import { ComparisonTableBuilder, type ComparisonData } from '@/components/admin/ComparisonTableBuilder';
import { MultiImageUpload, type GalleryItem } from '@/components/admin/MultiImageUpload';
import { RichTextEditor } from '@/components/admin/RichTextEditor';
import { showToast } from '@/components/admin/ui/AdminToast';
import { saveTechnology } from '@/app/admin/(dashboard)/technologies/actions';
import { Cpu, FileText, Layers, Images, Columns, Link2, Search } from 'lucide-react';

export function TechnologyForm({ technology }: { technology?: any }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const [image, setImage] = useState(technology?.image || '');
  const [description, setDescription] = useState(technology?.description || '');
  const [features, setFeatures] = useState<Feature[]>(technology?.features || []);
  const [gallery, setGallery] = useState<GalleryItem[]>(technology?.gallery || []);
  const [comparison, setComparison] = useState<ComparisonData>(
    technology?.comparisonTable || { columns: [], rows: [], enabled: false }
  );
  const [enabled, setEnabled] = useState(technology?.enabled ?? true);

  const [seo, setSeo] = useState<SeoData>({
    metaTitle: technology?.metaTitle || '',
    metaDesc: technology?.metaDesc || '',
    keywords: technology?.keywords || '',
    canonicalUrl: technology?.canonicalUrl || '',
    robotsMeta: technology?.robotsMeta || '',
    focusKeyword: technology?.focusKeyword || '',
    ogTitle: technology?.ogTitle || '',
    ogDesc: technology?.ogDesc || '',
    ogImage: technology?.ogImage || '',
    twitterTitle: technology?.twitterTitle || '',
    twitterDesc: technology?.twitterDesc || '',
    twitterImage: technology?.twitterImage || '',
    breadcrumb: technology?.breadcrumb || '',
  });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData(e.currentTarget);
      fd.set('image', image);
      fd.set('description', description);
      fd.set('features', JSON.stringify(features));
      fd.set('gallery', JSON.stringify(gallery));
      fd.set('comparisonTable', JSON.stringify(comparison));
      fd.set('enabled', enabled ? 'on' : '');
      
      Object.entries(seo).forEach(([k, v]) => fd.set(k, v || ''));

      await saveTechnology(fd);
      showToast({ type: 'success', title: 'Technology saved' });
      router.push('/admin/technologies');
    } catch (err) {
      showToast({ type: 'error', title: 'Save failed', description: String(err) });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {technology?.id && <input type="hidden" name="id" defaultValue={technology.id} />}

      <AdminTabs
        tabs={[
          {
            value: 'general',
            label: 'General',
            icon: <Cpu className="h-4 w-4" />,
            content: (
              <div className="space-y-5 max-w-3xl">
                <div className="grid gap-4 sm:grid-cols-2">
                  <AdminInput name="name" label="Technology Name" defaultValue={technology?.name} required />
                  <AdminInput name="slug" label="URL Slug" defaultValue={technology?.slug} placeholder="Leave blank to auto-generate" />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <AdminInput name="manufacturer" label="Manufacturer" defaultValue={technology?.manufacturer} />
                  <AdminInput name="order" label="Display Order" type="number" defaultValue={String(technology?.order || 0)} />
                </div>
                <AdminTextarea name="shortDesc" label="Short Description" defaultValue={technology?.shortDesc} rows={2} required />
                <AdminToggle label="Published" checked={enabled} onChange={setEnabled} />
                <UploadField label="Main Image" value={image} onChange={setImage} />
              </div>
            ),
          },
          {
            value: 'content',
            label: 'Content & Details',
            icon: <FileText className="h-4 w-4" />,
            content: (
              <div className="space-y-5 max-w-3xl">
                <RichTextEditor label="Full Description" content={description} onChange={setDescription} />
                <AdminTextarea name="benefits" label="Benefits (One per line)" defaultValue={Array.isArray(technology?.benefits) ? (technology.benefits as string[]).join('\n') : ''} rows={5} />
                <AdminTextarea name="videos" label="Videos (JSON)" defaultValue={JSON.stringify(technology?.videos || [])} rows={4} helpText='[{"url":"...", "title":"..."}]' />
              </div>
            ),
          },
          {
            value: 'features',
            label: 'Features',
            icon: <Layers className="h-4 w-4" />,
            content: (
              <div className="max-w-3xl">
                <FeatureBuilder features={features} onChange={setFeatures} />
              </div>
            ),
          },
          {
            value: 'gallery',
            label: 'Gallery',
            icon: <Images className="h-4 w-4" />,
            content: (
              <div className="max-w-3xl">
                <MultiImageUpload images={gallery} onChange={setGallery} label="Technology Gallery" />
              </div>
            ),
          },
          {
            value: 'comparison',
            label: 'Comparison Table',
            icon: <Columns className="h-4 w-4" />,
            content: (
              <div className="max-w-4xl">
                <ComparisonTableBuilder data={comparison} onChange={setComparison} />
              </div>
            ),
          },
          {
            value: 'relations',
            label: 'Relations',
            icon: <Link2 className="h-4 w-4" />,
            content: (
              <div className="space-y-4 max-w-3xl">
                <AdminTextarea name="relatedTreatments" label="Related Treatment IDs (JSON)" defaultValue={JSON.stringify(technology?.relatedTreatments || [])} rows={3} />
                <AdminTextarea name="relatedDoctors" label="Related Doctor IDs (JSON)" defaultValue={JSON.stringify(technology?.relatedDoctors || [])} rows={3} />
              </div>
            ),
          },
          {
            value: 'seo',
            label: 'SEO',
            icon: <Search className="h-4 w-4" />,
            content: (
              <div className="max-w-3xl">
                <SeoPanel data={seo} onChange={setSeo} slug={technology?.slug || ''} content={description} />
              </div>
            ),
          },
        ]}
      />

      <div className="flex items-center gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
        <AdminButton type="submit" loading={saving}>
          {technology?.id ? 'Update Technology' : 'Create Technology'}
        </AdminButton>
        <AdminButton type="button" variant="ghost" onClick={() => router.push('/admin/technologies')}>
          Cancel
        </AdminButton>
      </div>
    </form>
  );
}
