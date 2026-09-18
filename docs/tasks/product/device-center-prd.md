---
type: task
mode: EXECUTION
lifecycle: living
scope: product
status: ready
---

# 设备中心 PRD

## Goal

以产品经理视角维护设备功能的开发需求文档：先冻结电视端和跨端共用基础，后续在手机小程序设计确认后扩展为跨端 PRD。文档主要服务前端、后端、测试和设计评审，要求简单直接、清晰完整，不写代码或代替技术方案。

## Sources

- `docs/knowledge/products/aios-exhibition-context.md`
- `docs/knowledge/products/origin-home-eldercare.md`
- `docs/architecture/aios-exhibition-experience.md`
- `docs/specs/aios-exhibition-design-system.md`
- `docs/specs/device-center-mobile-design-system.md`
- `docs/tasks/product/device-access-discovery.md`
- `demo/aios-exhibition/src/components/DevicePanel.tsx`
- `demo/aios-exhibition/src/deviceMock.ts`
- 用户 2026-09-17 确认：首期手机端改按小程序设计；PRD 由产品经理面向前后端编写，避免过度技术化；账号、设备、品牌和能力必须可扩展并形成交互闭环。
- 用户 2026-09-17 在电视端 PRD v0.1 完成后要求继续进入手机小程序设计。
- 用户 2026-09-17 确认首期小程序只服务设备中心、采用家庭管理员／家庭成员两级角色并接受最小产品服务端；新增消息、AI 对话控制、电视与手机共用设备 Mock，以及 P0 与 P1 一体化完整演示要求。
- 用户 2026-09-18 确认底部首项由“设备”改为“首页”，首期仍以设备为主要内容；要求补齐空间的新增、编辑、删除、设备安置及其与账号／集成的独立关系。
- 用户 2026-09-18 确认添加设备必须选择或绑定对应账号，设备接入成功后必须选择或新增空间，后续可继续编辑设备和空间；同时要求 Demo 手机右下角增加悬浮球，用于切换异常和状态以方便演示。
- Home Assistant 官方文档（2026.9.2）：`https://www.home-assistant.io/getting-started/integration/`、`https://www.home-assistant.io/getting-started/concepts-terminology/`、`https://www.home-assistant.io/integrations/xiaomi_miio/`、`https://www.home-assistant.io/integrations/tuya/`、`https://www.home-assistant.io/integrations/conversation/`。

## Scope

- 维护 `docs/specs/device-center-prd.md`：先冻结电视端 v0.1，本轮升级为跨端 v1.0。
- 完整写明电视端与手机小程序功能、跨端共用对象、业务状态、操作闭环、异常处理和验收标准。
- 手机小程序覆盖首页、助手、消息、我的四个入口，以及小米／涂鸦接入和 P0／P1 一体化交付。
- 修正与当前已确认设备交互冲突的陈展事实或架构表述，并更新必要路由。
- 不确定具体技术架构、接口格式、数据库、框架或部署方案。
- 本轮依据用户确认和 Home Assistant 官方文档，将手机小程序、消息、AI、具体品牌接入及 P0／P1 演示要求吸收到设备中心 PRD v1.0。
- 本轮继续补充设备跨空间调整、涂鸦同手机授权优化、消息单列表和 Apple 风格手机设计基线，并同步方案稿、PRD 与设计系统 Owner；不进入手机前端实现。
- 本轮继续明确品牌账号、设备、空间的关系与各自生命周期，以及账号必选、接入与添加完成分离、空间必选、配置中断恢复和 Demo 演示状态悬浮球；不进入手机前端实现。

## Deliverables

- `docs/specs/device-center-prd.md`
- `docs/specs/README.md`
- `docs/README.md`
- `docs/specs/device-center-mobile-design-system.md` 独立手机设计系统与首页概念方向
- 必要的事实与架构 Owner 一致性修正

## Acceptance

### Hard Constraints

- 文档面向产品、前端、后端和测试共同理解，不包含代码。
- 不把当前 Demo 的品牌数量、账号数量、设备数量、设备类型或控制能力写成系统上限。
- 区分连接状态、工作状态、授权状态、指令状态和数据新鲜度。
- 电视端每个入口、操作、异常和返回路径均有闭环。
- 真实 Home Assistant、品牌授权、远程控制和平台范围未验证的部分明确标记待确认。
- 设计细节引用现有设计系统和 Figma，不在 PRD 中创建第二套视觉规范。

### Soft Evaluation

- 开发人员可快速回答做什么、何时可操作、失败如何处理、需要保存和同步哪些业务信息。
- 需求编号可追溯到页面、设计来源和验收案例。

## Context Manifest

Current Task: `docs/tasks/product/device-center-prd.md`

README Chain: `README.md` → `docs/README.md` → `docs/tasks/README.md` → `docs/knowledge/README.md` → `docs/knowledge/products/README.md` → `docs/architecture/README.md` → `docs/specs/README.md` → `demo/aios-exhibition/README.md`。

Direct References: Sources 中列出的 Owner、现有实现及本轮用户确认。

