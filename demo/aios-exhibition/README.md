# AIOS 家庭康养陈展 Demo

前端入口：`src/main.tsx`；基础组件：`src/components/Primitives.tsx`；场景数据：`src/mock.ts`。

运行、设计来源、组件映射与验收范围的唯一规范见 [陈展设计系统第 8 节](../../docs/specs/aios-exhibition-design-system.md)。当前任务见 [逐页实现](../../docs/tasks/exhibition-frontend.md)。

```sh
npm install
npm run dev -- --port 5186 --strictPort
npm run build
```

稳定预览使用用户级 `launchd` 服务，地址固定为 `http://127.0.0.1:5186/`。首次安装执行：

```sh
bash scripts/install-preview-service.sh
```

页面修改后执行 `npm run preview:sync`，会重新构建并同步到常驻服务目录，不需要重启服务。
