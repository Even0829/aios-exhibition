# knowledge/

本目录拥有可持久化项目事实。

## Position

Knowledge 是事实层，位于 Foundation 之下、Architecture、Specs、Tasks 之上。

## Answers

我们已经知道什么？

## Contains

- 产品和系统事实。
- 领域事实。
- 用户、市场、场景、伙伴和研究事实。
- 有来源材料支持的策略事实。

## Does Not Contain

- 治理规则。
- 官方术语表。
- 页面或媒介的信息架构。
- UX/UI/内容验收规则。
- 当前任务状态。

## Reading Order

1. `README.md`
2. 相关子域 README
3. 任务引用的具体 Owner 文件

## Citation Rules

Architecture、Specs 和 Tasks 需要事实时引用 Knowledge Owner，不得在本地重写事实定义。

## Owner Boundary

Knowledge 文件定义事实。它们可引用 Foundation，但不应因为低层实现变化而强迫 Foundation 自动变化。

## Routes

- `products/`：本项目主体“引元家庭康养产品”及其上位引元定义。
- `system/`：本项目依赖的 AIOS 系统与生态事实。
- `sources/`：来源角色、适用范围和吸收状态；原始材料本身不获得 Owner 权限。
