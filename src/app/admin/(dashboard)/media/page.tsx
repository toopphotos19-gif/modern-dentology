import { AdminPageHeader } from '@/components/admin/ui/AdminPageHeader';
import { Image as ImageIcon, Search, Folder, SlidersHorizontal, UploadCloud } from 'lucide-react';
import { AdminButton } from '@/components/admin/ui/AdminButton';

export const dynamic = 'force-dynamic';

export default function MediaLibraryPage() {
  return (
    <div className="space-y-6 flex flex-col h-[calc(100vh-8rem)]">
      <AdminPageHeader
        title="Media Library"
        description="Manage your images, videos, and documents across the entire website."
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Media' }]}
        actions={
          <AdminButton icon={<UploadCloud className="h-4 w-4" />}>Upload Media</AdminButton>
        }
      />

      <div className="rounded-2xl bg-white dark:bg-slate-800 shadow-sm ring-1 ring-slate-100 dark:ring-slate-700 flex-1 flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="border-b border-slate-200 dark:border-slate-700 p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-brand-50 text-brand-600 font-medium text-sm">
              <ImageIcon className="h-4 w-4" /> All Media
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-50 font-medium text-sm">
              <Folder className="h-4 w-4" /> Folders
            </button>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search media..." 
                className="pl-9 pr-4 py-1.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
              />
            </div>
            <button className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg border border-slate-200">
              <SlidersHorizontal className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-12 flex flex-col items-center justify-center text-center">
          <div className="h-20 w-20 bg-brand-50 dark:bg-brand-500/10 rounded-full flex items-center justify-center mb-6">
            <UploadCloud className="h-10 w-10 text-brand-500" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Cloudinary Integration Active</h2>
          <p className="mt-2 text-slate-500 max-w-md">
            Your media is securely managed and automatically optimized via Cloudinary. 
            You can upload and manage images directly within any content module (Pages, Services, Blog, etc.) using the built-in media uploader.
          </p>
          <div className="mt-8 flex gap-3">
            <AdminButton icon={<UploadCloud className="h-4 w-4" />}>Upload New File</AdminButton>
            <a href="https://cloudinary.com/console" target="_blank" rel="noreferrer">
              <AdminButton variant="secondary">Open Cloudinary Console</AdminButton>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
