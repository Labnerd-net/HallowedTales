// Catholic popular piety traditionally assigns each calendar month to a
// devotion. Source pass against the 1913 Catholic Encyclopedia's "Special
// Devotions for Months" article and the 1957 Raccolta - see the "Monthly
// devotions" section of
// `../catholic-research/HallowedTales/Notes/Pillar 2 - Catholic Folk Traditions.md`
// for the full research notes, including which months have real
// institutional backing vs. which are later popular-calendar filler (worded
// more cautiously below).
//
// The month/name facts are generated from catholic-research's
// `Shared/monthly-devotions.json` (see `./monthlyDevotionFacts.ts`); only the
// banner blurbs below are written here, since their wording is HallowedTales' own.
import { MONTHLY_DEVOTION_FACTS } from './monthlyDevotionFacts';

export type MonthlyDevotionEntry = {
  month: number;
  name: string;
  blurb: string;
};

const BLURBS: Record<number, string> = {
  1: 'January: the Holy Name of Jesus',
  2: 'February: the Holy Family',
  3: 'March: St. Joseph',
  4: 'April: popularly held to be the Blessed Sacrament',
  5: 'May: the month of Mary',
  6: 'June: the Sacred Heart of Jesus',
  7: 'July: the Precious Blood of Jesus',
  8: 'August: the Immaculate Heart of Mary',
  9: 'September: Our Lady of Sorrows',
  10: 'October: the Holy Rosary',
  11: 'November: the Holy Souls in Purgatory',
  12: 'December: popularly held to be the Immaculate Conception',
};

export const MONTHLY_DEVOTIONS: MonthlyDevotionEntry[] = MONTHLY_DEVOTION_FACTS.map((f) => ({
  month: f.month,
  name: f.name,
  blurb: BLURBS[f.month],
}));
