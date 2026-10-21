import { describe, expect, it } from 'vitest';
import { getFixedFeasts, getMovableFeastsInMonth, getAnchoredFeastsInMonth } from '../src/lib/feasts';

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

describe('getAnchoredFeastsInMonth', () => {
  it('places Christ the King in November and the other two outside it', () => {
    const nov = getAnchoredFeastsInMonth(2025, 11);
    expect(nov.find((f) => f.kind === 'christTheKing')?.day).toBe(23);
    expect(nov.some((f) => f.kind === 'holyFamily')).toBe(false);
  });
  it('places Holy Family in December and Baptism of the Lord in January', () => {
    expect(getAnchoredFeastsInMonth(2025, 12).find((f) => f.kind === 'holyFamily')?.day).toBe(28);
    expect(getAnchoredFeastsInMonth(2026, 1).find((f) => f.kind === 'baptismOfTheLord')?.day).toBe(11);
  });
  it('each anchored feast appears in exactly one month per year', () => {
    const counts = new Map<string, number>();
    for (let m = 1; m <= 12; m++) {
      for (const f of getAnchoredFeastsInMonth(2026, m)) counts.set(f.kind, (counts.get(f.kind) ?? 0) + 1);
    }
    for (const [kind, count] of counts) expect(count, kind).toBe(1);
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
