# Brain Dump Flow: Design Brainstorm Summary

## Session Date: February 28, 2026
## Context: Senior design research brainstorm to refine user flow, identify open questions, and prepare for playtest

---

## What This Document Captures

A working session refining the brain dump → word portrait → investigation flow. This is the core of Whelm's OPEN phase — where the user untangles overwhelm by externalizing thoughts, witnessing their own language patterns, and investigating the emotionally charged words beneath their narrative.

This document is intended as source of truth for Claude Code during prototype refinement. It captures decisions made, questions resolved, questions still open, and the design principles that emerged.

---

## The Three Acts of the Brain Dump Experience

### Act 1: The Void (Brain Dump)

**What it is:** A stream-of-consciousness typing experience where narrative text dissolves like rain and emotionally charged words are preserved.

**Established interaction design:**

- User types freely into a minimal, inviting space
- As text is entered, narrative words fade and dissolve (the "rain" animation)
- The word parser (14 signal categories, see WORD_PARSING_RULESET.md) identifies emotionally charged words in real time
- Extracted words drift to the bottom of the screen as pill-shaped labels
- Pills accumulate in an organic, imperfect pile — the "cairn"
- The user sees the distillation happening in real time as they type

**The void contract:** "Your story falls away. Your words stay." This is communicated through the interaction itself, not through explanatory text. The user watches narrative dissolve while emotionally significant words linger. No surprises. No surveillance.

**Key decision — pills during typing are PASSIVE:**
- During Act 1, the cairn is visible but not interactive
- Pills accumulate in the user's peripheral awareness
- They are visual evidence that something essential is being preserved
- The user's attention stays on typing — the cairn grows quietly
- Think: stones collecting at a riverbed while water flows over them

**Completion is user-initiated:**
- The user decides when they are done (presses a "done" action)
- The app never cuts them off or asks "are you done?"
- This respects agency and avoids the cognitive load of "am I finished?"

### Act 2: The Mirror (Word Portrait)

**What it is:** The transition from pouring out to witnessing. The user sees only their emotionally charged words, stripped of narrative context.

**The transition (decided in session):**
- When the user presses "done," the void (typing space) recedes or quiets
- The wabi-sabi cairn reorganizes into a more intentional, readable arrangement
- NOT a rigid grid — but more structured than the organic pile
- Instructions on how to engage with the pills appear
- The pills become interactive (tappable)
- This transformation happens on the same screen — no jarring page change
- The environment transforms around words that were already there

**The promise of this moment:** "This is how you're speaking to yourself right now." The power is in the subtraction — seeing ONLY these words without the narrative that justified them.

**Progressive context reveal (three-tap depth):**
- Tap 1: Tooltip shows ~3-5 words of surrounding context
- Tap 2: The full sentence where the word originated
- Tap 3: The full paragraph from the stream of consciousness

**User agency in the portrait:**
- User can dismiss words that don't resonate (parser false positives)
- User can add words the parser missed
- The system proposes; the user decides

**What happens to the void space:**
- The typing space recedes but the user can return to it
- If they want to add more stream of consciousness, they can go back
- The original draft is preserved — all drafts are accessible
- Privacy is retained — this is the user's data
- The brain dump is a living container, not a one-shot event
- Think: breathing rhythm — pour out, witness, pour out more, witness again
- The portrait updates as new material is added

### Act 3: The Investigation (Word Exploration)

**What it is:** The user selects a word from their portrait and explores it through a set of approachable questions informed by therapeutic modalities.

**Key design principle — constellation, not ladder:**
- The investigation is NOT a depth ladder where each question goes deeper
- It is a constellation of lateral questions AROUND the word
- The user picks what feels right via a shuffle mechanic
- This keeps cognitive load low and preserves agency
- "You are the authority on what works for you"

**Why "approachable" matters:**
- The questions should feel logistical and answerable, not emotionally demanding
- Questions like "where did this word come from?" or "who first used this about you?" are almost factual
- And yet the answers reveal enormously charged content
- "My ex called me that" is a factual statement that contains a whole wound
- The interaction IS the therapy — you don't have to ask someone to go deep if the approachable question naturally takes them there

**Working constellation of question types (not final phrasing):**

1. **Origin** — "Where does this word come from?" / "Who first used this about you?"
   - Modality: Narrative therapy, externalization
   - What it does: Separates the word from identity. "I'm toxic" becomes "someone called me toxic"
   - Approachability: High — this is almost a factual question

