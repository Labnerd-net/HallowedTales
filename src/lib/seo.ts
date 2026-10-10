import { stripMarkdown } from './excerpt';

export const SITE_NAME = 'Hallowed Tales';
export const DEFAULT_DESCRIPTION =
  'Catholic legend, folk tradition, and the charming history behind the customs people still keep today.';

// Plain-text meta description from an MDX excerpt: strips markup and
// truncates on a word boundary.
export function metaDescription(text: string | undefined, max = 160): string {
  const plain = stripMarkdown(text ?? '');
  if (!plain) return DEFAULT_DESCRIPTION;
  if (plain.length <= max) return plain;
  const cut = plain.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(' ');
  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[,;:.\s]+$/, '')}…`;
}
