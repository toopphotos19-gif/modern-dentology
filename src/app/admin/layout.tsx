// Top-level /admin layout is a plain pass-through (NO auth guard here).
// This is important: the login page lives at /admin/login and must NOT be
// guarded, otherwise it would redirect to itself forever (redirect loop).
// The actual guard + sidebar lives in /admin/(dashboard)/layout.tsx, which
// only wraps the protected pages.
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
