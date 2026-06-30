---
name: scaffold-migration-cell
description: Copies migrations/template/ into a new R0 migration cell folder (migrations/r0/m{m}/s{s}-{stack}/), enables .cursor/ in the cell .gitignore, and pre-fills conversation-log.md with the frozen prompt and mode from plan/phase2/methodology-protocols.md. Use when the user asks to scaffold, init, or copy a migration cell and supplies r, m, and s (e.g. "scaffold r0 m2 s1").
disable-model-invocation: true
---

# Scaffold Migration Cell

Copy `migrations/template/` into a new R0 migration cell, adjust `.gitignore`, and prepare `conversation-log.md` for the first prompt.

## Inputs

The user supplies three parameters: **r**, **m**, **s**.

| Param | Allowed       | Resolves to                        |
| ----- | ------------- | ---------------------------------- |
| `r`   | `0` only      | Path segment `r0`; tag prefix `r0` |
| `m`   | `1`, `2`, `3` | Path segment `m1` / `m2` / `m3`    |
| `s`   | `1`, `2`      | `s1` → `nextjs`; `s2` → `blazor`   |

**Derived identifiers:**

| Item          | Pattern                          | Example           |
| ------------- | -------------------------------- | ----------------- |
| Folder name   | `s{s}-{stack}`                   | `s1-nextjs`       |
| Target path   | `migrations/r0/m{m}/s{s}-{stack}/` | `migrations/r0/m2/s1-nextjs/` |
| Migration tag | `r0-m{m}-s{s}-{stack}`           | `r0-m2-s1-nextjs` |

| Input          | Path                                              |
| -------------- | ------------------------------------------------- |
| Template       | `migrations/template/`                            |
| Frozen prompts | `plan/phase2/methodology-protocols.md`            |
| Log template   | `migrations/template/conversation-log.md` (structure) |

## Validation

Fail fast with a clear message if:

- `r ≠ 0` — this skill is R0-only; R1 remediation continues in the same cell folder (Phase 3)
- `m` not in `1`–`3` or `s` not in `1`–`2`
- Target path already exists — do not overwrite

## Workflow

1. **Parse** `r`, `m`, `s` from the user request. Confirm values if ambiguous.
2. **Validate** per rules above.
3. **Create** parent directories `migrations/r0/m{m}/` if missing.
4. **Copy** `migrations/template/` recursively into the target path.
   - Preserve dotfiles (`.cursor/`, `.gitignore`).
   - Do **not** modify `migrations/template/` or `original-immutable/`.
5. **Edit** `.gitignore` in the new cell only — uncomment `.cursor/`:

   ```gitignore
   .cursor/
   original-php-project/
   ```

   Replace `# .cursor/` with `.cursor/`; leave `original-php-project/` unchanged.

6. **Read** `plan/phase2/methodology-protocols.md` and copy the frozen prompt verbatim from the section matching `m` and `s` (see lookup table below).
7. **Edit** `conversation-log.md` in the new cell (field mapping below).
8. **Run** the verification checklist.

### Copy notes

Template includes `.cursor/rules/` (cold-start + database-schema), `code/original-php-project/`, `code/migrated-project/`, `conversation-log.md`, and `.gitignore`. Use a recursive copy that preserves hidden files and directory structure.

## Conversation log

Edit only the new cell's `conversation-log.md`. Keep the template structure; replace placeholders as follows:

| Field                         | Value |
| ----------------------------- | ----- |
| Title                         | `# Conversation Log — \`{tag}\`` where `{tag}` = migration tag |
| Migration (cell)              | `` `{tag}` (e.g. `{tag}`) `` |
| Date                          | Today's date as `YYYY/MM/DD` |
| pre-generation (spec)         | M1: `None (no planning)`; M2/M3: `...` |
| generation                    | `...` |
| Prompt 1 — Starting condition | `None/Cold` |
| Prompt 1 — Mode               | M1: `` `agent` ``; M2/M3: `` `plan` `` |
| Prompt 1 — Prompt             | Verbatim frozen prompt from methodology-protocols.md |
| Duration                      | `...` |
| Brief description of changes  | `...` |
| Reply                         | `...` (inside the fenced `md` block) |

**Mode rationale:** M1 has no planning step — first prompt runs in agent mode. M2/M3 use plan mode as the precursor that produces the guideplan; migration execution afterward is agent mode (not logged in Prompt 1).

### Frozen prompt lookup

Read the prompt text exactly from the fenced `text` block in `plan/phase2/methodology-protocols.md`. Do not paraphrase.

| m | s | Section heading |
| - | - | --------------- |
| 1 | 1 | M1 — Frozen prompt — Next.js |
| 1 | 2 | M1 — Frozen prompt — Blazor |
| 2 | 1 | M2 — Frozen prompt — Next.js |
| 2 | 2 | M2 — Frozen prompt — Blazor |
| 3 | 1 | M3 — Frozen prompt — Next.js |
| 3 | 2 | M3 — Frozen prompt — Blazor |

## Verification

Before finishing:

- [ ] Target path exists and contains `.cursor/`, `code/`, `.gitignore`, `conversation-log.md`
- [ ] Cell `.gitignore` has uncommented `.cursor/` (not `# .cursor/`)
- [ ] Migration tag in title and table matches `r0-m{m}-s{s}-{stack}`
- [ ] Prompt 1 mode is `agent` (M1) or `plan` (M2/M3)
- [ ] Prompt 1 text matches methodology-protocols.md verbatim for the given m/s
- [ ] Unknown timing/response fields are `...`
- [ ] `migrations/template/` and `original-immutable/` were not modified
- [ ] No commit unless the user explicitly requests one