2. **Body** — "Where do you feel this word?"
   - Modality: Somatic psychology
   - What it does: Connects the cognitive pattern to embodied experience
   - Bridges back to the body scan the user already completed
   - Approachability: Medium — requires body awareness but no emotional excavation

3. **Accuracy** — "Does this word still fit, or would you choose a different one?"
   - Modality: ACT (cognitive defusion through choice)
   - What it does: Opens the door to the reframe
   - This is the bridge to the user choosing their own language
   - Approachability: High — it's a preference question

4. **Function** — "What is this word protecting you from?" / "What does believing this let you avoid?"
   - Modality: IFS / parts work
   - What it does: Reveals the protective structure beneath the label
   - Approachability: Lower — this goes deeper
   - Should be progressive — available after trust is built, not on first encounter

5. **Need** — "What would feel good to hear right now?"
   - Modality: Self-compassion, need identification
   - What it does: Bypasses cognitive defenses by approaching through need rather than analysis. The abstraction helps users access their core needs safely. Surfaces what they're actually hungry for underneath the presenting symptom.
   - Approachability: High — it's a wish, not an excavation
   - Why it works: The question doesn't ask "what do you need?" (too direct, triggers performance). It asks what would feel good to *hear* — externalizing the need into imagined language.

6. **Simplification** — "How would you explain this to a six-year-old?"
   - Modality: Radical reduction, cognitive defusion
   - What it does: Forces radical simplification. Strips away sophisticated vocabulary and defense-layer language. Gets to the root by requiring honest reduction.
   - Approachability: High — feels like a game, produces devastating clarity
   - Why it works: Clinical vocabulary can't survive the constraint. "I'm experiencing hypervigilance due to attachment trauma" becomes "I'm scared he doesn't like me anymore."

Both of these questions do the same thing from different angles: they bypass the knowledge-without-kindness layer and ask the person to locate something simple and true.

**Shuffle mechanic:**
- User sees ONE question at a time
- If it doesn't land, they shuffle to another
- One primary action per screen
- Not all questions shown every time
- The app leads with one; user can shuffle if it doesn't fit

**Depth emerges through relationship, not through a single session:**
- First visit: constellation of approachable questions
- Return visits: deeper questions become available
- The investigation evolves with familiarity
- Deferred explorations shape future sessions
- Words that keep appearing across sessions become visible patterns

---

## Architectural Insight: Guided Flow → Standalone Tools

A significant realization from this session:

**The guided flow is a teaching path.** The first time through, the user is introduced to tools they don't yet know they need — body mapping, brain dump, word investigation. The guide walks them through a sequence because they don't yet have the self-knowledge to choose.

**Standalone tools emerge from the guided experience.** Over time, the user starts to recognize their own signals:
- "My chest is tight — I need the body check"
- "I'm spiraling — I need the void"
- "I keep saying 'selfish' — I want to investigate that"

**The hub grows with the user:**
- First visit: gently leads through the full sequence
- Later visits: presents the toolkit and trusts the user to choose
- The nodes on the hub are tools the user has a relationship with
- This IS the success criterion: the tool is needed less because the user has internalized the pattern recognition

**The guided flow and standalone tools are not two products.** They are the same tools experienced at two different levels of self-knowledge. The guided flow is how you learn. The standalone access is what happens when the tool has done its job.

---

## The Longitudinal Vision: Data as Self-Knowledge

**Core value proposition of the brain dump over time:**
- Every session generates language data about the user
- Not mood scores, not journal entries — actual language patterns
- The user doesn't have to do anything extra to generate this data
- They just show up and pour out what's happening
- The app does the listening

**What accumulates:**
- Words that recur across sessions ("enough" appears in 4 of 6 brain dumps)
- Clusters by topic (e.g., "should" clusters around work, "too much" around relationships)
- Connections between word patterns and body map data
- The user's own reframes over time — evidence of change

**The therapy bridge:**
- Instead of "I don't know, I just feel overwhelmed," user brings their word portrait to a therapist
- The therapist sees: recurring words, body map patterns, origin stories, reframes
- That's material a therapist can work with
- Not a referral — empowerment. The user arrives with clarity instead of chaos.

**Critical ethical boundary — mirror, not interpreter:**
- The app accumulates and reflects. Period.
- "You used the word 'enough' four times" = surfacing
- "You seem to struggle with inadequacy" = interpreting — NEVER DO THIS
- Visualization shows the user their own data and lets them draw the meaning
- The mirror does the work. The user holds the authority.

