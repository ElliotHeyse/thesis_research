# Phase 2: Define instruments, methodologies, and order

**Purpose:** Decide _how_ to measure, _what_ each methodology is, and _in what order_ to run — all before any result can bias the study.  
**Entry condition:** Phase 1 complete.  
**Exit condition:** Tests green against legacy; quality tooling runs on a sample of both stacks; M1–M4 defined and rulesets assembled; logging template ready; R0 generation order fixed; Decisions 2.3–2.6 recorded.

**Risk flag:** This phase is heavier than in a single-migration design and the most likely to be under-budgeted. The methodology definitions and ruleset assembly are real work. Do not let eagerness to start migrating compress it — eight inconsistent migrations are worth less than four consistent ones.

## Key activities:

### Finalize Decisions 2.3–2.6

**Instructions:** Record and lock Decisions 2.3, 2.4, 2.5, and 2.6 with documented reasoning. Each decision must be fixed before writing tests or running migrations.

**Results:** ...

### Freeze M1–M4 operational definitions

**Instructions:** Freeze the M1–M4 operational definitions per §3.2 so all 8 runs are replicable.

**Results:** ...

### Assemble M2/M4 rulesets

**Instructions:** Assemble the M2/M4 rulesets for _both_ stacks to comparable depth. Uneven rule quality confounds methodology with rule quality.

**Results:** ...

### Define the correctness test suite

**Instructions:** Define the correctness test suite: which features get automated Playwright coverage, which get manual testing. Budget Playwright learning time; keep the suite focused on highest-value user flows.

**Results:** ...

### Build test suite against legacy PHP

**Instructions:** Build the test suite against the legacy PHP app and get it green before any migration exists. This proves the tests are valid independently of any migration.

**Results:** ...

### Configure code-quality instrumentation

**Instructions:** Configure code-quality instrumentation that analyzes _both_ JS/TS and C# on comparable axes. Split SonarQube's two roles per §5.7: decide which rules drive R1 remediation and which are held back as R1 quality outcomes.

**Results:** ...

### Set remediation stopping rule

**Instructions:** Set the remediation stopping rule per Decision 2.5: fix the iteration cap _N_ and confirm the target (suite-green).

**Results:** ...

### Lock logging template and time-tracking categories

**Instructions:** Lock the logging template (used identically for all 8 runs, capturing both R0 and R1) and time-tracking categories.

**Results:** ...

### Fix R0 generation order

**Instructions:** Fix the R0 generation order per §6.

**Results:** ...
