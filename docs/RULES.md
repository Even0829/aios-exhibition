# 知识库治理规则

本文件是 `docs/` 的唯一治理规则 Owner。

## 目的

知识库是长期项目资产。治理规则用于保存项目记忆、约束 AI 行为、防止幻觉、降低不必要上下文加载，并让 Durable Knowledge 可维护。

## 元规则

- 每个 Durable Concept 只在一个 Owner 文件中定义一次。
- 非 Owner 文件引用 Owner 路径，不重写定义。
- 一致性优先于完整性。
- 存在未解决冲突时，先停止依赖内容生成。
- 临时报告不得进入 Durable Docs。
- 历史交给 git；知识库只保存当前真相。
- 陈旧或重复上下文在形成维护负担前压缩。

## 层级

治理规则（`docs/RULES.md`）和术语表（`docs/canonical-vocabulary.md`）高于所有业务层。

| Layer | Directory | 回答的问题 | 职责 | 默认稳定性 |
| --- | --- | --- | --- | --- |
| Foundation | `foundation/` | 为什么存在？ | 使命、世界观、长期原则 | 年 |
| Knowledge | `knowledge/` | 我们知道什么？ | 项目、产品、领域、用户、市场、场景、伙伴、系统事实 | 月到年 |
| Architecture | `architecture/` | 信息如何组织？ | 信息架构、流程、叙事、页面/媒介结构 | 周到月 |
| Specs | `specs/` | 应如何构建或判断？ | UX、UI、内容、技术、质量、可访问性验收 | 周到月 |
| Tasks | `tasks/` | 当前要做什么？ | 工作契约、状态、上下文、交付物、验收 | 按任务 |

README 文件只做路由。它们即使摘要 Owner，也不会获得定义权。

## 依赖方向

- 定义应从稳定上层流向执行层。
- `foundation/` 可引用治理和术语，但不应依赖 `knowledge/`、`architecture/`、`specs/` 或 `tasks/`。
- `knowledge/` 可引用 `foundation/`。
- `architecture/` 可引用 `foundation/` 和 `knowledge/`。
- `specs/` 可引用定义验收所需的 Owner。
- `tasks/` 可引用任何必要 Owner，但不得成为 Owner。
- 低层实现压力如果要求改变高层定义，应进入 Owner Review，而不是自动改写。

## 放置决策树

使用第一个命中的归属：

1. 管理知识库的规则？-> `docs/RULES.md`
2. 官方术语、别名、废弃名称或命名边界？-> `docs/canonical-vocabulary.md`
3. 使命、世界观、长期原则？-> `docs/foundation/`
4. 持久项目、产品、领域、用户、市场、场景、伙伴或系统事实？-> `docs/knowledge/`
5. 信息架构、流程结构、叙事顺序或页面/媒介组织？-> `docs/architecture/`
6. 用户理解、质量、内容、UI、技术或实现验收？-> `docs/specs/`
7. 当前或可重复工作？-> `docs/tasks/`
8. 一次性证据或审查报告？-> `.tmp/reviews/`

## 定义所有权

每个高影响 Durable Concept 应有：

- Owner 路径。
- 定义范围。
- 允许引用方式。
- 变更流程。
- 影响较广时列出已知依赖方。

高影响 Owner 映射维护在 `docs/README.md` 或专门 Owner 索引中。

编辑检查：

1. 当前文件是不是 Owner？
2. 如果不是，这段文字是否应改成引用？
3. 如果 Owner 缺失，应由哪一层持有？
4. 如果存在多个 Owner，哪一个拥有正确稳定性和权威？

## 术语

官方名称、别名、废弃名称和术语 Owner 归 `docs/canonical-vocabulary.md`。

术语表只拥有命名表面，不拥有完整概念定义。完整定义归各自 Owner 文件。

## 冲突

遇到以下未解决冲突时停止：

- 命名。
- 定义。
- 层级归属。
- 机制所有权。
- 产品或领域边界。
- 治理规则。
- 验收来源。
- 生命周期。

报告格式：

```text
Conflict Type:
Paths:
Conflicting Claims:
Likely Owner:
Impact:
Proposed Repair:
Decision Needed:
```

修复顺序：

1. 停止依赖生成。
2. 识别可能 Owner。
3. 先修复 Owner。
4. 将非 Owner 断言改成引用。
5. 名称或路径变化时更新术语表和路由。
6. 重新检查链接和 Owner Closure。

不得只修引用表面，却留下错误 Owner。

## 生命周期

| Type | Location | Lifecycle |
| --- | --- | --- |
| Canonical | Owner files | Permanent, continuously maintained |
| Architecture | `architecture/**` | 长期存在，直到被替代并吸收 |
| Spec | `specs/**` | 长期存在，原地维护 |
| Task | `tasks/**` | `one-off`, `repeatable`, `living` |
| Review / Report | `.tmp/reviews/` | 临时；吸收或删除 |

`one-off` 任务在结果被吸收并验收后，通常应删除；只有明确需要可见审计轨迹时才保留。

## 压缩

按所有权压缩：

1. 找出重复定义、重复规则、复制摘要、陈旧报告和已完成任务结论。
2. 将每块内容分类为 Owner、引用、导航、临时证据或废弃内容。
3. 保留最稳定 Owner。
4. 用路径引用替换重复定义。
5. 将有价值的报告或任务结论吸收到 Owner。
6. 吸收后删除临时证据。
7. 更新路由、术语表和任务引用。

不得把冲突定义合并成第三个摘要文件。

## 质量门禁

- 活跃文档中没有第二定义。
- 非 Owner 文件引用 Owner 路径。
- 新规则写入 `docs/RULES.md`。
- 新官方术语写入 `docs/canonical-vocabulary.md`。
- README 文件只路由和索引。
- 任务引用 Owner，并区分硬约束和软评估。
- 链接指向存在的路径。
- 临时输出有吸收或删除条件。
