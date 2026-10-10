import type { AnyEntry } from './collections';
import { titleCaseSlug } from './labels';
import { registerMiracleHref, registerSaintHref } from './registerLink';
import { formatSaints } from './saints';
import { tagLabel } from './tags';

export interface EntryHeroData {
  subtitle?: string;
  meta: string[];
  note?: string;
  noteHref?: string;
  noteLabel?: string;
}

const compact = (items: (string | undefined)[]): string[] => items.filter((i): i is string => Boolean(i));

const SAINT_REGISTER_NOTE = 'This saint also has a documented miracle case on The Miracle Register.';
const PHENOMENON_REGISTER_NOTE =
  'This same case is also documented on The Miracle Register, written in a voice explicit about the evidence it rests on.';

// The per-pillar parts of a detail-page hero: the meta line and the optional
// Miracle Register cross-link.
export function heroData(entry: AnyEntry): EntryHeroData {
  switch (entry.collection) {
    case 'legends': {
      const { saints, earliestSource } = entry.data;
      const noteHref = registerSaintHref(saints);
      return {
        meta: compact([formatSaints(saints), `Earliest source: ${earliestSource.approxDate}`]),
        ...(noteHref && { note: SAINT_REGISTER_NOTE, noteHref, noteLabel: 'Visit The Miracle Register' }),
      };
    }
    case 'traditions': {
      const { category, feastDay, saints } = entry.data;
      return {
        meta: compact([
          titleCaseSlug(category),
          feastDay && `${feastDay.month} ${feastDay.day}`,
          formatSaints(saints),
        ]),
      };
    }
    case 'relics': {
      const { cluster, claimedLocations } = entry.data;
      return { meta: [titleCaseSlug(cluster), claimedLocations.map((loc) => loc.site).join(' / ')] };
    }
    case 'phenomena': {
      const { phenomenonType, saints, registerSlug } = entry.data;
      return {
        meta: compact([tagLabel(phenomenonType), formatSaints(saints)]),
        ...(registerSlug && {
          note: PHENOMENON_REGISTER_NOTE,
          noteHref: registerMiracleHref(registerSlug),
          noteLabel: 'View the Register entry',
        }),
      };
    }
    case 'symbols': {
      const { meaning, saints, earliestSource } = entry.data;
      const noteHref = registerSaintHref(saints);
      return {
        subtitle: meaning,
        meta: compact([formatSaints(saints), earliestSource && `Earliest source: ${earliestSource.approxDate}`]),
        ...(noteHref && { note: SAINT_REGISTER_NOTE, noteHref, noteLabel: 'Visit The Miracle Register' }),
      };
    }
  }
}

// The small line under a card's excerpt on a pillar's listing page.
export function cardMeta(entry: AnyEntry): string {
  switch (entry.collection) {
    case 'legends':
      return entry.data.earliestSource.approxDate;
    case 'traditions':
      return entry.data.feastDay
        ? `${entry.data.feastDay.month} ${entry.data.feastDay.day}`
        : titleCaseSlug(entry.data.category);
    case 'relics':
      return entry.data.claimedLocations.map((loc) => loc.site).join(' / ');
    case 'phenomena':
      return tagLabel(entry.data.phenomenonType);
    case 'symbols':
      return entry.data.meaning;
  }
}
