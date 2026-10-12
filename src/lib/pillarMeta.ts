// Shared pillar metadata (labels, badges, hrefs, accent colors) used by the
// homepage's "Explore by Category" grid and sidebar.
export type PillarKey = 'legends' | 'traditions' | 'relics' | 'symbols' | 'phenomena' | 'biographies';

export interface PillarMeta {
  key: PillarKey;
  label: string;
  badge: string;
  description: string;
  href: string;
  // CSS custom property name backing this pillar's accent (see global.css).
  accentVar: string;
  accentClass: 'accent' | 'ruby' | 'liturgical-green' | 'gold' | 'liturgical-violet' | 'sepia';
}

// Order here drives the homepage "Explore by Category" grid and (via
// NAV_LINKS in Layout.astro, kept in sync by hand) the nav - legends and
// biographies lead together since they're the most conceptually linked pair
// (a single-motif tale vs. the whole life, and biographies link out to
// legends), not sorted by content depth.
export const PILLARS: PillarMeta[] = [
  {
    key: 'legends',
    label: 'Legends',
    badge: 'Legend',
    description:
      'Saint-and-creature tales, patronage origin stories, and the legends behind how devotions begin.',
    href: '/legends',
    accentVar: '--color-accent',
    accentClass: 'accent',
  },
  {
    key: 'biographies',
    label: 'Saint Biographies',
    badge: 'Biography',
    description:
      'The whole arc of a life - childhood, conversion, founding work, death - told plainly, beyond any single legend.',
    href: '/biographies',
    accentVar: '--color-sepia',
    accentClass: 'sepia',
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
