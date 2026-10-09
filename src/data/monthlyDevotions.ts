// Catholic popular piety traditionally assigns each calendar month to a
// devotion. Source pass against the 1913 Catholic Encyclopedia's "Special
// Devotions for Months" article and the 1957 Raccolta - see the "Monthly
// devotions" section of
// `../catholic-research/HallowedTales/Notes/Pillar 2 - Catholic Folk Traditions.md`
// for the full research notes, including which months have real
// institutional backing vs. which are later popular-calendar filler (worded
// more cautiously below).
export type MonthlyDevotionEntry = {
  month: number;
  name: string;
  blurb: string;
};

export const MONTHLY_DEVOTIONS: MonthlyDevotionEntry[] = [
  { month: 1, name: 'the Holy Name of Jesus', blurb: 'January: the Holy Name of Jesus' },
  { month: 2, name: 'the Holy Family', blurb: 'February: the Holy Family' },
  { month: 3, name: 'St. Joseph', blurb: 'March: St. Joseph' },
  { month: 4, name: 'the Blessed Sacrament', blurb: 'April: popularly held to be the Blessed Sacrament' },
  { month: 5, name: 'Mary', blurb: 'May: the month of Mary' },
  { month: 6, name: 'the Sacred Heart of Jesus', blurb: 'June: the Sacred Heart of Jesus' },
  { month: 7, name: 'the Precious Blood of Jesus', blurb: 'July: the Precious Blood of Jesus' },
  { month: 8, name: 'the Immaculate Heart of Mary', blurb: 'August: the Immaculate Heart of Mary' },
  { month: 9, name: 'Our Lady of Sorrows', blurb: 'September: Our Lady of Sorrows' },
  { month: 10, name: 'the Holy Rosary', blurb: 'October: the Holy Rosary' },
  { month: 11, name: 'the Holy Souls in Purgatory', blurb: 'November: the Holy Souls in Purgatory' },
  { month: 12, name: 'the Immaculate Conception', blurb: 'December: popularly held to be the Immaculate Conception' },
];
