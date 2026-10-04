import { getEaster, resolveMovableFeast } from './easter';

export type LiturgicalColor = 'violet' | 'white' | 'green' | 'red' | 'rose';

export interface LiturgicalDay {
  label: string;
  color: LiturgicalColor;
}

const DAY_MS = 86_400_000;

function utcDate(year: number, month: number, day: number): Date {
  return new Date(Date.UTC(year, month - 1, day));
}

function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * DAY_MS);
}

// Most recent Sunday that is strictly before `date`.
function lastSundayBefore(date: Date): Date {
  const weekday = date.getUTCDay(); // 0 = Sunday
  const back = weekday === 0 ? 7 : weekday;
  return addDays(date, -back);
}

// First Sunday that is strictly after `date`.
function firstSundayAfter(date: Date): Date {
  const weekday = date.getUTCDay();
  const forward = 7 - weekday;
  return addDays(date, forward);
}

function sameDay(a: Date, b: Date): boolean {
  return a.getTime() === b.getTime();
}

function startOfUTCDay(date: Date): Date {
  return utcDate(date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate());
}

/**
 * Baptism of the Lord, under the fixed-Epiphany (Jan 6) convention TMR's
 * feast data uses - not the US transferred-to-Sunday convention. Normally
 * the Sunday after Jan 6; if Jan 6 itself is a Sunday (so it can be kept as
 * Epiphany), Baptism moves to the following Monday instead.
 */
function baptismOfTheLord(year: number): Date {
  const epiphany = utcDate(year, 1, 6);
  if (epiphany.getUTCDay() === 0) {
    return addDays(epiphany, 1);
  }
  return firstSundayAfter(epiphany);
}

/** The four Sundays of Advent for the Christmas falling in `year`. */
function adventSundays(year: number): Date[] {
  const fourthAdvent = lastSundayBefore(utcDate(year, 12, 25));
  return [-21, -14, -7, 0].map((offset) => addDays(fourthAdvent, offset));
}

/**
 * Season-level liturgical color for a given date, following the standard
 * Roman rite calendar. This intentionally stops at season granularity plus
 * the handful of single days that are universally a fixed color regardless
 * of what's being celebrated (Palm Sunday, Good Friday, Pentecost, and the
 * rose-colored Gaudete/Laetare Sundays). It does NOT attempt per-saint
 * overrides (e.g. red for an individual martyr's feast within Ordinary
 * Time) - that needs a martyr/confessor/virgin classification per feast,
 * which doesn't exist in either site's data yet.
 *
 * Also simplified: Holy Thursday and Holy Saturday are both folded into
 * Lent's violet rather than modeling the Triduum's own transitional colors,
 * since those two days don't have a single clean "what color is today"
 * answer even in real sacristies (it depends which Mass).
 */
export function getLiturgicalDay(date: Date): LiturgicalDay {
  const day = startOfUTCDay(date);
  const year = day.getUTCFullYear();
  const month = day.getUTCMonth() + 1;

  // December: Christmas Day onward belongs to the Christmas season; before
  // that, if we're within Advent, color by which Advent Sunday we're past.
  if (month === 12) {
    const christmas = utcDate(year, 12, 25);
    if (day.getTime() >= christmas.getTime()) {
      return { label: 'Christmas', color: 'white' };
    }
    const [advent1, , advent3] = adventSundays(year);
    if (day.getTime() >= advent1.getTime()) {
      if (sameDay(day, advent3)) {
        return { label: 'Gaudete Sunday', color: 'rose' };
      }
      return { label: 'Advent', color: 'violet' };
    }
    return { label: 'Ordinary Time', color: 'green' };
  }

  // January: still Christmas season through the Baptism of the Lord: Ash
  // Wednesday's earliest possible date is Feb 4, so no Lent conflict here.
  if (month === 1) {
    const baptism = baptismOfTheLord(year);
    if (day.getTime() <= baptism.getTime()) {
      return { label: 'Christmas', color: 'white' };
    }
    return { label: 'Ordinary Time', color: 'green' };
  }

  // Everything else: measure from this year's Easter.
  const easter = startOfUTCDay(getEaster(year));
  const offsetDays = Math.round((day.getTime() - easter.getTime()) / DAY_MS);

  const ashWednesday = startOfUTCDay(resolveMovableFeast(-46, year));
  const palmSunday = -7;
  const laetareSunday = -21;
  const goodFriday = -2;
  const pentecost = 49;

  if (offsetDays === pentecost) {
    return { label: 'Pentecost', color: 'red' };
  }
  if (offsetDays > 0 && offsetDays < pentecost) {
    return { label: 'Easter', color: 'white' };
  }
  if (offsetDays === 0) {
    return { label: 'Easter', color: 'white' };
  }
  if (offsetDays === goodFriday) {
    return { label: 'Good Friday', color: 'red' };
  }
  if (offsetDays === palmSunday) {
    return { label: 'Palm Sunday', color: 'red' };
  }
  if (offsetDays === laetareSunday) {
    return { label: 'Laetare Sunday', color: 'rose' };
  }
  // Upper bound is -1 (the day before Easter) rather than Holy Thursday,
  // so Holy Saturday falls here too - Good Friday and Palm Sunday are
  // already caught above by the explicit checks.
  if (day.getTime() >= ashWednesday.getTime() && offsetDays <= -1) {
    return { label: 'Lent', color: 'violet' };
  }
  if (offsetDays > pentecost) {
    return { label: 'Ordinary Time', color: 'green' };
  }

  // Between Baptism of the Lord and Ash Wednesday.
  return { label: 'Ordinary Time', color: 'green' };
}
