# 项目知识库

本文件只负责导航和 Owner 映射，不拥有 Durable Definition。

AI 运行行为由 `AGENTS.md` 管；治理规则由 `RULES.md` 管；任务绑定和 Context Manifest 由 `tasks/README.md` 管。

知识库是长期项目资产：通过路由和 Owner 保存记忆，避免未来 AI 为了理解任务而加载全仓文档。

## 层级地图

| Layer | Directory | 回答的问题 | 拥有内容 |
| --- | --- | --- | --- |
| Foundation | `foundation/` | 为什么存在？ | 使命、世界观、长期原则 |
| Knowledge | `knowledge/` | 我们知道什么？ | 项目、产品、领域、用户、市场、场景、伙伴、系统事实 |
| Architecture | `architecture/` | 信息如何组织？ | 信息架构、流程、叙事、页面/媒介结构 |
| Specs | `specs/` | 应如何构建或判断？ | UX、UI、内容、技术、质量验收 |
| Tasks | `tasks/` | 当前要做什么？ | 工作契约和执行状态 |

核心契约：

- `RULES.md`：治理、所有权、冲突、生命周期。
- `canonical-vocabulary.md`：官方术语、别名、废弃名称、术语 Owner。
- `tasks/README.md`：请求绑定、任务结构、Context Manifest、状态、生命周期。

## 常用路由

- **AIOS 家庭康养陈展 Demo**：先读 `knowledge/products/aios-exhibition-context.md`；全局状态、中断恢复和功能结构读 `architecture/aios-exhibition-experience.md`；单个体验故事从 `architecture/exhibition-stories/README.md` 路由到对应 Owner；所有通用、特殊、例外、Figma 还原、Mock、组件、动效和验收规范统一读 `specs/aios-exhibition-design-system.md`。现有产品业务场景不作为默认前置。
- 开展家庭康养产品级场景、功能或交互设计：从 `knowledge/products/origin-home-eldercare.md` 开始。
- 选择核心场景能力、设计具体服务场景：继续读取 `knowledge/products/origin-home-eldercare-scenarios.md`。
- 查看当前五个具体服务场景已使用设备、后续建议增强或逐场景设备组合：读取 `knowledge/products/origin-home-eldercare-devices.md`。
- 设计具体服务流程前，读取 `specs/eldercare/shared-service-mechanisms.md` 复用规律、任务、联系人、确认、设备、空间感知与就近调度、计划、测量、健康分流、中低风险主动服务和趋势机制。
- 开展夜间起身后卫生间无回应场景的开发评审：读取 `specs/eldercare/nighttime-bathroom-no-response.md`。
- 开展其余四个优先场景的开发评审：分别读取 `specs/eldercare/morning-blood-pressure-medication.md`、`specs/eldercare/sudden-dizziness-chest-distress.md`、`specs/eldercare/post-discharge-30-day-recovery.md` 和 `specs/eldercare/multiweek-functional-decline.md`。
- 理解引元上位定义：读取 `knowledge/products/origin.md`。
- 理解 AIOS 生态依赖：读取 `knowledge/system/aios-ecosystem.md`。
- 涉及使命、主动服务、物理 AI 或长期原则：读取 `foundation/aios-worldview.md`。
- 设计信息结构：从 `architecture/` 开始。
- 执行或审查工作：从 `tasks/README.md` 和绑定任务开始。
- 检查规则：读取 `RULES.md`。
- 检查命名：读取 `canonical-vocabulary.md`；`glossary.md` 是兼容跳转入口。

## 低成本 AI 调用

大多数任务只加载：

1. `AGENTS.md`
2. 本文件
3. `tasks/README.md`
4. 绑定任务
5. 任务与 Direct References 的 README Chain
6. 任务列出的 Direct References
7. 明确 Owner Closure

除非绑定任务是完整治理审查，不要加载全量 `docs/**`。

## Owner Map

高影响 Owner 在这里登记。本表是路由，不复制定义。

