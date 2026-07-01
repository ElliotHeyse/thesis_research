# Methodology protocols — M1–M3 (frozen prompts + operational definitions)

**Purpose:** Freeze the M1–M3 operational definitions and the verbatim prompts per §3.3 so all 6 migration cells are replicable. The contrast between methodologies lives almost entirely in the prompt wording, so each frozen prompt is a methodology artifact (thesis appendix).

**Related:** [research-project-plan.md §3 methodology axis](../research-project-plan.md#3-the-methodology-axis-planning-authority-m1m3) · [phase2.md](./phase2.md) · [feature-inventory.md](../phase1/feature-inventory.md) (held back from the agent — control, not input)

**Status:** _**FROZEN**_ — Phase 2.

---

## Invariants across all methodologies (§3.1, §3.5)

- **Execution is always agent mode.** Plan mode (M2/M3) is only a _precursor_ that produces a guideplan; execution of the migration itself is uniformly agent mode. The methodology axis varies _how much planning precedes the identical execution_, not the execution mode.
- **Single migration attempt per cell in R0.** Each methodology yields one R0 migration attempt.
- **Cold start.** Nothing is shared between cells; M2/M3 plans are regenerated from scratch every time, never reused.
- **Full-stack, whole in-scope app.** Target the entire scope per Decision 2.1 (everything except composer testing).
- **Feature inventory is held back.** The agent is never given [feature-inventory.md](../phase1/feature-inventory.md); in M3 it must discover features itself.
- **Per-stack expression.** The planning _approach_ is identical across Next.js and Blazor. Only stack-specific _vocabulary_ may differ (e.g. "API routes" for Next.js vs. the Blazor equivalent). **Approach drift between stacks is a confound and must be heavily motivated if it occurs.**

---

## M1 — No planning

**Planning authority:** None. **What the human does:** issues a single one-shot prompt; no planning step.

**Operational definition (§3.3):** A single, well-formed one-shot prompt instructing Cursor (agent mode) to migrate the whole in-scope app to the target stack, full-stack. No planning step, no structural guidance. This is the floor: the agent's raw one-shot capability.

**Frozen prompt — Next.js:**

```text
Migrate this application to Next.js (App Router). Produce a full-stack implementation — frontend and backend — that is a working application equivalent to the existing one, using the existing database per the provided schema (do not modify the database). Migrate the functionality of the current app.
```

**Frozen prompt — Blazor:**

```text
Migrate this application to Blazor Server (.NET). Produce a full-stack implementation — frontend and backend — that is a working application equivalent to the existing one, using the existing database per the provided schema (do not modify the database). Migrate the functionality of the current app.
```

---

## M2 — Autonomous planning

**Planning authority:** Agent-led. **What the human does:** issues a single prompt in plan mode; the agent plans freely.

**Operational definition (§3.3):** A single prompt issued in **plan mode**, of similar (ideally identical) complexity and wording to M1's, letting the agent build a complete migration plan _however it judges best_. The plan is documented as an attachment to the conversation, then executed (agent mode). **Critical:** the prompt must **not** hint at _how_ to plan, or it collapses toward M3 — it is approach-neutral by design.

**Frozen prompt — Next.js:**

```text
Migrate this application to Next.js (App Router). Produce a full-stack implementation — frontend and backend — that is a working application equivalent to the existing one, using the existing database per the provided schema (do not modify the database). Plan the migration of the current app's functionality, then carry it out.
```

**Frozen prompt — Blazor:**

```text
Migrate this application to Blazor Server (.NET). Produce a full-stack implementation — frontend and backend — that is a working application equivalent to the existing one, using the existing database per the provided schema (do not modify the database). Plan the migration of the current app's functionality, then carry it out.
```

---

## M3 — Directed planning

**Planning authority:** Human-directed. **What the human does:** issues a single prompt instructing _how_ to plan.

**Operational definition (§3.3):** A single prompt instructing the agent to plan in a **specified way**, then build the plan accordingly and execute it. The fixed approach:

1. **Discover the application's features first** — the agent identifies features _itself_; it is **not** given the Phase 1 feature inventory (held back as a control).
2. **Plan the build along a layer-based structure** — data layer → business logic → routes/API → views — covering exactly those discovered features, so all and only the code needed for the features is in place, organized by layer.

**Frozen prompt — Next.js:**

```text
Migrate this application to Next.js (App Router). Produce a full-stack implementation — frontend and backend — that is a working application equivalent to the existing one, using the existing database per the provided schema (do not modify the database). Plan the migration as follows: first, analyse the current application and identify all of its features yourself. Then plan the build along a layered structure — data access, then business logic, then API routes, then views — so that the plan covers exactly the features you identified and organises the work by layer. Carry out the plan once complete.
```

**Frozen prompt — Blazor:**

```text
Migrate this application to Blazor Server (.NET). Produce a full-stack implementation — frontend and backend — that is a working application equivalent to the existing one, using the existing database per the provided schema (do not modify the database). Plan the migration as follows: first, analyse the current application and identify all of its features yourself. Then plan the build along a layered structure — data access, then business logic, then page routing, then views — so that the plan covers exactly the features you identified and organises the work by layer. Carry out the plan once complete.
```

---

## Remediation (R1) stance per methodology (§3.4)

In R1 the **cell's own methodology is re-applied to each round of faults**, iterating under the stopping rule (suite-green, hard cap _N_ = 4):

| Cell        | R1 stance                                                                                                                                                       |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **M1 / R1** | Surface the broken features and their behavior; hand them to the agent one-shot to fix (no planning).                                                           |
| **M2 / R1** | Describe the faults and let the agent plan the fix autonomously in plan mode.                                                                                   |
| **M3 / R1** | Diagnose more closely and inject directed guidance where possible. _Log when you could direct and when you couldn't_ so M3/R1 intensity doesn't silently drift. |
