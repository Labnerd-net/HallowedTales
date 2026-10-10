import { describe, expect, it } from 'vitest';
import { getFixedFeasts, getMovableFeastsInMonth } from '../src/lib/feasts';

describe('getMovableFeastsInMonth', () => {
  it('places Palm Sunday in March 2026 and April 2027', () => {
    const march2026 = getMovableFeastsInMonth(2026, 3).find((f) => f.name === 'Palm Sunday');
    expect(march2026?.day).toBe(29);
    expect(getMovableFeastsInMonth(2026, 4).some((f) => f.name === 'Palm Sunday')).toBe(false);

    expect(getMovableFeastsInMonth(2027, 3).find((f) => f.name === 'Palm Sunday')?.day).toBe(21);
  });

  it('every returned feast carries its offset and a valid day', () => {
    for (const feast of getMovableFeastsInMonth(2026, 4)) {
      expect(feast.day).toBeGreaterThanOrEqual(1);
      expect(feast.day).toBeLessThanOrEqual(30);
      expect(Number.isInteger(feast.easterOffset)).toBe(true);
    }
  });

  it('a feast appears in exactly one month per year', () => {
    const counts = new Map<string, number>();
    for (let month = 1; month <= 12; month++) {
      for (const f of getMovableFeastsInMonth(2026, month)) counts.set(f.name, (counts.get(f.name) ?? 0) + 1);
    }
    for (const [name, count] of counts) expect(count, name).toBe(1);
  });
});

describe('getFixedFeasts', () => {
  it('finds Christmas', () => {
    expect(getFixedFeasts(12, 25).length).toBeGreaterThan(0);
  });
  it('returns nothing for a date with no feast', () => {
    expect(getFixedFeasts(2, 30)).toEqual([]);
  });
});
