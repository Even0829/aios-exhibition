---
type: task
mode: ANALYSIS
lifecycle: repeatable
scope: product
status: ready
---

# 核心场景能力服务案例设计

## Goal

基于已确认的产品定位、五大核心场景能力与设备建议，先建立具体服务场景解决方案的统一设计逻辑与闭环框架，再从老人用户价值、子女付费价值、市场传播价值和体验落地性出发，设计一组具体服务案例供用户确认。

## Sources

- `docs/knowledge/products/origin-home-eldercare.md`
- `docs/knowledge/products/origin-home-eldercare-scenarios.md`
- `docs/knowledge/products/origin-home-eldercare-devices.md`
- `docs/specs/eldercare/shared-service-mechanisms.md`

## Scope

In scope:

- 在进入具体场景解法前，定义适用于五类优先场景的通用设计逻辑、闭环阶段和判断维度。
- 面向开发评审，明确场景设备、感知信息、产品判断规则、服务分支、结果判定、异常降级和首期建议参数。
- 选择强价值、易理解、能体现持续低打扰感知与主动服务的家庭康养案例。
- 表达触发依据、服务过程、设备执行、家属协同与结果确认。
- 区分主销售案例和扩展案例。

Out of scope:

- 修改 Durable Owner。
- 编写接口、数据模型、算法实现、技术架构或程序代码。
- 未经设备测试、医疗安全评审或用户验证即将建议参数标为正式标准。
- 品牌、型号、价格与供应商选择。

## Deliverables

- 具体服务场景解决方案的通用设计逻辑与闭环框架。
- 可供开发继续拆解的场景级产品方案，包括明确的首期规则和待验证参数。
- 一组候选服务案例。
- 案例优先级及市场、用户价值判断。
- 用户确认后的 Owner 吸收建议。

## Acceptance

### Hard Constraints

- 案例符合现有产品、核心场景能力和设备 Owner。
- 每个案例体现感知、理解、主动服务、执行、确认和必要协同。
- 不把产品表达为医疗诊断或专业急救替代。

### Soft Evaluation

- 老人能感知价值，子女能理解付费理由。
- 运营商销售能用简短故事说明价值。
- 案例不重复堆叠同一种能力。
