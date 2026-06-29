import { prisma } from '@/lib/prisma';
import { Container } from '@/components/ui/Container';
import { BeforeAfterGallery } from '@/components/ui/BeforeAfterGallery';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Before & After Gallery | Modern Dentology',
  description: 'See real patient transformations with our interactive before and after comparison gallery.',
};

export default async function BeforeAfterPage() {
  const [comparisons, categories, settings] = await Promise.all([
    prisma.beforeAfter.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: [{ featured: 'desc' }, { order: 'asc' }],
      include: { category: true },
    }),
    prisma.beforeAfterCategory.findMany({ where: { enabled: true }, orderBy: { order: 'asc' } }),
    prisma.siteSetting.findUnique({ where: { id: 'main' } }),
  ]);

  return (
    <>
      <main>
        {/* Hero */}
        <section className="bg-gradient-to-br from-brand-900 via-brand-800 to-brand-700 pt-32 pb-16">
          <Container>
            <h1 className="text-4xl font-extrabold text-white sm:text-5xl">Before & After</h1>
            <p className="mt-4 max-w-xl text-lg text-white/70">
              See the transformations our patients have experienced. Drag the slider to compare before and after results.
            </p>
          </Container>
        </section>

        {/* Gallery */}
        <section className="py-16">
          <Container>
            <BeforeAfterGallery
              comparisons={comparisons.map((c) => ({
                id: c.id,
                slug: c.slug,
                treatmentName: c.treatmentName,
                beforeImage: c.beforeImage,
                afterImage: c.afterImage,
                beforeImageAlt: c.beforeImageAlt || undefined,
                afterImageAlt: c.afterImageAlt || undefined,
                shortDescription: c.shortDescription || undefined,
                categoryName: c.category?.name || 'All',
                categorySlug: c.category?.slug || '',
                featured: c.featured,
                doctorName: c.doctorName || undefined,
              }))}
              categories={categories.map((c) => ({ name: c.name, slug: c.slug }))}
            />
          </Container>
        </section>

        {/* CTA */}
        <section className="bg-brand-50 py-16">
          <Container className="text-center">
            <h2 className="text-3xl font-bold text-brand-900">Ready for Your Transformation?</h2>
            <p className="mt-4 max-w-lg mx-auto text-slate-600">
              Book a consultation today and take the first step toward your perfect smile.
            </p>
            <a href="/appointment" className="mt-6 inline-flex rounded-full bg-brand-500 px-8 py-3 font-semibold text-white shadow-lg hover:bg-brand-600 transition">
              Book Appointment
            </a>
          </Container>
        </section>
      </main>
    </>
  );
}
