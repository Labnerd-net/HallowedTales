// Display names for saint slugs used in frontmatter `saints` fields across
// legends/traditions/phenomena/symbols. Slugs are the cross-linking key (see
// CLAUDE.md on saint identity staying Register-compatible), not something to
// show verbatim - this is the one place that turns a slug back into prose.
const SAINT_NAMES: Record<string, string> = {
  'blaise-of-sebaste': 'Blaise of Sebaste',
  'eustace-of-rome': 'Eustace of Rome',
  'francis-of-assisi': 'Francis of Assisi',
  'george-of-lydda': 'George of Lydda',
  'hubert-of-liege': 'Hubert of Liège',
  'jerome-of-stridon': 'Jerome of Stridon',
  'joseph-of-cupertino': 'Joseph of Cupertino',
  'nicholas-of-myra': 'Nicholas of Myra',
  'padre-pio': 'Padre Pio',
  'patrick-of-ireland': 'Patrick of Ireland',
  'peter-the-apostle': 'Peter the Apostle',
};

const LOWERCASE_WORDS = new Set(['of', 'the', 'van', 'von', 'der', 'da', 'de']);

// Fallback for a slug with no entry above: title-case it rather than show
// the raw hyphenated slug. Covers new content immediately; the map above is
// just for cases (accents, "Padre") a naive title-case can't get right.
function humanize(slug: string): string {
  return slug
    .split('-')
    .map((word, i) => (i > 0 && LOWERCASE_WORDS.has(word) ? word : word[0].toUpperCase() + word.slice(1)))
    .join(' ');
}

export function saintName(slug: string): string {
  return SAINT_NAMES[slug] ?? humanize(slug);
}

export function formatSaints(slugs: string[] | undefined): string | undefined {
  if (!slugs || slugs.length === 0) return undefined;
  return slugs.map(saintName).join(', ');
}
