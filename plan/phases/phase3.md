# Phase 3: Execute the migration matrix

**Purpose:** Generate and remediate all migrations, fully logged, with evaluation deferred to Phase 4.  
**Entry condition:** Phase 2 complete; tests green against legacy; R0 order fixed; stopping rule (N) set.  
**Exit condition (floor):** R0 generated, instrumented, and tagged for all 8 cells.  
**Exit condition (target):** R1 captured for the cells the layered scope prioritizes (§8).

The phase runs in two passes — **all R0 generation, then all R1 remediation** — so the mandatory floor (§8) is fully banked before any stretch work, and so measurement never leaks between cells (§6).

> **A note on "measure" vs. "evaluate."** During execution, capture raw instrumentation — test pass/fail counts, SonarQube output, timing, an intervention tally. Do **not** interpret it, compare cells, or draw conclusions; that is Phase 4, deliberately held until all generation is done so results from early cells cannot shape how later ones are run. Capture is mechanical; evaluation is deferred.

**Note:** This is the bulk of the work. The §8 layered scope tells what to cut if behind — drop R1 breadth first, then whole cells; never rigor within a cell.

## Key activities:

### Pilot cell (Pass 3A Step 0)

**Instructions:** Before committing to all eight blind, run the _first_ cell in the §6 counterbalanced order (Next.js M1) all the way through R0 generation steps 1–7 as a dry run, then **stop and inspect the instrumentation, not the findings.** Verify the rig: correctness suite execution and pass/fail breakdown; SonarQube scan of the generated stack with parseable output; logging template completeness; sane timing data. This validates the measurement apparatus, not migration quality. If instrumentation changes, the pilot cell's R0 capture is invalid — **re-run it** under the fixed rig. Proceed to remaining cells only once the rig is verified.

**Results:** ...

### Start cold (Pass 3A Step 1)

**Instructions:** For each R0 cell, start cold with nothing carried from prior runs (§3.3).

**Results:** ...

### Apply methodology (Pass 3A Step 2)

**Instructions:** Apply the methodology exactly as defined: assemble rules and/or generate+validate spec as required.

**Results:** ...

### Migrate in dependency order (Pass 3A Step 3)

**Instructions:** Migrate in dependency order: data layer → business logic → routes/API → views.

**Results:** ...

### Log prompts and agent actions (Pass 3A Step 4)

**Instructions:** Log **every** prompt, ruleset, generated spec, and the agent's actions, with timing.

**Results:** ...

### Record errors without fixing (Pass 3A Step 5)

**Instructions:** **Fix nothing.** When the AI errs, record it (typed per Decision 2.4) and leave it in place.

**Results:** ...

### Capture R0 instrumentation (Pass 3A Step 6)

**Instructions:** Capture R0 instrumentation without interpreting: run the correctness suite and store results, run the SonarQube scan and store output, record the raw intervention tally and timing.

**Results:** ...

### Snapshot R0 (Pass 3A Step 7)

**Instructions:** Commit and **git-tag** the raw state (e.g. `r0/nextjs-m1`). Immutable and non-negotiable — once remediated, R0 is unrecoverable.

**Results:** ...

### Complete all R0 cells (Pass 3A Step 8)

**Instructions:** Move to the next cell in the §6 order. Repeat steps 1–7 for all 8 cells before touching R1.

**Results:** ...

### Enter remediation loop (Pass 3B Step 9)

**Instructions:** For each cell in scope (§8 decides how many), in cell order inherited from 3A (§6): enter the remediation loop — detect shortcomings (manual review + SonarQube) → document → direct the agent to fix → re-run the correctness suite. Iterate.

**Results:** ...

### Apply stopping rule (Pass 3B Step 10)

**Instructions:** Continue remediation until the suite is green, capped at N agent rounds. Record whether the target was reached and how many iterations it took; log time per iteration.

**Results:** ...

### Capture R1 instrumentation (Pass 3B Step 11)

**Instructions:** Re-run correctness and store results. Score quality with the non-SonarQube-driven lens (§5.7). Record the updated intervention tally and cumulative time — capture only, no interpretation.

**Results:** ...

### Snapshot R1 (Pass 3B Step 12)

**Instructions:** Commit and git-tag the remediated state (e.g. `r1/nextjs-m1`).

**Results:** ...
