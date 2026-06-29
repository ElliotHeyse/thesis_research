---
name: extract-phase
description: Extracts one research phase from plan/research-project-plan.md (section 7) into plan/phase{N}/phase{N}.md, splitting key activities into Instructions/Results subsections and preserving §/Decision citations without inlining referenced content. Use when the user asks to extract, generate, or write a phase file (phase1.md–phase5.md) from the research project plan.
disable-model-invocation: true
---

# Extract Phase

Write a single executable phase document from `plan/research-project-plan.md` §7 into `plan/phase{N}/phase{N}.md` (N = 1–5).

## Inputs

| Input          | Path                            |
| -------------- | ------------------------------- |
| Source plan    | `plan/research-project-plan.md` |
| Example output | `plan/phase1/phase1.md`         |
| Output target  | `plan/phase{N}/phase{N}.md`     |

Read the example (`plan/phase1/phase1.md`) before writing. Match its tone, structure, and level of self-containment.

## Workflow

1. **Confirm N** (1–5) if not given.
2. **Read** `plan/research-project-plan.md` — locate `## 7. Phase structure` and the `### Phase N — …` block (ends at the next `### Phase` or `---` before `## 8.`).
3. **Collect cross-references** cited anywhere in that phase block (entry/exit conditions, activities, notes, blockquotes, numbered steps):
   - `§N` or `§N.M` → heading `## N.` or `### N.M` in the source
   - `Decision N.M` → heading `### Decision N.M`
   - `Decisions N.M–N.P` → each decision in range
4. **Resolve references for writing** — read each cited block in the source so instructions are accurate. **Do not copy** referenced sections into the phase file; preserve citations (`§X.Y`, `Decision X.Y`) in instructions and phase-level text so the reader can look them up in `research-project-plan.md` when needed.
5. **Filter to required actions** — turn actionable items into activity subsections; keep contextual prose (purpose narrative, risk flags, “measure vs evaluate” notes) at phase level, not as activities.
6. **Write** `plan/phase{N}/phase{N}.md`. Create `plan/phase{N}/` if missing. Overwrite the file if it exists.

## Output structure

```markdown
# Phase N: [Title from source]

**Purpose:** … **Entry condition:** … **Exit condition:** …

[Optional phase-level context: risk flags, pass structure, blockquotes — verbatim or lightly trimmed from source. Not activity subsections.]

## Key activities:

### [Activity title]

**Instructions:** [Actionable instruction text. Preserve §/Decision citations from the source; fold in constraints that are already decided in the source (e.g. Decision 2.1 scope answers) when they directly govern the task.]

**Results:** ...

### [Next activity]

…
```

### Activity rules

- **One subsection per actionable item** — each bullet under “Key activities”, each numbered execution step, and each distinct pass sub-block (e.g. Pass 3A Step 0, steps 1–8, Pass 3B steps 9–12) that requires work.
- **Title** — short label from the bold lead term or step name (e.g. “Feature Inventory”, “Pilot cell”, “Freeze M1–M4 definitions”).
- **Instructions** — imperative and clear. Keep `§` and `Decision` references from the source; do **not** add `**Scoped context:**` blocks or a `## Scoped references` section. The executor opens `research-project-plan.md` for full detail when a citation is not self-explanatory.
- **Results** — always `**Results:** ...` (literal `...` placeholder for later manual fill-in).
- **Do not** invent tasks absent from the source. **Do** rephrase for clarity and merge duplicate bullets when the source repeats the same action.

### Phase-level vs activity-level

| Keep at phase level              | Promote to activity subsection                                     |
| -------------------------------- | ------------------------------------------------------------------ |
| Purpose, entry/exit              | Bulleted key activities                                            |
| Risk flags, notes                | Numbered execution steps                                           |
| “Measure vs evaluate” framing    | Pilot / pass headers when they gate work                           |
| Exit conditions (also in header) | Items that say “finalize”, “build”, “configure”, “lock”, “capture” |

## Cross-references

When the phase block cites `§X.Y` or `Decision X.Y`:

1. **Resolve** the citation to the matching heading in `research-project-plan.md` while writing (so instructions reflect the source accurately).
2. **Cite, do not copy** — leave the reference in **Instructions** or phase-level text (e.g. “per Decision 2.4”, “see §3.2”). Never paste the referenced block into the phase file.
3. **Subsection precision** — when reading the source, `§3.2` means `### 3.2 …` only, not all of §3. `§6` means `## 6. …` unless the phase cites a specific paragraph.

### Reference map (phase → commonly cited)

Use as a checklist while writing; still scan the phase block for any citation not listed here.

| Phase | Commonly cited                                    |
| ----- | ------------------------------------------------- |
| 1     | Decision 2.1 (scope freeze)                       |
| 2     | Decisions 2.3–2.6; §3.2; §5.7; §6                 |
| 3     | §3.3; §3.4 (R1 steps); §5.7; §6; §8; Decision 2.4 |
| 4     | §3.4; §5.4                                        |
| 5     | §9                                                |

## Conventions

- Normalize “your/you” to neutral wording where the example does (phase1 uses “the PHP app”, not “your PHP app”).
- Keep markdown formatting from the source (_italics_, `code`, tables) in phase-level context and instructions where it appears in §7.
- **Layout:** one directory per phase — `plan/phase1/phase1.md` … `plan/phase5/phase5.md` (no zero-padding in folder or file names).
- Do not modify `plan/research-project-plan.md` or `original-immutable/`.

## Verification

Before finishing:

- [ ] Header matches `# Phase N: [title]`
- [ ] Output written to `plan/phase{N}/phase{N}.md`
- [ ] Every actionable item from §7 for this phase has `###` + **Instructions** + **Results:** ...
- [ ] Every `§` / `Decision` citation from the phase block appears in the output (instructions or phase-level text), with **no** inlined scoped excerpts
- [ ] No `**Scoped context:**` blocks and no `## Scoped references` section
- [ ] Structure matches `plan/phase1/phase1.md`
