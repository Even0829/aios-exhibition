---
type: task
mode: EXECUTION
lifecycle: living
scope: docs-governance
status: ready
---

# Knowledge Base Maintenance

## Goal

随着项目演进，保持知识库一致、可导航、已压缩，并适合 AI 安全协作。

## Sources

- `AGENTS.md`
- `docs/README.md`
- `docs/RULES.md`
- `docs/canonical-vocabulary.md`
- `docs/tasks/README.md`
- 本轮直接影响的 Owner。
- 本轮引用的临时报告或 source-intake report。

## Context Manifest

当前无进行中的维护轮；以下为最近完成的电视端家庭设备与账号界面上下文。

```text
Current Task:
- docs/tasks/kb-maintenance.md
README Chain:
- README.md
- docs/README.md
- docs/tasks/README.md
- docs/knowledge/README.md
- docs/knowledge/products/README.md
- docs/architecture/README.md
- docs/specs/README.md
Direct References:
- 2026-09-16 本任务对话中的电视端收敛确认
- .tmp/reviews/device-tv-design-proposal.md
- docs/tasks/exhibition-frontend.md
Owner Closure:
- docs/RULES.md
- docs/knowledge/products/aios-exhibition-context.md
- docs/architecture/aios-exhibition-experience.md
- docs/specs/aios-exhibition-design-system.md
Missing:
- none
Conflicts:
- none；旧设备开关、独立手机管理和账号详情方案按用户最新确认收敛
```

## This Round Input

任务回到 `ready` 时重置为 `none`。

none

## Latest Completed Round

2026-09-16：吸收已确认并完成浏览器验收的电视端家庭设备方案。事实 Owner 记录 Home Assistant 目标、电视／App 分工、平台与真实接入待验证边界；体验架构收敛为设备列表／详情、账号列表和同面板手机接续；设计系统更新 12 台连续 Mock、涂鸦 9／小米 3、语音回执、异常和遥控验收。旧临时评审稿已改为吸收指针，不再保留独立手机管理、账号详情或卡片开关的平行定义。前端任务已记录构建、固定预览、1920／1280 浏览器检查、方向键、分层返回与无控制台告警并回到 `ready`。

2026-09-15：依据最新引元来源与用户三轮确认，升级引元产品 Owner，新增通用系统模型和来源卡；同步康养垂类身份、决策三维、陈展样板关系、术语和导航。旧生态改为按需参考，不再作为默认上位依赖。已核对新文档各章归属、受影响 Owner 语义及旧定位残留；结构扫描的本地链接与任务 frontmatter 均无错误，重复标题为模板和跨文档章节，不据此认定定义重复。未修改前端、场景阈值、设备或外部服务。来源分析已重置，临时报告完成吸收并清理；技术实现与全量场景语义不属于本轮验收。

2026-09-14：将用户重复确认的“Mock 只属于实现与交付边界，不进入观众可见文案”明确写入完整设计系统，并清理空气异常决策项和记忆详情的两处前台标识；同时将通用结束卡节奏更新为绿色圆环 3.6 秒走满、完成态停留 3 秒后再进入既有回流转场。前端任务已记录构建、5186 同步、页面文案与连续时序采样，控制台无告警并回到 `ready`。

2026-09-14：以用户最新确认为来源，将空气异常事实 Owner、独立故事 Owner 和完整设计系统统一为“CO₂ 持续偏高 → 空气消杀机低扰动空气优化 Mock → 设备运行回执 → 持续监测 → 后续读数确认回落”。当前故事明确不加入开窗／通风提醒，并保留真实降低 CO₂ 能力未验证的边界。前端任务已记录构建、5186 同步、流程核对和无运行告警并回到 `ready`。

2026-09-14：将语音球 `idle / thinking / responding` 统一动作协议吸收到总体体验架构、正常／空气异常／人体不适／疑似跌倒故事 Owner 和完整设计系统。规范明确无交互保持默认，思考／分析静默但使用 `thinking`，语音播报稳定开始后使用更强 `responding`，结束恢复 `idle`；蓝／黄／红语义色与动作状态继续独立。前端任务已记录参数、构建、预览同步及浏览器三态验证并回到 `ready`。

2026-09-14：将三处已在 5186 验证的文案吸收到正确 Owner：疑似跌倒二次询问完整提示“我没事／我需要帮助”，持续守护卡改为“持续守护，记录实时状态”，人体明显不适执行目标改为用户确认版本。同步范围为疑似跌倒故事、人体不适故事与完整设计系统；未改变故事流程、组件规范或外部协同边界。前端任务已记录构建、预览同步和浏览器核对并回到 `ready`。

