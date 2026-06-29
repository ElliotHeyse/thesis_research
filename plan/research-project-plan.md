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

This is a **controlled, exploratory case study with a comparative experimental core**. A single legacy codebase (your fall-2025 PHP project) acts as a _fixed research object_. You hold the codebase, the AI tool, and the engineer constant, and you vary **two things**: the **target stack** (Next.js vs. Blazor) and the **developer-agent interaction methodology** (four defined approaches). The migrations are the experiment; the evaluation across four dimensions is the measurement; the stakeholder interviews are the valorization layer that tests your findings against professional reality.

It is not a statistically generalizable study (n=1 codebase, 1 engineer). Its validity comes instead from **methodological transparency** — every decision, prompt, and intervention is logged, so the findings are traceable and the reasoning is reproducible. State this openly; it is a strength, not a weakness, for a bachelor's thesis.

### 1.2 The fixed and varied elements

| Element                     | Status                              | Value                                                                        |
| --------------------------- | ----------------------------------- | ---------------------------------------------------------------------------- |
| Legacy codebase             | **Fixed** (control)                 | Your vanilla PHP + MySQL/Postgres app (<2k lines)                            |
| AI tool                     | **Fixed**                           | Cursor (whole-repo context)                                                  |
| Engineer                    | **Fixed**                           | You                                                                          |
| Output type                 | **Fixed**                           | Full-stack (frontend + backend + DB)                                         |
| **Target stack**            | **Varied** (independent variable 1) | A: Next.js · B: Blazor (.NET)                                                |
| **Interaction methodology** | **Varied** (independent variable 2) | M1–M4 (see §3)                                                               |
| **Remediation state**       | **Varied** (independent variable 3) | R0 (raw AI output) · R1 (after a fixed-protocol remediation loop) — see §3.4 |

This is a **2 × 4 factorial design** (2 stacks × 4 methodologies = **8 full migrations**), with each migration measured at **two states**: **R0** (raw, untouched AI output) and **R1** (the same migration after a consistent, agent-directed remediation loop). The R0→R1 _delta_ is itself a primary finding (§3.4). Every cell is directly comparable to every other along one axis at a time.

### 1.3 The four evaluation dimensions, in priority order

Your thesis argument leads with **completeness**, so the dimensions are weighted accordingly. This ordering should shape how much measurement effort each receives.

1. **Completeness** _(primary)_ — what the AI migrates without human intervention, and what consistently requires a human. This is the spine of the thesis: it directly feeds the "role of the developer" question, and it is the dimension most sensitive to methodology (the whole point of M1–M4 is to change _how and when_ the human intervenes).
2. **Correctness** — functional equivalence to the legacy app, via automated + manual testing.
3. **Code quality & security** — readability, maintainability, OWASP-class issues.
4. **Efficiency** — your time as solution engineer vs. an estimate of classical refactoring.
5. **Human/organizational implications** — _not_ measured in the research phase; this emerges from interpreting 1–4 and is tested in the interviews.

> **Design implication:** because completeness leads, your instrumentation must capture _every_ point of human intervention with enough context to categorize it later. A simple pass/fail is not enough — you need a typology of interventions (Decision 2.4). The methodology axis (M1–M4) is precisely an experiment in _shifting where those interventions occur_ — from reactive fixing (M1) to upfront structuring (M4).

---

## 2. Foundational decisions (make these before any code is touched)

These are decisions that, once made, everything else depends on. Lock them early and document the reasoning — the _justification_ is assessable thesis content, not overhead.

### Decision 2.1 — Scope freeze of the legacy app _(RESOLVED)_

**Question:** Which features of the PHP app are _in scope_ for migration?  
**Why it matters:** With a small codebase you can likely migrate everything, but you must decide explicitly. Any feature you exclude must be excluded from _all 8 migrations_ to keep every comparison fair.  
**Decide by:** end of Phase 1.

> **Answer:** Everything except for composer testing (functional for the end-user).

### Decision 2.2 — Target Frameworks _(RESOLVED)_

**Resolved:** Framework A is **Next.js**, framework B is **Blazor (.NET)**. Rationale retained in §4: it creates a popular-vs-less-popular and JS-vs-.NET contrast, and you can evaluate C# output credibly. The model-familiarity confound this introduces is carried as a named limitation throughout (§5.4).

### Decision 2.3 — Definition of "functional equivalence"

