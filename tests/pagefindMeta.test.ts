import { describe, expect, it } from 'vitest';
import { pagefindMeta } from '../src/lib/pagefindMeta';

describe('pagefindMeta', () => {
  it('keeps the title last so commas in it are captured to the end', () => {
    expect(pagefindMeta('May, the Month of Mary', 'Folk Tradition')).toBe(
      'category:Folk Tradition, title:May, the Month of Mary',
    );
  });
  it('rejects a category label containing a comma', () => {
    expect(() => pagefindMeta('Title', 'A, B')).toThrow();
  });
});
