@AGENTS.md

# CLAUDE.md

## 项目概览
这是一个基于 Next.js 16、React 19、TypeScript 和 Tailwind CSS 4 的前端项目。
当前已接入 shadcn/ui，组件配置见 `components.json`。

## 常用命令
默认使用 npm：

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## 开发约定
- 这是 Next.js 16，不要套用旧版本经验；修改 Next 相关能力前，先阅读 `node_modules/next/dist/docs/` 中对应文档。
- 页面与路由基于 `app/` 目录组织。
- 优先复用现有组件与工具函数，不要重复造轮子。
- 项目使用 TypeScript，新增代码保持类型完整。
- 优先使用 `lucide-react` 图标库。
- 如需使用组件，优先通过 shadcn 官方命令安装官方组件。
- 涉及组件相关工作时，可以使用 `.claude` 下的 shadcn skills。
- 如果 shadcn 官方组件中没有合适实现，先向用户确认，再自定义组件。
- 样式使用 Tailwind CSS 4；如需 UI 组件，优先使用 shadcn/ui 风格与现有别名。

## 路径别名
- `@/components`
- `@/components/ui`
- `@/lib`
- `@/lib/utils`
- `@/hooks`

## 修改建议
- 小改动优先直接在现有文件上修改。
- 不要为了小需求提前抽象。
- 除非确实必要，否则不要添加多余注释。
- 完成前优先运行 `npm run lint`；如果涉及界面改动，尽量本地验证页面效果。

