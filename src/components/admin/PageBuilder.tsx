'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminTabs } from '@/components/admin/ui/AdminTabs';
import { AdminInput } from '@/components/admin/ui/AdminInput';
import { AdminToggle } from '@/components/admin/ui/AdminToggle';
import { AdminButton } from '@/components/admin/ui/AdminButton';
import { AdminTextarea } from '@/components/admin/ui/AdminTextarea';
import { SeoPanel, type SeoData } from '@/components/admin/SeoPanel';
import { showToast } from '@/components/admin/ui/AdminToast';
import { savePage, savePageSections } from '@/app/admin/(dashboard)/pages/actions';
import { FileText, LayoutTemplate, Search, Plus, GripVertical, Trash2, Copy, Settings } from 'lucide-react';
import { UploadField } from '@/components/admin/UploadField';

type Section = {
  id: string;
  sectionType: string;
  heading: string;
  subHeading: string;
  description: string;
  content: string;
  bgImage: string;
  bgColor: string;
  layout: string;
  enabled: boolean;
};

export function PageBuilder({ page, initialSections = [] }: { page?: any, initialSections?: any[] }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [sections, setSections] = useState<Section[]>(initialSections as Section[]);
  const [enabled, setEnabled] = useState(page?.enabled ?? true);
  const [seo, setSeo] = useState<SeoData>({
    metaTitle: page?.metaTitle || '',
    metaDesc: page?.metaDesc || '',
    keywords: page?.keywords || '',
    ogTitle: page?.ogTitle || '',
    ogDesc: page?.ogDesc || '',
    ogImage: page?.ogImage || '',
    focusKeyword: page?.focusKeyword || '',
  });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData(e.currentTarget);
      fd.set('enabled', enabled ? 'on' : '');
      Object.entries(seo).forEach(([k, v]) => fd.set(k, v || ''));
      
      await savePage(fd);
      
      if (page?.id) {
        await savePageSections(page.id, sections);
      }
      
      showToast({ type: 'success', title: 'Page saved', description: 'Page and sections updated successfully.' });
      if (!page?.id) {
        router.push('/admin/pages'); // Will go back and see it, then click edit to add sections
      }
    } catch (err) {
      showToast({ type: 'error', title: 'Save failed', description: String(err) });
    } finally {
      setSaving(false);
    }
  }

  function addSection(type: string = 'content') {
    setSections([...sections, {
      id: `new-${Date.now()}`,
      sectionType: type,
      heading: '',
      subHeading: '',
      description: '',
      content: '',
      bgImage: '',
      bgColor: '#ffffff',
      layout: 'full',
      enabled: true,
    }]);
  }

  function updateSection(index: number, key: keyof Section, value: any) {
    const newSecs = [...sections];
    newSecs[index] = { ...newSecs[index], [key]: value };
    setSections(newSecs);
  }

  function removeSection(index: number) {
    if (confirm('Are you sure you want to remove this section?')) {
      const newSecs = [...sections];
      newSecs.splice(index, 1);
      setSections(newSecs);
    }
  }

  function duplicateSection(index: number) {
    const newSecs = [...sections];
    const toDup = { ...newSecs[index], id: `new-${Date.now()}` };
    newSecs.splice(index + 1, 0, toDup);
    setSections(newSecs);
  }

  function moveSection(index: number, dir: 'up' | 'down') {
    if (dir === 'up' && index === 0) return;
    if (dir === 'down' && index === sections.length - 1) return;
    const newSecs = [...sections];
    const target = dir === 'up' ? index - 1 : index + 1;
    [newSecs[index], newSecs[target]] = [newSecs[target], newSecs[index]];
    setSections(newSecs);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {page?.id && <input type="hidden" name="id" defaultValue={page.id} />}

      <AdminTabs
        tabs={[
          {
            value: 'general',
            label: 'General',
            icon: <FileText className="h-4 w-4" />,
            content: (
              <div className="space-y-5 max-w-3xl">
                <div className="grid gap-4 sm:grid-cols-2">
                  <AdminInput name="title" label="Page Title" defaultValue={page?.title} required />
                  <AdminInput name="slug" label="URL Slug" defaultValue={page?.slug} placeholder="Leave blank to auto-generate" disabled={page?.slug === 'home'} />
                </div>
                <AdminToggle label="Enabled" description="Is this page visible on the website?" checked={enabled} onChange={setEnabled} />
                {!page?.id && (
                  <p className="text-sm text-slate-500 bg-slate-50 p-4 rounded-xl">Save this page first to unlock the Section Builder.</p>
                )}
              </div>
            ),
          },
          ...(page?.id ? [{
            value: 'builder',
            label: 'Section Builder',
            icon: <LayoutTemplate className="h-4 w-4" />,
            badge: sections.length ? String(sections.length) : undefined,
            content: (
              <div className="space-y-8 max-w-5xl">
                {sections.length === 0 ? (
                  <div className="text-center py-12 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700">
                    <p className="text-slate-500 mb-4">No sections added yet.</p>
                    <AdminButton type="button" onClick={() => addSection('hero')}>Add First Section</AdminButton>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {sections.map((sec, i) => (
                      <div key={sec.id} className="relative rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                        {/* Section Header */}
                        <div className="flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700">
                          <div className="flex items-center gap-3">
                            <GripVertical className="h-5 w-5 text-slate-400 cursor-move" />
                            <select 
                              className="bg-transparent text-sm font-medium outline-none text-slate-700 dark:text-slate-200"
                              value={sec.sectionType}
                              onChange={(e) => updateSection(i, 'sectionType', e.target.value)}
                            >
                              <option value="hero">Hero Section</option>
                              <option value="content">Content Block</option>
                              <option value="features">Features</option>
                              <option value="cta">Call to Action</option>
                              <option value="gallery">Gallery</option>
                            </select>
                          </div>
                          <div className="flex items-center gap-2">
                            <button type="button" onClick={() => moveSection(i, 'up')} disabled={i === 0} className="p-1.5 text-slate-400 hover:text-slate-600 disabled:opacity-30">↑</button>
                            <button type="button" onClick={() => moveSection(i, 'down')} disabled={i === sections.length - 1} className="p-1.5 text-slate-400 hover:text-slate-600 disabled:opacity-30">↓</button>
                            <div className="w-px h-4 bg-slate-300 mx-1" />
                            <button type="button" onClick={() => updateSection(i, 'enabled', !sec.enabled)} className={`p-1.5 ${sec.enabled ? 'text-green-500' : 'text-slate-400'} hover:opacity-80`}>
                              <Settings className="h-4 w-4" />
                            </button>
                            <button type="button" onClick={() => duplicateSection(i)} className="p-1.5 text-slate-400 hover:text-blue-500"><Copy className="h-4 w-4" /></button>
                            <button type="button" onClick={() => removeSection(i)} className="p-1.5 text-slate-400 hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
                          </div>
                        </div>
                        {/* Section Body */}
                        <div className={`p-5 space-y-4 ${!sec.enabled ? 'opacity-50 grayscale' : ''}`}>
                          <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-4">
                              <AdminInput label="Heading" value={sec.heading || ''} onChange={(e) => updateSection(i, 'heading', e.target.value)} />
                              <AdminInput label="Sub Heading" value={sec.subHeading || ''} onChange={(e) => updateSection(i, 'subHeading', e.target.value)} />
                            </div>
                            <div className="space-y-4">
                              <AdminTextarea label="Description" value={sec.description || ''} onChange={(e) => updateSection(i, 'description', e.target.value)} rows={4} />
                            </div>
                          </div>
                          <div className="grid gap-4 sm:grid-cols-3 pt-4 border-t border-slate-100 dark:border-slate-700">
                            <UploadField label="Background Image" value={sec.bgImage || ''} onChange={(v) => updateSection(i, 'bgImage', v)} />
                            <AdminInput label="Background Color" type="color" value={sec.bgColor || '#ffffff'} onChange={(e) => updateSection(i, 'bgColor', e.target.value)} />
                            <div>
                              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Layout</label>
                              <select 
                                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-brand-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900"
                                value={sec.layout || 'full'}
                                onChange={(e) => updateSection(i, 'layout', e.target.value)}
                              >
                                <option value="full">Full Width</option>
                                <option value="split-left">Image Left, Text Right</option>
                                <option value="split-right">Image Right, Text Left</option>
                                <option value="grid">Grid (Cards)</option>
                                <option value="center">Centered Text</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="flex justify-center">
                      <AdminButton type="button" variant="ghost" onClick={() => addSection('content')} icon={<Plus className="h-4 w-4" />}>
                        Add Another Section
                      </AdminButton>
                    </div>
                  </div>
                )}
              </div>
            ),
          }] : []),
          {
            value: 'seo',
            label: 'SEO',
            icon: <Search className="h-4 w-4" />,
            content: (
              <div className="max-w-3xl">
                <SeoPanel data={seo} onChange={setSeo} slug={page?.slug} />
              </div>
            ),
          },
        ]}
      />

      <div className="flex items-center gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
        <AdminButton type="submit" loading={saving}>
          {page?.id ? 'Save Page & Sections' : 'Create Page'}
        </AdminButton>
        <AdminButton type="button" variant="ghost" onClick={() => router.push('/admin/pages')}>
          Cancel
        </AdminButton>
      </div>
    </form>
  );
}