2026-09-11：吸收疑似跌倒前端逐页纠偏和 Figma `329:69` 最终确认。故事 Owner 更新为全局页头／导航保留、顶部状态不染红、确认页只复用红色毛玻璃且无额外证据卡、求助／无人回应直接进入联系人同步和持续守护；执行三卡顺序固定为“执行目标 → 同步紧急联系人 → 持续守护”，联系人完成态只让红色圆环走满并保留同步图标。完整设计系统第 23 节同步了页面亮度、组件边界、Demo 查验菜单、状态模型 `pending → initiated → guarding` 和验收；总体体验架构仅更新故事路由摘要。前端任务已记录构建、5186 同步和浏览器验证并回到 `ready`。

2026-09-11：已将疑似跌倒首版前端 Mock 的实现与验证边界吸收到故事 Owner、总体体验架构和完整设计系统第 23 节。文档明确区分已实现的全局抢占、三分支、协同状态、持续守护、确认记录与恢复，和仍未接入的专属 Figma 逐页确认、真实射频、语音识别、外部通知与现场回执；同时把场景配置映射修正为 `src/fallMock.ts`。前端任务已记录构建、5186 同步、浏览器覆盖范围和未覆盖项并回到 `ready`。

2026-09-11：完成“总体体验架构＋四个故事 Owner＋一个完整设计系统”的总分结构。疑似跌倒评审稿已吸收到故事 Owner 与设计系统第 23 节；空气异常、人体不适和疑似跌倒三份临时评审稿均已删除。故事任务与前端任务改为按当前故事 Owner 低成本加载。知识库扫描共识别 49 个 Markdown 文件，本地链接与任务 frontmatter 均无错误；重复标题报告为跨模板／四故事相同章节名，不构成 Owner 冲突。本轮仅为文档治理，未执行前端、浏览器、真实设备或外部协同验证。

## Scope

In scope:

- 新增、移动、拆分、合并或压缩文档 Owner。
- 更新 Owner Map、术语表、README 路由和任务引用。
- 修复坏链、重复定义、错放知识、陈旧报告和生命周期问题。
- 将临时报告或已完成任务中被接受的结论吸收到 Owner。
- 将 source-intake report 中被接受的结论吸收到狭窄 Owner。
- 只有在存在来源材料且没有当前 Owner 可承载时，才创建狭窄 Owner stub。
- 所有权或定义冲突时，创建冲突报告。

Out of scope:

- 没有来源材料时编造产品、市场、用户或技术事实。
- 生产环境或外部服务变更。
- 未经明确确认删除用户写入的 Durable Content。

## Maintenance Loop

1. 绑定本轮输入并将状态设为 `active`。
2. 解析 Context Manifest。
3. 执行清单扫描或聚焦扫描。
4. 将变更分类为 Owner 更新、路由更新、术语更新、任务生命周期更新或临时证据清理。
5. 先修复 Owner。
6. 将重复定义压缩为引用。
7. 更新路由和受影响任务引用。
8. 验证链接、任务 frontmatter、生命周期和未解决冲突。
9. 除非存在持续工作流，否则把本轮输入重置为 `none` 并回到 `ready`。

## Auto-Documentation Rules

只有同时满足以下条件时，AI 才可自动更新文档：

- 当前任务、受影响文件或引用证据中有来源材料。
- 正确 Owner 已知，或可按放置规则创建狭窄 Owner。
- 当前模式允许编辑，或已明确绑定本维护任务。
- 更新能降低歧义、消除重复、记录 Durable Fact 或保存已接受决策。

AI 不得自动：

- 编造缺失的产品、市场、用户或技术事实。
- 没有证据时，把一次性实现选择提升为长期规格。
- 创建宽泛空分类，给未来任务制造维护负担。
- 让同一定义同时活跃在多个文件中。

## Deliverables

- 更新后的 Owner 或路由。
- 必要时更新术语表或 Owner Map。
- 临时审查证据被吸收或删除。
- 已完成任务结论按生命周期吸收、重置或删除。
- source-intake reports 被吸收，或保留明确缺失来源条件。
- 阻塞时产出冲突报告。
- 验证记录。

## Acceptance

### Hard Constraints

- 不引入第二定义。
- 每个 Durable Concept 有一个 Owner。
- README 文件只路由，不定义。
- 规则归 `docs/RULES.md`。
- 术语归 `docs/canonical-vocabulary.md`。
- 任务引用 Owner，不成为 Durable Fact 来源。
- 临时报告已吸收、拒绝，或留下明确清理条件。
- 自动文档更新有来源材料支撑。

### Soft Evaluation

- 知识库更小、更清楚，更便于下一位 AI 或人类协作者导航。
- 因路由和 Direct References 更清晰，未来 agents 可加载更少上下文。
- 修复优先处理根 Owner，而不是表面补丁。
