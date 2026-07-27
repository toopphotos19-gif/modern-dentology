'use client';

import { useState } from 'react';
import { AdminTabs } from '@/components/admin/ui/AdminTabs';
import { AdminInput } from '@/components/admin/ui/AdminInput';
import { AdminTextarea } from '@/components/admin/ui/AdminTextarea';
import { AdminToggle } from '@/components/admin/ui/AdminToggle';
import { AdminButton } from '@/components/admin/ui/AdminButton';
import { UploadField } from '@/components/admin/UploadField';
import { showToast } from '@/components/admin/ui/AdminToast';
import { saveSiteSettings } from '@/app/admin/(dashboard)/settings/actions';
import { Globe, MapPin, Share2, Paintbrush, Bell, LayoutTemplate, Search } from 'lucide-react';
import { AppearanceSettings } from '@/components/admin/AppearanceSettings';

export function SettingsForm({ settings }: { settings: any }) {
  const [saving, setSaving] = useState(false);
  const [headerLogo, setHeaderLogo] = useState(settings?.headerLogo || '');
  const [footerLogo, setFooterLogo] = useState(settings?.footerLogo || '');
  const [favicon, setFavicon] = useState(settings?.favicon || '');
  const [sitemapEnabled, setSitemapEnabled] = useState(settings?.sitemapEnabled ?? true);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData(e.currentTarget);
      fd.set('headerLogo', headerLogo);
      fd.set('footerLogo', footerLogo);
      fd.set('favicon', favicon);
      fd.set('sitemapEnabled', sitemapEnabled ? 'on' : '');

      await saveSiteSettings(fd);
      showToast({ type: 'success', title: 'Settings saved', description: 'Global website settings have been updated.' });
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
            value: 'general',
            label: 'General',
            icon: <Globe className="h-4 w-4" />,
            content: (
              <div className="space-y-5 max-w-3xl">
                <div className="grid gap-4 sm:grid-cols-2">
                  <AdminInput name="websiteName" label="Website Name" defaultValue={settings?.websiteName} />
                  <AdminInput name="tagline" label="Tagline" defaultValue={settings?.tagline} />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <UploadField label="Header Logo" value={headerLogo} onChange={setHeaderLogo} />
                  <UploadField label="Footer Logo" value={footerLogo} onChange={setFooterLogo} />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <UploadField label="Favicon" value={favicon} onChange={setFavicon} />
                  <AdminInput name="loadingAnimation" label="Loading Animation URL" defaultValue={settings?.loadingAnimation} />
                </div>
                <AdminTextarea name="copyrightText" label="Copyright Text" defaultValue={settings?.copyrightText} rows={2} />
                <AdminTextarea name="footerText" label="Footer Text" defaultValue={settings?.footerText} rows={3} />
              </div>
            ),
          },
          {
            value: 'contact',
            label: 'Contact Information',
            icon: <MapPin className="h-4 w-4" />,
            content: (
              <div className="space-y-5 max-w-3xl">
                <div className="grid gap-4 sm:grid-cols-2">
                  <AdminInput name="phone" label="Phone Number" defaultValue={settings?.phone} />
                  <AdminInput name="whatsapp" label="WhatsApp Number" defaultValue={settings?.whatsapp} />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <AdminInput name="email" label="Email Address" type="email" defaultValue={settings?.email} />
                  <AdminInput name="emergencyContact" label="Emergency Contact" defaultValue={settings?.emergencyContact} />
                </div>
                <AdminTextarea name="address" label="Physical Address" defaultValue={settings?.address} rows={2} />
                <div className="grid gap-4 sm:grid-cols-2">
                  <AdminInput name="googleMapsUrl" label="Google Maps URL" defaultValue={settings?.googleMapsUrl} />
                  <AdminInput name="googleBusinessUrl" label="Google Business Profile" defaultValue={settings?.googleBusinessUrl} />
                </div>
                <AdminTextarea name="mapEmbed" label="Google Maps Embed Code" defaultValue={settings?.mapEmbed} rows={3} />
                <AdminTextarea name="workingHours" label="Working Hours (JSON)" defaultValue={JSON.stringify(settings?.workingHours || [])} rows={4} helpText='[{"day":"Monday","open":"09:00","close":"17:00"}]' />
              </div>
            ),
          },
          {
            value: 'social',
            label: 'Social Media',
            icon: <Share2 className="h-4 w-4" />,
            content: (
              <div className="space-y-5 max-w-3xl grid sm:grid-cols-2 gap-4 items-end">
                <AdminInput name="facebook" label="Facebook URL" defaultValue={settings?.facebook} />
                <AdminInput name="instagram" label="Instagram URL" defaultValue={settings?.instagram} />
                <AdminInput name="youtube" label="YouTube URL" defaultValue={settings?.youtube} />
                <AdminInput name="twitter" label="Twitter / X URL" defaultValue={settings?.twitter} />
                <AdminInput name="linkedin" label="LinkedIn URL" defaultValue={settings?.linkedin} />
                <AdminInput name="tiktok" label="TikTok URL" defaultValue={settings?.tiktok} />
                <AdminInput name="pinterest" label="Pinterest URL" defaultValue={settings?.pinterest} />
              </div>
            ),
          },
          {
            value: 'appearance',
            label: 'Appearance',
            icon: <Paintbrush className="h-4 w-4" />,
            content: <AppearanceSettings settings={settings} />,
          },
          {
            value: 'navigation',
            label: 'Menus',
            icon: <LayoutTemplate className="h-4 w-4" />,
            content: (
              <div className="space-y-5 max-w-3xl">
                <AdminTextarea name="headerMenu" label="Header Menu (JSON)" defaultValue={JSON.stringify(settings?.headerMenu || [])} rows={6} helpText='[{"label":"Home","href":"/"}]' />
                <AdminTextarea name="footerMenu" label="Footer Menu (JSON)" defaultValue={JSON.stringify(settings?.footerMenu || [])} rows={6} helpText='[{"label":"Privacy Policy","url":"/privacy"}]' />
              </div>
            ),
          },
          {
            value: 'features',
            label: 'Popups & Bars',
            icon: <Bell className="h-4 w-4" />,
            content: (
              <div className="space-y-5 max-w-3xl">
                <AdminTextarea name="announcementBar" label="Announcement Bar (JSON)" defaultValue={JSON.stringify(settings?.announcementBar || {})} rows={3} helpText='{"enabled":true, "text":"Sale!"}' />
                <AdminTextarea name="cookieBanner" label="Cookie Banner (JSON)" defaultValue={JSON.stringify(settings?.cookieBanner || {})} rows={3} />
                <AdminTextarea name="newsletterPopup" label="Newsletter Popup (JSON)" defaultValue={JSON.stringify(settings?.newsletterPopup || {})} rows={4} />
              </div>
            ),
          },
          {
            value: 'seo',
            label: 'Default SEO',
            icon: <Search className="h-4 w-4" />,
            content: (
              <div className="space-y-5 max-w-3xl">
                <AdminInput name="metaTitle" label="Default Meta Title" defaultValue={settings?.metaTitle} />
                <AdminTextarea name="metaDesc" label="Default Meta Description" defaultValue={settings?.metaDesc} rows={3} />
                <AdminInput name="keywords" label="Default Keywords" defaultValue={settings?.keywords} />
                <AdminInput name="robots" label="Robots Meta" defaultValue={settings?.robots || 'index, follow'} />
                <AdminToggle label="Enable XML Sitemap" checked={sitemapEnabled} onChange={setSitemapEnabled} />
              </div>
            ),
          },
        ]}
      />

      <div className="flex items-center gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
        <AdminButton type="submit" loading={saving}>
          Save Settings
        </AdminButton>
      </div>
    </form>
  );
}
