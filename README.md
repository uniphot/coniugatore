# Coniugatore — Italian Verb Conjugator

A minimalist, static Italian verb conjugator for students. Search a verb,
pick the tenses you want (grouped by mood), and see every form conjugated
with the **stressed vowel marked**.

## Run locally

It's plain HTML/CSS/JS — no build step. But the scripts need to be served over
HTTP (not opened as a `file://`), so run a tiny local server from this folder:

```bash
python3 -m http.server 8731
```

Then open <http://localhost:8731>.

## Project structure

```
index.html        markup
css/style.css      yopta-style skin (bold, hard edges, acid accent; classic fonts)
js/engine.js       conjugation engine + stress logic
js/verbs.js        verb dictionary (regulars with stress data + irregulars)
js/app.js          UI: search/autocomplete, tense selector, tables
```

## What it covers

~355 verbs and growing (target: exhaustive to C2).

- Regular `-are / -ere / -ire / -ire(isc)` verbs, including spelling rules
  (cercare→cerchi, mangiare→mangi, pagare→paghi, studiare→studi but studierò).
- Irregulars, scaled by architecture rather than brute force:
  - `buildSig()` — sigmatic `-ere` verbs (regular present/future, irregular
    passato remoto + participle): prendere, chiudere, spingere, decidere…
  - `derive()` — prefixed families from one correct base/template:
    comprendere←prendere, produrre←durre, comporre←porre, ottenere←tenere.
- All standard tenses across Indicativo, Congiuntivo, Condizionale, Imperativo,
  including compound tenses with correct auxiliary and participle agreement
  (`sono andato/a` → `siamo andati/e`).

Design: skin **B "Editorial"** — cream, rust accent, Georgia serif, thin borders.

## Stress marking — how reliable is it?

- **Ending-stressed forms** (the majority) are computed by rule → reliable.
- **Stem-stressed present-tense forms** (the *àbito* vs *abìto* problem) can't be
  derived purely from spelling. They are encoded per-verb in the dictionary and
  are correct for every verb in the list.
- If a student types a verb **not** in the dictionary, it's conjugated with the
  regular pattern and stem stress is guessed (last stem vowel). Those forms are
  flagged with a small `•` so they're never silently wrong.

## Next steps

- Expand the irregular/verb list.
- Then deploy to GitHub Pages (just push these files to a repo and enable Pages).
