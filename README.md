# Thesis research: AI-driven code migration

Bachelor thesis research on **AI-assisted migration of legacy web applications** — from a fixed vanilla PHP codebase to modern full-stack targets (Next.js and Blazor), using Cursor as the migration agent.

**Research question:** To what extent is AI-assisted code migration a valid and qualitatively sound approach for modernizing legacy web applications, and what are the implications for the role of the developer and the IT organization?

The study is a controlled case study: one legacy app, one engineer, one AI tool. It varies target stack and developer–agent interaction methodology across eight migrations, each measured at raw output (R0) and after a fixed remediation loop (R1).

## Repository layout

| Path | Purpose |
|------|---------|
| [`original-immutable/`](original-immutable/) | Frozen legacy PHP app (the research control). Read-only — do not modify. |
| [`plan/`](plan/) | Research design, decisions, and phased execution guides. |

Migration outputs and working copies will live outside `original-immutable/` as the experiment progresses.

## Documentation

Start with the master plan, then follow the phase guides in order:

1. [`plan/research-project-plan.md`](plan/research-project-plan.md) — full research design, decisions, and methodology (M1–M4, R0/R1, evaluation dimensions)
2. [`plan/phase1/phase1.md`](plan/phase1/phase1.md) — establish the research object (scope, inventory, test data)
3. [`plan/phase2/phase2.md`](plan/phase2/phase2.md) — instruments, methodology definitions, migration order
4. [`plan/phase3/phase3.md`](plan/phase3/phase3.md) — execute the migration matrix
5. [`plan/phase4/phase4.md`](plan/phase4/phase4.md) — comparative evaluation
6. [`plan/phase5/phase5.md`](plan/phase5/phase5.md) — bridge to stakeholder interviews

For the legacy application itself, see [`original-immutable/silent_auction_merged/README.md`](original-immutable/silent_auction_merged/README.md).
