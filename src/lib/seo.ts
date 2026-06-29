/**
 * SEO utility functions for the enterprise CMS.
 * Provides SEO scoring, readability analysis, schema markup generation,
 * sitemap building, and real-time preview data.
 */

// ─── SEO Score Calculation ───────────────────────────────────────────

export type SeoAnalysis = {
  score: number;           // 0-100
  grade: 'poor' | 'needs-work' | 'good' | 'excellent';
  checks: SeoCheck[];
};

export type SeoCheck = {
  id: string;
  label: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
  weight: number;
};

export function calculateSeoScore(data: {
  title?: string | null;
  metaDesc?: string | null;
  focusKeyword?: string | null;
  content?: string | null;
  slug?: string | null;
  images?: { alt?: string | null }[];
  headings?: string[];
}): SeoAnalysis {
  const checks: SeoCheck[] = [];

  // Title checks
  const titleLen = (data.title || '').length;
  checks.push({
    id: 'title-exists',
    label: 'SEO Title',
    status: titleLen > 0 ? 'pass' : 'fail',
    message: titleLen > 0 ? 'SEO title is set' : 'Missing SEO title',
    weight: 15,
  });
  checks.push({
    id: 'title-length',
    label: 'Title Length',
    status: titleLen >= 30 && titleLen <= 60 ? 'pass' : titleLen > 0 ? 'warning' : 'fail',
    message: titleLen >= 30 && titleLen <= 60
      ? `Title length (${titleLen}) is optimal`
      : titleLen > 60
        ? `Title is too long (${titleLen}/60 chars)`
        : `Title is too short (${titleLen}/30 chars minimum)`,
    weight: 10,
  });

  // Meta description checks
  const descLen = (data.metaDesc || '').length;
  checks.push({
    id: 'meta-desc',
    label: 'Meta Description',
    status: descLen >= 120 && descLen <= 160 ? 'pass' : descLen > 0 ? 'warning' : 'fail',
    message: descLen >= 120 && descLen <= 160
      ? `Description length (${descLen}) is optimal`
      : descLen > 160
        ? `Too long (${descLen}/160 chars)`
        : descLen > 0
          ? `Too short (${descLen}/120 chars minimum)`
          : 'Missing meta description',
    weight: 15,
  });

  // Focus keyword checks
  const keyword = (data.focusKeyword || '').toLowerCase().trim();
  if (keyword) {
    const titleHasKw = (data.title || '').toLowerCase().includes(keyword);
    const descHasKw = (data.metaDesc || '').toLowerCase().includes(keyword);
    const slugHasKw = (data.slug || '').toLowerCase().includes(keyword.replace(/\s+/g, '-'));
    const contentHasKw = (data.content || '').toLowerCase().includes(keyword);

    checks.push({
      id: 'kw-in-title',
      label: 'Keyword in Title',
      status: titleHasKw ? 'pass' : 'fail',
      message: titleHasKw ? 'Focus keyword found in title' : 'Focus keyword not in title',
      weight: 10,
    });
    checks.push({
      id: 'kw-in-desc',
      label: 'Keyword in Description',
      status: descHasKw ? 'pass' : 'warning',
      message: descHasKw ? 'Focus keyword found in description' : 'Focus keyword not in description',
      weight: 5,
    });
    checks.push({
      id: 'kw-in-slug',
      label: 'Keyword in URL',
      status: slugHasKw ? 'pass' : 'warning',
      message: slugHasKw ? 'Focus keyword found in URL' : 'Focus keyword not in URL slug',
      weight: 5,
    });

    // Keyword density
    if (data.content && contentHasKw) {
      const words = data.content.split(/\s+/).length;
      const kwCount = data.content.toLowerCase().split(keyword).length - 1;
      const density = (kwCount / words) * 100;
      checks.push({
        id: 'kw-density',
        label: 'Keyword Density',
        status: density >= 0.5 && density <= 2.5 ? 'pass' : 'warning',
        message: `Keyword density is ${density.toFixed(1)}% (aim for 0.5-2.5%)`,
        weight: 5,
      });
    }
  } else {
    checks.push({
      id: 'kw-missing',
      label: 'Focus Keyword',
      status: 'fail',
      message: 'No focus keyword set',
      weight: 10,
    });
  }

  // Content length
  const wordCount = (data.content || '').split(/\s+/).filter(Boolean).length;
  checks.push({
    id: 'content-length',
    label: 'Content Length',
    status: wordCount >= 300 ? 'pass' : wordCount >= 100 ? 'warning' : 'fail',
    message: wordCount >= 300
      ? `Content has ${wordCount} words (good)`
      : `Content has only ${wordCount} words (aim for 300+)`,
    weight: 10,
  });

  // Image alt text
  if (data.images && data.images.length > 0) {
    const withAlt = data.images.filter((i) => i.alt && i.alt.length > 0).length;
    checks.push({
      id: 'image-alt',
      label: 'Image Alt Text',
      status: withAlt === data.images.length ? 'pass' : withAlt > 0 ? 'warning' : 'fail',
      message: `${withAlt}/${data.images.length} images have alt text`,
      weight: 10,
    });
  }

  // Slug check
  checks.push({
    id: 'slug-exists',
    label: 'SEO-friendly URL',
    status: data.slug ? 'pass' : 'fail',
    message: data.slug ? 'URL slug is set' : 'Missing URL slug',
    weight: 5,
  });

  // Calculate score
  let totalWeight = 0;
  let earnedWeight = 0;
  for (const check of checks) {
    totalWeight += check.weight;
    if (check.status === 'pass') earnedWeight += check.weight;
    else if (check.status === 'warning') earnedWeight += check.weight * 0.5;
  }

  const score = totalWeight > 0 ? Math.round((earnedWeight / totalWeight) * 100) : 0;
  const grade: SeoAnalysis['grade'] =
    score >= 80 ? 'excellent' : score >= 60 ? 'good' : score >= 40 ? 'needs-work' : 'poor';

  return { score, grade, checks };
}