**Question:** What does it mean for a migrated app to be "correct"?  
**Why it matters:** This definition determines what your automated tests assert. It must be defined once and applied identically to all 8 migrations.  
**Decide by:** Phase 2, before writing any tests.

> **Answer:** For every in-scope feature, given identical inputs and database state, the migrated app produces functionally equivalent observable output and side-effects (DB writes, redirects, error states) as the legacy app. Code quality is also considered using SonarQube.

### Decision 2.4 — The completeness typology

**Question:** What _categories_ of human intervention will you record?  
**Why it matters:** Your primary dimension is only as good as the classification scheme behind it. With the methodology axis, this typology does double duty: it characterizes _what_ AI couldn't do, and — compared across M1–M4 — _whether better methodology reduces or merely relocates_ the intervention.  
**Decide by:** Phase 2.

> **Answer:** Starter categories:
>
> - scaffolding gap
> - missing logic
> - incorrect logic
> - hallucinated API
> - security regression
> - framework-convention violation
> - integration/wiring fix
> - config/environment fix

### Decision 2.5 — Correction handling: the R0/R1 remediation axis _(RESOLVED)_

**Question (original):** In the baseline, when AI output has errors, do you fix manually or with the agent?  
**Resolution:** Neither framing was right — the correction step is not a property of M1, it is a **third axis measured on every cell**. Each of the 8 migrations is evaluated at two states:

- **R0 — raw AI output.** The migration exactly as the agent produced it under its methodology, _before any human correction_. This is the clean experimental floor: what the unaided agent achieved. R0 is fully measured and **snapshotted (git-tagged) before anything is touched**.
- **R1 — remediated output.** The same migration after a **consistent, agent-directed remediation loop**: you detect shortcomings (manual review + SonarQube), document them, direct Cursor's agent to fix them, and log iterations and time — applied identically in protocol to all cells.

**Why this is better than the original either/or:** R0 and R1 stop competing over what M1 "means." You get the clean floor (R0) _and_ the realistic human-as-QA-director workflow (R1) from the same migrations, without adding cells. The **R0→R1 delta** becomes a primary finding (§3.4): it quantifies what the human-directed loop adds on top of raw generation, and — compared across methodologies — tests whether upfront structuring (M4) reduces how much remediation is needed versus the baseline (M1).

**The remediation stopping rule (must be fixed before run 1):** remediate until the **correctness suite passes (functional equivalence reached)**, subject to a **hard iteration cap** (e.g. _N_ agent rounds — set N in Phase 2). Record, per cell: whether the target was reached, and how many iterations it took. Cells that hit the cap _without_ reaching green are not failures of the method — they are a completeness finding ("this could not be remediated to equivalence within reason"). This combined rule keeps R1 meaningful (equivalence achieved, or demonstrably not achievable) while protecting the schedule from a single stubborn cell.

**Decide by:** Phase 2 (set N). Flagged for supervisor sign-off.

> See §5.7 for the SonarQube double-counting caveat this introduces, and §8 for the R1 reduction path if time runs short.

### Decision 2.6 — Migration ordering strategy _(critical — see §6)_

**Question:** In what order do you run the 8 migrations?  
**Why it matters:** With one engineer and 8 sequential migrations, **learning effects are your single largest confound** — by migration #8 you know the legacy app's quirks far better than at #1. Naïve ordering (all Next.js first, or all M1 first) would _confound methodology with practice_. The order must be designed to spread learning across the design, not concentrate it.  
**Decide by:** Phase 2, before the first migration. Full treatment in §6.

> **Answer:** Order decided in §6.

---

## 3. The methodology axis: developer-agent interaction (M1–M4)

This is the heart of what makes your study more than a framework bake-off. You are studying **how the structure of the human-agent interaction changes migration outcomes** — which is exactly the "role of the developer" question, made empirical.

### 3.1 The involvement ladder

The four methodologies form a ladder of _increasing human structuring of the agent's work_. M2 and M3 sit at the same rung — they impose comparable effort but differ in the **source** of guidance (imported vs. co-produced). M4 combines them.

|        | Methodology       | Source of guidance                                                                                                  | Human's role                   | Rung   |
| ------ | ----------------- | ------------------------------------------------------------------------------------------------------------------- | ------------------------------ | ------ |
| **M1** | **Baseline**      | None — single do-all prompt; errors fixed manually (Decision 2.5)                                                   | Reactive (fix after)           | Floor  |
| **M2** | **Rule-directed** | External, imported rulesets (Cursor `.mdc` rules, framework best-practice guides pulled from authoritative sources) | Curator (set up, then let run) | Middle |
| **M3** | **Spec-first**    | Co-produced, human-validated migration plan/spec generated _with_ the agent, then implemented against               | Architect (validate before)    | Middle |
| **M4** | **Rules + spec**  | Both imported rulesets _and_ a validated plan                                                                       | Curator + Architect            | Top    |

