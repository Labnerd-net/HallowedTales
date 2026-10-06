import type { ImageMetadata } from 'astro';

export interface EntryImage {
  src: ImageMetadata;
  alt: string;
  caption?: string;
  credit?: string;
  kind: 'photo' | 'illustration' | 'artwork';
}

// Resolves which image represents an entry on card art (homepage, pillar
// listings). `featuredImageIndex` is author-set; falls back to images[0]
// when unset or out of range.
export function featuredImage(images: EntryImage[], featuredImageIndex?: number): EntryImage {
  return images[featuredImageIndex ?? 0] ?? images[0];
}
