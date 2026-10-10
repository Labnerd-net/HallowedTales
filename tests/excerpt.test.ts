import { describe, expect, it } from 'vitest';
import { excerptFrom, stripMarkdown } from '../src/lib/excerpt';

describe('excerptFrom', () => {
  it('skips import/export lines and JSX blocks', () => {
    const body = "import X from './x';\n\n<InlineImage src={x} />\n\nFirst prose paragraph.\n\nSecond.";
    expect(excerptFrom(body)).toBe('First prose paragraph.');
  });
  it('skips headings', () => {
    expect(excerptFrom('## A heading\n\nThe prose.')).toBe('The prose.');
  });
  it('handles CRLF line endings', () => {
    expect(excerptFrom('import X from "x";\r\n\r\nThe prose.\r\n\r\nMore.')).toBe('The prose.');
  });
  it('strips markdown from the result', () => {
    expect(excerptFrom('A *vivid* story of [Eustace](/legends/x).')).toBe('A vivid story of Eustace.');
  });
  it('returns an empty string for an empty body', () => {
    expect(excerptFrom(undefined)).toBe('');
  });
});

describe('stripMarkdown', () => {
  it('drops images and keeps alt text', () => {
    expect(stripMarkdown('![alt](x.png) text')).toBe('alt text');
  });
});