### 3.2 What each methodology means operationally

Each must be defined precisely enough that someone else could replicate it. Draft these definitions in Phase 2 and freeze them.

- **M1 — Baseline.** A single, well-formed but unstructured prompt instructing Cursor to migrate the whole in-scope app to the target stack. No external rules, no plan. Whatever it produces, you then bring to functional equivalence by **manual** correction only. This is the floor: raw agent capability plus unaided human debugging.

- **M2 — Rule-directed.** Before prompting, you assemble a defined set of **external rulesets**: Cursor rule files and curated best-practice guidance for the target stack, pulled from authoritative sources. The agent migrates under that governance. The human's pre-work is _curation_; intervention during/after follows the same correction discipline as the others. _Key design point:_ the rulesets for Next.js and Blazor must be assembled to comparable depth/quality, or you confound methodology with rule-quality.

- **M3 — Spec-first.** You first have the agent analyze the legacy app and produce a **migration plan/specification**. You review and correct _that artifact_ — this review step is where human architectural judgment enters. Only the approved plan is then implemented. The guidance is internally co-produced, not imported.

- **M4 — Rules + spec.** Both: the agent operates under imported rulesets _and_ against a validated, co-produced plan. The top of the ladder.

### 3.3 The "nothing shared" rule and its consequence _(Decision, resolved)_

You have ruled that **nothing is shared between the 8 migrations** — each starts completely cold. This is methodologically pure: every cell is independent, so no cell's outcome contaminates another.

**The consequence you must account for:** in M3 and M4, the **spec is regenerated from scratch every time**, never written once and reused. This is the correct choice under "nothing shared," and it has an upside: the _spec-production step itself becomes part of what you measure_. How good a plan does the agent produce for Next.js vs. Blazor? How much human correction does the _plan_ need before it's trustworthy? That plan-correction effort is itself completeness data — it's the human catching gaps _before_ implementation rather than after.

### 3.4 The remediation axis: R0 (raw) vs. R1 (remediated)

Every one of the 8 migrations is measured at **two states**, turning the correction step from a confound into a third independent variable (Decision 2.5).

**R0 — raw AI output.** The migration exactly as produced by the agent under its methodology, before any human touches it. This is the experimental floor: the unaided capability of the agent for that stack × methodology. You **measure R0 fully and snapshot it (git tag) before remediation begins** — once you remediate, R0 is gone for that cell and cannot be reconstructed. _This snapshot discipline is the single most important rule in the design._

**R1 — remediated output.** The same migration after one consistent, agent-directed remediation loop: detect (manual review + SonarQube) → document → direct the agent to fix → re-measure, iterating under the stopping rule (suite-green, hard iteration cap). The human's role here is **QA director**, not hand-fixer — which is how practitioners actually operate, and which keeps the loop consistent across cells.

**The R0→R1 delta is a primary finding.** It quantifies _what the human-directed remediation loop adds on top of raw generation_. Read across the axes, it answers questions the single-state design could not:

- _Per cell:_ how far did raw output get, and how much did directed remediation recover? (e.g. "R0 = 60% features equivalent; R1 = 95% after 3 agent rounds")
- _Across methodologies:_ does upfront structuring shrink the delta? If M4's R0→R1 delta is small and M1's is large, that is direct evidence that proactive structuring front-loads the work the remediation loop would otherwise do — a clean argument for the "architect" developer role over the "reactive fixer" role.
- _Across stacks:_ is Blazor's raw output rougher (larger delta) than Next.js's — and is that a framework effect or a model-familiarity effect (§5.4)?

**Layered scope (see §8):** R0 on all 8 cells is the _mandatory floor_ of the study — a complete thesis on its own. R1 is the _stretch layer_, with its own reduction path if time runs short.

---

## 4. Framework choices (retained rationale)

Next.js and Blazor are confirmed. The reasoning, for your methodology chapter:

