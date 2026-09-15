---
type: task
mode: ANALYSIS
lifecycle: living
scope: product
status: ready
---

# 游客自助陈展故事与服务闭环梳理

## 最近一轮结果（2026-09-11）

疑似跌倒体验已完成用户确认并由维护任务吸收；故事内容读取 `docs/architecture/exhibition-stories/suspected-fall-emergency.md`，特殊组件、抢占、红色守护与验收读取 `docs/specs/aios-exhibition-design-system.md` 第 23 节。本任务不保留第二份流程或文案，当前回到 `ready`，等待新的故事讨论。

## Goal

按陈展核心 Owner 继续讨论和验证故事、状态及服务闭环，提出需要用户确认的增量，避免任务持有第二套产品定义。

## Sources

- `docs/knowledge/products/aios-exhibition-context.md`
- `docs/architecture/aios-exhibition-experience.md`
- `docs/architecture/exhibition-stories/README.md`；单故事工作只追加对应故事 Owner。
- `docs/specs/aios-exhibition-design-system.md`
- 本轮用户补充的具体页面或场景材料。

## Scope

- 按 Sources 的当前范围讨论体验流程、场景事实、系统状态与服务结果。
- 不套用旧陈展框架；不修改既有产品定义或直接实现前端。
- 新事实、流程或规格经用户确认后，按任务协议转入执行模式或维护任务，在对应 Owner 原地沉淀。

## Deliverables

- 面向当前问题的分析、设计建议及待确认项。
- 必要时提供临时证据；不复制事实、总架构、故事 Owner 或设计系统的完整定义。

## Acceptance

- 当前用户指令与 Owner 范围一致，冲突先说明。
- 区分用户确认、设计建议、实现现状与未验证信息。
- 结论指向相应 Owner，避免重复定义。

## Context Manifest

```text
Current Task:
- docs/tasks/product/exhibition-story-discovery.md

README Chain:
- README.md
- docs/README.md
- docs/tasks/README.md
- docs/knowledge/README.md
- docs/knowledge/products/README.md
- docs/architecture/README.md
- docs/specs/README.md

Direct References:
- docs/knowledge/products/aios-exhibition-context.md
- docs/architecture/aios-exhibition-experience.md
- docs/architecture/exhibition-stories/README.md
- docs/architecture/exhibition-stories/<current-story>.md
- docs/specs/aios-exhibition-design-system.md

Owner Closure:
- 事实 Owner、总体体验架构、故事路由、当前故事 Owner 与完整设计系统
- docs/knowledge/products/origin-home-eldercare.md（仅补充产品定位及系统原则时）
- docs/RULES.md
- docs/canonical-vocabulary.md

Missing:
- none；没有当前故事时不解析占位路径 `<current-story>`，绑定具体故事后替换为实际 Owner。

Conflicts:
- none
```

## 当前状态

正常、空气异常、人体不适和疑似跌倒均已有独立故事 Owner。本任务保持 `ready`，后续只承接新的故事讨论，不作为现有流程定义或前端授权；已实现范围和验证记录见 `../exhibition-frontend.md`。
