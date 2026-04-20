# VPS 剩余价值计算器

一个面向二手 VPS 交易场景的在线估价工具，用于快速计算 VPS 的剩余天数、剩余价值，以及当前成交价相对理论剩余价值的折价或溢价。

适合在 VPS 挂售、收购、比价和交易沟通时快速给出相对直观、可分享的估值结果。

## 功能亮点

- 支持根据到期日期、交易日期和续费周期计算剩余天数
- 支持根据续费金额按比例折算 VPS 理论剩余价值
- 支持 CNY、USD、HKD、EUR、GBP 多币种输入
- 支持自定义汇率，并统一换算为人民币视角展示
- 自动对比成交金额与理论剩余价值，判断折价、溢价或原价
- 同时展示人民币和续费币种两个金额视角
- 支持下载结果图片、复制图片、复制 Markdown
- 支持亮色 / 暗色主题切换
- 已配置基础 SEO、Open Graph、robots、sitemap 与 Web App Manifest

## 在线页面说明

首页为单页计算器，核心由“参数输入”和“计算结果”两部分组成：

- 参数输入：到期日期、续费周期、续费金额、续费币种、汇率、交易日期、成交金额
- 结果展示：剩余天数、剩余价值、交易金额、折价 / 溢价金额
- 结果操作：下载图片、复制图片、复制为 Markdown

## 适用场景

- 二手 VPS 挂售前快速估价
- 购买他人 VPS 时判断价格是否合理
- 在论坛、社群或交易平台中分享估价结果
- 用统一口径快速沟通不同币种 VPS 的交易价格

## 计算逻辑

项目会以“到期日期”为周期结束日，并根据所选续费周期向前回推周期起始日：

1. 计算当前续费周期的总天数
2. 计算交易日期到到期日期之间的剩余天数
3. 按剩余天数 / 周期总天数，折算剩余价值
4. 使用成交金额减去剩余价值，得到折价或溢价金额

> 当前计算逻辑适合用于交易前快速估值与对比，不等同于平台最终成交价格，也不包含品牌、线路、地域、溢价稀缺性等主观因素。

## 使用示例

例如：

- 到期日期：2026-12-31
- 续费周期：1 年
- 续费金额：100 USD
- 汇率：7.20
- 交易日期：2026-06-30
- 成交金额：500 CNY

系统会自动计算：

- 剩余天数
- 理论剩余价值
- 当前成交金额对应的折价 / 溢价金额

你可以进一步将结果导出为图片或 Markdown，用于发帖、聊天或交易确认。

## 界面预览

如果你准备将项目开源展示到 GitHub，建议后续补充：

- 首页截图
- 计算结果截图
- 深色模式截图

可将截图放到例如 `public/screenshots/` 目录后，在此处补充图片引用。

## 技术栈

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- shadcn/ui
- React Hook Form
- Zod
- next-themes
- Sonner
- html-to-image
- date-fns

## 本地开发

安装依赖：

```bash
npm install
```

启动开发环境：

```bash
npm run dev
```

默认访问地址：

```text
http://localhost:3000
```

## 可用脚本

```bash
npm run dev    # 启动开发服务器
npm run build  # 构建生产版本
npm run start  # 启动生产服务器
npm run lint   # 运行 ESLint
```

## 项目结构

```text
app/                    # Next.js App Router 页面入口与站点配置
components/             # UI 组件与业务组件
components/vps/         # VPS 计算器与结果展示组件
lib/vps/                # 计算逻辑、常量、日期与格式化工具
lib/site.ts             # 站点基础信息
```

## SEO 与站点配置

项目已包含以下站点能力：

- `metadata` 基础 SEO 信息
- Open Graph / Twitter 元信息
- `robots.ts`
- `sitemap.ts`
- `manifest.ts`
- JSON-LD 结构化数据

如需正确生成 canonical、Open Graph、sitemap 等站点地址相关元信息，请配置环境变量：

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

## 部署说明

项目已配置静态导出（`output: "export"`），构建后生成纯静态文件，可部署到任何支持静态托管的平台。

### VPS Docker 部署

#### 1. 克隆项目

```bash
git clone <repo-url>
cd vps-surplus
```

#### 2. 配置环境变量

```bash
cp .env.example .env
```

编辑 `.env`：

```bash
# 站点域名（构建时注入，用于 canonical、sitemap、OG 等元信息）
NEXT_PUBLIC_SITE_URL=https://your-domain.com

# 容器映射到本地的端口（默认 3001）
PORT=3001
```

#### 3. 一键部署

```bash
chmod +x deploy.sh
sudo ./deploy.sh
```

脚本会自动安装 Docker（如未安装）、构建镜像并启动容器。

容器启动后监听 `http://127.0.0.1:3001`。

#### 4. 配置反向代理

以 Caddy 为例，在 Caddyfile 中添加：

```caddyfile
your-domain.com {
    reverse_proxy 127.0.0.1:3001
}
```

Caddy 会自动处理 HTTPS 证书。

#### 手动操作

```bash
# 构建并启动
docker compose up -d --build

# 停止
docker compose down

# 查看状态
docker compose ps

# 查看日志
docker compose logs
```

## 后续可扩展方向

如果你后续继续完善这个项目，可以考虑增加：

- 更多币种支持
- VPS 信息模板预设
- 手续费 / 汇损因素计算
- 可分享链接或参数持久化
- 历史估值记录
- 截图水印或交易平台发布模板

## 贡献

欢迎基于实际 VPS 交易场景继续优化交互、计算展示与分享能力。

如果你准备公开协作，建议补充：

- Issue 模板
- PR 规范
- License 声明

## License

如无额外声明，默认仅作项目代码参考与学习使用。
