import { describe, expect, it } from 'vitest';
import { DEFAULT_DESCRIPTION, metaDescription } from '../src/lib/seo';

describe('metaDescription', () => {
  it('falls back to the site description when empty', () => {
    expect(metaDescription('')).toBe(DEFAULT_DESCRIPTION);
    expect(metaDescription(undefined)).toBe(DEFAULT_DESCRIPTION);
  });
  it('strips markdown links and emphasis', () => {
    expect(metaDescription('A *bold* [link](https://x.test) here')).toBe('A bold link here');
  });
  it('collapses whitespace', () => {
    expect(metaDescription('one\n two   three')).toBe('one two three');
  });
  it('leaves short text untouched', () => {
    expect(metaDescription('Short text.')).toBe('Short text.');
  });
  it('truncates long text on a word boundary within the limit', () => {
    const out = metaDescription('word '.repeat(60), 160);
    expect(out.length).toBeLessThanOrEqual(160);
    expect(out.endsWith('…')).toBe(true);
    expect(out).not.toMatch(/wor…$/);
  });
});
