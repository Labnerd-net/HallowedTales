import { getCollection } from 'astro:content';
import { getEaster } from './liturgical/easter';
import { excerptFrom } from './excerpt';
import { getFixedFeasts, getMovableFeastsInMonth } from './feasts';
import { isPublished } from './published';

const MONTH_INDEX: Record<string, number> = {
  Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
  Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
};
const MONTH_ABBR = Object.keys(MONTH_INDEX);

interface FeastDay {
  month: string;
  day: string;
  easterOffset?: number;
}

interface FeastDayEntry {
  href: string;
  title: string;
  excerpt: string;
  feastDay: FeastDay;
}

export interface UpcomingFeastDay {
  href: string;
  title: string;
  excerpt: string;
  month: string;
  day: string;
  daysUntil: number;
}

export interface ContentFeastDay {
  href: string;
  title: string;
  day: number;
}

// Every traditions/relics entry that carries a feastDay, with the
// collection-scan done once so both the homepage "upcoming" list and the
// calendar page's month lookup can share it.
async function getFeastDayEntries(): Promise<FeastDayEntry[]> {
  const collections = ['traditions', 'relics'] as const;
  const results: FeastDayEntry[] = [];

  for (const collection of collections) {
    const entries = (await getCollection(collection)).filter(isPublished);
    for (const entry of entries) {
      const feastDay = entry.data.feastDay;
      if (!feastDay) continue;
      results.push({
        href: `/${collection}/${entry.id}`,
        title: entry.data.title,
        excerpt: excerptFrom(entry.body),
        feastDay,
      });
    }
  }

  return results;
}

// Next calendar occurrence of a feast day on or after `from`, rolling over
// to next year if this year's date has already passed. Movable feasts
// (easterOffset set) are resolved off that year's Easter Sunday instead of
// the month/day fields, which hold a placeholder like "varies" for those.
function resolveNextOccurrence(feastDay: FeastDay, from: Date): Date {
  const fromUTC = Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), from.getUTCDate());
  const year = from.getUTCFullYear();

  if (feastDay.easterOffset !== undefined) {
    const thisYear = new Date(getEaster(year).getTime() + feastDay.easterOffset * 86_400_000);
    if (thisYear.getTime() >= fromUTC) return thisYear;
    return new Date(getEaster(year + 1).getTime() + feastDay.easterOffset * 86_400_000);
  }

  const month = MONTH_INDEX[feastDay.month];
  const day = Number(feastDay.day);
  const thisYear = new Date(Date.UTC(year, month, day));
  if (thisYear.getTime() >= fromUTC) return thisYear;
  return new Date(Date.UTC(year + 1, month, day));
}

// This feast day's date within a specific year (not "next occurrence" -
// used by the calendar page, which views one year/month at a time rather
// than counting forward from today).
function resolveDateInYear(feastDay: FeastDay, year: number): Date {
  if (feastDay.easterOffset !== undefined) {
    return new Date(getEaster(year).getTime() + feastDay.easterOffset * 86_400_000);
  }
  return new Date(Date.UTC(year, MONTH_INDEX[feastDay.month], Number(feastDay.day)));
}

function truncate(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text;
  return `${text.slice(0, maxLen).trimEnd()}…`;
}

// Feast days drawn from actual traditions/relics entries (not the universal
// reference calendar) so every tile links to a real page, sorted by how
// soon each one's next occurrence falls from `from`.
export async function getUpcomingFeastDays(limit: number, from = new Date()): Promise<UpcomingFeastDay[]> {
  const entries = await getFeastDayEntries();
  const fromUTC = Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), from.getUTCDate());

  const withDates = entries.map((entry) => ({
    ...entry,
    nextDate: resolveNextOccurrence(entry.feastDay, from),
  }));
  withDates.sort((a, b) => a.nextDate.getTime() - b.nextDate.getTime());

  return withDates.slice(0, limit).map((entry) => ({
    href: entry.href,
    title: entry.title,
    excerpt: truncate(entry.excerpt, 70),
    month: MONTH_ABBR[entry.nextDate.getUTCMonth()],
    day: String(entry.nextDate.getUTCDate()),
    daysUntil: Math.round((entry.nextDate.getTime() - fromUTC) / 86_400_000),
  }));
}

// This site's own dated entries that fall in the given month/year, for
// overlaying onto the reference calendar as links.
export async function getContentFeastDaysInMonth(year: number, month: number): Promise<ContentFeastDay[]> {
  const entries = await getFeastDayEntries();

  return entries
    .map((entry) => ({ ...entry, date: resolveDateInYear(entry.feastDay, year) }))
    .filter((entry) => entry.date.getUTCMonth() + 1 === month)
    .map((entry) => ({ href: entry.href, title: entry.title, day: entry.date.getUTCDate() }));
}

export interface DayFeast {
  label: string;
  href?: string;
}

// Everything on the reference calendar + this site's own entries for one
// specific day - the "what's today" line on the liturgical banner, same
// content-first-then-reference ordering as the calendar page.
export async function getFeastsForDate(date: Date): Promise<DayFeast[]> {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();

  const contentToday = (await getContentFeastDaysInMonth(year, month)).filter((c) => c.day === day);
  const fixedToday = getFixedFeasts(month, day).map((f) => f.name);
  const movableToday = getMovableFeastsInMonth(year, month)
    .filter((f) => f.day === day)
    .map((f) => f.name);

  return [
    ...contentToday.map((c): DayFeast => ({ label: c.title, href: c.href })),
    ...[...fixedToday, ...movableToday].map((name): DayFeast => ({ label: name })),
  ];
}
