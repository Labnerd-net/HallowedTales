// Card-preview text pulled from a content entry's raw body. MDX files can
// open with import/export statements, and often a floated <InlineImage />
// right after them, before the first prose paragraph - those are skipped
// rather than surfaced as the excerpt.
export function excerptFrom(body: string | undefined): string {
  const paragraphs = (body ?? '').trim().split('\n\n');
  const prose = paragraphs.find((p) => {
    const trimmed = p.trimStart();
    return (
      !trimmed.startsWith('import ') && !trimmed.startsWith('export ') && !trimmed.startsWith('<')
    );
  });
  return prose ?? '';
}
