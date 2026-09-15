# architecture/

本目录拥有信息如何组织。

## Position

Architecture 把事实组织成页面、流程、叙事和媒介结构；它不拥有被组织的事实本身。

## Answers

项目知识、流程、叙事或界面应如何结构化？

## Contains

- 信息架构。
- 导航模型。
- 流程结构。
- 叙事顺序。
- 页面、Deck 或其他媒介组织。

## Does Not Contain

- 产品定义。
- 治理规则。
- 官方术语表。
- UI 实现细节，除非它们本身定义结构。
- 当前任务状态。

## Reading Order

1. `README.md`
2. 相关媒介或界面 README
3. 任务引用的具体 Architecture Owner

## Citation Rules

Architecture 引用 Foundation 和 Knowledge 获得含义，再引用 Specs 获得执行约束。其他文件引用 Architecture 获取结构和信息顺序。

## Owner Boundary

Architecture 文件组织事实和体验。除非明确限定，它们不拥有产品事实或实现验收。

## Owners

- `aios-exhibition-experience.md`：陈展总体体验架构，只拥有五类可交织运行状态、共用体验契约、事件优先级、中断恢复、功能结构与四故事路由。
- `exhibition-stories/README.md`：四个陈展体验故事的定位、读取与更新路由。
- `exhibition-stories/normal-state.md`：正常状态完整体验故事。
- `exhibition-stories/air-environment-warning.md`：空气环境异常完整体验故事。
- `exhibition-stories/body-discomfort.md`：人体不适（心率偏快）完整体验故事。
- `exhibition-stories/suspected-fall-emergency.md`：疑似跌倒紧急事件完整体验故事。
