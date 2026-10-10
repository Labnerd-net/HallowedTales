import { MONTHLY_DEVOTIONS } from '../data/monthlyDevotions';
import { getPublished } from './collections';

export interface MonthlyDevotion {
  label: string;
  href?: string;
}

// The current month's devotion, linked to a `traditions` entry if one exists
// for it, otherwise a plain label - same content-first-then-reference
// pattern as `getFeastsForDate` in `./feastDays.ts`.
export async function getMonthlyDevotion(date: Date): Promise<MonthlyDevotion> {
  const month = date.getUTCMonth() + 1;
  const fallback = MONTHLY_DEVOTIONS.find((d) => d.month === month);
  const label = fallback?.blurb ?? '';

  const entries = await getPublished('traditions');
  const match = entries.find((entry) => entry.data.category === 'monthly-devotion' && entry.data.month === month);
  if (!match) return { label };

  return { label, href: `/traditions/${match.id}` };
}