| Concept | Owner Path | Referenced By | Stability | Notes |
| --- | --- | --- | --- | --- |
| 知识库治理 | `docs/RULES.md` | `AGENTS.md`, `docs/README.md`, `docs/tasks/README.md` | Long-term | 唯一规则 Owner |
| 官方术语 | `docs/canonical-vocabulary.md` | 使用受控术语的所有文档 | Long-term | 只管名称、别名和使用边界 |
| 任务协议 | `docs/tasks/README.md` | `AGENTS.md`, task files | Long-term | 请求绑定和 Context Manifest |
| AIOS 世界观 | `docs/foundation/aios-worldview.md` | 战略判断、产品原则与长期价值判断 | Long-term | 使命、主动服务、物理 AI、中心资产 |
| AIOS 生态 | `docs/knowledge/system/aios-ecosystem.md` | 跨产品设计与边界判断 | Evolving | 系统定义、当前阶段、五产品分工与协作 |
| 引元 | `docs/knowledge/products/origin.md` | 所有引元产品线与场景产品 | Long-term | 上位定位、能力、产品线和产品边界 |
| 引元家庭康养产品 | `docs/knowledge/products/origin-home-eldercare.md` | 本仓库所有产品设计、架构、规格与任务 | Evolving | 产品定义、首期架构、设计原则与评价框架的单一总 Owner |
| 引元家庭康养核心场景能力 | `docs/knowledge/products/origin-home-eldercare-scenarios.md` | 能力选择、具体服务场景、体验流程 | Evolving | 双 AI 服务角色、五大核心场景能力、价值定位和能力边界的单一 Owner |
| 五个优先具体服务场景设备清单 | `docs/knowledge/products/origin-home-eldercare-devices.md` | 当前设备核对、后续增强建议与逐场景设备组合 | Evolving | 当前五个场景已使用设备、后续建议增强和场景组合的单一 Owner；不包含品牌、型号、价格、供应商或合作要求 |
| 家庭康养共用服务机制 | `docs/specs/eldercare/shared-service-mechanisms.md` | 所有具体服务场景规格和开发拆解 | Evolving | 规律、任务、联系人、确认、设备、空间感知与就近调度、计划、测量、健康分流、中低风险主动服务和趋势机制的唯一 Owner |
| 夜间起身后卫生间无回应场景 | `docs/specs/eldercare/nighttime-bathroom-no-response.md` | 首期场景开发、交互、设备联调和验收 | Evolving | 当前夜间异常核心路径、建议参数和验收的唯一 Owner |
| 晨间血压与服药计划混乱场景 | `docs/specs/eldercare/morning-blood-pressure-medication.md` | 首期场景开发、交互、设备联调和验收 | Evolving | 当前晨间慢病计划核心路径、建议参数和验收的唯一 Owner |
| 独自在家突发头晕或胸闷场景 | `docs/specs/eldercare/sudden-dizziness-chest-distress.md` | 首期场景开发、交互、设备联调和验收 | Evolving | 当前突发不适分流、协同和结果确认的唯一 Owner |
| 出院后30天居家恢复场景 | `docs/specs/eldercare/post-discharge-30-day-recovery.md` | 首期场景开发、交互、设备联调和验收 | Evolving | 当前出院计划执行、阶段复查和转接的唯一 Owner |
| 连续数周生活能力下降场景 | `docs/specs/eldercare/multiweek-functional-decline.md` | 首期场景开发、交互、设备联调和验收 | Evolving | 当前多周变化发现、原因确认和干预复查的唯一 Owner |
| 陈展事实与边界 | `docs/knowledge/products/aios-exhibition-context.md` | 陈展架构、设计与实现任务 | Evolving | 陈展目标、受众、设备输入、事实证据、范围与来源的唯一 Owner |
| 陈展总体体验架构 | `docs/architecture/aios-exhibition-experience.md` | 陈展故事梳理、页面还原与场景验证 | Evolving | 五种可交织状态、共用契约、事件优先级、中断恢复、功能结构与四故事路由的唯一 Owner |
| 陈展四个体验故事 | `docs/architecture/exhibition-stories/README.md` | 陈展单故事设计、实现与验收 | Evolving | 路由到正常、空气异常、人体不适、疑似跌倒四个独立 Owner；每个 Owner 拥有本故事的触发、证据、流程、文案、分支和结果 |
| 陈展设计系统与还原规范 | `docs/specs/aios-exhibition-design-system.md` | 全部陈展故事、Figma 还原、Mock、组件开发与验收 | Evolving | 基础视觉、通用组件、故事变体、特殊状态、例外、语音、动效、前端映射与验收的唯一完整 Owner |
| AIOS 产品设计底座来源 | `docs/knowledge/sources/aios-product-design-base.md` | Source intake 与冲突核查 | Evolving | 来源角色、适用范围与吸收状态 |

只有在真实 Owner 已确定后，才把新的 Durable Concept 加入本表。
