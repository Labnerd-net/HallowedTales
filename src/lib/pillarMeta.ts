// Shared pillar metadata for the homepage-mockup pages (alt-homepage-*.astro).
// Not used by the live site yet - if one of these layouts gets adopted,
// this is the natural place to keep pulling from.
export type PillarKey = 'legends' | 'traditions' | 'relics' | 'symbols' | 'phenomena';

export interface PillarMeta {
  key: PillarKey;
  label: string;
  badge: string;
  description: string;
  href: string;
  // CSS custom property name backing this pillar's accent (see global.css).
  accentVar: string;
  accentClass: 'accent' | 'ruby' | 'liturgical-green' | 'gold' | 'liturgical-violet';
}

export const PILLARS: PillarMeta[] = [
  {
    key: 'legends',
    label: 'Legends',
    badge: 'Legend',
    description:
      'Saint-and-creature tales, patronage origin stories, and the legends behind how devotion to a saint begins.',
    href: '/legends',
    accentVar: '--color-accent',
    accentClass: 'accent',
  },
  {
    key: 'traditions',
    label: 'Folk Traditions',
    badge: 'Folk Tradition',
    description:
      'Feast-day customs, food traditions, and the quiet practices handed down through parishes and families.',
    href: '/traditions',
    accentVar: '--color-ruby',
    accentClass: 'ruby',
  },
  {
    key: 'relics',
    label: 'Relics & Legendary Artifacts',
    badge: 'Relic & Legend',
    description:
      'The True Cross, the Holy Lance, and the sacred objects whose stories outlasted the evidence for them.',
    href: '/relics',
    accentVar: '--color-liturgical-green',
    accentClass: 'liturgical-green',
  },
  {
    key: 'symbols',
    label: 'Symbols',
    badge: 'Symbol',
    description:
      'The Chi-Rho, the scallop shell, the pelican - what they mean and how their use changed across the centuries.',
    href: '/symbols',
    accentVar: '--color-gold',
    accentClass: 'gold',
  },
  {
    key: 'phenomena',
    label: 'Mystical Phenomena',
    badge: 'Mystical Phenomenon',
    description:
      "Bilocation, levitation, luminosity - the mystical reports that cling to certain saints' lives.",
    href: '/phenomena',
    accentVar: '--color-liturgical-violet',
    accentClass: 'liturgical-violet',
  },
];

export function pillarFor(key: PillarKey): PillarMeta {
  const match = PILLARS.find((p) => p.key === key);
  if (!match) throw new Error(`Unknown pillar key: ${key}`);
  return match;
}
