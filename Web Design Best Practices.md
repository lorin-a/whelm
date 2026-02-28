# Portfolio Intelligence — 2026

> Distilled from industry talks on portfolio strategy, web design craft, and 2026 trends.
> This file informs all vibe-coded projects. It is external intelligence, not internal spec.
> For design tokens and architecture, defer to `DESIGN_SPEC.md` and `ENGINEERING_STANDARDS.md`.

---

## 1. The Discovery Layer Has Changed

Hiring managers spend roughly **55 seconds** deciding whether to engage with a portfolio. They are not reading case studies at the discovery stage. What gets attention now:

- **Interactive, live work** — sites you can click through, playgrounds, micro-tools, shipped products
- **Motion and craft on display** — hover states, transitions, micro-animations that prove you understand how interfaces should *feel*
- **Personality and point of view** — Easter eggs, thoughtful details, a sense that every element was chosen

Case studies still matter — but they belong in the **interview cycle**, not the discovery layer. The portfolio site itself is the first proof of capability.

**What this means for Lorin:** The site *is* the portfolio. Every interaction, transition, and layout choice is a design decision on display. The Groundswell vibe-coded app, the Whelm app, the TRO tool — these are discovery-layer proof. Case study write-ups support the interview, not the first impression.

---

## 2. What Hiring Managers Are Scanning For

From Figma's *The Demand for Design Hiring in 2026* (323 hiring managers, fielded Oct 2-23, 2025):

- **Visual polish and craft** — cited as the #1 evaluation criterion by 58% of hiring managers
- **AI tool proficiency** — 73% say this need is increasing; for some roles it's now a requirement
- **Judgment and taste** — not "can you wireframe" (AI does that fast) but "do you know *why* this works"
- **Willingness to build publicly** — shipped experiments, even rough ones, signal capability more than polished decks

The foundational work AI accelerates (wireframing, responsive layouts, code-design translation) is no longer the differentiator. **What's left to show is judgment, curiosity, and the ability to ship.**

---

## 3. The Playground Model

The most effective portfolios in 2026 function as **playgrounds** — living collections of experiments, not static deliverables. Key characteristics:

- **Simple but layered** — clean surface, rewards exploration
- **Interactive** — every element is a design decision you can engage with
- **Personality-forward** — the designer's point of view is unmistakable
- **Evolving** — treated as a living collection, not a one-time launch

This doesn't mean abandoning structure. It means the structure itself demonstrates design thinking. Navigation is a design decision. Scroll behavior is a design decision. How a page loads is a design decision.

**Spectrum of approaches:**
1. **Micro-interactions** — small moments (hover states, loading transitions, 15-second interactions) that prove good judgment
2. **Playground site** — a website hosting experiments, wide or deep, living not finished
3. **Software as gift** — small tools built for real people (a friend, a nonprofit, a partner) — shipping for a real user is the fastest way to produce work worth showing
4. **Public experiments** — sharing what you built and what you learned, mentoring at scale

---

## 4. Design Craft Principles (Reinforced)

These are not new — they're confirmation that our existing design system is aligned with industry best practice. Cross-reference `DESIGN_SPEC.md` for token values.

### Typography
- **Type scale system** is non-negotiable — consistent sizing, spacing, and line height
- Paragraph text: don't touch letter-spacing. Headings: tighten as size increases.
- Line height: ~150% for body, tighter for headings
- Display fonts for attention-grabbing; legible fonts for anything over ~7 words
- Font pairing: if it clashes, keep looking. Side-by-side comparison is the test.

### Color
- **Limit the palette.** 2–3 colors max, each with a specific job.
- **60-30-10 rule:** 60% neutrals (background/text), 30% secondary (cards/headers/visuals), 10% accent (CTAs/buttons only)
- Use **opacity variations** of a single color to create layers rather than adding more colors
- One accent color reserved exclusively for calls to action — trains the user's eye
- Always check contrast (4.5:1 for body text, 3:1 for large text) — beauty that can't be read doesn't matter
- Image colors should be in the ballpark of the site palette

### Layout
- 12-column grid (desktop), 8 (tablet), 4 (mobile)
- **8-point spacing grid** — all spacing in multiples of 8 (8, 16, 24, 32...)
- Visual hierarchy in three tiers: most important (big, scannable), secondary (visible but not competing), detail (for people who want the weeds)
- People scan, they don't read — layout must guide the eye
- White space is not empty — it's breathing room. Use more than feels comfortable.

