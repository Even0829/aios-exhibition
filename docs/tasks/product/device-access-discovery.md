---
type: task
mode: ANALYSIS
lifecycle: repeatable
scope: product
status: ready
---

# 设备接入与跨端管理讨论

## 当前轮：电视端沉淀与整体 PRD 时机（2026-09-17）

用户确认电视端设备功能阶段性结束，计划下一步以手机小程序形态继续设计；本轮评估电视端是否仍需提取设计规范、组件与交互，以及面向开发的设备功能整体 PRD 应在电视端完成后立即编写、手机端完成后统一编写，还是采用分阶段交付。范围为现有 Owner、实现和交付结构审计，不新增手机端方案、不修改实现或 Durable Owner。Missing: none；Conflicts: none。

本轮结论：现有 `docs/specs/aios-exhibition-design-system.md` 第 17 节已覆盖电视设备页的主要视觉、遥控、语音、异常、空状态和验收规则，可继续作为设计 Owner；仍需在开发交付中补齐可复用组件清单与职责、设备／账号／空间／能力／连接与工作状态等领域模型、控制命令与状态回执、跨端接续契约、需求到设计／代码／验收的追溯矩阵。交付节奏采用两阶段：电视端结束后立即形成可追加的设备 PRD 工作稿与电视端冻结章节，作为手机小程序设计输入；待手机端核心流程、Home Assistant 边界和初期后台范围确认后，再合并发布跨端设备 PRD v1.0。当前不把尚未设计的小程序和平台能力写成定稿，也不等待手机端完成后才整理电视端。本任务回到 ready。

## Goal
按正常家庭需求设计 HA 支撑的设备体验，先完成电视端方案，再展开手机 App；本轮交付电视端可评审方案。

## Sources
- 当前用户需求（2026-09-15）。
- 2026-09-16 用户澄清：HA 负责设备接入与控制，自有电视展示和手机网页配置体验；评估初期是否需要独立平台。
- https://www.home-assistant.io/getting-started/integration/ 及其相关官方概念、接口和品牌集成文档。
- docs/knowledge/products/aios-exhibition-context.md
- docs/architecture/aios-exhibition-experience.md
- docs/specs/aios-exhibition-design-system.md
- demo/aios-exhibition/src/components/DevicePanel.tsx
- demo/aios-exhibition/src/components/MemoryPanel.tsx
- docs/knowledge/products/origin-home-eldercare.md
- 用户后续确认：面向正常家庭；手机暂按 App 设计并支持远程控制；电视可语音控制，复用记忆功能的语音交互方式。独立平台范围尚属评估建议。

## Scope
仅讨论设备功能增量与待确认项；不修改实现或 Durable Owner，不接入外部系统。

## Deliverables
电视端详细方案：`.tmp/reviews/device-tv-design-proposal.md`。覆盖具体布局、组件映射、语音状态、连续 Mock、遥控焦点及验收案例；手机端只定义衔接契约。本轮为设计评审，不执行前端实现。

## Acceptance
区分现状、建议与未核验的品牌接入能力；明确跨端职责和模拟/真实接入边界。

## 本轮验收（2026-09-15）
已核对设备组件及对应 Owner 中的设备与真实接入边界；本轮交付为对话建议，品牌型号、部署与接入范围仍待用户补充。未修改实现或产品定义。

## 本轮验收（2026-09-16）
已浏览用户截图中的五项入门文档，并补查 HA WebSocket、REST、Config Flow 开发文档、Tuya 集成文档及 Xiaomi Home 官方仓库说明。对话给出初期架构建议与授权/配网边界；尚未进行真实设备、配置接口及第三方授权页面验证，建议不作为已确认规格。任务回到 ready 等待用户继续讨论。

本轮外部来源：
- https://www.home-assistant.io/getting-started/concepts-terminology/
- https://www.home-assistant.io/getting-started/onboarding_dashboard/
- https://www.home-assistant.io/getting-started/integration/ （上一轮已读，本轮沿用）
- https://www.home-assistant.io/getting-started/automation/
- https://www.home-assistant.io/getting-started/presence-detection/
- https://www.home-assistant.io/integrations/tuya/
- https://github.com/XiaoMi/ha_xiaomi_home
- https://developers.home-assistant.io/docs/api/websocket/
- https://developers.home-assistant.io/docs/api/rest/
- https://developers.home-assistant.io/docs/config_entries_config_flow_handler/

## Context Manifest
Current Task: docs/tasks/product/device-access-discovery.md
README Chain: README.md → docs/README.md → docs/tasks/README.md；docs/knowledge/README.md → docs/knowledge/products/README.md；docs/architecture/README.md；docs/specs/README.md；demo/aios-exhibition/README.md。
Direct References: Sources 中各文件，按设备功能范围读取。
Owner Closure: 陈展事实边界、总体体验架构、设计系统的设备/记忆/共享面板约束；家庭康养产品 Owner 中的交互端职责、本地连续运行与操作授权原则；docs/RULES.md。不修改或重新定义引元通用模型。
Missing: none（具体品牌型号与真实接入验证不在本轮范围）。
Conflicts: none（新方案仅作为提案，不替换现有模拟接入定义）。

## 电视方案首轮验收
已核对现有设备结构、记忆语音状态及共享外壳，读取电视布局和遥控焦点指南。对话交付电视首轮设计提案，覆盖总览、详情、账号来源、App 配置衔接、语音执行/澄清/失败、无设备与连接异常。未改实现及 Durable Owner；未进行视觉、真实语音、设备或跨端验收。手机 App 详细方案待电视方向明确后继续。

## 电视详细方案交付
已生成 `.tmp/reviews/device-tv-design-proposal.md` 待评审稿，覆盖五种内容视图、语音状态、12 台连续设备 Mock、账号与跨端衔接、遥控焦点及 14 项验收案例。已核对既有设计系统第 17–20 节、DevicePanel/MemoryPanel 代码及数量关联；文档检查通过。本轮未改前端或 Durable Owner，未宣称真实接入及浏览器验收完成；任务回到 ready，等待方案评审后绑定前端执行。

用户本轮接受收敛方案并要求继续，电视实现已转交 `docs/tasks/exhibition-frontend.md`；来源与界面规则以本轮指令优先：原在线四设备归涂鸦、添加入口随设备/账号列表、扫码替换列表、取消独立手机管理和账号详情、控制以语音为主。分析任务保持 ready。
