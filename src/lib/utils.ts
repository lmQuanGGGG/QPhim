import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function stripHtmlTags(html: string): string {
  return html.replace(/<[^>]*>?/gm, '');
}

export function formatYear(year: number | string): string {
  return year.toString();
}

export function getImageUrl(url: string, cdnDomain?: string): string {
  if (url.startsWith('http')) return url;
  return cdnDomain ? `${cdnDomain}/${url}` : url;
}
