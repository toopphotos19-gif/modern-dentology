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
import { showToast } from '@/components/admin/ui/AdminToast';
import { saveBeforeAfter } from '@/app/admin/(dashboard)/before-after/actions';
import { Settings, Images, FileText, Search } from 'lucide-react';

type Category = { id: string; name: string };

export function BeforeAfterForm({
  comparison,
  categories = [],
}: {
  comparison?: Record<string, any>;
  categories?: Category[];
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [beforeImage, setBeforeImage] = useState(comparison?.beforeImage || '');
  const [afterImage, setAfterImage] = useState(comparison?.afterImage || '');
  const [ogImage, setOgImage] = useState(comparison?.ogImage || '');
  const [featured, setFeatured] = useState(comparison?.featured ?? false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData(e.currentTarget);
      fd.set('beforeImage', beforeImage);
      fd.set('afterImage', afterImage);
      fd.set('ogImage', ogImage);
      fd.set('featured', featured ? 'on' : '');
      await saveBeforeAfter(fd);
      showToast({ type: 'success', title: 'Comparison saved' });
      router.push('/admin/before-after');
    } catch (err) {
      showToast({ type: 'error', title: 'Save failed', description: String(err) });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {comparison?.id && <input type="hidden" name="id" defaultValue={comparison.id} />}

      <AdminTabs
        tabs={[
          {
            value: 'general',
            label: 'General',
            icon: <Settings className="h-4 w-4" />,
            content: (
              <div className="space-y-4 max-w-3xl">
                <div className="grid gap-4 sm:grid-cols-2">
                  <AdminInput name="treatmentName" label="Treatment Name" defaultValue={comparison?.treatmentName} required />
                  <AdminInput name="slug" label="URL Slug" defaultValue={comparison?.slug} placeholder="auto-generated" />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <AdminSelect
                    name="categoryId"
                    label="Category"
                    defaultValue={comparison?.categoryId || ''}
                    placeholder="Select category"
                    options={categories.map((c) => ({ value: c.id, label: c.name }))}
                  />
                  <AdminSelect
                    name="status"
                    label="Status"
                    defaultValue={comparison?.status || 'DRAFT'}
                    options={[
                      { value: 'DRAFT', label: 'Draft' },
                      { value: 'PUBLISHED', label: 'Published' },
                    ]}
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <AdminInput name="patientName" label="Patient Name (Optional)" defaultValue={comparison?.patientName} />
                  <AdminInput name="patientInitials" label="Patient Initials (Optional)" defaultValue={comparison?.patientInitials} />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <AdminInput name="doctorName" label="Doctor" defaultValue={comparison?.doctorName} />
                  <AdminInput name="treatmentDate" label="Treatment Date" type="date" defaultValue={comparison?.treatmentDate ? new Date(comparison.treatmentDate).toISOString().split('T')[0] : ''} />
                </div>
                <AdminInput name="order" label="Display Order" type="number" defaultValue={String(comparison?.order ?? 0)} />
                <AdminToggle label="Featured Comparison" description="Highlight on the main page" checked={featured} onChange={setFeatured} />
              </div>
            ),
          },
          {
            value: 'images',
            label: 'Images',
            icon: <Images className="h-4 w-4" />,
            content: (
              <div className="space-y-6 max-w-3xl">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-3">
                    <UploadField label="Before Image" value={beforeImage} onChange={setBeforeImage} />
                    <AdminInput name="beforeImageAlt" label="Before Alt Text" defaultValue={comparison?.beforeImageAlt} placeholder="Describe the before state" />
                    <AdminInput name="beforeImageCaption" label="Before Caption" defaultValue={comparison?.beforeImageCaption} />
                  </div>
                  <div className="space-y-3">
                    <UploadField label="After Image" value={afterImage} onChange={setAfterImage} />
                    <AdminInput name="afterImageAlt" label="After Alt Text" defaultValue={comparison?.afterImageAlt} placeholder="Describe the after state" />
                    <AdminInput name="afterImageCaption" label="After Caption" defaultValue={comparison?.afterImageCaption} />
                  </div>
                </div>
                {/* Preview */}
                {beforeImage && afterImage && (
                  <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                    <p className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-50 dark:bg-slate-700/50">Preview</p>
                    <div className="flex h-48">
                      <div className="w-1/2 relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={beforeImage} alt="Before" className="h-full w-full object-cover" />
                        <span className="absolute bottom-2 left-2 rounded bg-black/60 px-2 py-0.5 text-xs text-white">Before</span>
                      </div>
                      <div className="w-1/2 relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={afterImage} alt="After" className="h-full w-full object-cover" />
                        <span className="absolute bottom-2 right-2 rounded bg-black/60 px-2 py-0.5 text-xs text-white">After</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ),
          },
          {
            value: 'content',
            label: 'Content',
            icon: <FileText className="h-4 w-4" />,
            content: (
              <div className="space-y-4 max-w-3xl">
                <AdminTextarea name="shortDescription" label="Short Description" defaultValue={comparison?.shortDescription} rows={3} />
                <AdminTextarea name="patientStory" label="Patient Story" defaultValue={comparison?.patientStory} rows={5} />
                <AdminTextarea name="treatmentSummary" label="Treatment Summary" defaultValue={comparison?.treatmentSummary} rows={4} />
                <AdminTextarea name="procedurePerformed" label="Procedure Performed" defaultValue={comparison?.procedurePerformed} rows={3} />
              </div>
            ),
          },
          {
            value: 'seo',
            label: 'SEO',
            icon: <Search className="h-4 w-4" />,
            content: (
              <div className="space-y-4 max-w-3xl">
                <AdminInput name="seoTitle" label="SEO Title" defaultValue={comparison?.seoTitle} />
                <AdminTextarea name="seoDesc" label="SEO Description" defaultValue={comparison?.seoDesc} maxLength={160} showCount rows={3} />
                <AdminInput name="seoKeywords" label="SEO Keywords" defaultValue={comparison?.seoKeywords} />
                <AdminInput name="focusKeyword" label="Focus Keyword" defaultValue={comparison?.focusKeyword} />
                <UploadField label="OG Image" value={ogImage} onChange={setOgImage} />
              </div>
            ),
          },
        ]}
      />

      <div className="flex items-center gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
        <AdminButton type="submit" loading={saving}>
          {comparison?.id ? 'Update Comparison' : 'Create Comparison'}
        </AdminButton>
        <AdminButton type="button" variant="ghost" onClick={() => router.push('/admin/before-after')}>
          Cancel
        </AdminButton>
      </div>
    </form>
  );
}
