import type { LiturgicalColor } from './season';

// White/gold and red reuse the site's existing gold/ruby tokens rather than
// separate liturgical ones - see the comment in global.css.
export const barClass: Record<LiturgicalColor, string> = {
  violet: 'bg-liturgical-violet',
  green: 'bg-liturgical-green',
  rose: 'bg-liturgical-rose',
  white: 'bg-gold',
  red: 'bg-ruby',
};
