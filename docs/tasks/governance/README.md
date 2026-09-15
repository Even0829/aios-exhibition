# governance/

本目录存放可重复治理任务。

## Position

这里是 Task 子目录，只拥有工作契约，不拥有治理规则或审查结论。

## Contains

- 仓库治理审查。
- 文档质量审查。
- 术语清理任务。
- Owner 迁移任务。

## Does Not Contain

- 永久治理规则；规则归 `docs/RULES.md`。
- 永久发现；结论应吸收到 Owner。
- 一次性报告；报告归 `.tmp/reviews/`。

## Reading Order

1. `../README.md`
2. 本 README
3. 绑定的治理任务

## Citation Rules

治理任务引用 `docs/RULES.md`、`docs/tasks/README.md` 和受影响 Owner。临时报告写入 `.tmp/reviews/`，Durable Conclusion 路由回 Owner。

## 任务索引

- `repository-governance-review.md`：可重复的知识库治理审查。
- `../kb-maintenance.md`：执行审查修复、Owner 吸收及路由维护。
- `initialize-knowledge-base.md`：已完成的初始化任务记录，不作为当前工作入口或产品依据。
