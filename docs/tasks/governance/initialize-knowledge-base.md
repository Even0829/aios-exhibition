---
type: task
mode: EXECUTION
lifecycle: one-off
scope: docs-governance
status: completed
---

# 初始化项目知识库

## Goal

为 `Aios盒子` 建立参考级知识库治理骨架，并让后续 AI 协作默认按任务绑定、Owner、Context Manifest 和生命周期规则运行。

## Sources

- `/Users/admin/.codex/skills/knowledge-base-governance/SKILL.md`
- `/Users/admin/.codex/skills/knowledge-base-governance/references/system-blueprint.md`
- `/Users/admin/.codex/skills/knowledge-base-governance/references/governance-protocol.md`
- `/Users/admin/.codex/skills/knowledge-base-governance/references/task-collaboration-protocol.md`
- `/Users/admin/.codex/skills/knowledge-base-governance/references/context-invocation.md`
- `/Users/admin/.codex/skills/knowledge-base-governance/references/readme-patterns.md`
- `/Users/admin/.codex/skills/knowledge-base-governance/references/project-evolution-pipeline.md`

## Context Manifest

```text
Current Task:
- docs/tasks/governance/initialize-knowledge-base.md

README Chain:
- README.md
- docs/README.md
- docs/tasks/README.md
- docs/tasks/governance/README.md

Direct References:
- skill and reference files listed in Sources

Owner Closure:
- AGENTS.md
- docs/README.md
- docs/RULES.md
- docs/canonical-vocabulary.md
- docs/tasks/README.md

Missing:
- none

Conflicts:
- none
```

## Scope

In scope:

- 创建参考级知识库核心文件和目录。
- 明确 `AGENTS.md`、`docs/RULES.md`、`docs/README.md`、`docs/tasks/README.md`、`docs/canonical-vocabulary.md` 的权威边界。
- 建立 source intake、kb maintenance 和 repository governance review 三个长期治理入口。
- 将模板改写为当前项目可用的中文协作规则。

Out of scope:

- 定义产品、用户、市场、系统或实现事实。
- 创建没有来源材料支撑的领域 Owner。
- 发布、远程写入或修改外部系统。

## Deliverables

- `README.md`
- `AGENTS.md`
- `docs/README.md`
- `docs/RULES.md`
- `docs/canonical-vocabulary.md`
- `docs/glossary.md`
- `docs/foundation/README.md`
- `docs/knowledge/README.md`
- `docs/architecture/README.md`
- `docs/specs/README.md`
- `docs/tasks/README.md`
- `docs/tasks/source-intake.md`
- `docs/tasks/kb-maintenance.md`
- `docs/tasks/governance/README.md`
- `docs/tasks/governance/repository-governance-review.md`
- `.tmp/reviews/README.md`

## Acceptance

### Hard Constraints

- AI 后续不能安全绕过任务绑定直接修改项目内容。
- README 文件只路由，不拥有 Durable Definition。
- 规则、术语、任务协议分别只有一个 Owner。
- 空领域目录不包含编造事实。
- 临时证据有 `.tmp/reviews/` 路由和吸收/删除机制。

### Soft Evaluation

- 后续任务可从 `AGENTS.md`、`docs/README.md`、`docs/tasks/README.md`、绑定任务、Direct References 和 Owner Closure 低成本启动。
- 用户可直接提供粗略材料，由 `source-intake` 分类后再进入 Owner。
