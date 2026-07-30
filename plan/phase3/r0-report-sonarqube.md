# SonarQube — issue report

**Scope.** All six cells (methodology M1–M3 × stack Next.js / Blazor Server), scanned after generation and before any remediation. Maintainability issues were counted but not reviewed. Reliability and security issues are enumerated below with SonarQube's native category tags.

**Source data.** SonarQube scans per cell; raw counts and issue text as observed. Time values sourced from per-cell conversation logs.

**Reading note.** *Distinct* issues (unique rule violations) are the headline count throughout, since a rule repeated N times is one finding, not N. Total occurrences including repeats are shown alongside for recoverability against the raw scans.

---



## 1. SonarQube category tags

Every enumerated issue below carries one of SonarQube's native category tags. In this report they serve as the organizing lens:

- **[responsibility]** — a security or ownership call the AI made silently (e.g. embedding credentials in source).
- **[consistency]** — a non-idiomatic form used where an idiomatic one exists in the target language/framework (e.g. `isNaN` vs `Number.isNaN`, `String#replace` vs `String#replaceAll` for global replacement, redundant `alt` phrasing).
- **[intentionality]** — code that will misbehave or degrade under real use (super-linear regex, non-awaited async entry point).

---



## 2. Per-cell detail

**Time template** (fill per cell where blank):

> **Total time:** *mm:ss.xx* · Planning: *mm:ss.xx* · Generation: *mm:ss.xx*

For M1 cells (no planning step), "Planning" is N/A.

---



### 2.1 `r0/m1/s1-nextjs`

**Total time:** 13:20.45 · Planning: N/A · Generation: 13:20.45

- **1 security issue (distinct):**
  - Hard-coded database password *[responsibility]*
- **3 distinct reliability issues** (7 occurrences total):
  - Prefer `Number.isNaN` over `isNaN` — ×5 *[consistency]*
  - Redundant `alt` attribute (screen-readers already announce `img` as an image; don't use "image / photo / picture" in `alt`) *[consistency]*
  - Simplify this regular expression to reduce its runtime, as it has super-linear performance due to backtracking *[intentionality]*
- **88 maintainability issues** (not reviewed)



### 2.2 `r0/m2/s1-nextjs`

**Total time:** *TBD* · Planning: *TBD* · Generation: *TBD*

- **0 security issues**
- **2 distinct reliability issues** (6 occurrences total):
  - Prefer `Number.parseFloat` over `parseFloat` *[consistency]*
  - Prefer `String#replaceAll()` over `String#replace()` — ×5 *[intentionality]*
- **64 maintainability issues** (not reviewed)



### 2.3 `r0/m3/s1-nextjs`

**Total time:** *TBD* · Planning: *TBD* · Generation: *TBD*

- **0 security issues**
- **3 distinct reliability issues** (all distinct, 3 occurrences total):
  - Redundant `alt` attribute *[consistency]* — 2 occurrences
  - Simplify this regular expression to reduce its runtime, as it has super-linear performance due to backtracking *[intentionality]*
- **104 maintainability issues** (not reviewed)



### 2.4 `r0/m1/s2-blazor`

**Total time:** 09:55.99 · Planning: N/A · Generation: 09:55.99

- **1 security issue (distinct):**
  - Hard-coded database password *[responsibility]*
- **1 distinct reliability issue:**
  - `Await RunAsync instead.` (in `Program.cs`) *[intentionality]*
- **12 maintainability issues** (not reviewed)



### 2.5 `r0/m2/s2-blazor`

**Total time:** *TBD* · Planning: *TBD* · Generation: *TBD*

- **0 security issues**
- **1 distinct reliability issue:**
  - `Await RunAsync instead.` (in `Program.cs`) *[intentionality]*
- **22 maintainability issues** (not reviewed)



### 2.6 `r0/m3/s2-blazor`

**Total time:** *TBD* · Planning: *TBD* · Generation: *TBD*

- **1 security issue (distinct):**
  - Hard-coded database password *[responsibility]*
- **1 distinct reliability issue:**
  - `Await RunAsync instead.` (in `Program.cs`) *[intentionality]*
- **8 maintainability issues** (not reviewed)

---



## 3. Cross-cell overview

Distinct issues per cell. Total occurrences (including repeats) shown in parentheses where they differ.


| Cell              | Security | Reliability                 | Maintainability (not reviewed) |
| ----------------- | -------- | --------------------------- | ------------------------------ |
| `r0/m1/s1-nextjs` | 1        | 3 (7 total)                 | 88                             |
| `r0/m2/s1-nextjs` | 0        | 2 (6 total)                 | 64                             |
| `r0/m3/s1-nextjs` | 0        | 3 (3 total, incl. `alt` ×2) | 104                            |
| `r0/m1/s2-blazor` | 1        | 1                           | 12                             |
| `r0/m2/s2-blazor` | 0        | 1                           | 22                             |
| `r0/m3/s2-blazor` | 1        | 1                           | 8                              |


---



## 4. Cross-cell counts by category

Distinct issues, categorized per §1. Maintainability is untriaged and not tagged; totals in §3 hold the raw figure.


| Cell              | Responsibility | Consistency    | Intentionality |
| ----------------- | -------------- | -------------- | -------------- |
| `r0/m1/s1-nextjs` | 1 (password)   | 2 (isNaN, alt) | 1 (regex)      |
| `r0/m2/s1-nextjs` | 0              | 1 (parseFloat) | 1 (replaceAll) |
| `r0/m3/s1-nextjs` | 0              | 1 (alt)        | 1 (regex)      |
| `r0/m1/s2-blazor` | 1 (password)   | 0              | 1 (RunAsync)   |
| `r0/m2/s2-blazor` | 0              | 0              | 1 (RunAsync)   |
| `r0/m3/s2-blazor` | 1 (password)   | 0              | 1 (RunAsync)   |


---



## 5. Conclusions

*To be written.*