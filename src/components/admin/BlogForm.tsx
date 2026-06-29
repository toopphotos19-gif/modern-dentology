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
import { RichTextEditor } from '@/components/admin/RichTextEditor';
import { showToast } from '@/components/admin/ui/AdminToast';
import { saveBlogPost } from '@/app/admin/(dashboard)/blog/actions';
import { PenTool, Image, Link2, Search, Settings } from 'lucide-react';

export function BlogForm({ post }: { post?: any }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const [featuredImage, setFeaturedImage] = useState(post?.featured || '');
  const [content, setContent] = useState(post?.content || '');
  const [gallery, setGallery] = useState<GalleryItem[]>(post?.gallery || []);
  const [published, setPublished] = useState(post?.published ?? false);

  const [seo, setSeo] = useState<SeoData>({
    metaTitle: post?.metaTitle || '',
    metaDesc: post?.metaDesc || '',
    keywords: post?.keywords || '',
    canonicalUrl: post?.canonicalUrl || '',
    ogTitle: post?.ogTitle || '',
    ogDesc: post?.ogDesc || '',
    ogImage: post?.ogImage || '',
    twitterTitle: post?.twitterTitle || '',
    twitterDesc: post?.twitterDesc || '',
    twitterImage: post?.twitterImage || '',
    breadcrumb: post?.breadcrumb || '',
  });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData(e.currentTarget);
      fd.set('featured', featuredImage);
      fd.set('content', content);
      fd.set('gallery', JSON.stringify(gallery));
      fd.set('published', published ? 'on' : '');
      
      Object.entries(seo).forEach(([k, v]) => fd.set(k, v || ''));

      await saveBlogPost(fd);
      showToast({ type: 'success', title: 'Blog post saved' });
      router.push('/admin/blog');
    } catch (err) {
      showToast({ type: 'error', title: 'Save failed', description: String(err) });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {post?.id && <input type="hidden" name="id" defaultValue={post.id} />}

      <AdminTabs
        tabs={[
          {
            value: 'content',
            label: 'Content',
            icon: <PenTool className="h-4 w-4" />,
            content: (
              <div className="space-y-6 max-w-4xl">
                <AdminInput name="title" label="Post Title" defaultValue={post?.title} required />
                <AdminTextarea name="excerpt" label="Short Excerpt" defaultValue={post?.excerpt} rows={3} />
                <RichTextEditor label="Blog Content" content={content} onChange={setContent} />
              </div>
            ),
          },
          {
            value: 'media',
            label: 'Media',
            icon: <Image className="h-4 w-4" />,
            content: (
              <div className="space-y-6 max-w-3xl">
                <UploadField label="Featured Image" value={featuredImage} onChange={setFeaturedImage} />
                <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                  <MultiImageUpload images={gallery} onChange={setGallery} label="Inline Gallery" />
                </div>
                <AdminTextarea name="videoEmbeds" label="Video Embeds (JSON)" defaultValue={JSON.stringify(post?.videoEmbeds || [])} rows={3} helpText='[{"url":"https://youtube.com/...", "title":"Video"}]' />
              </div>
            ),
          },
          {
            value: 'settings',
            label: 'Settings',
            icon: <Settings className="h-4 w-4" />,
            content: (
              <div className="space-y-5 max-w-3xl">
                <div className="grid gap-4 sm:grid-cols-2">
                  <AdminInput name="slug" label="URL Slug" defaultValue={post?.slug} placeholder="Auto-generated if blank" />
                  <AdminInput name="author" label="Author" defaultValue={post?.author} />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <AdminInput name="category" label="Category" defaultValue={post?.category} />
                  <AdminInput name="tags" label="Tags (comma separated)" defaultValue={Array.isArray(post?.tags) ? post.tags.join(', ') : ''} />
                </div>
                <div className="grid gap-4 sm:grid-cols-2 items-center">
                  <AdminInput name="publishAt" label="Publish Date" type="datetime-local" defaultValue={post?.publishAt ? new Date(post.publishAt).toISOString().slice(0, 16) : ''} />
                  <AdminToggle label="Published Status" description="Toggle to publish or draft" checked={published} onChange={setPublished} />
                </div>
              </div>
            ),
          },
          {
            value: 'relations',
            label: 'Relations',
            icon: <Link2 className="h-4 w-4" />,
            content: (
              <div className="space-y-5 max-w-3xl">
                <AdminTextarea name="relatedBlogs" label="Related Blogs (IDs)" defaultValue={JSON.stringify(post?.relatedBlogs || [])} rows={2} />
                <AdminTextarea name="relatedServices" label="Related Services (IDs)" defaultValue={JSON.stringify(post?.relatedServices || [])} rows={2} />
                <AdminTextarea name="relatedDoctors" label="Related Doctors (IDs)" defaultValue={JSON.stringify(post?.relatedDoctors || [])} rows={2} />
              </div>
            ),
          },
          {
            value: 'seo',
            label: 'SEO',
            icon: <Search className="h-4 w-4" />,
            content: (
              <div className="max-w-3xl">
                <SeoPanel data={seo} onChange={setSeo} slug={post?.slug || ''} content={content} />
              </div>
            ),
          },
        ]}
      />

      <div className="flex items-center gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
        <AdminButton type="submit" loading={saving}>
          {post?.id ? 'Update Post' : 'Create Post'}
        </AdminButton>
        <AdminButton type="button" variant="ghost" onClick={() => router.push('/admin/blog')}>
          Cancel
        </AdminButton>
      </div>
    </form>
  );
}
