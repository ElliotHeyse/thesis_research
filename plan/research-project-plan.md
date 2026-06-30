# Research Project Plan

**Thesis:** _AI-driven code migration in practice: from legacy PHP to modern web frameworks_

**To what extent is AI-assisted code migration a valid and qualitatively sound approach for modernizing legacy web applications, and what are the implications for the role of the developer and the IT organization?**

---

## How to read this document

This is a _research project plan_, not a calendar. It is organized around the **logic of the research**: what you are trying to establish, what decisions need making (and when), what each phase depends on, and what could go wrong. It serves two audiences at once — it is detailed enough to show your supervisor for approval, and concrete enough to execute from.

The research runs roughly one week, followed by ~three weeks of interviews and writing. This plan covers the research portion and hands off cleanly to the interview/writing phase.

---

## 1. Research design at a glance

### 1.1 What kind of study this is

This is a **controlled, exploratory case study with a comparative experimental core**. A single legacy codebase (your fall-2025 PHP project) acts as a _fixed research object_. You hold the codebase, the AI tool, and the engineer constant, and you vary **two things**: the **target stack** (Next.js vs. Blazor) and the **developer-agent interaction methodology** (three defined approaches differing in _planning authority_). The migrations are the experiment; the evaluation across four dimensions is the measurement; the stakeholder interviews are the valorization layer that tests your findings against professional reality.

It is not a statistically generalizable study (n=1 codebase, 1 engineer). Its validity comes instead from **methodological transparency** — every decision, prompt, and intervention is logged, so the findings are traceable and the reasoning is reproducible. State this openly; it is a strength, not a weakness, for a bachelor's thesis.

### 1.2 The fixed and varied elements

| Element                     | Status                              | Value                                                                        |
| --------------------------- | ----------------------------------- | ---------------------------------------------------------------------------- |
| Legacy codebase             | **Fixed** (control)                 | Your vanilla PHP + MySQL/Postgres app (<2k lines)                            |
| AI tool                     | **Fixed**                           | Cursor (whole-repo context)                                                  |
| Engineer                    | **Fixed**                           | You                                                                          |
| Execution mode              | **Fixed**                           | Agent mode performs all code creation/modification (see §3.1)                |
| Output type                 | **Fixed**                           | Full-stack (frontend + backend + DB)                                         |
| **Target stack**            | **Varied** (independent variable 1) | A: Next.js · B: Blazor (.NET)                                                |
| **Interaction methodology** | **Varied** (independent variable 2) | M1–M3 — planning authority (see §3)                                          |
| **Remediation state**       | **Varied** (independent variable 3) | R0 (raw AI output) · R1 (after a fixed-protocol remediation loop) — see §3.4 |

This is a **2 × 3 factorial design** (2 stacks × 3 methodologies = **6 full migrations**), with each migration measured at **two states**: **R0** (raw, untouched AI output) and **R1** (the same migration after a consistent, methodology-applied remediation loop). The R0→R1 _delta_ is itself a primary finding (§3.4). Every cell is directly comparable to every other along one axis at a time.

### 1.3 The four evaluation dimensions, in priority order

Your thesis argument leads with **completeness**, so the dimensions are weighted accordingly. This ordering should shape how much measurement effort each receives.

1. **Completeness** _(primary)_ — what the AI migrates without human intervention, and what consistently requires a human. This is the spine of the thesis: it directly feeds the "role of the developer" question, and it is the dimension most sensitive to methodology (the whole point of M1–M3 is to change _how planning is done and by whom_).
2. **Correctness** — functional equivalence to the legacy app, via automated + manual testing.
3. **Code quality & security** — readability, maintainability, OWASP-class issues.
4. **Efficiency** — your time as solution engineer vs. an estimate of classical refactoring.
5. **Human/organizational implications** — _not_ measured in the research phase; this emerges from interpreting 1–4 and is tested in the interviews.

> **Design implication:** because completeness leads, your instrumentation must capture _every_ point of human intervention with enough context to categorize it later. A simple pass/fail is not enough — you need a typology of interventions (Decision 2.4). The methodology axis (M1–M3) is precisely an experiment in _where planning authority sits_ — from none (M1), to agent-led (M2), to human-directed (M3).

---

## 2. Foundational decisions (make these before any code is touched)

These are decisions that, once made, everything else depends on. Lock them early and document the reasoning — the _justification_ is assessable thesis content, not overhead.

### Decision 2.1 — Scope freeze of the legacy app _(RESOLVED)_

**Question:** Which features of the PHP app are _in scope_ for migration?  
**Why it matters:** With a small codebase you can likely migrate everything, but you must decide explicitly. Any feature you exclude must be excluded from _all 6 migrations_ to keep every comparison fair.  
**Decide by:** end of Phase 1.

> **Answer:** Everything except for composer testing (functional for the end-user).

### Decision 2.2 — Target Frameworks _(RESOLVED)_

