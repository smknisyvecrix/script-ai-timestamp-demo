# 剧本 AI 平台可信时间戳接入演示

这是从 Meoo 导出的 React + Vite Demo，已调整为可提交到 GitHub 并通过 Cloudflare Pages 部署。

## 本地启动

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm dev
```

默认开发地址：`http://localhost:3015`

## 构建

```bash
pnpm build
```

构建产物输出到 `dist/`。

## Demo 登录

- 管理员入口：`/`
- 管理员账号：`liugang@tsa.cn`
- 管理员密码：`admin@`
- 默认试用账号：`test1@example.com`
- 默认试用密码：`123456`

这些账号仅用于产品演示。前端 Demo 中的账号密码不能用于真实生产认证。

## 部署

Cloudflare Pages 推荐配置：

- Framework preset: `Vite`
- Install command: `pnpm install --frozen-lockfile`
- Build command: `pnpm build`
- Build output directory: `dist`
- Node version: `22.12.0` 或更高

详细步骤见 [DEPLOYMENT.md](./DEPLOYMENT.md)。

## Supabase

项目可以不配置 Supabase 直接作为静态 Demo 运行。未配置时，试用账号保存在当前浏览器 localStorage 中。

如需跨设备共享试用账号，请复制 `.env.example` 中的变量到 Cloudflare Pages 环境变量，并在 Supabase 中按 `migrations/` 顺序执行 SQL。

## Meoo 导出文件

`meoo-manifest.json` 和 `meoo-cloud-snapshot.json` 保留在仓库中，仅用于记录来源和未来回导参考；它们不是 Cloudflare Pages 部署的必要文件。
