import { resolveMovableFeast } from './liturgical/easter';
import { FIXED_FEASTS, MOVABLE_FEASTS, type FixedFeastEntry } from '../data/feastDays';

export function getFixedFeasts(month: number, day: number): FixedFeastEntry[] {
  return FIXED_FEASTS.filter((f) => f.month === month && f.day === day);
}

export interface ResolvedMovableFeast {
  day: number;
  name: string;
  easterOffset: number;
}

// Movable feasts that fall in the given month (1-12) of `year`, with their day of month
export function getMovableFeastsInMonth(year: number, month: number): ResolvedMovableFeast[] {
  const result: ResolvedMovableFeast[] = [];
  for (const feast of MOVABLE_FEASTS) {
    const date = resolveMovableFeast(feast.easterOffset, year);
    if (date.getUTCMonth() + 1 === month) {
      result.push({ day: date.getUTCDate(), name: feast.name, easterOffset: feast.easterOffset });
    }
  }
  return result;
}
