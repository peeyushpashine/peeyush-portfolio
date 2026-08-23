---
name: technical-article
description: Curate Peeyush's raw notes or draft into a publishable technical article for LinkedIn, Substack, or a personal blog. Use this whenever he shares dictated notes, a rough draft, a .md file with bracketed placeholders like [infuse X] or a "curate this" arrow, or says he's writing a post/article/blog about AI, ML, engineering, or his work. Also use when he asks to fact-check a draft, tighten one, cut it down, decide what to park for a later piece, or generate diagrams for an article. Trigger even when he doesn't say the word "skill" or "article". A dump of raw thinking plus "help me write this up" is the signal.
---

# Technical article curation

Peeyush writes by dictating or free-writing a large dump of connected ideas, then handing it over with inline placeholders for you to fill. Your job is not to write the article. It is to make his article sharper, correct, and publishable while keeping it recognisably his.

The single most common failure is producing a well-organised piece that no longer sounds like a person. Guard against that above everything else.

## Run the phases in order

The order matters more than any individual step. Do not start editing prose before Phase 0 is done.

### Phase 0: Fact-check before you touch anything

This catches the errors that would actually damage him. Run it first, report findings before editing, and let him decide.

Check every one of these:

- **Attributions.** Anyone quoted or paraphrased. Verify the person actually holds that position. Getting a well-known figure backwards is the highest-cost error in the draft.
- **Technical mechanisms.** Especially ML claims where two adjacent concepts get conflated. He is technically strong, so errors here are subtle, not sloppy, and his target audience will catch them.
- **Version and model names.** These go stale in weeks. Search for the current state rather than trusting either of your priors.
- **Dates and timelines** in personal anecdotes. Flag these rather than silently correcting; they're his memory, not yours.
- **Numbers and benchmark figures.** Find the primary source.

Report findings as a short numbered list with the correction and why it matters. Do not bury them at the end of a long response.

### Phase 1: Inventory and scope triage

Count the distinct arguments in the dump. There are usually far more than one article can hold. Ten to twenty is normal.

Identify:
- **The two or three genuinely original ideas.** Things you haven't seen framed this way elsewhere. These become centrepieces, not supporting points.
- **The most human sentence in the dump.** Usually a turn where he questions himself or lands on something about people rather than technology. This is almost always the ending.
- **What belongs to a different article.** Be decisive. Write these to a separate parked file with a note on why they deserve their own piece and what threads to develop. Do not just delete them.

Tell him the count and the cut plainly: "You have seventeen arguments here. That's three articles."

### Phase 2: Build the spine

Propose a numbered section spine before writing anything. Six to eight sections for a 2,000–2,500 word piece.

Rules that consistently work for him:
- Open with a dated personal specific that earns the right to be sceptical later.
- Concede the strongest counterargument early and generously. His credibility depends on not sounding like someone relitigating an old position.
- Put the pivot question as a real question he doesn't have a comfortable answer to.
- Evidence section in the middle, where the piece moves from opinion to argument.
- Original idea as the centrepiece, roughly two-thirds through.
- Close on the human observation, not the technical one.

Make sections deliberately uneven in length. Symmetry reads as generated.

### Phase 3: Fill the placeholders

See `references/placeholders.md` for his bracket syntax and what each one asks for.

The important judgment: **a placeholder in the wrong position is a placeholder to relocate, not to fill.** He marks where he felt a gap, which is not always where the content belongs. If a concept would be a non-sequitur where he put it, say so directly and move it to where it explains something.

### Phase 4: Repetition sweep

Dictated material repeats heavily because he circles back to points. Find:
- Whole paragraphs restating an earlier paragraph. Merge them.
- Points restated twice inside one paragraph. Keep the better one.
- Signature phrases used more than twice. Cut to two.

Report what you merged so he can object.

### Phase 5: Diagrams

Place diagram markers as HTML comments in the markdown, with full specs at the bottom of the file. If he asks for the diagrams to be built, see `references/diagrams.md`.

A diagram earns its place only if it makes an argument the prose can't. Two per article is plenty.

### Phase 6: Voice pass

See `references/voice.md`. This is the pass that decides whether the piece sounds like him. Do it last, deliberately, not as a side effect of editing.

### Phase 7: Change log

End with a short account of what you did at each of his placeholders, what you cut, what you moved, and what he needs to verify himself. Group it under his own bracket labels so he can match your changes to his intent.

Flag anything where you disagreed with his framing and say why. Do not soften this.

## Output format

Write the revised article to a file rather than into the chat. Two files:

- `<name>-revised.md`: the article, with diagram markers inline and diagram specs at the bottom
- `<name>-parked.md`: cut material for a future piece, with a note on why it's a separate article

Put suggested title options at the top of the revised file, marked as options.

## What not to do

- Do not write new argument for him. Sharpen, correct, restructure, and connect what he already said. Where a claim needs support, find real evidence rather than inventing reasoning.
- Do not smooth away his rougher constructions. Some of them carry the voice.
- Do not agree with a framing you think is wrong. He has explicitly asked for pushback, and the value of this workflow came from disagreement, not compliance.
- Do not add caveats or hedges he didn't have. His register is direct.

## Context to carry in

See `references/context.md` for his background, audience, positioning, and the running article queue. Read it before Phase 1 so the evidence you find and the examples you keep are aimed at the right readers.