**Parser accuracy matters more over time:**
- A false positive in a single session is forgettable
- A false positive that accumulates across sessions could mislead someone about themselves
- "Err toward under-detection" (from WORD_PARSING_RULESET.md) gets MORE weight with persistence
- Trust is built through accuracy. One bad flag can undermine the whole mirror.

---

## Open Questions for Playtest

### Brain Dump Mechanics (Testable Now)
- Does the void contract land experientially? Does the user understand what's being kept vs. what's dissolving?
- Does the cairn feel like preservation or surveillance?
- Does pressing "done" feel like a choice or a demand?
- What's the minimum brain dump length for the parser to produce a meaningful portrait?
- What happens if the parser catches nothing? (Very short dump, or purely logistical content)
- What happens if the parser catches too much? (30+ pills — does it overwhelm?)

### Word Portrait (Testable Now)
- Does the transition from cairn to organized portrait feel like a natural shift?
- Does seeing just the charged words, stripped of story, produce recognition?
- Is the progressive context reveal (3 taps) intuitive without instruction?
- Does the user want to edit the portrait (add/remove words)?

### Investigation (Needs Design Before Testing)
- Which question framings actually land with users?
- Does the shuffle mechanic feel like autonomy or like randomness?
- Is one question per screen the right density, or too sparse?
- How does the user signal they're done investigating a word?
- Can/should a user investigate more than one word per session?

### Not Playtest Territory Yet
- Longitudinal data visualization
- Cross-session pattern surfacing
- Therapy export format
- Voice input as alternative to typing

---

## The Missing Self — Core Therapeutic Insight

The core pattern Whelm addresses: users forget to include themselves in their own story. All the external stuff — other people's feelings, relational management, scanning for what they did wrong — crowds out their own experience.

The most therapeutic thing the app can do is help someone notice that they are missing from the narrative they're telling. Not through teaching. Through the structure of the experience:
- **The brain dump** captures everything outward
- **The word portrait** reflects back the tone
- **The investigation** surfaces the question: where are you in this?

### Simplification as Valid Reframe Destination

Sometimes the destination of the word work isn't a reframe — it's a radical reduction. The reframed version of a complex spiral might not be more nuanced language. It might be devastatingly simple: "My feelings are hurt."

The reframe step should allow for simplification, not just substitution. The most powerful reframe might use fewer, smaller words.

### Cognitive Sophistication as Defense

The target user weaponizes therapeutic literacy. They use terms like "hypervigilance," "co-regulation," and "trauma response" with precision — but that precision keeps them above the feeling, not in it.

When the brain dump contains a high density of clinical vocabulary, that itself may be a pattern worth surfacing. Not as pathology, but as an invitation: "You used a lot of clinical language — what's underneath?"

This connects to Category 8 (Echoed & Borrowed Language) in the WORD_PARSING_RULESET.md, but extends it. It's not just individual echoed words — it's the *density* of clinical framing as a structural pattern.

---

## Principles That Emerged or Were Reinforced

1. **The interaction IS the therapy** — approachable questions that naturally surface deep material, rather than directly asking for depth
2. **Mirror, not interpreter** — accumulate and reflect, never assert meaning
3. **The brain dump is a living container** — users can return to add more, drafts are preserved
4. **Guided flow teaches standalone tools** — the architecture supports both first-time guidance and returning self-directed use
5. **Depth emerges through relationship** — investigation questions deepen over sessions, not within a single session
6. **Passive → active transition** — pills exist during typing but become interactive only when the user shifts to witnessing
7. **The void contract is sacred** — no surprises about what's kept, what's gone, and who can see it
8. **Approachable > profound** — questions that feel logistical and answerable produce more therapeutic value than questions that demand emotional excavation

---

## Relationship to Existing Documents

This brainstorm builds on and refines:
- **Whelm_Updated_Framework_3_24_26.docx** — the brain dump → word portrait → investigation sequence
- **WORD_PARSING_RULESET.md** — the 14 signal categories for word extraction
- **ETHICAL_FRAMEWORK.md** — mirror not interpreter, user agency, void contract
- **DECISION_LOG.md** — adds new decisions about pill interactivity, constellation vs ladder, guided→standalone architecture

This document does NOT replace any existing documents. It captures emerging thinking that should inform prototype development and future updates to the framework.

---

*This is a living document. Principles are stable. Specific phrasings and interactions are emerging through build and testing.*
