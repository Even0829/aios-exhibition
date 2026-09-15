# specs/

本目录拥有执行与验收标准。

## Position

Specs 是执行和验收层，把 Owner 事实与 Architecture 转换成可验证约束。

## Answers

某个东西应如何构建、表达或判断？

## Contains

- UX 验收。
- UI 与视觉标准。
- 内容与语言标准。
- 技术和实现约束。
- 质量门禁。

## Does Not Contain

- 使命或世界观。
- 产品事实。
- 信息架构，除非它是验收专属内容。
- 当前任务状态。

## Reading Order

1. `README.md`
2. 任务对应的规格 Owner；陈展读取 `aios-exhibition-design-system.md`，业务场景读取 `eldercare/README.md`
3. 任务引用的具体验收 Owner

## Citation Rules

任务引用 Specs 获取硬约束和软评估。Specs 在定义必须保留的内容时引用 Knowledge 和 Architecture。

## Owner Boundary

Specs 定义验收和约束。任务引用 Specs，不重写 Specs。

## Owners

- `aios-exhibition-design-system.md`：覆盖陈展基础视觉、页面、通用组件、故事变体、特殊状态、例外、语音、动效、Mock、Figma 还原、前端映射与验收的唯一完整设计系统 Owner。

当前设备总览与五个具体服务场景设备组合由 `../knowledge/products/origin-home-eldercare-devices.md` 统一汇总；下方 `eldercare/` 场景规格只拥有各场景内的设备使用、流程和验收。

- `eldercare/shared-service-mechanisms.md`：五类优先服务场景共用运行机制的唯一 Owner，包含规律、任务、联系人、确认、设备、空间感知与就近调度、计划、测量、健康分流、中低风险主动服务和趋势机制。
- `eldercare/nighttime-bathroom-no-response.md`：夜间起身后卫生间无回应场景的首期落地规格。
- `eldercare/morning-blood-pressure-medication.md`：晨间血压与服药计划混乱场景的首期落地规格。
- `eldercare/sudden-dizziness-chest-distress.md`：独自在家突发头晕或胸闷场景的首期落地规格。
- `eldercare/post-discharge-30-day-recovery.md`：出院后30天居家恢复场景的首期落地规格。
- `eldercare/multiweek-functional-decline.md`：连续数周生活能力下降场景的首期落地规格。
