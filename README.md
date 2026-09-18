# 引元家庭康养产品

本仓库支持引元底座知识维护、家庭康养产品与具体场景设计，以及陈展样板工作。产品定义与继承关系从下列 Owner 进入，完整导航见 `docs/README.md`。

## 从这里开始

- AI 运行约束：`AGENTS.md`
- 知识库导航与 Owner 映射：`docs/README.md`
- 引元产品定义：`docs/knowledge/products/origin.md`
- 引元通用系统模型：`docs/knowledge/system/origin-system-model.md`
- 康养垂类产品：`docs/knowledge/products/origin-home-eldercare.md`
- 陈展 Demo 设计依据：`docs/knowledge/products/aios-exhibition-context.md`（流程与设计规范按 `docs/README.md` 路由）
- 知识库治理规则：`docs/RULES.md`
- 任务绑定与上下文协议：`docs/tasks/README.md`

## 当前知识状态

引元最新知识来源与吸收范围见 `docs/knowledge/sources/origin-product-base.md`；旧生态参考入口为 `docs/knowledge/system/aios-ecosystem.md`。未被 Owner 收录的用户、市场、系统或实现判断仍不得推断。

新知识必须先有来源，再通过任务进入正确 Owner。聊天、草稿、截图、报告和临时分析只能作为证据，不能直接变成长期事实。

## 协作原则

任何实质性项目工作都必须先绑定任务，解析 Context Manifest，只读取当前任务需要的 README 链路、Direct References 和 Owner Closure。只有当任务模式、范围和证据允许时，才修改 Durable Owner 或实现文件。
