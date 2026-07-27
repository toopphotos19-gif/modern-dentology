'use client';

import { useState } from 'react';
import { AdminSelect } from '@/components/admin/ui/AdminSelect';
import { AdminInput } from '@/components/admin/ui/AdminInput';
import { AdminToggle } from '@/components/admin/ui/AdminToggle';
import { Palette, Type, MousePointerClick, Sparkles, Loader2 } from 'lucide-react';

// ─── Color Picker Card ─────────────────────────────────────────
function ColorField({
  label,
  value,
  onChange,
  helpText,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  helpText?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
        {label}
      </label>
      <div className="flex items-center gap-3">
        <div className="relative">
          <input
            type="color"
            value={value || '#0ea5e9'}
            onChange={(e) => onChange(e.target.value)}
            className="h-10 w-14 cursor-pointer rounded-lg border border-slate-200 dark:border-slate-600 bg-transparent p-0.5 [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:rounded-md [&::-webkit-color-swatch]:border-none"
          />
        </div>
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#0ea5e9"
          className="w-28 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-800 dark:text-slate-200 font-mono focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500"
        />
        <div
          className="h-10 w-10 rounded-xl border border-slate-200 dark:border-slate-600 shadow-inner"
          style={{ backgroundColor: value || '#0ea5e9' }}
        />
      </div>
      {helpText && (
        <p className="text-xs text-slate-400 dark:text-slate-500">{helpText}</p>
      )}
    </div>
  );
}

// ─── Section wrapper ─────────────────────────────────────────
function Section({
  icon,
  title,
  description,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/80">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400">
          {icon}
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            {title}
          </h3>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            {description}
          </p>
        </div>
      </div>
      <div className="p-5 space-y-5">{children}</div>
    </div>
  );
}

// ─── Font options ─────────────────────────────────────────
const FONT_OPTIONS = [
  { value: '', label: 'Default (System)' },
  { value: 'Inter', label: 'Inter' },
  { value: 'Roboto', label: 'Roboto' },
  { value: 'Poppins', label: 'Poppins' },
  { value: 'Outfit', label: 'Outfit' },
  { value: 'Montserrat', label: 'Montserrat' },
  { value: 'Open Sans', label: 'Open Sans' },
  { value: 'Lato', label: 'Lato' },
  { value: 'Nunito', label: 'Nunito' },
  { value: 'Raleway', label: 'Raleway' },
  { value: 'Playfair Display', label: 'Playfair Display' },
  { value: 'Merriweather', label: 'Merriweather' },
  { value: 'DM Sans', label: 'DM Sans' },
  { value: 'Space Grotesk', label: 'Space Grotesk' },
  { value: 'Plus Jakarta Sans', label: 'Plus Jakarta Sans' },
];

// ─── Button radius options ─────────────────────────────────────
const RADIUS_OPTIONS = [
  { value: 'none', label: 'None (Square)' },
  { value: 'sm', label: 'Small' },
  { value: 'md', label: 'Medium' },
  { value: 'lg', label: 'Large' },
  { value: 'xl', label: 'Extra Large' },
  { value: 'full', label: 'Fully Rounded (Pill)' },
];

const BUTTON_SIZE_OPTIONS = [
  { value: 'sm', label: 'Small' },
  { value: 'md', label: 'Medium' },
  { value: 'lg', label: 'Large' },
];

// ─── Icon pack options ─────────────────────────────────────
const ICON_PACK_OPTIONS = [
  { value: 'lucide', label: 'Lucide Icons (Default)' },
  { value: 'heroicons', label: 'Heroicons' },
  { value: 'phosphor', label: 'Phosphor Icons' },
  { value: 'tabler', label: 'Tabler Icons' },
];

const ICON_STYLE_OPTIONS = [
  { value: 'outline', label: 'Outline' },
  { value: 'solid', label: 'Solid (Filled)' },
  { value: 'duotone', label: 'Duotone' },
];

// ─── Loader type options ─────────────────────────────────────
const LOADER_TYPE_OPTIONS = [
  { value: 'spinner', label: '🔄 Spinner' },
  { value: 'pulse', label: '💫 Pulse' },
  { value: 'skeleton', label: '▒ Skeleton' },
  { value: 'progress', label: '━ Progress Bar' },
  { value: 'logo', label: '🏥 Logo Fade' },
  { value: 'none', label: '🚫 No Loader' },
];

