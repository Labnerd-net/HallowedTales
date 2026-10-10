import { beforeEach, describe, expect, it, vi } from 'vitest';

// Content entries the feast-day lookups read, keyed by collection.
const fixtures: Record<string, unknown[]> = {};

vi.mock('astro:content', () => ({
  getCollection: async (name: string) => fixtures[name] ?? [],
}));

const { getUpcomingFeastDays, getContentFeastDaysInMonth, getFeastsForDate } = await import('../src/lib/feastDays');

const d = (y: number, m: number, day: number) => new Date(Date.UTC(y, m - 1, day));

function entry(id: string, collection: string, feastDay: unknown, published = true) {
  return {
    id,
    collection,
    body: `Body of ${id}.\n\nSecond paragraph.`,
    data: { title: `Title ${id}`, feastDay, published },
  };
}

beforeEach(() => {
  fixtures.traditions = [
    entry('blaise', 'traditions', { month: 'Feb', day: '3' }),
    entry('nicholas', 'traditions', { month: 'Dec', day: '6' }),
    entry('palms', 'traditions', { month: 'Apr', day: 'varies', easterOffset: -7 }),
    entry('no-date', 'traditions', undefined),
    entry('draft', 'traditions', { month: 'Feb', day: '4' }, false),
  ];
  fixtures.relics = [entry('cross', 'relics', { month: 'Sep', day: '14' })];
});

describe('getUpcomingFeastDays', () => {
  it('sorts by next occurrence and skips undated and unpublished entries', async () => {
    const result = await getUpcomingFeastDays(10, d(2026, 1, 1));
    expect(result.map((r) => r.href)).toEqual([
      '/traditions/blaise',
      '/traditions/palms',
      '/relics/cross',
      '/traditions/nicholas',
    ]);
  });

  it('wraps into next year once this year\'s date has passed', async () => {
    const result = await getUpcomingFeastDays(10, d(2026, 12, 20));
    // Dec 6 already passed, so Saint Nicholas is last; Feb 3 2027 comes first.
    expect(result[0].href).toBe('/traditions/blaise');
    expect(result.at(-1)?.href).toBe('/traditions/nicholas');
    expect(result[0].daysUntil).toBe(45);
  });

  it('counts a feast falling today as 0 days away', async () => {
    const [first] = await getUpcomingFeastDays(1, d(2026, 2, 3));
    expect(first).toMatchObject({ href: '/traditions/blaise', daysUntil: 0, month: 'Feb', day: '3' });
  });

  it('resolves movable feasts off that year\'s Easter, rolling to next year when past', async () => {
    // Palm Sunday 2026 is Mar 29; from Apr 1 the next one is Mar 21, 2027.
    const result = await getUpcomingFeastDays(10, d(2026, 4, 1));
    const palms = result.find((r) => r.href === '/traditions/palms');
    expect(palms).toMatchObject({ month: 'Mar', day: '21' });
  });

  it('honors the limit and only builds excerpts for what it returns', async () => {
    const result = await getUpcomingFeastDays(1, d(2026, 1, 1));
    expect(result).toHaveLength(1);
    expect(result[0].excerpt).toBe('Body of blaise.');
  });
});

describe('getContentFeastDaysInMonth', () => {
  it('returns entries in the month, including movable ones for that year', async () => {
    expect(await getContentFeastDaysInMonth(2026, 3)).toEqual([
      { href: '/traditions/palms', title: 'Title palms', day: 29 },
    ]);
    expect(await getContentFeastDaysInMonth(2026, 2)).toEqual([
      { href: '/traditions/blaise', title: 'Title blaise', day: 3 },
    ]);
  });
});

describe('getFeastsForDate', () => {
  it('puts this site\'s entries before reference-calendar feasts', async () => {
    const feasts = await getFeastsForDate(d(2026, 12, 6));
    expect(feasts[0]).toEqual({ label: 'Title nicholas', href: '/traditions/nicholas' });
  });
  it('is empty-safe on a day with no content entry', async () => {
    const feasts = await getFeastsForDate(d(2026, 7, 1));
    expect(feasts.every((f) => f.href === undefined)).toBe(true);
  });
});