// ─── Readability Score ───────────────────────────────────────────

export function calculateReadabilityScore(text: string): {
  score: number;
  grade: string;
  avgSentenceLength: number;
  avgWordLength: number;
} {
  if (!text || text.trim().length === 0) {
    return { score: 0, grade: 'N/A', avgSentenceLength: 0, avgWordLength: 0 };
  }

  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const words = text.split(/\s+/).filter((w) => w.length > 0);
  const syllableCount = words.reduce((total, word) => total + countSyllables(word), 0);

  const avgSentenceLength = words.length / Math.max(sentences.length, 1);
  const avgSyllablesPerWord = syllableCount / Math.max(words.length, 1);

  // Flesch Reading Ease
  const score = Math.max(0, Math.min(100,
    206.835 - 1.015 * avgSentenceLength - 84.6 * avgSyllablesPerWord
  ));

  let grade: string;
  if (score >= 80) grade = 'Very Easy';
  else if (score >= 70) grade = 'Easy';
  else if (score >= 60) grade = 'Standard';
  else if (score >= 50) grade = 'Fairly Difficult';
  else if (score >= 30) grade = 'Difficult';
  else grade = 'Very Difficult';

  const avgWordLength = words.reduce((sum, w) => sum + w.length, 0) / Math.max(words.length, 1);

  return { score: Math.round(score), grade, avgSentenceLength: Math.round(avgSentenceLength * 10) / 10, avgWordLength: Math.round(avgWordLength * 10) / 10 };
}

function countSyllables(word: string): number {
  word = word.toLowerCase().replace(/[^a-z]/g, '');
  if (word.length <= 3) return 1;
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
  word = word.replace(/^y/, '');
  const vowelGroups = word.match(/[aeiouy]{1,2}/g);
  return vowelGroups ? vowelGroups.length : 1;
}

// ─── Keyword Density ───────────────────────────────────────────

