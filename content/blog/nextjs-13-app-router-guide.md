# Next.js 13 App Router 完全指南

Next.js 13 引入了一个全新的 App Router，这是一个基于文件系统的路由系统，提供了更好的性能、更简洁的代码组织和更强大的功能。

## 什么是 App Router？

App Router 是 Next.js 13 中的新路由系统，它位于 `app` 目录下。与之前的 Pages Router 相比，它有以下优势：

- 更好的性能优化
- 内置支持布局和模板
- 更简洁的代码组织
- 支持流式渲染
- 更好的 SEO 支持

## 基础概念

### 文件约定

- `page.tsx` - 定义路由的 UI
- `layout.tsx` - 定义多个页面的共享 UI
- `loading.tsx` - 定义加载状态的 UI
- `error.tsx` - 定义错误边界的 UI
- `not-found.tsx` - 定义 404 页面

### 路由结构

```typescript
app/
├── layout.tsx          // 根布局
├── page.tsx            // 首页 (/)
├── about/
│   └── page.tsx        // 关于页面 (/about)
└── blog/
    ├── page.tsx        // 博客列表 (/blog)
    └── [slug]/
        └── page.tsx    // 博客文章 (/blog/abc)
```

## 核心功能

### 布局系统

布局允许你在多个页面之间共享 UI：

```typescript
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  )
}
```

### 数据获取

App Router 提供了多种数据获取方式：

#### Server Components（默认）

```typescript
async function getData() {
  const res = await fetch('https://api.example.com/data')
  return res.json()
}

export default async function Page() {
  const data = await getData()
  return <div>{data.title}</div>
}
```

#### 动态路由

```typescript
export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug)
  return <article>{post.content}</article>
}
```

### 流式渲染

使用 `Suspense` 实现流式渲染：

```typescript
import { Suspense } from 'react'

export default function Page() {
  return (
    <div>
      <Suspense fallback={<Loading />}>
        <PostContent />
      </Suspense>
    </div>
  )
}
```

## 最佳实践

1. **默认使用 Server Components** - 除非需要交互，否则使用 Server Components
2. **合理使用 Layout** - 将共享 UI 放在布局中
3. **优化数据获取** - 使用 fetch 的缓存选项
4. **错误处理** - 为关键路由添加 error.tsx
5. **加载状态** - 使用 loading.tsx 提供良好的用户体验

## 迁移指南

从 Pages Router 迁移到 App Router：

1. 将 `pages/` 目录下的文件移动到 `app/`
2. 将 `_app.tsx` 转换为 `layout.tsx`
3. 将 `_document.tsx` 的内容移到根布局
4. 更新数据获取逻辑
5. 测试所有路由和功能

## 总结

Next.js 13 的 App Router 是一个强大的路由系统，它提供了更好的性能和开发体验。通过理解其核心概念和最佳实践，你可以构建出更快、更易维护的 Web 应用。
