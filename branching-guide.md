# Branching Strategy: Void Prototype

## The Situation

You have two things that don't currently fit together:

1. **Main branch (beta):** The intro sequence ("overwhelm" → "whelm" animation), hub with four nodules, body scan, overwhelm-o-meter, breathing exercises — all in React.

2. **Void prototype:** A standalone HTML file testing the brain dump interaction — vanilla JS, no React, no build step. This is exploratory work that will eventually become Step 2 of the flow, but isn't ready to integrate yet.

These need separate branches because they have different tech stacks, different maturity levels, and different testing needs. Merging the prototype into the React app prematurely would create coupling before the interaction design is settled.

---

## Recommended Branch Structure

```
main
 │
 ├── beta                    ← Your current working branch (React app)
 │    └── (intro, hub, body scan, breathing)
 │
 └── prototype/void-rain     ← New branch for the brain dump prototype
      └── (standalone HTML, parsing engine, iteration)
```

### Why `prototype/void-rain` (not `testing` or `dev`)

Using a `prototype/` prefix does a few things: it signals that this is exploratory work with its own rules, it groups naturally if you later have `prototype/word-portrait` or `prototype/reframe-reveal`, and it avoids the ambiguity of a generic "testing" branch that could mean anything.

---

## How to Set It Up

### If your repo is on GitHub/GitLab

```bash
# Make sure you're up to date
cd your-whelm-repo
git fetch origin

# Create the prototype branch from main (not from beta)
# This keeps it clean — no React code, no beta-specific work
git checkout main
git checkout -b prototype/void-rain

# Create a folder for the prototype
mkdir -p prototype/void-rain

# Move/copy in your files
cp /path/to/void-rain-v9.html prototype/void-rain/void-rain.html
cp /path/to/CLAUDE.md prototype/void-rain/CLAUDE.md

# Copy in reference docs the prototype needs
mkdir -p prototype/void-rain/docs
cp docs/WORD_PARSING_RULESET.md prototype/void-rain/docs/
# (add other reference docs as needed)

# Commit and push
git add .
git commit -m "Initialize void rain prototype — brain dump step"
git push -u origin prototype/void-rain
```

### If you don't have a repo yet for this prototype

```bash
# Start fresh
mkdir whelm-void-prototype
cd whelm-void-prototype
git init

# Set up structure
mkdir -p docs

# Add your files
cp /path/to/void-rain-v9.html void-rain.html
cp /path/to/CLAUDE.md CLAUDE.md
cp /path/to/WORD_PARSING_RULESET.md docs/

# Initial commit on main
git add .
git commit -m "Initialize void rain prototype"

# Create the working branch
git checkout -b prototype/void-rain

# If connecting to GitHub:
# gh repo create whelm-void-prototype --private
# git push -u origin main
# git push -u origin prototype/void-rain
```

### If using a monorepo (prototype lives alongside the React app)

```bash
cd your-whelm-repo
git checkout main
git checkout -b prototype/void-rain

# Create a separate folder that doesn't interfere with the React app
mkdir -p prototypes/void-rain

# The React app lives in src/, components/, etc.
# The prototype lives in prototypes/void-rain/
# They don't touch each other

cp /path/to/void-rain-v9.html prototypes/void-rain/index.html
cp /path/to/CLAUDE.md prototypes/void-rain/CLAUDE.md

git add .
git commit -m "Add void rain prototype in isolated folder"
git push -u origin prototype/void-rain
```

---

## Working in Claude Code

Once the branch exists, open it in Claude Code:

```bash
# Navigate to the repo
cd your-whelm-repo

# Switch to the prototype branch
git checkout prototype/void-rain

# Start Claude Code
claude
```

Claude Code will automatically read the CLAUDE.md file in the working directory and use it as project context. That's why the CLAUDE.md is written the way it is — it gives Claude Code everything it needs about the prototype's architecture, constraints, and testing approach without requiring the full project documentation on every prompt.

### Tip: Scoped CLAUDE.md

If you're using a monorepo, you can put the CLAUDE.md inside `prototypes/void-rain/` and then `cd` into that directory before starting Claude Code. That way Claude Code picks up the prototype-specific instructions, not the main app's.

```bash
cd prototypes/void-rain
claude
```

---

## When to Merge Back

The void prototype should NOT merge into beta until:

1. **The interaction design is stable** — timing, auto-release behavior, pill pile layout feel right
2. **The parsing engine is tested** — run the test passages, check false positives/negatives
3. **It's been converted to React** — the standalone HTML needs to become React components that fit the existing architecture
4. **The transition design exists** — how does the user get FROM the body snapshot TO the brain dump? What's the entry animation?
5. **Exit paths are implemented** — the prototype currently has no visible skip/exit

The merge path would be:

```
prototype/void-rain → feature/void-integration → beta → main
```

Where `feature/void-integration` is where you do the React conversion and connect it to the existing flow.

---

## Branch Hygiene

A few practices that'll help:

**Commit messages that capture the "why":**
```bash
git commit -m "Expand parser: add Cat 6 compound metaphors (falling apart, dead inside)"
git commit -m "Fix freeze: debounce render via RAF, eliminate duplicate input handlers"
git commit -m "Adjust auto-release timing: 1.2s after punct (was 1s, felt too aggressive)"
```

**Tag stable versions before big changes:**
```bash
git tag v9-stable    # before major parser rewrite
git tag v10-timing   # after timing experiments
```

**Keep the prototype folder clean:**
```
prototypes/void-rain/
├── index.html           # The prototype (rename from void-rain-v9)
├── CLAUDE.md            # Claude Code instructions
├── docs/
│   └── WORD_PARSING_RULESET.md
└── test-passages.md     # Test phrases and expected results (optional)
```

No `node_modules`, no `package.json`, no build artifacts. The simplicity is the point.

---

## Summary

| Question | Answer |
|----------|--------|
| Branch name | `prototype/void-rain` |
| Branch from | `main` (not `beta`) |
| Folder location | `prototypes/void-rain/` (monorepo) or root (standalone repo) |
| CLAUDE.md location | Inside the prototype folder |
| When to merge | After interaction is stable + React conversion + exit paths |
| Merge target | `feature/void-integration` → `beta` → `main` |