**Resolved:** Framework A is **Next.js**, framework B is **Blazor (.NET)**. Rationale retained in §4: it creates a popular-vs-less-popular and JS-vs-.NET contrast, and you can evaluate C# output credibly. The model-familiarity confound this introduces is carried as a named limitation throughout (§5.4).

### Decision 2.3 — Definition of "functional equivalence" _(RESOLVED)_

**Question:** What does it mean for a migrated app to be "correct"?  
**Why it matters:** This definition determines what your tests assert. It must be defined once and applied identically to all 6 migrations.  
**Decide by:** Phase 2, before writing any tests.

> **Answer:** For every in-scope feature, given identical inputs and database state, the migrated app produces functionally equivalent observable output and side-effects (DB writes, redirects, error states) as the legacy app. Code quality is also considered using SonarQube.

### Decision 2.4 — Issue documentation _(RESOLVED)_

**Question:** How will you record the issues found in raw AI output and the interventions made during remediation?

**Why this changed.** An earlier version of this decision defined an eight-category _typology of interventions_. That instrument solved a problem this design no longer has. It was written when the _form of human intervention_ was the variable to be characterized. The R1 workflow has since fixed intervention form on the methodology axis (§3.4): in any cell, the intervention simply _is_ "re-apply that cell's methodology." The human action is therefore a constant defined by the cell, not a variable to classify — so a formal intervention typology has lost its job.

**What remains worth recording** is the _issues themselves_ — what the raw output got wrong or omitted, and (in remediation) what you handed back. Given a <2k-line app across six cells, the volume is a handful of issues per cell, not the hundreds at which categorization earns its keep. Forcing few issues into many buckets produces empty cells and n=1 counts, not insight. And premature tagging is lossy: a free-text description ("agent reimplemented the `-1`→NULL sentinel as a literal -1 write") preserves more than a category label ever could.

> **Answer:**
>
> - **Document issues as free text**, one entry per issue, written during execution (capture, not interpretation — §6).
> - **Anchor every issue to the affected feature/area** using the Phase 1 feature IDs. This is the one constraint that matters: the same app breaks in different cells, so a consistent anchor lets "the same issue recurring across cells" be recognized without any taxonomy. This is what preserves your _primary_ finding — cross-methodology and cross-stack patterns in what AI handles alone (e.g. "M1 cells dropped the side-effect-on-read; M3 caught it in planning") — which needs comparability by _what broke_, not by _how it was categorized_.
> - **Formal categorization is optional and post-hoc.** If, in Phase 4, a kind of failure recurs across cells, categorize _then_ — bottom-up from observed data, which is more defensible than a scheme guessed in advance. The free-text descriptions survive, so nothing is lost by deferring.
> - **M3's identified issues** (where directed remediation has you diagnose more deeply) get the same treatment — documented, feature-anchored, untaxonomized. These are your richest free-text material, since they capture judgment the other methodologies didn't exercise, so favor descriptive detail there.

**Decide by:** Phase 2 (confirm the feature-ID anchor and the free-text log field exist in the logging template).

### Decision 2.5 — Correction handling: the R0/R1 remediation axis _(RESOLVED)_

**Question (original):** When AI output has errors, do you fix manually or with the agent?  
**Resolution:** The correction step is not a property of one methodology — it is a **third axis measured on every cell**. Each of the 6 migrations is evaluated at two states:

- **R0 — raw AI output.** The migration exactly as the agent produced it under its methodology, _before any human correction_. This is the clean experimental floor: what the agent achieved under that methodology. R0 is fully measured and **snapshotted (git-tagged) before anything is touched**.
- **R1 — remediated output.** The same migration after a remediation loop in which **the cell's own methodology is re-applied to the faults** (see §3.4): you surface shortcomings, hand them back through the same planning stance the methodology defines, and log iterations and time.

**Why this is better than the original either/or:** R0 and R1 stop competing over what a methodology "means." You get the clean floor (R0) _and_ the realistic iterative workflow (R1) from the same migrations, without adding cells. The **R0→R1 delta** becomes a primary finding (§3.4): it quantifies what the remediation loop adds on top of raw generation, and — compared across methodologies — tests whether more directed planning reduces how much remediation is needed.

**The remediation stopping rule:** remediate until the **correctness suite passes (functional equivalence reached)**, subject to a **hard iteration cap of N = 4 agent rounds**. Record, per cell: whether the target was reached, and how many iterations it took. Cells that hit the cap _without_ reaching green are not failures of the method — they are a completeness finding ("this could not be remediated to equivalence within reason"). This combined rule keeps R1 meaningful while protecting the schedule from a single stubborn cell.

> See §5.7 for the SonarQube double-counting caveat this introduces, and §8 for the R1 reduction path if time runs short.

### Decision 2.6 — Migration ordering strategy _(RESOLVED — see §6)_