- **Meaningful contrast.** Next.js (JS/React, very high model familiarity) vs. Blazor (.NET/C#, lower model familiarity) creates a _popular-vs-less-popular_ and _ecosystem-vs-ecosystem_ contrast that a second JS framework wouldn't.
- **You can evaluate it.** You're comfortable in typescript and C#/.NET, so you can judge output quality credibly.
- **It probes a real industry concern.** "Can we trust AI migration for our less-mainstream stack?" is exactly what an IT organization weighing adoption asks.

**The confound to name honestly (§5.4):** any quality or completeness gap between the stacks could stem from (a) the framework's intrinsic fit for this app, or (b) the model's familiarity with the framework. With n=1 you cannot fully separate these — so you report both as competing explanations rather than claiming one. Naming this is methodological maturity, not weakness.

---

## 5. Cross-cutting concerns (apply across all phases and all 8 migrations)

### 5.1 Logging discipline

Everything traceable: prompts, rulesets used, generated specs, outputs, interventions (typed per Decision 2.4), time, surprises. These logs are your dataset and your appendices. With 8 migrations, **consistent logging structure across cells is what makes the matrix analyzable** — design one template and use it eight times.

### 5.2 The legacy app is a control — protect it

The PHP app on its frozen branch never changes. It is the single source of truth for correctness across all 8 migrations. Any drift invalidates every comparison.

### 5.3 Process consistency within a methodology, across stacks

For a given methodology, the _process_ must be identical between Next.js and Blazor — only the stack differs. The remediation loop (R0→R1) must likewise follow the same protocol and stopping rule in every cell. If you refine your technique mid-study, log it as a deviation; it's a confound you must report.

### 5.4 The model-familiarity confound (Blazor)

Carry §4's caveat through every stack comparison. Whenever you report a Next.js-vs-Blazor gap, ask: framework fit, or model familiarity? Report both.

### 5.5 Learning effects across the 8 runs

The dominant threat to this design (one engineer, eight sequential migrations — and, for R1, eight remediation loops). Mitigated by ordering (§6) and by logging — but also acknowledged as a limitation. You will get faster and sharper; the ordering strategy spreads that improvement so it doesn't masquerade as a methodology or stack effect. The remediation stopping rule (fixed target + iteration cap) further guards R1 against drift, since "remediate until green, capped at N" is mechanical rather than dependent on how much effort you feel like spending on a given day.

### 5.6 Efficiency measurement caveat

Your "AI time" is logged and real. Your "classical refactoring time" is an _estimate_ (you won't hand-refactor). This is the softest dimension; consider grounding the estimate via an interviewee's expert judgment rather than guessing alone. Note also that efficiency now has a richer story across two dimensions: M4 front-loads human effort while M1 back-loads it (the methodology axis), and R1 adds the remediation cost on top of R0 (the remediation axis). _Total_ time, _where_ time is spent, and _how much remediation each cell needed_ all matter.

### 5.7 SonarQube double-counting between detection and quality measurement

SonarQube plays two roles, and they must not contaminate each other. It is your **fault-detector** driving the R1 remediation loop, _and_ a source of **code-quality metrics**. The problem: if SonarQube findings drive what you fix in R1, then "SonarQube issues remaining" is a clean quality metric at **R0** but a circular one at **R1** — of course R1 scores well, you optimized directly against it. **Rule:** use SonarQube freely (a) as your R0 quality measurement and (b) as the R1 fault-detector. But measure **R1 quality outcome** with a lens SonarQube did _not_ drive — e.g. readability/maintainability judgement, test-based correctness, or a **held-back subset of SonarQube rules used for R1 scoring only and never shown to the remediation loop**. State whichever you choose in the methodology.

**Possible remedy:** Delay use of SonarQube until all 16 workflows have been completed (not letting it drive remediation).

---

## 6. The ordering strategy (counter to learning effects)

**The protocol splits the timeline cleanly:** you generate **all 8 R0 migrations first**, evaluating nothing, then run the R1 remediation loops, and only then evaluate. This ordering of the _work_ has one genuine benefit and one tempting-but-false implication. Both need stating.

**What deferring evaluation correctly removes.** Because you never look at a test result or a SonarQube report until everything is done, _measurement cannot leak between cells_ — you can't unconsciously let cell 3's results shape how you approach cell 4, because you haven't seen them. This is a real simplification and worth claiming in the methodology.

**What it does _not_ remove — the trap.** "I'm not evaluating, so order doesn't matter for R0" conflates _not measuring_ with _not learning_. You don't need to see a single metric to get better at the task — the learning is in the _doing_:

- After migrating the legacy app once, you understand its quirks (the awkward auth flow, the implicit data-model assumption, the procedural-PHP construct that resists mapping). You carry that into every later migration regardless of evaluation.
- You grow fluent in the target stack's migration patterns — by the third Next.js run you know how the agent scaffolds, what it forgets, how to phrase the methodology's prompts.
- You get better at _operating each methodology_ (writing the M3 spec prompt, assembling the M2 rules). So **R0 generation is still fully subject to learning effects**, and the order of the R0 runs still matters. Worse: doing all R0 first _concentrates_ the risk if you batch naïvely. If you generate R0 grouped by methodology (all M1, then all M2 … all M4), then by the time you reach M4 you've done six migrations' worth of practice — M4's raw output looks better, and you'd wrongly credit "upfront structuring" for what is really accumulated skill. The methodology axis is your core contribution and the one you most need clean; naïve R0 batching is exactly how you'd contaminate it.

**Principle:** the counterbalanced order applies specifically to the **R0 generation sequence**, because that is where the learning lives. Distribute practice as evenly as possible across both the stack and methodology axes, so neither stack nor any methodology is systematically advantaged by running late.

**Recommended R0 generation order — interleave and counterbalance:**

- Alternate stacks every run (never two of the same stack back-to-back).
- Avoid monotonic ladder order for methodologies (don't run M1→M2→M3→M4 cleanly, or late methodologies inherit all your practice).
- A workable sequence (one of several valid ones): | R0 run | Stack | Methodology | |---|---|---| | 1 | Next.js | M1 | | 2 | Blazor | M3 | | 3 | Blazor | M2 | | 4 | Next.js | M4 | | 5 | Next.js | M2 | | 6 | Blazor | M4 | | 7 | Blazor | M1 | | 8 | Next.js | M3 |

Each stack appears 4×; each methodology appears 2× (once per stack); stacks alternate; no methodology clusters at the start or end. **Document whatever order you choose and why** — examiners look for exactly this kind of confound-awareness.

> **The pilot cell is run 1, not a separate pre-run.** Phase 3A opens with a pilot dry-run to verify the instrumentation rig (see Phase 3, Step 0). That pilot _is_ run 1 of this order (Next.js M1) — so the practice it generates is already accounted for in the counterbalancing. Don't run a throwaway migration _before_ run 1, or you'd inject one cell of un-counterbalanced learning. If the pilot forces an instrumentation change, you re-run run 1's _capture_ under the fixed rig, but it stays run 1 in the sequence.

**R1 inherits this order and needs no separate counterbalancing.** Run the remediation loops in the same cell sequence (or any fixed, documented order). R1 isn't where the steep across-the-app learning curve lives — by then you've plateaued on understanding the legacy app — so a single fixed order is enough; you just avoid introducing a _second_, uncontrolled sequence. This clean R0-then-R1 split also serves §8: you complete the entire mandatory floor (8× R0) before spending a minute on the stretch layer, which is exactly the risk ordering you want.

> **Alternative if 8 is too many (see §8 feasibility):** if you must cut, drop to a 2×2 core (M1 + M4 — the floor and ceiling of the involvement ladder) × 2 stacks = 4 migrations. This preserves the most informative contrast (least vs. most human structuring) on both stacks. M2 and M3 become "if time allows." This is the cleanest reduction because M1 and M4 bound the ladder.

---

## 7. Phase structure

Phases are sequenced by **dependency**, not fixed dates. Each lists its entry condition (what must be true to start) and exit condition (what must be true to move on).

### Phase 1 — Establish the research object

**Purpose:** Turn your PHP app from "code you know" into "a documented, measurable control."  
**Entry condition:** Repo set up; legacy code frozen on an untouchable branch.  
**Key activities:**

- Produce a **feature inventory**: every in-scope feature, files involved, complexity rating. Doubles as migration checklist _and_ completeness scorecard.
- Document the **data model**: schema export, relationships, representative seed data for testing.
- Record **PHP-specific constructs** likely to resist migration (session handling, global state, raw SQL). These are your _predictions_ of where AI will struggle — comparing prediction vs. reality later is strong analytical material, and may differ by methodology (does M4 overcome what M1 couldn't?).  
  **Exit condition:** Scope frozen (Decision 2.1); feature inventory complete; representative test data prepared.  
  **Note:** Lighter than usual since you know the code — but the inventory's quality caps your completeness measurement's quality. Don't skip it.

### Phase 2 — Define instruments, methodologies, and order

**Purpose:** Decide _how_ you measure, _what_ each methodology is, and _in what order_ you run — all before any result can bias you. **Entry condition:** Phase 1 complete. **Key activities:**

- Finalize Decisions 2.3, 2.4, 2.5, 2.6.
- **Freeze the M1–M4 operational definitions** (§3.2) so all 8 runs are replicable.
- **Assemble the M2/M4 rulesets** for _both_ stacks to comparable depth (or you confound methodology with rule-quality).
- Define the **correctness test suite**: which features get automated Playwright coverage, which get manual testing. Budget Playwright learning time; keep the suite focused on highest-value user flows.
- **Build the test suite against the legacy PHP app and get it green** before any migration exists. Critical ordering dependency — it proves the tests are valid independently of any migration.
- Configure **code-quality instrumentation** that analyzes _both_ JS/TS and C# on comparable axes. **Split SonarQube's two roles** (§5.7): decide which rules drive R1 remediation and which are held back as R1 quality outcomes.
- **Set the remediation stopping rule** (Decision 2.5): fix the iteration cap _N_ and confirm the target (suite-green).
- Lock the **logging template** (used identically for all 8 runs, capturing both R0 and R1) and **time-tracking categories**.
- **Fix the R0 generation order** (§6). **Exit condition:** Tests green against legacy; quality tooling runs on a sample of both stacks; M1–M4 defined and rulesets assembled; logging template ready; R0 generation order fixed; Decisions 2.3–2.6 recorded. **Risk flag:** This phase is heavier than in a single-migration design and the most likely to be under-budgeted. The methodology definitions and ruleset assembly are real work. Do not let eagerness to start migrating compress it — eight inconsistent migrations are worth less than four consistent ones.

### Phase 3 — Execute the migration matrix

**Purpose:** Generate and remediate all migrations, fully logged, with evaluation deferred to Phase 4. **Entry condition:** Phase 2 complete; tests green against legacy; R0 order fixed; stopping rule (N) set.

The phase runs in two passes — **all R0 generation, then all R1 remediation** — so the mandatory floor (§8) is fully banked before any stretch work, and so measurement never leaks between cells (§6).

> **A note on "measure" vs. "evaluate."** During execution you _capture raw instrumentation_ — test pass/fail counts, SonarQube output, timing, an intervention tally. You do **not** interpret it, compare cells, or draw conclusions; that is Phase 4, deliberately held until all generation is done so results from early cells can't shape how you run later ones. Capture is mechanical; evaluation is deferred.

**Pass 3A — R0 generation (all 8 cells, in the §6 counterbalanced order):**

> **Step 0 — Pilot cell (verify the rig, not the result).** Before committing to all eight blind, run the _first_ cell in your order (Next.js M1) all the way through steps 1–7 as a dry run, then **stop and inspect the instrumentation, not the findings.** You are checking that the rig works: did the correctness suite actually execute and produce a usable pass/fail breakdown? Did SonarQube scan the generated stack and emit parseable output? Does the logging template capture what you need, in a form you can analyse later? Is the timing data sane? This is _not_ evaluation in the confound sense — you're validating the measurement apparatus, not interpreting the migration's quality or comparing anything. If the rig is broken (a test that can't target the new stack, a scanner misconfigured for C#, a log field you forgot), fixing it now costs one cell; discovering it after eight costs the study. If you change the instrumentation as a result, the pilot cell's R0 capture is invalid — **re-run it** under the fixed rig so all eight cells are measured identically. Only once the rig is verified do you proceed through the remaining cells.

1. Start cold (nothing carried from prior runs — §3.3).
2. Apply the methodology exactly as defined (assemble rules / generate+validate spec as required).
3. Migrate in dependency order: data layer → business logic → routes/API → views.
4. Log **every** prompt, ruleset, generated spec, and the agent's actions, with timing.
5. **Fix nothing.** When the AI errs, record it (typed per Decision 2.4) and leave it in place.
6. **Capture R0 instrumentation** (don't interpret): run the correctness suite and store results, run the SonarQube scan and store output, record the raw intervention tally and timing.
7. **Snapshot R0:** commit and **git-tag** the raw state (e.g. `r0/nextjs-m1`). Immutable and non-negotiable — once you remediate, R0 is unrecoverable.
8. Move to the next cell. Repeat for all 8 before touching R1. **Pass 3B — R1 remediation (stretch layer; cell order inherited from 3A, §6):**
9. For each cell in scope (§8 decides how many): enter the remediation loop — detect shortcomings (manual review + SonarQube) → document → direct the agent to fix → re-run the correctness suite. Iterate.
10. **Apply the stopping rule:** continue until the suite is green, capped at N agent rounds. Record whether the target was reached and how many iterations it took; log time per iteration.
11. **Capture R1 instrumentation:** re-run correctness and store, score quality with the non-SonarQube-driven lens (§5.7), record the updated intervention tally and cumulative time — again, capture only, no interpretation.
12. **Snapshot R1:** commit and git-tag (e.g. `r1/nextjs-m1`).

**Exit condition (floor):** R0 generated, instrumented, and tagged for all 8 cells. **Exit condition (target):** R1 captured for the cells the layered scope prioritizes (§8). **Note:** This is the bulk of the work. The §8 layered scope tells you what to cut if you fall behind — drop R1 breadth first, then whole cells; never rigor within a cell.

### Phase 4 — Comparative evaluation

**Purpose:** Convert eight logged migrations (each at R0 and R1) into findings across the four dimensions and all three axes. **Entry condition:** All in-scope cells generated and remediated; raw instrumentation captured and snapshots tagged. This is the _first_ point at which you interpret results. **Key activities:**

- Build the **comparison matrix** (legacy baseline vs. each cell at R0 and R1), readable along all three axes:
  - _Down the methodology axis_ (holding stack fixed): does more human structuring improve completeness/correctness/quality — or just relocate the human effort earlier?
  - _Across the stack axis_ (holding methodology fixed): Next.js vs. Blazor, interpreted through the familiarity confound (§5.4).
  - _Across the remediation axis_ (R0→R1 delta): how much did the directed remediation loop recover, and does the delta shrink as methodology structuring increases (§3.4)?
- For **completeness** (primary): tabulate interventions by category × feature × cell, at R0 and after R1. The headline questions: _Which code did AI handle alone (R0)? What did directed remediation recover (R1)? What survived even remediation? Did better methodology shrink the un-migratable set, or move the intervention from after-the-fact fixing to upfront spec/rule work?_
- Read **efficiency** across both relevant axes: methodology (front-loaded M4 vs. back-loaded M1) and remediation (R0 generation cost vs. added R1 remediation cost per cell).
- Synthesize what the dimensions _together_ say about validity and quality.
- Draft a **provisional answer** to the research question's first half and a **first-draft decision framework** for practitioners (valorization deliverable) — now able to give _methodology-specific_ guidance ("for a less-familiar stack, spec-first pays off because…"). **Exit condition:** Comparison matrix complete; completeness typology populated across cells; provisional findings written; interview inputs prepared.

### Phase 5 — Bridge to interviews

**Purpose:** Turn findings into instruments for the stakeholder phase. **Entry condition:** Provisional findings exist. **Key activities:**

- Convert striking findings into **interview probes** confronting practitioners with your results (e.g. "Spec-first cut un-migratable features by X% on the .NET stack — does that match how your team governs AI tools?").
- Confirm interview leads and schedule (start _early_, in parallel — see §9). **Exit condition:** Interview guide ready; interviews scheduled. Research phase closes; writing/interview phase begins.

---

## 8. Feasibility and the reduction path

**Be realistic:** 8 full-stack migrations is ambitious for one person in ~2 weeks; _remediating_ all 8 to green (R1) on top is plausibly more total work than generating them, especially the rougher Blazor cells. The design is therefore **layered** so you can stop at any layer and still have a complete, defensible thesis.

**The layered scope (each layer is a complete, reportable result):**

1. **Floor — R0 on all 8 cells.** Eight raw migrations, fully measured and tagged. _This is the mandatory minimum and a complete thesis on its own:_ it fully answers the methodology and stack axes for raw AI output. Protect this before attempting any R1.
2. **Target — R1 on M1 + M4 × both stacks (4 cells).** Adds the remediation axis where it carries the most argument: the R0→R1 delta on the floor and ceiling of the involvement ladder. This is the principled R1 subset — not a random scramble.
3. **Ideal — R1 on all 8 cells.** Full three-axis design. **Two independent reduction levers, pull in this order if time runs short:**

- _First, cut R1 breadth_ (drop from layer 3 → 2 → R0-only). Losing R1 costs you the remediation axis but keeps the whole raw-output study intact.
- _Then, if even R0 is at risk, cut cells_ along the matrix: drop to **M1 + M4 × both stacks** (preserves the strongest methodology contrast and the full stack contrast), then if needed to **all four methodologies on Next.js only + one M1 Blazor probe** (prioritizes the richer methodology axis over the stack axis). **Rule for cutting:** remove **whole cells or whole layers**, never rigor within a cell. A smaller fully-instrumented design beats a larger sloppy one. Set explicit trigger points now (e.g. _"if R0 for all 8 isn't done by end of week 1, skip straight to R1 on M1+M4 only and don't attempt R1 elsewhere"_).

> Raise the layered scope with your supervisor up front, so a "R0-on-all-8, R1-on-four" result is pre-approved as success rather than received as a shortfall.

---

## 9. Dependencies that must start early

- **Interview recruitment.** Convert your "some leads" into committed interviewees _during_ the research phase. Scheduling professionals takes weeks — this is the most common cause of thesis slippage.
- **Supervisor sign-off on design.** Get §1–§6 approved before Phase 3 — especially the methodology definitions (§3.2), the R0/R1 remediation axis and its stopping rule (Decision 2.5, §3.4), the ordering strategy (§6), and the layered scope (§8). Re-running migrations because the design was wrong is the costliest possible mistake, multiplied by up to eight here.
- **Tooling access.** Cursor, a quality scanner covering _both_ JS/TS and C#, and Playwright — all installed and smoke-tested before Phase 2 ends.
- **Ruleset sourcing (M2/M4).** Identify authoritative Next.js and Blazor best-practice sources early; assembling balanced rulesets is real work and gates those cells.

---

## 10. Deliverables produced by the research phase

| Deliverable                                                            | Feeds thesis section                |
| ---------------------------------------------------------------------- | ----------------------------------- |
| Scope statement + feature inventory                                    | Methodology / research object       |
| Framework B (Blazor) justification + familiarity-confound analysis     | Methodology                         |
| **M1–M4 operational definitions**                                      | **Methodology (core contribution)** |
| **R0/R1 protocol + remediation stopping rule**                         | **Methodology (core contribution)** |
| M2/M4 ruleset packs (both stacks)                                      | Methodology / appendix              |
| Functional-equivalence definition                                      | Methodology                         |
| Correctness test suite (legacy-validated)                              | Methodology / results               |
| **Migration-order rationale**                                          | Methodology (confound control)      |
| Per-cell logs: prompts, specs, typed interventions, R0+R1 (×8)         | **Results (primary) + appendix**    |
| Git-tagged R0 and R1 snapshots per cell                                | Reproducibility / appendix          |
| Completeness typology populated at R0 and R1 across cells              | **Results (primary)**               |
| Code-quality & security scans, R0 and R1 (×8)                          | Results                             |
| Time-tracking dataset, generation + remediation (×8)                   | Results (efficiency)                |
| Cross-dimensional comparison matrix (all three axes incl. R0→R1 delta) | Results / discussion                |
| Provisional answer to RQ part 1                                        | Discussion                          |
| First-draft, methodology-specific decision framework                   | Valorization                        |
| Interview guide grounded in findings                                   | Valorization / interview phase      |

---

## 11. Open questions to resolve with your supervisor

1. Is **n=1 codebase with a 2×4 instrumented matrix, each cell measured at R0 and R1**, accepted as sufficient depth? (Almost certainly yes — confirm.)

   > Yes.

2. Is the **R0/R1 remediation axis** (Decision 2.5, §3.4) sound, and is the **stopping rule** (suite-green + iteration cap _N_) the right choice — and what should _N_ be?

   > Yes; N = 4

3. Is the **ordering strategy** (§6) a satisfactory control for learning effects, and do they accept that it can't fully eliminate them at n=1?

   > Yes.

4. Is the **layered scope** (§8) pre-approved, so "R0 on all 8, R1 on M1+M4 ×2" counts as success if time forces it?

   > Yes.

5. Does the **completeness typology** (Decision 2.4) look sound, or do they want categories changed?

   > OK.

6. How should **SonarQube's dual role** be split (§5.7) so R1 quality isn't measured circularly — do they have a preferred approach?

   > Undecided, decide before R1

7. How many **stakeholder interviews** constitute "enough" for the valorization chapter?

   > At least 2, I have 4 lined up.

8. For **M2/M4**, do they agree the Next.js and Blazor rulesets must be balanced in depth — and is your sourcing plan adequate?
   > Undecided, will review after sourcing.