Owner Closure: 设备功能事实边界、陈展功能结构、陈展设计系统、康养产品交互端职责和知识库治理规则。

Missing: 手机小程序最终视觉稿与可交互 Demo；Home Assistant 部署、小米／涂鸦真实账号与型号兼容、远程控制安全和微信订阅通知仍需技术方案或真实试点验证；不阻塞 PRD v1.0 产品需求冻结。

Conflicts: none。旧“账号卡筛选设备”和“手机 App”表述已依据后续用户确认修正为账号管理手机接续和首期手机小程序。

## 本轮结果（2026-09-17）

- 已建立 `docs/specs/device-center-prd.md` v0.1，冻结跨端共用基础、电视端功能、手机接续、异常处理、扩展规则与验收标准。
- 已将当前 Demo 样本与长期产品上限分开，账号、品牌、设备、空间和设备能力均按可扩展对象表达。
- 已统一电视账号管理与设备配置进入手机小程序的接续方向，并修正旧的账号筛选和手机 App 表述。
- 已更新 Specs、任务和知识库总路由；手机小程序详细流程和初期平台范围留待下一阶段确认。

## 当前轮：手机小程序产品方案（2026-09-17）

目标：在不提前绑定具体技术实现的前提下，形成设备中心小程序首期范围、页面结构、账号与设备接入、远程控制、权限、电视接续和异常闭环；同时判断正常家庭首期是否需要产品服务端。评审稿放在 `.tmp/reviews/device-miniapp-design-proposal.md`，确认后吸收到设备中心 PRD v1.0。

本轮评审稿已由用户补充并确认，正式结论吸收到 PRD v1.0：底部为首页、助手、消息、我的四个入口；小米与涂鸦按 Home Assistant 官方当前接入要求分别设计；管理员与成员两级角色；电视与手机共用设备样本；真实家庭首期建设可扩展的最小产品服务端；P0 完整交互与 P1 真实链路使用同一套产品流程。

用户进一步明确在前端还原前先确认文档，并希望继续以更易理解的“设备中心手机小程序方案”形式评审。`.tmp/reviews/device-miniapp-design-proposal.md` 已从早期吸收记录恢复为 v0.2 评审稿，按信息架构、设备页、助手、消息、我的、小米／涂鸦差异化接入、电视接续、共用演示数据和 P0／P1 交付方式重新组织；正式开发规则仍由 `docs/specs/device-center-prd.md` 统一拥有。本阶段不进入手机前端实现。

本轮根据用户补充将方案稿升级：增加单设备换空间、多设备不同目标空间一次保存和批量移动；消息前台收敛为标题、摘要、时间组成的单列表；手机端采用 Apple 风格视觉、组件、动效与交互基线。涂鸦接入经官方文档及当前 Home Assistant 实现核对，官方仍要求二维码扫码，因此主方案调整为优先验证“保存二维码 → 涂鸦 App 从相册识别 → 返回查询结果”，电视／第二屏只作相册不可用时兜底，同时保留官方深链或 OAuth 技术验证，未把未公开能力写成已支持。

用户确认涂鸦 App 支持相册扫码，首期将其设为正式主流程；官方跳转能力后续与开发确认。用户同时要求电视与手机设计系统分别作为独立 Owner 维护，手机设计基线已迁移至 `docs/specs/device-center-mobile-design-system.md`，电视规范继续由 `docs/specs/aios-exhibition-design-system.md` 拥有。进入前端 Demo 前，先制作三个设备首页概念方向供视觉评审，不修改现有前端。

三个首页概念方向已生成并保存至 `.tmp/reviews/device-mobile-home-concepts/`：A 为系统家居卡片，B 为空间概览，C 为设备清单。三张图共用方案中的家庭状态、空间筛选、四台代表设备、能力差异和底部四入口；当前仅供风格评审，尚未冻结为手机视觉规范，也未进入前端实现。

用户进一步确认底部首项由“设备”改为“首页”：首期仍以设备为主要内容，但命名不限制后续家庭概览能力。空间被补充为与账号／集成独立的可管理对象，方案与 PRD 已增加新增、重命名、排序、删除、未分配、添加设备时安置、单台／批量调整、删除前迁移、离线可调整及电视／AI／Home Assistant Area 映射同步规则。现有概念图仍含旧底栏名称，已标记下一轮视觉稿统一修正，不进入前端实现。

用户继续确认添加设备的完整闭环：先选择已有账号或绑定新账号，选择并接入设备，接入成功后必须选择已有空间或新增空间，名称与空间保存后才算添加完成；中途退出进入待完成配置，后续仍可编辑设备与空间。品牌账号负责来源与授权，设备负责稳定身份与能力，空间负责家庭位置，三者分别管理并明确解除账号、移除设备、删除空间、重新授权和重复发现的影响。Demo 版手机右下增加“演示状态”悬浮球，以预设情境切换异常、状态和角色，同步影响手机、电视和消息且不触发真实设备；正式家庭版本隐藏。上述规则已同步方案稿、PRD v1.3 和手机设计系统，本阶段仍不进入前端实现。
