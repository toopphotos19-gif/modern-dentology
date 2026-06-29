/**
 * Media processing utilities for the enterprise CMS.
 * Handles image optimization, thumbnails, dimensions, and file metadata.
 */

// ─── File Size Formatting ───────────────────────────────────────

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(i > 0 ? 1 : 0)} ${units[i]}`;
}

// ─── MIME Type Detection ───────────────────────────────────────

export function getMediaType(mimeType: string): 'image' | 'video' | 'document' | 'pdf' | 'other' {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType === 'application/pdf') return 'pdf';
  if (
    mimeType.includes('document') ||
    mimeType.includes('spreadsheet') ||
    mimeType.includes('presentation') ||
    mimeType.includes('text/')
  ) return 'document';
  return 'other';
}

// ─── File Extension ───────────────────────────────────────────

export function getFileExtension(filename: string): string {
  const parts = filename.split('.');
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
}

// ─── Cloudinary Transformation URLs ───────────────────────────

export function getOptimizedUrl(
  url: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'auto' | 'webp' | 'avif' | 'jpg' | 'png';
    crop?: 'fill' | 'fit' | 'scale' | 'thumb';
  } = {}
): string {
  if (!url || !url.includes('cloudinary.com')) return url;

  const transforms: string[] = [];
  if (options.width) transforms.push(`w_${options.width}`);
  if (options.height) transforms.push(`h_${options.height}`);
  if (options.quality) transforms.push(`q_${options.quality}`);
  else transforms.push('q_auto');
  if (options.format) transforms.push(`f_${options.format}`);
  else transforms.push('f_auto');
  if (options.crop) transforms.push(`c_${options.crop}`);

  if (transforms.length === 0) return url;

  // Insert transformation before version or filename
  const uploadIndex = url.indexOf('/upload/');
  if (uploadIndex === -1) return url;

  const before = url.slice(0, uploadIndex + 8);
  const after = url.slice(uploadIndex + 8);
  return `${before}${transforms.join(',')}/${after}`;
}

// ─── Thumbnail Generation ───────────────────────────────────

export function getThumbnailUrl(url: string, size: number = 200): string {
  return getOptimizedUrl(url, { width: size, height: size, crop: 'thumb', quality: 80 });
}

// ─── Responsive Image URLs ───────────────────────────────────

export function getResponsiveUrls(url: string): { sm: string; md: string; lg: string; xl: string } {
  return {
    sm: getOptimizedUrl(url, { width: 400, quality: 80 }),
    md: getOptimizedUrl(url, { width: 800, quality: 80 }),
    lg: getOptimizedUrl(url, { width: 1200, quality: 80 }),
    xl: getOptimizedUrl(url, { width: 1920, quality: 85 }),
  };
}

// ─── Image Validation ───────────────────────────────────────

export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif', 'image/gif', 'image/svg+xml'];
export const ACCEPTED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/ogg'];
export const ACCEPTED_DOC_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB

export function validateFile(file: { size: number; type: string }, allowedTypes?: string[]): { valid: boolean; error?: string } {
  const types = allowedTypes || [...ACCEPTED_IMAGE_TYPES, ...ACCEPTED_VIDEO_TYPES, ...ACCEPTED_DOC_TYPES];
  
  if (!types.includes(file.type)) {
    return { valid: false, error: `File type "${file.type}" is not allowed` };
  }

  const maxSize = file.type.startsWith('video/') ? MAX_VIDEO_SIZE : MAX_FILE_SIZE;
  if (file.size > maxSize) {
    return { valid: false, error: `File too large (max ${formatFileSize(maxSize)})` };
  }

  return { valid: true };
}

// ─── Image Aspect Ratios ───────────────────────────────────

export const ASPECT_RATIOS = {
  'square': { width: 1, height: 1, label: '1:1 (Square)' },
  'landscape': { width: 16, height: 9, label: '16:9 (Landscape)' },
  'portrait': { width: 3, height: 4, label: '3:4 (Portrait)' },
  'wide': { width: 21, height: 9, label: '21:9 (Wide)' },
  'banner': { width: 4, height: 1, label: '4:1 (Banner)' },
  'free': { width: 0, height: 0, label: 'Free' },
} as const;

// ─── Folder Utils ───────────────────────────────────────────

export function normalizeFolderPath(path: string): string {
  let normalized = path.replace(/\\/g, '/').replace(/\/+/g, '/');
  if (!normalized.startsWith('/')) normalized = '/' + normalized;
  if (normalized.length > 1 && normalized.endsWith('/')) normalized = normalized.slice(0, -1);
  return normalized;
}

export function getParentFolder(path: string): string {
  const parts = path.split('/').filter(Boolean);
  if (parts.length <= 1) return '/';
  return '/' + parts.slice(0, -1).join('/');
}

export function getFolderName(path: string): string {
  const parts = path.split('/').filter(Boolean);
  return parts.length > 0 ? parts[parts.length - 1] : 'Root';
}
