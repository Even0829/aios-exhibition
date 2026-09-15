---
type: task
mode: ANALYSIS
lifecycle: repeatable
scope: docs-governance
status: ready
---

# Repository Governance Review

## Goal

Verify that root collaboration files and `docs/**` satisfy the governance, ownership, lifecycle, and context-resolution rules owned by this repository. This task runs review only; it cites rules and must not become a second rule source.

## Sources

- `docs/RULES.md` - governance, ownership, naming, lifecycle, conflicts, quality gates.
- `docs/canonical-vocabulary.md` - official terms, aliases, deprecated names, term Owners.
- `docs/README.md` - knowledge-base navigation and Owner map.
- `docs/foundation/README.md` - Foundation boundary.
- `docs/knowledge/README.md` - Knowledge boundary.
- `docs/architecture/README.md` - Architecture boundary.
- `docs/specs/README.md` - Specs boundary.
- `docs/tasks/README.md` - task contract, context resolution, status, lifecycle.

## Context Manifest

Fill this when the review is bound and active.

```text
Current Task:
- docs/tasks/governance/repository-governance-review.md

README Chain:
- README.md
- docs/README.md
- docs/tasks/README.md
- docs/tasks/governance/README.md

Direct References:
- AGENTS.md
- docs/RULES.md
- docs/canonical-vocabulary.md
- docs/glossary.md
- docs/foundation/README.md
- docs/knowledge/README.md
- docs/architecture/README.md
- docs/specs/README.md
- docs/tasks/README.md

Owner Closure:
- All Owners reached by README routes during the review

Missing:
- none

Conflicts:
- none
```

## Scope

- Review root `AGENTS.md`, root `README.md`, and current Markdown under `docs/**`.
- Classify each file by layer, ownership, document type, and lifecycle.
- Check misplaced knowledge, duplicate definitions, stale references, broken links, lifecycle violations, oversized tasks, and compressible repetition.
- Check whether future AI calls can load context cheaply through README routes, task sources, and Owner closure.
- Do not modify Owners, code, or durable docs in this analysis task.

## Finding Severity

- **Blocking Conflict**: naming, definition, layer placement, mechanism ownership, domain boundary, rule ownership, reference, or lifecycle conflict that can produce two valid answers or unsafe AI execution. Stop scanning and report the block.
- **Optimization**: compressible repetition, weak routing, unclear wording, oversized tasks, or maintainability issues that do not create conflicting truth. Record and continue.

If evidence is insufficient for a blocking conflict, classify it as Optimization.

## Scan Order

```text
Root
-> Governance (docs/README, RULES, canonical-vocabulary, glossary)
-> Foundation
-> Knowledge
-> Architecture
-> Specs
-> Tasks
-> Temporary evidence
```

Within each group, scan lexicographically. Each file has exactly one ledger status: `not-scanned`, `pass`, `optimization`, or `conflict`.

## Steps

1. Build the Context Manifest from `docs/tasks/README.md`.
2. Generate the Markdown file inventory and initialize the ledger as `not-scanned`.
3. Run structure checks: local links, README chain availability, task frontmatter, lifecycle fields, deprecated paths, and layer dependency direction.
4. Run semantic Owner review file by file.
5. Record each finding with evidence path, severity, Owner, root repair, impact, and verification condition.
6. Stop immediately on Blocking Conflict; leave unscanned files as `not-scanned`.
7. After repair, rescan changed files, direct references, Owner closure, and affected README chain before continuing.
8. After first full pass, run a final link and cross-layer consistency pass.

## Deliverables

- `.tmp/reviews/repository-governance-review-report.md`
- The report records Context Manifest, file ledger, findings, stop position when blocked, Owner repair plan, impact, verification, and conclusion.
- The report is temporary evidence. Absorb accepted conclusions through `docs/tasks/kb-maintenance.md`, then delete the report.

## Acceptance

### Hard Constraints

- Context Manifest has no unresolved missing files or conflicts.
- File ledger covers every in-scope Markdown file.
- No unscanned files are marked as passed.
- Every finding has evidence path, severity, Owner, root repair, impact, and verification.
- Blocking Conflict produces a blocked conclusion, not a full-pass conclusion.
- Findings distinguish governance repair from content invention; missing source material becomes a task, not asserted knowledge.

### Soft Evaluation

- Optimizations are sorted by impact, compression value, and maintenance cost.
- Root-cause repair is preferred over preserving existing files.