export function calculateKeywordDensity(content: string, keyword: string): number {
  if (!content || !keyword) return 0;
  const words = content.toLowerCase().split(/\s+/).filter(Boolean);
  const kwLower = keyword.toLowerCase();
  const occurrences = content.toLowerCase().split(kwLower).length - 1;
  return words.length > 0 ? Math.round((occurrences / words.length) * 100 * 10) / 10 : 0;
}

// ─── Schema Markup Generators ───────────────────────────────────

export function generateDentalServiceSchema(service: {
  name: string;
  description: string;
  image?: string | null;
  slug: string;
  baseUrl?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalProcedure',
    name: service.name,
    description: service.description,
    image: service.image || undefined,
    url: `${service.baseUrl || ''}}/services/${service.slug}`,
    provider: {
      '@type': 'Dentist',
      name: 'Modern Dentology',
    },
  };
}

export function generateDoctorSchema(doctor: {
  name: string;
  qualification?: string | null;
  bio?: string | null;
  photo?: string | null;
  slug: string;
  baseUrl?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Dentist',
    name: doctor.name,
    description: doctor.bio || undefined,
    image: doctor.photo || undefined,
    url: `${doctor.baseUrl || ''}/doctors/${doctor.slug}`,
    medicalSpecialty: 'Dentistry',
    qualification: doctor.qualification || undefined,
  };
}

export function generateBlogSchema(post: {
  title: string;
  excerpt?: string | null;
  content: string;
  featured?: string | null;
  author?: string | null;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
  baseUrl?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt || post.content.slice(0, 160),
    image: post.featured || undefined,
    author: post.author ? { '@type': 'Person', name: post.author } : undefined,
    url: `${post.baseUrl || ''}/blog/${post.slug}`,
    datePublished: post.createdAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    publisher: { '@type': 'Organization', name: 'Modern Dentology' },
  };
}

export function generateFaqSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };
}

// ─── Reading Time ───────────────────────────────────────────

export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

// ─── Breadcrumb Generator ───────────────────────────────────

export function generateBreadcrumbs(
  path: string,
  labels?: Record<string, string>
): { label: string; href: string }[] {
  const parts = path.split('/').filter(Boolean);
  const crumbs: { label: string; href: string }[] = [{ label: 'Home', href: '/' }];

  let currentPath = '';
  for (const part of parts) {
    currentPath += `/${part}`;
    const label = labels?.[part] || part.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    crumbs.push({ label, href: currentPath });
  }

  return crumbs;
}

// ─── Google Search Preview ───────────────────────────────────

export type SearchPreview = {
  title: string;
  url: string;
  description: string;
  titleTooLong: boolean;
  descTooLong: boolean;
};

export function generateSearchPreview(data: {
  title?: string | null;
  metaDesc?: string | null;
  slug?: string | null;
  baseUrl?: string;
}): SearchPreview {
  const title = data.title || 'Untitled Page';
  const url = `${data.baseUrl || 'https://yoursite.com'}/${data.slug || ''}`;
  const description = data.metaDesc || 'No description set.';

  return {
    title: title.slice(0, 70),
    url,
    description: description.slice(0, 170),
    titleTooLong: title.length > 60,
    descTooLong: description.length > 160,
  };
}

// ─── Social Media Preview ───────────────────────────────────

export type SocialPreview = {
  title: string;
  description: string;
  image?: string;
  siteName: string;
};

export function generateSocialPreview(data: {
  ogTitle?: string | null;
  ogDesc?: string | null;
  ogImage?: string | null;
  title?: string | null;
  metaDesc?: string | null;
  siteName?: string;
}): SocialPreview {
  return {
    title: data.ogTitle || data.title || 'Untitled',
    description: data.ogDesc || data.metaDesc || '',
    image: data.ogImage || undefined,
    siteName: data.siteName || 'Modern Dentology',
  };
}

// ─── Suggested Improvements ───────────────────────────────────

export function getSuggestedImprovements(analysis: SeoAnalysis): string[] {
  return analysis.checks
    .filter((c) => c.status !== 'pass')
    .map((c) => c.message);
}
