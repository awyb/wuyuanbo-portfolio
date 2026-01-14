# 个人主页开发与部署指南

这个项目是基于 **Next.js 14+**, **React**, **TypeScript**, 和 **Tailwind CSS** 构建的。

## 🚀 快速开始

1.  **安装依赖**：
    ```bash
    npm install
    ```

2.  **启动开发服务器**：
    ```bash
    npm run dev
    ```
    访问 [http://localhost:3000](http://localhost:3000) 查看效果。

## 📂 项目结构

-   `app/`: 页面路由和布局 (Next.js App Router)
-   `components/`: 可复用的 React 组件
    -   `common/`: 通用组件（如卡片、按钮）
    -   `layout/`: 布局组件（如导航栏、页脚）
    -   `sections/`: 首页各部分组件
-   `data/`: 静态数据（个人信息、项目列表等）
-   `types/`: TypeScript 类型定义
-   `public/`: 静态资源（图片、图标等）

## 🛠️ 如何自定义

1.  **修改个人信息**：
    编辑 `data/portfolio.ts` 文件，更新您的姓名、简介、项目、技能等。

2.  **更换头像和图片**：
    将您的图片放入 `public/images/` 目录，并在 `data/portfolio.ts` 中更新路径。

3.  **添加新页面**：
    在 `app/` 目录下创建新文件夹并添加 `page.tsx`。

4.  **修改样式**：
    使用 Tailwind CSS 类名直接在组件中修改，或编辑 `app/globals.css`。

## 🌐 部署到 Vercel

由于您已经将 GitHub 仓库与 Vercel 绑定，部署非常简单：

1.  **提交代码到 GitHub**：
    ```bash
    git add .
    git commit -m "Initial portfolio setup"
    git push origin main
    ```

2.  **自动部署**：
    Vercel 会检测到您的推送并自动开始构建和部署。

3.  **配置域名**（可选）：
    在 Vercel 项目控制面板中，您可以绑定自己的自定义域名。

## 💡 后续建议

-   **博客功能**：目前博客是静态数据，后续可以集成 [Contentlayer](https://www.contentlayer.dev/) 或 [MDX](https://nextjs.org/docs/app/building-your-application/configuring/mdx) 来支持 Markdown 写作。
-   **暗黑模式**：项目已预留 Tailwind 暗黑模式支持，可以添加一个主题切换组件。
-   **动画效果**：可以使用 [Framer Motion](https://www.framer.com/motion/) 为页面添加平滑的过渡动画。
-   **SEO 优化**：在各页面的 `metadata` 中完善描述和关键词。
