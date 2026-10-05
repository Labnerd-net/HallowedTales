Source pass for the Chi-Rho entry listed under "Symbol origin stories" in
`Pillar 5 - Symbols.md`. Not published content - this is the research/sourcing step the
README calls for before drafting.

## The legend as usually told

Constantine sees a vision before the Battle of the Milvian Bridge (312 AD) telling him
"In this sign, conquer," marks his army's shields with the Chi-Rho (the first two Greek
letters of "Christos," ☧), wins the battle, and credits the sign for the victory.

## Primary sources (and where they disagree)

- **Lactantius, *De Mortibus Persecutorum*, ch. 44** - written c. 313-315, within a year or
  two of the battle. Says Constantine was told **in a dream**, the night before the battle,
  to put "the heavenly sign of God" on his soldiers' shields, and describes the shape as "the
  letter X with a line drawn through it and turned round at the top" - i.e. the Chi-Rho. No
  daytime sky vision in this version.
- **Eusebius of Caesarea, *Vita Constantini***, written c. 337-339, after Constantine's
  death, claiming to relate what Constantine told him personally under oath years later.
  This is the version with the vivid **noonday sky vision** - a cross of light above the sun
  with the Greek words "Εν Τούτῳ Νίκα" (Latin: *in hoc signo vinces*) - followed that same
  night by a dream of Christ instructing him to use the sign as his standard.
- The two accounts disagree on dream-vs-waking-vision, timing, and the exact sign described.
  That gap is a good example of the site's usual "here's the earliest source, here's how the
  story visibly grew in the retelling" framing - Eusebius's version, written a generation
  later from secondhand testimony, is the more dramatic one and the one that produced the
  "In Hoc Signo Vinces" motto people know today.

## What we actually know historically

- **The Chi-Rho predates this story.** It was already circulating among Christians as a
  monogram/abbreviation for "Christos" before 312 - it shows up in catacomb use beforehand.
  (A superficially similar letter combination was also used centuries earlier in Ptolemaic
  Egypt to abbreviate an unrelated Greek word, *chrēston* - that's a coincidence of the
  letterforms, not a Christian origin, worth a line so it doesn't read like the symbol was
  invented for this vision.)
- **What's independently verifiable about Constantine himself:** he adopted the Chi-Rho on
  his military standard (the *labarum*), and it starts appearing on imperial coinage from the
  mid-310s onward - e.g. a bronze follis struck 337 at Constantinople (RIC VII 19) shows the
  labarum, topped with a christogram, spearing a serpent, legend "SPES PVBLICA."
- **The Arch of Constantine** (Rome, dedicated 315, commemorating this exact battle) carries
  no Christian imagery at all - a nice "what you'd expect vs. what actually survives" beat if
  there's room for it.

## How it actually entered Catholic visual/devotional life

This is the part worth building the piece around, rather than a Constantine biography:

- Pre-dates Constantine in Christian catacomb tomb-marking use.
- 4th-5th century Christian sarcophagi (Museo Pio Cristiano, Vatican Museums) carve the
  Chi-Rho inside a laurel/victory wreath, often flanked by two Roman soldiers at the foot of
  an empty cross - a direct repurposing of Roman military victory imagery into a Resurrection
  image. Concrete, visual, and exactly the "how a Roman symbol got absorbed into Catholic
  tradition" throughline this entry needs.
- Still in customary use today on the Paschal (Easter) candle alongside the cross and
  Alpha/Omega at the Easter Vigil - though that's decorative custom, not something the Roman
  Missal's candle-blessing rubric names by symbol. **Flag:** I sourced that from liturgical-
  goods/parish pages, not the Missal itself - worth a direct check against the Missal text
  before stating it as rubric in the published piece.
- Shows up widely in church heraldry, vestments, and altar linen as a Christogram - worth one
  clarifying aside that it's a distinct symbol from the Jesuit "IHS" monogram (short for
  *Iesus*, not *Christos*), since the two are commonly confused.

## Guardrail note

Already flagged in the Pillar doc as sitting at the edge of "Catholic vs. just early-
Christian/Roman-history." Given the research above, the fix is in the framing: lead with the
vision-legend as the hook, keep Constantine's biography brief, and spend the back half on the
symbol's actual life in Catholic art and liturgy (sarcophagi, Paschal candle, heraldry) rather
than Roman military history.

## Schema snag - resolved

This entry is the reason the `symbols` collection (`src/content.config.ts`) has `saints` as
optional rather than required like `legends`/`phenomena`: Constantine isn't a canonized saint in
the Catholic Church (he's venerated as a saint in Eastern Orthodoxy/Eastern Catholic calendars,
commemorated with St. Helena on May 21, but not in the Latin rite's canon), so there's no saint
slug this entry is obligated to carry. At drafting time, either leave `saints` off entirely, or
set `saints: [helena]` if the piece ends up discussing her role in Constantine's story - that's
a content call for the draft, not a schema blocker anymore.

## Image candidates (Wikimedia Commons, vetted for license)

1. **Hinton St Mary Mosaic**, central roundel - Chi-Rho flanked by two pomegranates behind a
   bust (identity debated: Christ, or possibly Constantine - the ambiguity is itself a fun
   detail). Romano-British, 4th century, now British Museum. File: `Hinton_St_Mary_Mosaic.jpg`.
   **Public domain** (released by uploader on Commons).
2. **Chi-Rho monogram from a 4th-century sarcophagus**, Museo Pio Cristiano, Vatican Museums
   - the wreath-and-soldiers Resurrection imagery described above. File:
   `Vatican Museums 2020 P06 Chi Rho monogram from sarcophagus.jpg`. Photo by "Fallaner,"
   2020. **CC BY-SA 4.0** (credit required).
3. **Bronze follis of Constantine I**, Constantinople mint, 337 AD (RIC VII 19) - reverse
   shows the labarum topped with a christogram spearing a serpent. File:
   `As-Constantine-XR_RIC_vII_019.jpg`. Numismatic photo via CNG/Wildwinds. **Triple-licensed
   GFDL / CC BY-SA 3.0 / CC BY-SA 2.5** (credit required).
4. Possible catacomb graffito candidate (`Catacomb_stayros01.jpg`, marked public domain) -
   **not confirmed usable**, its description reads as a cross ("stauros"), not clearly a
   Chi-Rho. Don't use without visually confirming the actual symbol in the photo.

None require purchase or formal clearance. Files have not been downloaded into the repo yet -
that's a drafting-time step (`src/content/symbols/chi-rho/` images, per `imagesField` in
`src/content.config.ts`, with `credit` set from the license info above).
