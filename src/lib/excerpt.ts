// Card-preview text pulled from a content entry's raw body. MDX files can
// open with import/export statements before the first prose paragraph, so
// those lines are skipped rather than surfaced as the excerpt.
export function excerptFrom(body: string | undefined): string {
  const paragraphs = (body ?? '').trim().split('\n\n');
  const prose = paragraphs.find(
    (p) => !p.trimStart().startsWith('import ') && !p.trimStart().startsWith('export ')
  );
  return prose ?? '';
}
