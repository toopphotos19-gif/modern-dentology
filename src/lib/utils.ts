import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Merge Tailwind class names safely.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Turn 'Dental Implants' into 'dental-implants' for dynamic URLs.
export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}
