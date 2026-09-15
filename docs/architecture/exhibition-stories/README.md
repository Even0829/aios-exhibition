# 陈展体验故事

本目录拥有 AIOS 家庭康养陈展 Demo 的具体故事体验。总体运行机制由 [体验流程与状态](../aios-exhibition-experience.md) 拥有，包含通用基础、场景变体、特殊状态和例外处理的所有设计、动效与验收规则，统一由 [陈展设计系统](../../specs/aios-exhibition-design-system.md) 拥有。

每个故事文档完整记录本场景的触发、证据、等级、体验流程、设备与能力、主文案与语音、用户确认、执行与反馈、结束与记忆、时序、组件映射和未接入边界。设计实现参数与例外统一引用设计系统，不在四个故事中建立平行规范。

## 故事路由

| 故事 | 默认等级 | 主要价值 | Owner |
| --- | --- | --- | --- |
| 正常状态 | `normal` 蓝色 | 在整体平稳时主动进行低扰动空气优化 | [normal-state.md](normal-state.md) |
| 空气环境异常 | `warning` 黄色 | 基于异常指标进行针对性空气优化 | [air-environment-warning.md](air-environment-warning.md) |
| 人体不适 | `warning` 黄色，明显不适升为 `emergency` 红色 | 用睡眠带测量与本人感受共同分流 | [body-discomfort.md](body-discomfort.md) |
| 疑似跌倒 | `emergency` 红色 | 全局抢占、主动确认、现场协同和升级守护 | [suspected-fall-emergency.md](suspected-fall-emergency.md) |

## 读取方式

- 调整全局状态、中断、恢复或功能内页：先读总体验架构。
- 设计或实现单个故事：只加载总体验架构、本故事 Owner、完整设计系统和当前 Figma Direct Reference。
- 修改公共组件、色彩、转场或可读性：修改设计系统，故事文档只记录配置和场景覆盖项。
- 改变设备、真实接入或能力边界：先修改 [陈展事实与边界](../../knowledge/products/aios-exhibition-context.md)。
