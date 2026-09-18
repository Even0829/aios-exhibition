# tasks/

`tasks/` 存放工作契约。本文件拥有请求绑定、任务结构、状态、Context Manifest 和任务生命周期。

任务只回答：

- 要做什么？
- 哪些 Owner 提供事实和规则？
- 什么在范围内，什么在范围外？
- 交付什么？
- 如何验证成功？

任务不拥有 Durable Facts、规则、术语或 Specs。任务只引用 Owner。

## 任务路由

按当前请求选择已有任务；具体模式、范围和状态以任务文件为准。

| 当前工作 | 任务入口 |
| --- | --- |
| 陈展前端逐页还原与组件实现 | `exhibition-frontend.md` |
| 陈展故事、状态、服务闭环的分析与讨论 | `product/exhibition-story-discovery.md` |
| 设备中心 PRD 与跨端需求维护 | `product/device-center-prd.md` |
| 接收新材料，区分事实、提案和待核实项 | `source-intake.md` |
| 更新 Owner、吸收结论、维护路由与清理重复内容 | `kb-maintenance.md` |
| 核查知识库治理、引用、生命周期及上下文调用 | `governance/repository-governance-review.md` |
| 长期产品的老人及子女用户问题研究 | `product/elder-user-problem-discovery.md` |
| 长期产品的优先问题与真实生活场景探索 | `product/priority-problem-life-scenarios.md` |
| 长期产品的核心能力服务案例分析 | `product/service-case-design.md` |

治理任务目录与已完成初始化记录见 `governance/README.md`。陈展前端实现绑定 `exhibition-frontend.md`；不可将故事分析任务直接当成实现授权。

## 请求绑定

1. 用户明确指向某个任务时，绑定该任务。
2. 如果请求是某项工作的延续，绑定对应 `ready`、`active` 或 `blocked` 任务。
3. 如果请求独立且边界明确，创建新任务。
4. 不同绑定会实质改变范围或风险时，先问用户。
5. 小补充更新当前任务；新目标创建新任务。

创建或更新任务契约是 intake 行为。其他项目修改必须先有绑定任务。

## 低成本调用规则

任务必须降低未来上下文成本：

- 在 `Sources` 中列出直接本地路径。
- 除非任务是审计，优先列具体文件而不是宽泛目录。
- 不手动列 README Chain；协议会推导。
- 不复制 Owner 定义。
- 单次运行证据放 `.tmp/reviews/`，仅在需要时引用。

## Frontmatter

```yaml
---
type: task
mode: ANALYSIS | EXECUTION
lifecycle: one-off | repeatable | living
scope: docs-governance | product | design | engineering | research | other
status: ready | active | blocked | completed
---
```

## 状态

```text
ready -> active -> blocked -> active -> completed
```

规则：

- 单个执行上下文中只应有一个 `active` 任务。
- 只有实际开始工作时，才把 `ready` 改为 `active`。
- `blocked` 必须写明原因和恢复条件。
- `completed` 必须有验收证据。
- 完成后按生命周期处理任务。

## Context Resolution Protocol

实质实现前必须解析上下文。

解析单元：

- **Direct References**：任务明确列出的本地来源、验收或前置路径。
- **README Chain**：从仓库根到目标路径的 README，按 root-to-leaf 读取。
- **Owner Closure**：Direct References 加上其中明确点名的 Owner、验收来源或必要前置。
- **Context Manifest**：本轮实际加载的上下文证据。

Context Manifest 是运行时证据，不应成为 Durable Definition。

算法：

1. 读取根 `README.md` 和 `docs/README.md`。
2. 读取任务路径上的 README。
3. 读取任务。
4. 抽取 Direct References。
5. 对每个引用路径做规范化，读取其 README Chain，再读取目标文件。
6. 将明确点名的 Owner 和验收来源加入队列。
7. 去重已读路径。
8. 遇到缺失文件、未解决冲突或无法解释的循环引用时停止。

启动门禁：

- 当前任务已绑定。
- 真正开始工作时状态为 `active`。
- README Chain 和 Owner Closure 完整。
- Missing 与 Conflicts 为空，或已被明确排除出范围。
- 模式允许操作。

## Context Manifest

```text
Current Task:
- docs/tasks/<scope>/<task>.md

README Chain:
- README.md
- docs/README.md
- ...

Direct References:
- ...

Owner Closure:
- ...

Missing:
- none

Conflicts:
- none
```

## 生命周期

- `one-off`：一次性有边界交付；结果吸收并验收后删除，除非明确需要可见审计记录。
- `repeatable`：可复用契约；每轮验收后重置为 `ready`。
- `living`：长期对象；只有对象正在演进时才保持 `active`。

审查报告和临时证据放 `.tmp/reviews/`，不放在 `docs/`。

## Maintenance Handoff

已完成任务产生 Durable Conclusion 时：

1. 判断结论是事实、规则、术语、架构、规格，还是仅任务结果。
2. 将事实/规则/术语/架构/规格吸收到正确 Owner。
3. 仅在必要时更新路由和术语表。
4. 跨 Owner 清理、压缩或吸收报告时，绑定 `docs/tasks/kb-maintenance.md`。
5. `one-off` 任务在价值吸收后删除或重置，除非明确需要可见审计轨迹。

## Source Intake

当用户提供粗略笔记、对话、截图或非结构化项目材料时，先绑定可重复的 source-intake 任务，再创建 Durable Owner。Intake 负责分类材料、记录证据、识别候选 Owner，并把被接受的结论路由到维护任务。

## 标准任务模板

```markdown
---
type: task
mode: ANALYSIS | EXECUTION
lifecycle: one-off | repeatable | living
scope: docs-governance | product | design | engineering | research | other
status: ready | active | blocked | completed
---

# Task Name

## Goal

## Sources

List direct Owners, acceptance sources, and required prerequisites only.

## Scope

## Deliverables

## Acceptance

### Hard Constraints

### Soft Evaluation
```