**Question:** In what order do you run the 6 migrations?  
**Why it matters:** With one engineer and 6 sequential migrations, **learning effects are your single largest confound** — by the last migration you know the legacy app's quirks far better than at the first. Naïve ordering (all Next.js first, or all M1 first) would _confound methodology with practice_. The order must be designed to spread learning across the design, not concentrate it.  
**Decide by:** Phase 2, before the first migration. Full treatment in §6.

> **Answer:** Order decided in §6.

---

## 3. The methodology axis: planning authority (M1–M3)

This is the heart of what makes your study more than a framework bake-off. You are studying **where planning authority sits in the human-agent interaction, and how that changes migration outcomes** — which is exactly the "role of the developer" question, made empirical.

### 3.1 Execution mode is constant; only planning varies

**All code creation and modification happens in agent mode, in every methodology.** Plan mode (where used) is purely a _precursor_ that produces a guideplan; when you choose to execute, Cursor switches to agent mode to carry the plan out. The net result is the same kind of object in all three methodologies: **a single migration attempt in R0**, differing only in _how much planning preceded the identical execution_. This dissolves any "agent-mode vs. plan-mode" confound — the modes are not an independent variable, they are the mechanism by which planning does or doesn't happen. State this explicitly in the methodology chapter; it pre-empts the obvious examiner objection.

### 3.2 The planning-authority ladder

The three methodologies form a ladder of _where planning authority sits_: absent, then agent-led, then human-directed.

|        | Methodology             | Planning authority | What the human does                                     |
| ------ | ----------------------- | ------------------ | ------------------------------------------------------- |
| **M1** | **No planning**         | None               | Issues a single one-shot prompt; no planning step       |
| **M2** | **Autonomous planning** | Agent-led          | Issues a single prompt in plan mode; agent plans freely |
| **M3** | **Directed planning**   | Human-directed     | Issues a single prompt instructing _how_ to plan        |

### 3.3 What each methodology means operationally

Each must be defined precisely enough that someone else could replicate it. **Freeze the three prompts verbatim in Phase 2**; the contrast between methodologies lives almost entirely in that wording, so each prompt is a methodology artifact (appendix).

- **M1 — No planning.** A single, well-formed one-shot prompt instructing Cursor (agent mode) to migrate the whole in-scope app to the target stack, full-stack. No planning step, no structural guidance. This is the floor: the agent's raw one-shot capability.

- **M2 — Autonomous planning.** A single prompt issued in **plan mode**, of similar (ideally identical) complexity and wording to M1's, letting the agent build a complete migration plan _however it judges best_. The plan is **documented as an attachment to the conversation**, then executed (agent mode). The defining trait: the agent owns the planning approach. _Critical:_ M2's prompt must **not** hint at _how_ to plan, or it collapses toward M3. It is approach-neutral by design.

- **M3 — Directed planning.** A single prompt instructing the agent to plan in a **specified way**, then build the plan accordingly and execute it. The fixed approach (frozen in Phase 2): **discover the application's features first** (the agent identifies features _itself_ — it is **not** given the Phase 1 feature inventory, which is held back as a control), **then plan the build along a layer-based structure** (data layer → business logic → routes/API → views) that covers exactly those discovered features. This ensures all and only the code needed for the features is in place, organized by layer. The defining trait: the human dictates the planning approach.

> **Per-stack expression of M3's approach.** The planning _approach_ (discover features → structure by layer) is identical for both stacks. Only stack-specific _vocabulary_ may differ (e.g. "API routes" for Next.js vs. the Blazor equivalent). Terminology drift is fine and expected; **approach drift between stacks is a confound and must be heavily motivated if it occurs.** State this distinction in Phase 2.

> **Scope note for the writeup.** Because execution is uniformly agent-mode and each methodology is a single migration attempt, the methodology axis tests _how planning authority is allocated before/around a single execution_, not _how a human supervises an iterative build_. The "directed planning" role in M3 is the developer specifying an approach and handing it off, not walking the build. State this so the methodologies aren't over-claimed as full workflow archetypes.

### 3.4 The remediation axis: R0 (raw) vs. R1 (remediated)

Every one of the 6 migrations is measured at **two states**, turning the correction step from a confound into a third independent variable (Decision 2.5).

**R0 — raw AI output.** The migration exactly as produced by the agent under its methodology, before any human touches it. This is the experimental floor: the agent's capability for that stack × methodology. You **measure R0 fully and snapshot it (git tag) before remediation begins** — once you remediate, R0 is gone for that cell and cannot be reconstructed. _This snapshot discipline is the single most important rule in the design._

**R1 — remediated output.** The same migration after a remediation loop in which **the cell's own methodology is re-applied to each round of faults**, iterating under the stopping rule (suite-green, hard cap N = 4). Re-applying the methodology keeps the methodology axis coherent into remediation:

- **M1 / R1** — surface the broken features and their behavior, hand them to the agent one-shot to fix (no planning), mirroring M1's stance.
- **M2 / R1** — describe the faults ("features x, y, z fail with behavior …; fix this") and let the agent plan the fix autonomously in plan mode, mirroring M2.
- **M3 / R1** — you look more closely at what is going wrong and **inject directed guidance where you can**, mirroring M3's human-directed planning. The difference from M2/R1 is narrow but consistent with each methodology's defining trait. _Log when you could direct and when you couldn't_, so M3/R1 intensity doesn't silently drift with how well you happen to understand each fault.

**The R0→R1 delta is a primary finding.** It quantifies _what the remediation loop adds on top of raw generation_. Read across the axes:

- _Per cell:_ how far did raw output get, and how much did remediation recover? (e.g. "R0 = 60% features equivalent; R1 = 95% after 3 rounds")
- _Across methodologies:_ does more directed planning shrink the delta? If M3's R0→R1 delta is small and M1's is large, that is direct evidence that planning front-loads the work the remediation loop would otherwise do — a clean argument for the "planner/director" developer role over the "reactive fixer" role.
- _Across stacks:_ is Blazor's raw output rougher (larger delta) than Next.js's — and is that a framework effect or a model-familiarity effect (§5.4)?

**Layered scope (see §8):** R0 on all 6 cells is the _mandatory floor_ of the study — a complete thesis on its own. R1 is the _stretch layer_, with its own reduction path if time runs short.

### 3.5 Cold start — nothing shared between cells

Nothing is shared between the 6 migrations — each starts completely cold. Every cell is independent, so no cell's outcome contaminates another. In M2 and M3 the plan is regenerated from scratch every time, never written once and reused. This has an upside: the _plan-production step itself becomes part of what you measure_ — how good a plan the agent produces for Next.js vs. Blazor, and (M3) whether feature-discovery surfaced all in-scope features.

---

## 4. Framework choices (retained rationale)

Next.js and Blazor are confirmed. The reasoning, for your methodology chapter:

- **Meaningful contrast.** Next.js (JS/React, very high model familiarity) vs. Blazor (.NET/C#, lower model familiarity) creates a _popular-vs-less-popular_ and _ecosystem-vs-ecosystem_ contrast that a second JS framework wouldn't.
- **You can evaluate it.** You're comfortable in TypeScript and C#/.NET, so you can judge output quality credibly.
- **It probes a real industry concern.** "Can we trust AI migration for our less-mainstream stack?" is exactly what an IT organization weighing adoption asks.

**The confound to name honestly (§5.4):** any quality or completeness gap between the stacks could stem from (a) the framework's intrinsic fit for this app, or (b) the model's familiarity with the framework. With n=1 you cannot fully separate these — so you report both as competing explanations rather than claiming one. Naming this is methodological maturity, not weakness.

---

## 5. Cross-cutting concerns (apply across all phases and all 6 migrations)

### 5.1 Logging discipline

Everything traceable: prompts, generated plans, outputs, interventions (typed per Decision 2.4), time, surprises. These logs are your dataset and your appendices. With 6 migrations, **consistent logging structure across cells is what makes the matrix analyzable** — design one template and use it six times.

### 5.2 The legacy app is a control — protect it

The PHP app on its frozen branch never changes. It is the single source of truth for correctness across all 6 migrations. Any drift invalidates every comparison.

### 5.3 Process consistency within a methodology, across stacks

For a given methodology, the _process_ must be identical between Next.js and Blazor — only the stack (and, for M3, stack-specific terminology) differs. The remediation loop (R0→R1) must likewise follow the same protocol and stopping rule in every cell. If you refine your technique mid-study, log it as a deviation; it's a confound you must report.

### 5.4 The model-familiarity confound (Blazor)

Carry §4's caveat through every stack comparison. Whenever you report a Next.js-vs-Blazor gap, ask: framework fit, or model familiarity? Report both.

### 5.5 Learning effects across the 6 runs

The dominant threat to this design (one engineer, six sequential migrations — and, for R1, six remediation loops). Mitigated by ordering (§6) and by logging — but also acknowledged as a limitation. You will get faster and sharper; the ordering strategy spreads that improvement so it doesn't masquerade as a methodology or stack effect. The remediation stopping rule (fixed target + cap N = 4) further guards R1 against drift, since "remediate until green, capped at N" is mechanical rather than dependent on how much effort you feel like spending on a given day.

### 5.6 Efficiency measurement caveat

Your "AI time" is logged and real. Your "classical refactoring time" is an _estimate_ (you won't hand-refactor). This is the softest dimension; consider grounding the estimate via an interviewee's expert judgment rather than guessing alone. Note also that efficiency has a richer story across two dimensions: planning effort lands differently across M1→M2→M3 (the methodology axis), and R1 adds remediation cost on top of R0 (the remediation axis). _Total_ time, _where_ time is spent, and _how much remediation each cell needed_ all matter.

### 5.7 SonarQube double-counting between detection and quality measurement

SonarQube plays two roles, and they must not contaminate each other: a **fault-detector** that can drive the R1 remediation loop, _and_ a source of **code-quality metrics**. The problem: if SonarQube findings drive what you fix in R1, then "SonarQube issues remaining" is a clean quality metric at **R0** but a circular one at **R1** — of course R1 scores well, you optimized directly against it.

**Decision pending (resolve before R1).** Two viable approaches:

- Use SonarQube as the R0 quality measurement and the R1 fault-detector, but measure **R1 quality outcome** with a lens SonarQube did _not_ drive (readability/maintainability judgement, test-based correctness, or a held-back subset of SonarQube rules used for R1 scoring only).
- **Simpler alternative:** delay SonarQube entirely until all R0 and R1 workflows are complete, so it never drives remediation and is purely an after-the-fact quality measurement on both states.

State whichever you choose in the methodology.

---

## 6. The ordering strategy (counter to learning effects)

**The protocol splits the timeline cleanly:** you generate **all 6 R0 migrations first**, evaluating nothing, then run the R1 remediation loops, and only then evaluate. This ordering of the _work_ has one genuine benefit and one tempting-but-false implication. Both need stating.

**What deferring evaluation correctly removes.** Because you never look at a test result or a SonarQube report until everything is done, _measurement cannot leak between cells_ — you can't unconsciously let cell 3's results shape how you approach cell 4, because you haven't seen them. This is a real simplification and worth claiming in the methodology.

**What it does _not_ remove — the trap.** "I'm not evaluating, so order doesn't matter for R0" conflates _not measuring_ with _not learning_. You don't need to see a single metric to get better at the task — the learning is in the _doing_:

- After migrating the legacy app once, you understand its quirks (the GET-form mutations, the side-effect-on-read, the procedural-PHP constructs that resist mapping). You carry that into every later migration regardless of evaluation.
- You grow fluent in the target stack's migration patterns — by the third Next.js run you know how the agent scaffolds, what it forgets, how to phrase the methodology's prompts.
- You get better at _operating each methodology_ (writing the M3 directed-planning prompt, judging M2's autonomous plans).

So **R0 generation is still fully subject to learning effects**, and the order of the R0 runs still matters. Worse: doing all R0 first _concentrates_ the risk if you batch naïvely. If you generate R0 grouped by methodology (all M1, then all M2, then all M3), then by the time you reach M3 you've done four migrations' worth of practice — M3's raw output looks better, and you'd wrongly credit "directed planning" for what is really accumulated skill. The methodology axis is your core contribution and the one you most need clean; naïve R0 batching is exactly how you'd contaminate it.

**Principle:** the counterbalanced order applies specifically to the **R0 generation sequence**, because that is where the learning lives. Distribute practice as evenly as possible across both the stack and methodology axes, so neither stack nor any methodology is systematically advantaged by running late.

**Recommended R0 generation order — interleave and counterbalance:**

- Alternate stacks every run (never two of the same stack back-to-back).
- Avoid monotonic ladder order for methodologies (don't run M1→M2→M3 cleanly, or late methodologies inherit all your practice).
- A workable sequence (one of several valid ones):

| R0 run | Stack   | Methodology |
| ------ | ------- | ----------- |
| 1      | Next.js | M1          |
| 2      | Blazor  | M2          |
| 3      | Next.js | M3          |
| 4      | Blazor  | M1          |
| 5      | Next.js | M2          |
| 6      | Blazor  | M3          |

Each stack appears 3×; each methodology appears 2× (once per stack); stacks alternate every run; no methodology clusters at the start or end (M1 at runs 1&4, M2 at 2&5, M3 at 3&6 — each methodology has one early and one late run, balancing practice). **Document whatever order you choose and why** — examiners look for exactly this kind of confound-awareness.

> **The pilot cell is run 1, not a separate pre-run.** Phase 3A opens with a pilot dry-run to verify the instrumentation rig (see Phase 3, Step 0). That pilot _is_ run 1 of this order (Next.js M1) — so the practice it generates is already accounted for in the counterbalancing. Don't run a throwaway migration _before_ run 1, or you'd inject one cell of un-counterbalanced learning. If the pilot forces an instrumentation change, you re-run run 1's _capture_ under the fixed rig, but it stays run 1 in the sequence.

**R1 inherits this order and needs no separate counterbalancing.** Run the remediation loops in the same cell sequence (or any fixed, documented order). R1 isn't where the steep across-the-app learning curve lives — by then you've plateaued on understanding the legacy app — so a single fixed order is enough; you just avoid introducing a _second_, uncontrolled sequence. This clean R0-then-R1 split also serves §8: you complete the entire mandatory floor (6× R0) before spending a minute on the stretch layer.

> **Alternative if 6 is too many (see §8 feasibility):** if you must cut, drop to a 2×2 core (M1 + M3 — the floor and ceiling of the planning ladder) × 2 stacks = 4 migrations. This preserves the most informative contrast (no planning vs. directed planning) on both stacks. M2 becomes "if time allows." This is the cleanest reduction because M1 and M3 bound the ladder.

---

## 7. Phase structure

Phases are sequenced by **dependency**, not fixed dates. Each lists its entry condition (what must be true to start) and exit condition (what must be true to move on).

### Phase 1 — Establish the research object

**Purpose:** Turn your PHP app from "code you know" into "a documented, measurable control."  
**Entry condition:** Repo set up; legacy code frozen on an untouchable branch.  
**Key activities:**

- Produce a **feature inventory**: every in-scope feature, files involved, complexity rating. Doubles as migration checklist _and_ completeness scorecard. _Held back from the agent_ — in M3 the agent must discover features itself, so the inventory is a control, not an input.
- Document the **data model**: schema export, relationships, representative seed data for testing.
- Record **PHP-specific constructs** likely to resist migration (GET-form mutations, side-effect-on-read, the `-1`→NULL sentinel, dynamic CASE SQL). These are your _predictions_ of where AI will struggle — comparing prediction vs. reality later is strong analytical material, and may differ by methodology (does directed planning overcome what one-shot couldn't?).

**Exit condition:** Scope frozen (Decision 2.1); feature inventory complete; representative test data prepared.  
**Note:** Lighter than usual since you know the code — but the inventory's quality caps your completeness measurement's quality. Don't skip it.

### Phase 2 — Define instruments, methodologies, and order

**Purpose:** Decide _how_ you measure, _what_ each methodology is, and _in what order_ you run — all before any result can bias you.  
**Entry condition:** Phase 1 complete.  
**Key activities:**

- Finalize Decisions 2.3, 2.4, 2.5, 2.6.
- **Freeze the three methodology prompts verbatim** (§3.3) so all 6 runs are replicable. Ensure M2's prompt is approach-neutral and ≈ M1's; ensure M3's prompt specifies feature-discovery-then-layer and names any per-stack terminology.
- Define the **correctness test suite**: which features get automated coverage, which get manual testing. Build it against the **legacy PHP app and get it green** before any migration exists — this proves the tests are valid independently of any migration. (Automated via HTTP-client content assertions against a fixed SQL seed for PHP and Next.js; identical assertions walked manually for Blazor — see the testing plan.)
- Configure **code-quality instrumentation** that analyzes _both_ JS/TS and C#. **Decide SonarQube's role/timing** (§5.7).
- Confirm the **remediation stopping rule** (Decision 2.5): cap N = 4, target suite-green.
- Lock the **logging template** (used identically for all 6 runs, capturing both R0 and R1) and **time-tracking categories**.
- **Fix the R0 generation order** (§6).

**Exit condition:** Tests green against legacy; quality tooling runs on a sample of both stacks; M1–M3 prompts frozen; logging template ready; R0 generation order fixed; Decisions 2.3–2.6 recorded.  
**Risk flag:** This phase is the most likely to be under-budgeted. Freezing the three prompts precisely and getting the test rig green on legacy are the real work. Do not let eagerness to start migrating compress it — six inconsistent migrations are worth less than four consistent ones.

### Phase 3 — Execute the migration matrix

**Purpose:** Generate and remediate all migrations, fully logged, with evaluation deferred to Phase 4.  
**Entry condition:** Phase 2 complete; tests green against legacy; R0 order fixed; stopping rule (N = 4) set.

The phase runs in two passes — **all R0 generation, then all R1 remediation** — so the mandatory floor (§8) is fully banked before any stretch work, and so measurement never leaks between cells (§6).

> **A note on "measure" vs. "evaluate."** During execution you _capture raw instrumentation_ — test pass/fail counts, SonarQube output (if not deferred), timing, an intervention tally. You do **not** interpret it, compare cells, or draw conclusions; that is Phase 4, deliberately held until all generation is done so results from early cells can't shape how you run later ones. Capture is mechanical; evaluation is deferred.

**Pass 3A — R0 generation (all 6 cells, in the §6 counterbalanced order):**

> **Step 0 — Pilot cell (verify the rig, not the result).** Before committing to all six blind, run the _first_ cell in your order (Next.js M1) all the way through steps 1–7 as a dry run, then **stop and inspect the instrumentation, not the findings.** Did the correctness suite execute and produce a usable pass/fail breakdown? Did SonarQube scan the generated stack and emit parseable output? Does the logging template capture what you need? Is the timing data sane? This is _not_ evaluation in the confound sense — you're validating the apparatus, not interpreting quality or comparing anything. If the rig is broken, fixing it now costs one cell; discovering it after six costs the study. If you change the instrumentation as a result, the pilot cell's R0 capture is invalid — **re-run it** under the fixed rig so all six cells are measured identically. It remains run 1 in the sequence.

1. Start cold (nothing carried from prior runs — §3.5).
2. Apply the methodology exactly as defined (M1 one-shot / M2 autonomous plan / M3 directed plan), using the frozen prompt.
3. Let the agent execute the single migration attempt (agent mode). For M2/M3, attach the generated plan to the conversation first.
4. Log **every** prompt, generated plan, and the agent's actions, with timing.
5. **Fix nothing.** When the AI errs, record it (typed per Decision 2.4) and leave it in place. ("Continue/finish" nudges that don't fix errors are allowed but logged — needing them is data about raw autonomy.)
6. **Capture R0 instrumentation** (don't interpret): run the correctness suite and store results, run/queue the SonarQube scan, record the raw intervention tally and timing.
7. **Snapshot R0:** commit and **git-tag** the raw state (e.g. `r0/nextjs-m1`). Immutable — once you remediate, R0 is unrecoverable.
8. Move to the next cell. Repeat for all 6 before touching R1.

**Pass 3B — R1 remediation (stretch layer; cell order inherited from 3A, §6):**

9. For each cell in scope (§8 decides how many): enter the remediation loop, **re-applying the cell's methodology to the faults** (§3.4 — M1 one-shot fix / M2 autonomous fix-plan / M3 directed fix). Detect shortcomings → document → hand back via the methodology → re-run the correctness suite. Iterate.
10. **Apply the stopping rule:** continue until the suite is green, capped at N = 4 rounds. Record whether the target was reached and how many rounds it took; log time per round. For M3, log when you could direct and when you couldn't.
11. **Capture R1 instrumentation:** re-run correctness and store, score quality per the §5.7 decision, record the updated intervention tally and cumulative time — capture only, no interpretation.
12. **Snapshot R1:** commit and git-tag (e.g. `r1/nextjs-m1`).

**Exit condition (floor):** R0 generated, instrumented, and tagged for all 6 cells.  
**Exit condition (target):** R1 captured for the cells the layered scope prioritizes (§8).  
**Note:** This is the bulk of the work. The §8 layered scope tells you what to cut if you fall behind — drop R1 breadth first, then whole cells; never rigor within a cell.

### Phase 4 — Comparative evaluation

**Purpose:** Convert six logged migrations (each at R0 and R1) into findings across the four dimensions and all three axes.  
**Entry condition:** All in-scope cells generated and remediated; raw instrumentation captured and snapshots tagged. This is the _first_ point at which you interpret results.  
**Key activities:**

- Build the **comparison matrix** (legacy baseline vs. each cell at R0 and R1), readable along all three axes:
  - _Down the methodology axis_ (holding stack fixed): does more directed planning improve completeness/correctness/quality — or just relocate the human effort earlier?
  - _Across the stack axis_ (holding methodology fixed): Next.js vs. Blazor, interpreted through the familiarity confound (§5.4).
  - _Across the remediation axis_ (R0→R1 delta): how much did the loop recover, and does the delta shrink as planning becomes more directed (§3.4)?
- For **completeness** (primary): tabulate interventions by category × feature × cell, at R0 and after R1. Headline questions: _Which code did AI handle alone (R0)? What did remediation recover (R1)? What survived even remediation? Did more directed planning shrink the un-migratable set, or move the intervention earlier into planning?_ For M3 specifically: _did agent feature-discovery surface all in-scope features, or miss some the held-back inventory contains?_
- Read **efficiency** across both relevant axes: methodology (where planning effort lands across M1→M2→M3) and remediation (R0 generation cost vs. added R1 cost per cell).
- Synthesize what the dimensions _together_ say about validity and quality.
- Draft a **provisional answer** to the research question's first half and a **first-draft decision framework** for practitioners (valorization deliverable) — able to give _methodology-specific_ guidance.

**Exit condition:** Comparison matrix complete; completeness typology populated across cells; provisional findings written; interview inputs prepared.

### Phase 5 — Bridge to interviews

**Purpose:** Turn findings into instruments for the stakeholder phase.  
**Entry condition:** Provisional findings exist.  
**Key activities:**

- Convert striking findings into **interview probes** confronting practitioners with your results (e.g. "Directed planning cut un-migratable features by X% on the .NET stack — does that match how your team works with AI tools?").
- Confirm interview leads and schedule (start _early_, in parallel — see §9).

**Exit condition:** Interview guide ready; interviews scheduled. Research phase closes; writing/interview phase begins.

---

## 8. Feasibility and the reduction path

**Be realistic:** 6 full-stack migrations is ambitious for one person in ~one week; _remediating_ all 6 to green (R1) on top is plausibly more total work than generating them, especially the rougher Blazor cells. The design is therefore **layered** so you can stop at any layer and still have a complete, defensible thesis.

**The layered scope (each layer is a complete, reportable result):**

1. **Floor — R0 on all 6 cells.** Six raw migrations, fully measured and tagged. _This is the mandatory minimum and a complete thesis on its own:_ it fully answers the methodology and stack axes for raw AI output. Protect this before attempting any R1.
2. **Target — R1 on M1 + M3 × both stacks (4 cells).** Adds the remediation axis where it carries the most argument: the R0→R1 delta on the floor and ceiling of the planning ladder. This is the principled R1 subset — not a random scramble.
3. **Ideal — R1 on all 6 cells.** Full three-axis design.

**Two independent reduction levers, pull in this order if time runs short:**

- _First, cut R1 breadth_ (drop from layer 3 → 2 → R0-only). Losing R1 costs you the remediation axis but keeps the whole raw-output study intact.
- _Then, if even R0 is at risk, cut cells_: drop to **M1 + M3 × both stacks** (preserves the strongest methodology contrast and the full stack contrast), then if needed to **all three methodologies on Next.js only + one M1 Blazor probe** (prioritizes the richer methodology axis over the stack axis).

**Rule for cutting:** remove **whole cells or whole layers**, never rigor within a cell. A smaller fully-instrumented design beats a larger sloppy one. Set explicit trigger points now (e.g. _"if R0 for all 6 isn't done by mid-week, skip straight to R1 on M1+M3 only and don't attempt R1 elsewhere"_).

> Raise the layered scope with your supervisor up front, so a "R0-on-all-6, R1-on-four" result is pre-approved as success rather than received as a shortfall.

---

## 9. Dependencies that must start early

- **Interview recruitment.** You have 4 leads (floor of 2). Convert them into committed, scheduled interviewees _during_ the research phase. Scheduling professionals takes weeks — this is the most common cause of thesis slippage.
- **Supervisor sign-off on design.** Get §1–§6 approved before Phase 3 — especially the three frozen methodology prompts (§3.3), the R0/R1 remediation axis and its stopping rule (Decision 2.5, §3.4), and the ordering strategy (§6). Re-running migrations because the design was wrong is the costliest possible mistake, multiplied across six cells.
- **Tooling access.** Cursor, a quality scanner covering _both_ JS/TS and C#, and the HTTP test-client harness — all installed and smoke-tested before Phase 2 ends.

---

## 10. Deliverables produced by the research phase

| Deliverable                                                            | Feeds thesis section                |
| ---------------------------------------------------------------------- | ----------------------------------- |
| Scope statement + feature inventory (held back from agent)             | Methodology / research object       |
| Framework (Blazor) justification + familiarity-confound analysis       | Methodology                         |
| **M1–M3 frozen prompts + operational definitions**                     | **Methodology (core contribution)** |
| **R0/R1 protocol + remediation stopping rule**                         | **Methodology (core contribution)** |
| Functional-equivalence definition                                      | Methodology                         |
| Correctness test suite (legacy-validated)                              | Methodology / results               |
| **R0 generation-order rationale**                                      | Methodology (confound control)      |
| Per-cell logs: prompts, plans, typed interventions, R0+R1 (×6)         | **Results (primary) + appendix**    |
| Git-tagged R0 and R1 snapshots per cell                                | Reproducibility / appendix          |
| Generated migration plans (M2 autonomous, M3 directed) per cell        | Results / appendix                  |
| Completeness typology populated at R0 and R1 across cells              | **Results (primary)**               |
| Code-quality & security scans, R0 and R1 (×6)                          | Results                             |
| Time-tracking dataset, generation + remediation (×6)                   | Results (efficiency)                |
| Cross-dimensional comparison matrix (all three axes incl. R0→R1 delta) | Results / discussion                |
| Provisional answer to RQ part 1                                        | Discussion                          |
| First-draft, methodology-specific decision framework                   | Valorization                        |
| Interview guide grounded in findings                                   | Valorization / interview phase      |

---

## 11. Open questions to resolve with your supervisor

1. Is **n=1 codebase with a 2×3 instrumented matrix, each cell measured at R0 and R1**, accepted as sufficient depth?

   > Yes.

2. Is the **R0/R1 remediation axis** (Decision 2.5, §3.4) sound, and is the **stopping rule** (suite-green + cap N) the right choice — and is N = 4 appropriate?

   > Yes; N = 4.

3. Is the **ordering strategy** (§6) a satisfactory control for learning effects, and do they accept that it can't fully eliminate them at n=1?

   > Yes.

4. Is the **layered scope** (§8) pre-approved, so "R0 on all 6, R1 on M1+M3 ×2" counts as success if time forces it?

   > Yes.

5. Does the **completeness typology** (Decision 2.4) look sound, or do they want categories changed?

   > OK.

6. How should **SonarQube's role/timing** be handled (§5.7) so R1 quality isn't measured circularly?

   > Undecided, decide before R1.

7. How many **stakeholder interviews** constitute "enough" for the valorization chapter?

   > At least 2; 4 lined up.

8. Is the **M2 vs. M3 distinction** (autonomous vs. directed planning) sharp enough, and is M3's fixed approach (feature-discovery → layer-based, inventory held back as control) appropriately motivated?

   > To review with supervisor.
