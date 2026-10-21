import { resolveMovableFeast } from './liturgical/easter';
import { resolveAnchoredFeast } from './liturgical/anchoredFeasts';
import {
  FIXED_FEASTS,
  MOVABLE_FEASTS,
  ANCHORED_FEASTS,
  type FixedFeastEntry,
  type AnchoredFeastKind,
} from '../data/feastDays';

export function getFixedFeasts(month: number, day: number): FixedFeastEntry[] {
  return FIXED_FEASTS.filter((f) => f.month === month && f.day === day);
}

export interface ResolvedMovableFeast {
  day: number;
  name: string;
  easterOffset: number;
}

export interface ResolvedAnchoredFeast {
  day: number;
  name: string;
  kind: AnchoredFeastKind;
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

// Anchored feasts (Holy Family / Baptism of the Lord / Christ the King) that fall in the given
// month (1-12) of `year`, with their day of month
export function getAnchoredFeastsInMonth(year: number, month: number): ResolvedAnchoredFeast[] {
  const result: ResolvedAnchoredFeast[] = [];
  for (const feast of ANCHORED_FEASTS) {
    const date = resolveAnchoredFeast(feast.kind, year);
    if (date.getUTCMonth() + 1 === month) {
      result.push({ day: date.getUTCDate(), name: feast.name, kind: feast.kind });
    }
  }
  return result;
}
