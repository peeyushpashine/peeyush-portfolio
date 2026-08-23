# Diagrams

## Deciding

A diagram earns its place only if it makes an argument the prose can't. Two per article is plenty. If the diagram restates a paragraph, cut it.

The strongest article diagrams reframe an axis. If everyone plots X and the argument depends on Y, plotting Y is itself the contribution. Look for that before designing anything.

## Marking placement

In the markdown, insert:

```
<!-- DIAGRAM 1 GOES HERE: see spec at the bottom of this file -->
```

Then write full specs in a `## DIAGRAM SPECS` section at the end, with axes, series, zones, annotations, and the explicit takeaway to label. Specs alone are a complete deliverable; he can build them himself or hand them to a designer.

## Building in Figma

Only build when he asks. The connector path:

1. `Figma:whoami` for the plan key
2. `Figma:get_figma_skill` on `skill://figma/figma-create-new-file/SKILL.md`
3. `Figma:create_new_file` with `editorType: "design"`
4. `Figma:get_figma_skill` on `skill://figma/figma-use/SKILL.md`
5. `Figma:use_figma` in incremental calls, screenshotting to verify

`Figma:generate_diagram` is Mermaid-only and cannot render annotated charts, cones, zones, or custom geometry. Don't reach for it on this kind of work.

### Canvas

1200 × 700 fits LinkedIn's article image width without cropping. Export PNG at 2x.

### Palette that has worked

```
ink     {r:0.09, g:0.09, b:0.11}
muted   {r:0.42, g:0.45, b:0.50}
gridline{r:0.87, g:0.88, b:0.90}
blue    {r:0.15, g:0.39, b:0.92}
red     {r:0.86, g:0.15, b:0.15}
green   {r:0.02, g:0.59, b:0.41}
purple  {r:0.55, g:0.16, b:0.72}
amber   {r:0.96, g:0.62, b:0.04}
```

Zone bands at 0.07 opacity. Inter throughout: Regular, Medium, Semi Bold, Bold. Section labels at 10–11px Semi Bold with 0.8px letter spacing.

### Gotchas hit and solved

**Vector positioning.** Setting `vectorPaths` resizes the node to the path bounding box. Compute path data relative to the minimum x and y of your points, then set `node.x` and `node.y` to those minimums after appending.

**Symmetric cones.** Apex at bottom centre opening upward is:
```
"M " + spread + " " + height + " L 0 0 L " + (spread*2) + " 0 Z"
```
Getting the first coordinate wrong produces a right triangle. Screenshot to confirm.

**Points inside a cone.** At depth `y` from the top, the half-width is `spread * (1 - y/height)`. Constrain scattered points to that or they float outside the shape.

**Label collisions.** Multi-line axis labels overrun their allotted band. Always screenshot after the first build and fix vertical positions before adding more.

**Rotated text.** `rotation = 90` rotates about the origin and will throw the node off-canvas. Set the size and alignment first, then rotation, then x and y, then verify visually.

**Font styles.** Inter uses `"Semi Bold"`, not `"SemiBold"`.

### Working method

Build in three or four `use_figma` calls rather than one. Frame and axes, then data, then annotations and takeaway. Screenshot after each. Failed scripts are atomic, so a botched call leaves no debris, but a single giant call is much harder to debug.

Always end the diagram with an explicit takeaway line in the frame. The diagram should be readable standalone when someone screenshots it out of the article, which is how it will travel.
