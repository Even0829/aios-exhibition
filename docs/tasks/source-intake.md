---
type: task
mode: ANALYSIS
lifecycle: repeatable
scope: docs-governance
status: ready
---

# Source Intake

## Goal

把用户提供或项目中发现的原始材料转成有来源支撑的候选知识，不编造事实，也不过早创建 Durable Owner。

## Sources

- `AGENTS.md`
- `docs/README.md`
- `docs/RULES.md`
- `docs/canonical-vocabulary.md`
- `docs/tasks/README.md`
- "This Round Input" 中列出的原始材料。

## Context Manifest

当前无进行中的来源分析。新一轮绑定并进入 `active` 后，按任务协议填写实际 README Chain、Direct References、Owner Closure、Missing 与 Conflicts。

## This Round Input

任务回到 `ready` 时重置为 `none`。

- none

## Scope

In scope:

- 将原始材料分类为事实、原则、架构、规格、任务、术语和不确定项。
- 识别候选 Owner 和缺失 Owner。
- 识别与现有 Owner 的冲突。
- 产出临时 intake report。
- 推荐维护动作。

Out of scope:

- 编造材料中不存在的事实。
- 把不确定断言提升为 Durable Owner。
- 在本 `ANALYSIS` 任务中修改 Durable Docs。

## Classification

| Class | Destination |
| --- | --- |
| Durable Fact | `docs/knowledge/` 或既有事实 Owner |
| Principle | `docs/foundation/` |
| Structure | `docs/architecture/` |
| Spec | `docs/specs/` |
| Task | `docs/tasks/` |
| Term | `docs/canonical-vocabulary.md` |
| Uncertain | `.tmp/reviews/` 或 blocked task |

## Deliverables

- `.tmp/reviews/source-intake-report.md`
- 候选 Owner Map。
- 缺失来源列表。
- 冲突列表。
- 推荐的 `kb-maintenance` 输入。

## Acceptance

### Hard Constraints

- 每个候选 Durable Claim 都指向来源材料。
- 不确定断言不写成事实。
- 候选 Owner 足够窄，且层级正确。
- 冲突会阻止持久化提升。

### Soft Evaluation

- 用户可以提供凌乱材料，仍获得清晰下一步。
- 报告通过识别可能 Owner 降低未来上下文成本。
