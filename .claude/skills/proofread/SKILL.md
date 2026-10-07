---
name: proofread
description: Proofreads prose in `src/content/{legends,traditions,relics,phenomena}/**` for spelling, grammar, run-on sentences, structural issues (paragraph length, repetitive sentence openers, passive-voice overuse, pacing), and this repo's specific style rules (plain hyphens not em dashes, saints/terms introduced at first mention, warm/devotional tone rather than clinical or dark framing). Use when asked to proofread, copyedit, check writing quality, check for run-ons, or review tone/voice/structure on one or more content entries. Produces a dated report under `context/Notes/` - never edits content files itself.
---

# proofread

Checks prose quality on this site's narrative content. This is a judgment
pass, not a mechanical lint - run-ons, pacing, and tone drift are read, not
regex-matched, so do the check yourself rather than reaching for a script.

**Report only.** This skill never edits `src/content/**` itself. It writes
findings to a dated report; the user applies fixes by hand or asks for them
to be applied in a separate follow-up step.

## Step 0 - scope from `$ARGUMENTS`

- A collection name (`legends`, `traditions`, `relics`, `phenomena`) ->
  only that collection.
- A slug or filename fragment -> resolve it to the matching file(s) under
  `src/content/*/` (don't guess spelling - glob/grep for it).
- "published" / "published only" -> filter to entries with `published: true`
  in frontmatter.
- Nothing specified -> full scan of all four collections, published and
  unpublished alike (unpublished drafts benefit from this pass before they
  ever go live).

Discover target files with Glob on `src/content/{legends,traditions,relics,phenomena}/**/*.{md,mdx}`,
narrowed by whatever scope applied above.

## Reading the files

At this repo's current size (~17 entries, call it current via a quick
`Glob` count if it matters) just `Read` each file directly - no subagents
needed. If the content collections grow past roughly 25-30 entries in
scope for a single run, split into batches and dispatch `general-purpose`
agents in parallel (one message, multiple calls), each returning findings
as structured text rather than full file content, so the report-writing
step isn't re-reading entire entries out of agent output.

Check the prose body (everything after frontmatter) plus any free-text
frontmatter fields meant to read as prose: `historicalNote`, and
`variants[].detail` / `variants[].note` on legends.

## What to check

**Spelling and grammar.** Typos, misspelled proper nouns (cross-check a
saint/place name's spelling against its own `title` and against other
entries mentioning the same saint - inconsistent spelling of the same name
across entries is still a spelling issue even if each instance is
internally consistent), subject-verb agreement, tense consistency within a
paragraph, basic punctuation.

**Run-on sentences.** A sentence stacking more than two independent clauses,
or a comma splice joining two complete thoughts without a conjunction.
Quote the sentence and suggest where it would split.

**Structure and pacing.**
- Paragraphs noticeably longer than the entry's others, or a wall of text
  with no natural break.
- Repetitive sentence openers (three-plus sentences in a row starting the
  same way - "He then...", "The story goes...") within one entry.
- Passive voice used often enough to flatten the narrative voice, as
  opposed to occasional deliberate use.
- Pacing: does the entry front-load setup and rush the actual legend/custom,
  or vice versa?

**This repo's style rules** (from `CLAUDE.md` and recent convention):
- Em dashes (`—`) anywhere in body copy - should be plain hyphens (`-`).
- A saint or specialized term introduced at first mention without the
  short identifying clause this repo's convention uses - e.g. "Francis of
  Assisi - the 13th-century friar who founded the Franciscans -" rather
  than bare "Francis" on a reader's first encounter with the name in that
  entry. Check this is present once per entry, not restated every
  paragraph (the convention is contextual sentences, not italicized
  glossary entries written separately after each term - that pattern read
  flat and was replaced with inline identifying clauses instead).
- Tone drift toward clinical/encyclopedic voice, or toward the "Not dark"
  guardrail in `CLAUDE.md` (horror framing, gore, dwelling on martyrdom
  detail, exorcism/demonic content) - flag even a mild lean in that
  direction, since the guardrail is explicit about cutting rather than
  softening.
- Internal taxonomy jargon leaking into reader-facing prose - "pillar" used
  to mean a content pillar/category (e.g. "unlike most objects in this
  pillar") rather than a literal architectural pillar. Readers don't know
  this repo's internal `CLAUDE.md` structure; flag it and suggest "category"
  or a rephrase. Don't flag genuine uses of "pillar" describing an actual
  physical column.

Don't flag things `CLAUDE.md` explicitly allows (e.g. shared Old Testament
origin material anchored in Catholic veneration) - this is a writing-quality
pass, not a scope-guardrail audit.

## Writing the report

Write to `context/Notes/proofreading-<YYYY-MM-DD>.md` (today's date; create
`context/Notes/` if it doesn't exist). Structure:

1. **Summary** - entries checked, scope, and a one-line count per category
   (e.g. "6 entries checked: 2 run-ons, 1 em dash, 3 first-mention misses,
   1 tone note").
2. **Findings grouped by file**, each as a short list:
   `[category] quote or location - the issue - suggested fix`. Keep the
   quote short (the specific sentence/phrase, not the surrounding
   paragraph). Skip entries with nothing to flag entirely rather than
   listing them as clean.
3. Nothing else - no restating what's already correct, no general writing
   advice not tied to a specific entry.

## Tell the user

Report the file path and the headline counts from the summary. If the
user asks to apply the fixes afterward, that's a normal edit pass against
the report - re-read the flagged entries and fix them directly, don't
re-run the full proofread skill just to make the edits.
