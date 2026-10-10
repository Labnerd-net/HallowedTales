// Drops Markdown link/image/emphasis/code markup so card and meta text shows
// plain prose instead of raw `*italics*` or `[text](url)`.
export function stripMarkdown(text: string): string {
  return text
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[*_`]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Card-preview text pulled from a content entry's raw body. MDX files can
// open with import/export statements, and often a floated <InlineImage />
// right after them, before the first prose paragraph - those are skipped
// rather than surfaced as the excerpt. Headings are skipped too, and CRLF
// line endings are handled.
export function excerptFrom(body: string | undefined): string {
  const paragraphs = (body ?? '').trim().split(/\r?\n\r?\n/);
  const prose = paragraphs.find((p) => {
    const trimmed = p.trimStart();
    return (
      !trimmed.startsWith('import ') &&
      !trimmed.startsWith('export ') &&
      !trimmed.startsWith('<') &&
      !trimmed.startsWith('#')
    );
  });
  return stripMarkdown(prose ?? '');
}
