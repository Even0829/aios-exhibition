# AGENTS.md

本文件是本仓库的 AI 运行入口。它约束 AI 如何协作，不拥有项目事实、术语、治理规则、规格或当前任务状态。

目标是在最小充分上下文内安全工作，同时让长期项目记忆沉淀在正确 Owner 中。

权威入口：

- 知识库导航与 Owner 映射：`docs/README.md`
- 治理规则与冲突处理：`docs/RULES.md`
- 官方术语与别名：`docs/canonical-vocabulary.md`
- 任务绑定、Context Manifest、状态与生命周期：`docs/tasks/README.md`

## 启动门禁

在进行实质性分析或实现前：

1. 将用户请求绑定到已有任务；若目标独立且边界明确，则创建新任务契约。
2. 除了创建或更新任务契约，未绑定当前任务时不得修改项目内容。
3. 真正开始工作时，将任务状态设为 `active`。
4. 读取任务的模式、范围、来源、交付物和验收标准。
5. 解析 Context Manifest：任务路径、README Chain、Direct References、Owner Closure、Missing、Conflicts。
6. 如果必要 Owner 缺失、上下文不完整、模式不允许操作或存在未解决冲突，停止执行并说明阻塞。
7. 只在任务范围内执行。
8. 按任务验收标准验证。
9. 将可持久化结论吸收到 Owner，并按生命周期清理临时证据。

## 模式

- `ANALYSIS`：读取、检查、诊断、提出方案；不得修改 Durable Owner、实现文件或外部系统。
- `EXECUTION`：在绑定任务范围内修改文件并交付结果。

不得静默从 `ANALYSIS` 升级到 `EXECUTION`。当用户改变模式或范围时，先更新绑定任务。

## Context Manifest

```text
Current Task:
- docs/tasks/<scope>/<task>.md

README Chain:
- README.md
- docs/README.md
- ...

Direct References:
- ...

Owner Closure:
- ...

Missing:
- none

Conflicts:
- none
```

## AI 边界

- 没有来源材料时，不得编造项目事实、产品定义、市场证据、用户判断或技术约束。
- 不得在非 Owner 文件中创建第二定义；应引用 Owner 路径。
- 提示词、聊天、截图、临时报告和已完成任务在被吸收到正确 Owner 前，不是 Durable Truth。
- 不得把未扫描文件或未解决冲突标为通过。
- 保留用户已有修改；除非迁移本身是任务目标，不做大范围改写。
- 不把 `docs/RULES.md`、`docs/tasks/README.md`、`docs/README.md` 的规则复制到本文件；只引用它们的权威。

## 文档维护触发

当工作产生可持久化事实、规则、术语、架构决策、规格、反复误解或重复定义时：

1. 不要把更新散落到多个文件。
2. 按 `docs/RULES.md` 找到正确 Owner。
3. 如果当前任务范围和模式允许，更新 Owner 与受影响路由。
4. 如果更新跨 Owner 或影响治理全局，绑定 `docs/tasks/kb-maintenance.md` 并填写 "This Round Input"。
5. 如果来源不足，创建或更新任务索要缺失来源，不直接断言为事实。
6. 吸收完成后，按生命周期删除或重置临时证据。

需要用户明确确认的操作：破坏性删除、覆盖用户修改、生产环境变更、发布、远程写入、外部副作用，或改变高影响 Owner 的含义。
