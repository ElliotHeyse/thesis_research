# Phase 2: Define instruments, methodologies, and order

**Purpose:** Decide _how_ to measure, _what_ each methodology is, and _in what order_ to run — all before any result can bias the study.  
**Entry condition:** Phase 1 complete.  
**Exit condition:** Tests green against legacy; quality tooling runs on a sample of both stacks; M1–M3 prompts frozen; logging template ready; R0 generation order fixed; Decisions 2.3–2.6 recorded.

**Risk flag:** This phase is the most likely to be under-budgeted. Freezing the three prompts precisely and getting the test rig green on legacy are the real work. Do not let eagerness to start migrating compress it — six inconsistent migrations are worth less than four consistent ones.

## Key activities:

### Finalize Decisions 2.3–2.6

**Instructions:** Record and lock Decisions 2.3, 2.4, 2.5, and 2.6 with documented reasoning. Each must be fixed before writing tests or running migrations.

**Results:** Locked in [research-project-plan.md](../research-project-plan.md) §2:

- [Decision 2.3 — functional equivalence](../research-project-plan.md#decision-23--definition-of-functional-equivalence-resolved)
- [Decision 2.4 — issue documentation (free-text, feature-anchored)](../research-project-plan.md#decision-24--issue-documentation-resolved)
- [Decision 2.5 — R0/R1 remediation axis](../research-project-plan.md#decision-25--correction-handling-the-r0r1-remediation-axis-resolved) (_N_ = 4)
- [Decision 2.6 — migration ordering strategy](../research-project-plan.md#decision-26--migration-ordering-strategy-resolved--see-6) (run table → "Fix R0 generation order" below)

### Freeze the three methodology prompts

**Instructions:** Freeze the M1–M3 methodology prompts verbatim per §3.3 so all 6 runs are replicable. Ensure M2's prompt is approach-neutral and ≈ M1's (it must not hint at _how_ to plan, or it collapses toward M3); ensure M3's prompt specifies feature-discovery-then-layer and names any per-stack terminology (approach identical across stacks; only vocabulary may differ).

**Results:** [methodology-protocols.md](./methodology-protocols.md)

### Define the correctness test suite

**Instructions:** Define the correctness test suite: which features get automated coverage, which get manual testing. Apply Decision 2.3's functional-equivalence definition identically across cells. Automated via HTTP-client content assertions against a fixed SQL seed for PHP and Next.js; identical assertions walked manually for Blazor.

**Results:** _**TODO**_

### Build test suite against legacy PHP

**Instructions:** Build the test suite against the legacy PHP app and get it green before any migration exists. This proves the tests are valid independently of any migration.

**Results:** _**TECHNICAL TODO**_

### Configure code-quality instrumentation

**Instructions:** Configure code-quality instrumentation that analyzes _both_ JS/TS and C# on comparable axes. Decide SonarQube's role/timing per §5.7 so R1 quality is not measured circularly (either hold back a non-driving lens for R1 quality, or defer SonarQube entirely until all R0/R1 work is done).

**Results:** _**TECHNICAL TODO**_

### Confirm remediation stopping rule

**Instructions:** Confirm the remediation stopping rule per Decision 2.5: fix the iteration cap _N_ and confirm the target (suite-green).

**Results:** Iteration cap _N_ = **4**; target: suite-green (automated + manual).

### Lock logging template and time-tracking categories

**Instructions:** Lock the logging template (used identically for all 6 runs, capturing both R0 and R1) and the time-tracking categories. Confirm the Decision 2.4 feature-ID anchor and free-text issue field exist in the template.

**Results:** [logging-template.md](./logging-template.md)

### Lock down R0 generation order

**Instructions:** Fix the R0 generation order per §6 — interleave and counterbalance so neither stack nor any methodology is systematically advantaged by running late. Document the chosen order and why.

**Results:** Counterbalanced order per §6 (run 1 = Next.js M1 doubles as the Phase 3 pilot cell):

| R0 run | Stack   | Methodology |
| ------ | ------- | ----------- |
| 1      | Next.js | M1          |
| 2      | Blazor  | M2          |
| 3      | Next.js | M3          |
| 4      | Blazor  | M1          |
| 5      | Next.js | M2          |
| 6      | Blazor  | M3          |