### Images
- **WebP format** when possible — faster loads without quality loss
- Target **~300KB per image** — large images are the #1 performance killer
- Intentional cropping using rule of thirds
- Resize and export at exact needed dimensions, don't rely on the browser to scale
- People in images looking toward key content directs the user's eye

---

## 5. 2026 Design Trends (Relevant to This Portfolio)

### Aligned with our direction
- **Human touch / Wabi-sabi** — hand-drawn elements, organic textures, imperfection as beauty. Anti-AI-generated aesthetic. This is already core to Lorin's visual language (scanned objects, hand-drawn SVGs, flatbed scanner textures). Lean into it harder.
- **Barely-there UI** — hyper-minimal, generous white space, stripped-down palettes, single font family confidence. Where appropriate, let restraint do the talking.
- **Democratized fancy animations** — WebGL-type interactions are now accessible via tools and vibe coding. Animations should tell a story, not just impress. If they don't add to what the site communicates, skip them.

### Worth noting but use with caution
- **Maximalism with an asterisk** — bold fonts, bright pops of color, creative energy. The trend has "pumped the brakes" — apply sparingly and in service of the brand.
- **Spaceship instruction manual** — blueprint-style layouts, monospace labels, diagram aesthetics. Could work for technical process sections if it fits the project.
- **Internet nostalgia** — retro UI elements, custom cursors, early-web references. One nostalgic moment as seasoning, not a full rebuild.

### Avoid
- **Tech bro gradient** — the purple/blue/teal SaaS gradient is everywhere and signals "trying to look cutting edge" rather than having actual craft. Lorin's organic palette is the antidote.
- **Sound for sound's sake** — micro-sounds can work if opt-in and tasteful, but the risk outweighs the reward for a portfolio site. Skip unless there's a compelling storytelling reason.

---

## 6. The Show vs. Tell Shift

> "The shift seems to be rewarding people who are showing their work versus explaining it in a document."

This is the single most important takeaway. Applied to Lorin's portfolio:

| Instead of... | Show... |
|---|---|
| Describing your process in paragraphs | The process *in action* via interactive artifacts |
| Listing skills | Proof of those skills in the site itself |
| Explaining that you think in systems | A site architecture that *is* systems thinking |
| Saying you care about accessibility | A site that passes every audit |
| Telling people you can code | Shipped, working software they can use |

The vibe-coded projects (Groundswell app, Whelm, TRO tool) are not supplementary portfolio items — they are **primary evidence**. The case study write-ups support them, not the other way around.

---

## 7. Posting and Discovery Strategy

For when the portfolio launches and projects ship:

- **X (Twitter) first** — where design talent scouts are actively sourcing. Work with motion performs especially well. Even zero-following accounts can go viral if the work is good.
- **Instagram second** — motion plays well, packaging matters slightly more
- **LinkedIn third** — hiring managers scroll here; format: "here's what I built, here's what I learned, here's the tools I used"
- **30 micro-shares beat 3 case study cycles** — each post is low stakes, each is a feedback loop
- If the work has motion, the packaging barely matters — the work does the talking

---

## 8. Applying This to Lorin's Specific Strengths

What this intelligence confirms about positioning:

1. **Participatory design + vibe coding is a rare combination.** The ability to conduct rigorous research AND ship working software is exactly the "full stack" hiring managers are looking for in 2026.
2. **The human touch aesthetic is a trend tailwind.** The scanned-object color palettes, hand-drawn elements, and organic textures aren't just personal style — they're directionally aligned with where the industry is moving away from AI-generated sameness.
3. **Groundswell as flagship is the right call.** It demonstrates judgment, facilitation, research rigor, AND a shipped interactive product. It's the whole story.
4. **The upcoming projects (Whelm, TRO tool) are discovery-layer gold.** Real software for real people. "Software as gift" is cited as the fastest way to produce work worth showing.
5. **Don't over-document.** The instinct to be thorough is a journalism strength, but at the discovery layer, less text and more interaction wins. Save the depth for the interview.

---

*Last updated: 2026-02-28*
*Sources:*
- *Figma, "The Demand for Design Hiring in 2026," survey of 323 design hiring managers across U.S., Canada, UK, Germany, France, Australia, and Japan, fielded Oct 2-23, 2025*
- *Industry talks on portfolio strategy, design talent network insights*
