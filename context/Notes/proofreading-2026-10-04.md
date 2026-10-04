# Proofreading pass - 2026-10-04

Scope: full scan, all four collections. All 17 entries are now
`published: true` (16 drafts were flipped from `false` today).

## Summary

17 entries checked: 12 findings across 9 entries. 1 run-on, 1
subject-verb-agreement error, 2 misplaced/dangling modifiers, 1 awkward
wording, 1 tense-consistency slip, 1 first-mention miss, 1 borderline
run-on (colon-chained clauses), and 3 structural/clarity notes (dash
overload, mismatched subject coordination, a garden-path appositive).
8 entries were clean: `true-cross.md`, `joseph-of-cupertino-levitation.md`,
`padre-pio-bilocation.md`, `palm-sunday-palms.md`, `eustace-stag-vision.md`,
`holy-grail/index.mdx`, and `keys-of-st-peter/index.md` (see note below).

**`keys-of-st-peter/index.md`** - findings from this morning's pass
(scoped to published-only, when it was the sole published entry) were
applied directly to the file: the pacing split, Peter's first-mention
clause, the tense fix, and the run-on split. The capitalization finding
from that pass was retracted as a false positive ("Catacomb paintings..."
is sentence-initial, so capitalizing it is correct) and left unchanged.
Re-checked in this full scan - clean.

## Findings

### `src/content/legends/francis-and-the-wolf-of-gubbio.md`

- **[run-on]** "Francis's reputation for an easy rapport with animals is
  old and well attested, but this particular story is not - it appears
  for the first time in the Fioretti, compiled around a century after his
  death, and neither Thomas of Celano nor Bonaventure, his two earliest
  biographers, mention a wolf at all." - four independent clauses chained
  via "but," a dash, and "and." Fix: split after "is not." into its own
  sentence.
- **[grammar]** Same sentence: "neither Thomas of Celano nor Bonaventure
  ... mention a wolf at all" - "neither...nor" with two singular subjects
  takes a singular verb agreeing with the nearer subject ("Bonaventure"),
  so this should be "mentions," not "mention."

### `src/content/legends/george-and-the-dragon.md`

- **[tense]** "They agree, and by some tellings, thousands were baptized
  that same day." - the whole paragraph is in historical present
  ("rides," "happens," "challenges," "leads," "offers," "agree"); "were
  baptized" breaks that voice. Fix: "thousands are baptized that same
  day."

### `src/content/legends/jerome-and-the-lion.md`

- **[grammar]** "a lion limped into the monastery courtyard near
  Bethlehem where Jerome - the 4th-century scholar who translated the
  Bible into Latin - lived and worked, holding up one paw, and the other
  monks scattered in terror." - "holding up one paw" is meant to describe
  the lion, but sits right after the Jerome clause, far from "lion," and
  reads momentarily as if it modifies something else. Fix: move it next
  to its subject, e.g. "a lion, holding up one paw, limped into the
  monastery courtyard near Bethlehem where Jerome..."

### `src/content/legends/hubert-stag-vision.md`

- **[grammar]** "But almost the identical vision, down to the glowing
  crucifix between the antlers, is told about..." - "almost the
  identical" is awkward; "identical" already implies exactness, so
  pairing it with "almost the" reads as a near-typo. Fix: "almost exactly
  the same vision" or "a nearly identical vision."

### `src/content/legends/nicholas-dowry-gold.md`

- **[structure]** "Nicholas, then a young man in Myra - the 4th-century
  bishop who would become the saint behind Santa Claus - known already
  for his quiet generosity, heard of the family's plight." - the
  identifying clause was inserted between "a young man in Myra" and
  "known already for his quiet generosity," which were one continuous
  description before the edit; splitting them makes the sentence
  garden-path on first read. Fix: e.g. "Nicholas - the young man in Myra
  who would grow up to become the 4th-century bishop behind the Santa
  Claus legend - was already known for his quiet generosity when he
  heard of the family's plight."

### `src/content/legends/patrick-and-the-snakes.md`

- **[run-on, borderline]** "Ireland really has had no native snakes, for
  a much simpler reason than any saint's intervention: the island
  separated from the rest of Europe after the last Ice Age, before
  snakes were able to migrate back north and recolonize the land, and
  the surrounding sea has kept them out ever since." - three independent
  clauses chained via a colon and "and." The colon is doing deliberate
  explanatory work here (not a comma-splice drift), so this is more a
  judgment call than a clear defect - flagging per the "note borderline
  cases" rule rather than as a confirmed issue.

### `src/content/legends/francis-sermon-to-the-birds.md`

- **[clarity]** "Francis of Assisi - the 13th-century friar who founded
  the Franciscans - came upon a great flock of birds of every kind
  gathered in the fields and trees along the way - doves, crows, and
  others the story doesn't bother naming." - three hyphens doing two
  different jobs (an interrupting identifying clause, then a trailing
  appositive list) in one sentence. Consider giving the bird list its own
  sentence to reduce dash overload.

### `src/content/relics/holy-house-of-loreto.md`

- **[structure, borderline]** "What keeps the mystery alive, and part of
  why the shrine still draws pilgrims by the millions each year, is that
  the house's walls really do rest on open ground..." - the coordinated
  subject ("What keeps the mystery alive" + "part of why...") pairs a
  free relative clause with a noun phrase; they're not quite parallel and
  the sentence reads slightly tangled on first pass. Minor - flagging as
  a judgment call, not a clear error.

### `src/content/traditions/st-nicholas-day-shoes.md`

- **[first-mention]** "The custom traces itself back to the dowry-gold
  legend - the story of Nicholas secretly tossing bags of gold through a
  window..." - Nicholas is named with no identifying clause, unlike
  `st-blaise-day-throat-blessing.md`'s "a legend about Blaise, a bishop
  and physician in Sebaste," which shows the convention applies to
  traditions entries too, not just legends. Fix: something like "Nicholas
  - the 4th-century bishop of Myra behind the Santa Claus legend -."
- **[clarity]** "St. Nicholas himself slowly reshaped into Sinterklaas's
  better-known descendant, Santa Claus." - this compresses Nicholas ->
  Sinterklaas -> Santa Claus into one step, reading as if Nicholas
  skipped directly to becoming "Sinterklaas's descendant" without ever
  being Sinterklaas. Fix: something like "Nicholas's own image slowly
  reshaped first into Sinterklaas, then into Sinterklaas's better-known
  descendant, Santa Claus."

### `src/content/traditions/st-blaise-day-throat-blessing.md`

- **[grammar]** "a mother brought her young son to him, choking on a
  fishbone and near death." - "choking on a fishbone and near death" sits
  right after "to him" (Blaise), so it momentarily reads as modifying
  Blaise rather than the son. Fix: "a mother brought to him her young
  son, who was choking on a fishbone and near death."
