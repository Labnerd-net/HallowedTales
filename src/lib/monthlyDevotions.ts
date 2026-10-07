import { getCollection } from 'astro:content';
import { MONTHLY_DEVOTIONS } from '../data/monthlyDevotions';
import { isPublished } from './published';

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

  const entries = await getCollection('traditions');
  const match = entries.find(
    (entry) => entry.data.category === 'monthly-devotion' && entry.data.month === month && isPublished(entry),
  );
  if (!match) return { label };

  return { label, href: `/traditions/${match.id}` };
}