// ─── Main Component ─────────────────────────────────────────
export function AppearanceSettings({ settings }: { settings: any }) {
  // ── Theme Colors ──
  const existingColors = settings?.themeColors || {};
  const [primary, setPrimary] = useState(existingColors.primary || '#0ea5e9');
  const [secondary, setSecondary] = useState(existingColors.secondary || '#64748b');
  const [accent, setAccent] = useState(existingColors.accent || '#f59e0b');
  const [background, setBackground] = useState(existingColors.background || '#ffffff');
  const [surface, setSurface] = useState(existingColors.surface || '#f8fafc');
  const [text, setText] = useState(existingColors.text || '#1e293b');

  // ── Typography ──
  const existingFonts = settings?.fonts || {};
  const [headingFont, setHeadingFont] = useState(existingFonts.heading || 'Inter');
  const [bodyFont, setBodyFont] = useState(existingFonts.body || 'Roboto');

  // ── Button Styles ──
  const existingButtons = settings?.buttonStyles || {};
  const [btnRadius, setBtnRadius] = useState(existingButtons.radius || 'full');
  const [btnSize, setBtnSize] = useState(existingButtons.size || 'md');
  const [btnShadow, setBtnShadow] = useState(existingButtons.shadow ?? true);
  const [btnAnimation, setBtnAnimation] = useState(existingButtons.hoverAnimation ?? true);

  // ── Global Icons ──
  const existingIcons = settings?.globalIcons || {};
  const [iconPack, setIconPack] = useState(existingIcons.pack || 'lucide');
  const [iconStyle, setIconStyle] = useState(existingIcons.style || 'outline');

  // ── Website Loader ──
  const existingLoader = settings?.websiteLoader || {};
  const [loaderEnabled, setLoaderEnabled] = useState(existingLoader.enabled ?? true);
  const [loaderType, setLoaderType] = useState(existingLoader.type || 'spinner');
  const [loaderColor, setLoaderColor] = useState(existingLoader.color || primary);
  const [loaderBg, setLoaderBg] = useState(existingLoader.background || '#ffffff');
  const [loaderText, setLoaderText] = useState(existingLoader.text || '');

  // Build JSON strings for the hidden form fields
  const themeColorsJSON = JSON.stringify({ primary, secondary, accent, background, surface, text });
  const fontsJSON = JSON.stringify({ heading: headingFont, body: bodyFont });
  const buttonStylesJSON = JSON.stringify({ radius: btnRadius, size: btnSize, shadow: btnShadow, hoverAnimation: btnAnimation });
  const globalIconsJSON = JSON.stringify({ pack: iconPack, style: iconStyle });
  const websiteLoaderJSON = JSON.stringify({ enabled: loaderEnabled, type: loaderType, color: loaderColor, background: loaderBg, text: loaderText });

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Hidden inputs that carry the JSON to the form */}
      <input type="hidden" name="themeColors" value={themeColorsJSON} />
      <input type="hidden" name="fonts" value={fontsJSON} />
      <input type="hidden" name="buttonStyles" value={buttonStylesJSON} />
      <input type="hidden" name="globalIcons" value={globalIconsJSON} />
      <input type="hidden" name="websiteLoader" value={websiteLoaderJSON} />

      {/* ── 1. Theme Colors ────────────────────────── */}
      <Section
        icon={<Palette className="h-4 w-4" />}
        title="Theme Colors"
        description="Choose colors for your website brand and layout"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <ColorField
            label="Primary Color"
            value={primary}
            onChange={setPrimary}
            helpText="Main brand color — buttons, links, highlights"
          />
          <ColorField
            label="Secondary Color"
            value={secondary}
            onChange={setSecondary}
            helpText="Supporting color — badges, secondary buttons"
          />
          <ColorField
            label="Accent Color"
            value={accent}
            onChange={setAccent}
            helpText="Eye-catching color — alerts, notifications"
          />
          <ColorField
            label="Text Color"
            value={text}
            onChange={setText}
            helpText="Default text color across the site"
          />
          <ColorField
            label="Background Color"
            value={background}
            onChange={setBackground}
            helpText="Main page background"
          />
          <ColorField
            label="Surface Color"
            value={surface}
            onChange={setSurface}
            helpText="Cards and elevated sections background"
          />
        </div>

        {/* Live preview */}
        <div className="mt-4 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="px-4 py-2 text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
            Preview
          </div>
          <div className="p-5" style={{ backgroundColor: background, color: text }}>
            <div className="flex items-center gap-3 mb-3">
              <div
                className="h-8 w-8 rounded-lg"
                style={{ backgroundColor: primary }}
              />
              <span className="font-semibold" style={{ fontFamily: headingFont }}>
                Your Brand
              </span>
            </div>
            <div
              className="rounded-xl p-4 mb-3"
              style={{ backgroundColor: surface }}
            >
              <p className="text-sm" style={{ fontFamily: bodyFont }}>
                This is a sample card on a surface background.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="px-4 py-1.5 text-sm font-medium text-white transition-transform hover:scale-105"
                style={{
                  backgroundColor: primary,
                  borderRadius: btnRadius === 'full' ? '9999px' : btnRadius === 'xl' ? '16px' : btnRadius === 'lg' ? '12px' : btnRadius === 'md' ? '8px' : btnRadius === 'sm' ? '4px' : '0',
                  boxShadow: btnShadow ? '0 4px 14px rgba(0,0,0,0.15)' : 'none',
                }}
              >
                Primary Button
              </button>
              <button
                type="button"
                className="px-4 py-1.5 text-sm font-medium transition-transform hover:scale-105"
                style={{
                  backgroundColor: secondary,
                  color: '#fff',
                  borderRadius: btnRadius === 'full' ? '9999px' : btnRadius === 'xl' ? '16px' : btnRadius === 'lg' ? '12px' : btnRadius === 'md' ? '8px' : btnRadius === 'sm' ? '4px' : '0',
                }}
              >
                Secondary
              </button>
              <span
                className="inline-block px-2 py-0.5 text-xs font-bold rounded"
                style={{ backgroundColor: accent, color: '#fff' }}
              >
                Accent Badge
              </span>
            </div>
          </div>
        </div>
      </Section>

      {/* ── 2. Typography ────────────────────────── */}
      <Section
        icon={<Type className="h-4 w-4" />}
        title="Typography"
        description="Select fonts for headings and body text"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <AdminSelect
              label="Heading Font"
              options={FONT_OPTIONS}
              value={headingFont}
              onChange={(e) => setHeadingFont(e.target.value)}
              helpText="Used for page titles and section headings"
            />
            <div
              className="mt-2 text-xl font-bold text-slate-800 dark:text-slate-200"
              style={{ fontFamily: headingFont || 'inherit' }}
            >
              Heading Preview
            </div>
          </div>
          <div className="space-y-1.5">
            <AdminSelect
              label="Body Font"
              options={FONT_OPTIONS}
              value={bodyFont}
              onChange={(e) => setBodyFont(e.target.value)}
              helpText="Used for paragraphs and general text"
            />
            <div
              className="mt-2 text-sm text-slate-600 dark:text-slate-400"
              style={{ fontFamily: bodyFont || 'inherit' }}
            >
              This is how your body text will look across the website.
            </div>
          </div>
        </div>
      </Section>

      {/* ── 3. Button Styles ────────────────────────── */}
      <Section
        icon={<MousePointerClick className="h-4 w-4" />}
        title="Button Styles"
        description="Customize the look of all buttons across your website"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <AdminSelect
            label="Corner Roundness"
            options={RADIUS_OPTIONS}
            value={btnRadius}
            onChange={(e) => setBtnRadius(e.target.value)}
            helpText="How rounded the button corners should be"
          />
          <AdminSelect
            label="Default Size"
            options={BUTTON_SIZE_OPTIONS}
            value={btnSize}
            onChange={(e) => setBtnSize(e.target.value)}
            helpText="Default button padding size"
          />
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:gap-8">
          <AdminToggle
            label="Button Shadow"
            description="Add a subtle shadow behind buttons"
            checked={btnShadow}
            onChange={setBtnShadow}
          />
          <AdminToggle
            label="Hover Animation"
            description="Scale up slightly when hovering"
            checked={btnAnimation}
            onChange={setBtnAnimation}
          />
        </div>
      </Section>

      {/* ── 4. Icon Settings ────────────────────────── */}
      <Section
        icon={<Sparkles className="h-4 w-4" />}
        title="Icon Settings"
        description="Choose the icon style used throughout the website"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <AdminSelect
            label="Icon Pack"
            options={ICON_PACK_OPTIONS}
            value={iconPack}
            onChange={(e) => setIconPack(e.target.value)}
            helpText="The icon library used across the website"
          />
          <AdminSelect
            label="Icon Style"
            options={ICON_STYLE_OPTIONS}
            value={iconStyle}
            onChange={(e) => setIconStyle(e.target.value)}
            helpText="Outline for a clean look, solid for bold impact"
          />
        </div>
      </Section>

      {/* ── 5. Website Loader ────────────────────────── */}
      <Section
        icon={<Loader2 className="h-4 w-4" />}
        title="Website Loader"
        description="The loading screen visitors see while the page loads"
      >
        <AdminToggle
          label="Enable Loading Screen"
          description="Show a loader animation while the page is loading"
          checked={loaderEnabled}
          onChange={setLoaderEnabled}
        />
        {loaderEnabled && (
          <>
            <AdminSelect
              label="Loader Type"
              options={LOADER_TYPE_OPTIONS}
              value={loaderType}
              onChange={(e) => setLoaderType(e.target.value)}
              helpText="Choose the style of loading animation"
            />
            <div className="grid gap-5 sm:grid-cols-2">
              <ColorField
                label="Loader Color"
                value={loaderColor}
                onChange={setLoaderColor}
                helpText="Color of the spinner or progress bar"
              />
              <ColorField
                label="Loader Background"
                value={loaderBg}
                onChange={setLoaderBg}
                helpText="Background color of the loading screen"
              />
            </div>
            <AdminInput
              name="_loaderText"
              label="Loading Text (optional)"
              value={loaderText}
              onChange={(e) => setLoaderText(e.target.value)}
              placeholder="e.g. Loading..."
              helpText="Text shown below the loader animation"
            />

            {/* Loader preview */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="px-4 py-2 text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                Loader Preview
              </div>
              <div
                className="flex flex-col items-center justify-center gap-3 py-10"
                style={{ backgroundColor: loaderBg }}
              >
                {loaderType === 'spinner' && (
                  <div
                    className="h-10 w-10 animate-spin rounded-full border-4 border-t-transparent"
                    style={{ borderColor: `${loaderColor}33`, borderTopColor: loaderColor }}
                  />
                )}
                {loaderType === 'pulse' && (
                  <div className="flex gap-1.5">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="h-3 w-3 rounded-full animate-pulse"
                        style={{
                          backgroundColor: loaderColor,
                          animationDelay: `${i * 0.2}s`,
                        }}
                      />
                    ))}
                  </div>
                )}
                {loaderType === 'progress' && (
                  <div className="w-48 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: `${loaderColor}22` }}>
                    <div
                      className="h-full rounded-full animate-[progress_1.5s_ease-in-out_infinite]"
                      style={{
                        backgroundColor: loaderColor,
                        width: '40%',
                        animation: 'progress 1.5s ease-in-out infinite',
                      }}
                    />
                  </div>
                )}
                {loaderType === 'skeleton' && (
                  <div className="w-48 space-y-2">
                    <div className="h-4 rounded animate-pulse" style={{ backgroundColor: `${loaderColor}22` }} />
                    <div className="h-4 w-3/4 rounded animate-pulse" style={{ backgroundColor: `${loaderColor}15` }} />
                    <div className="h-4 w-1/2 rounded animate-pulse" style={{ backgroundColor: `${loaderColor}10` }} />
                  </div>
                )}
                {loaderType === 'logo' && (
                  <div className="h-12 w-12 rounded-xl animate-pulse flex items-center justify-center text-white text-xl font-bold" style={{ backgroundColor: loaderColor }}>
                    D
                  </div>
                )}
                {loaderType === 'none' && (
                  <p className="text-sm text-slate-400">No loading screen</p>
                )}
                {loaderText && loaderType !== 'none' && (
                  <p className="text-sm font-medium" style={{ color: loaderColor }}>
                    {loaderText}
                  </p>
                )}
              </div>
            </div>
          </>
        )}
      </Section>

      {/* Progress bar animation keyframes */}
      <style>{`
        @keyframes progress {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(150%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  );
}
