# 博客系统使用指南

## 概述

本博客系统采用了现代化的架构设计和 Tailwind CSS 最佳实践，提供了优雅的文章展示和阅读体验。

## 架构设计

### 组件结构

```
app/
├── blog/
│   ├── page.tsx                    # 博客列表页（服务端组件）
│   └── [slug]/page.tsx             # 博客详情页（动态路由）
components/
└── common/
    ├── BlogCard.tsx                # 博客卡片组件
    └── BlogPageContent.tsx         # 博客列表内容组件
```

### 数据流程

1. **博客列表页**
   - 从数据库获取所有文章
   - 传递给 BlogPageContent 组件
   - 支持按分类筛选

2. **博客详情页**
   - 根据 slug 获取单篇文章
   - 显示相关文章（同分类）
   - 动态生成 SEO 元数据

## Tailwind CSS 最佳实践

### 1. 响应式设计

使用 Tailwind 的断点系统实现自适应布局：

```tsx
// 移动优先的响应式网格
<div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">{/* 卡片内容 */}</div>
```

### 2. 暗色模式支持

使用 Tailwind 的暗色模式修饰符：

```tsx
<div className="bg-white dark:bg-gray-800">
  <h2 className="text-gray-900 dark:text-white">文字颜色</h2>
</div>
```

### 3. 渐变和透明度

创建现代视觉效果：

```tsx
// 渐变背景
<div className="bg-linear-to-r from-blue-500 to-purple-600" />

// 渐变文字
<h1 className="bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
  渐变标题
</h1>

// 透明度
<div className="bg-white/90 backdrop-blur-sm" />
```

### 4. 动画和过渡

流畅的用户交互体验：

```tsx
<button className="transition-all duration-300 hover:scale-105">
  按钮
</button>

// 卡片悬停效果
<article className="transition-shadow hover:shadow-xl">
  {/* 内容 */}
</article>
```

### 5. 排版（Typography）

使用 Tailwind 的 prose 类美化文章内容：

```tsx
<article className="prose prose-lg dark:prose-invert max-w-none">
  <h2>标题</h2>
  <p>段落内容</p>
</article>
```

### 6. Ring 和 Shadow

创建深度和层次感：

```tsx
// Ring 边框
<div className="ring-1 ring-gray-200 hover:ring-blue-500" />

// Shadow 阴影
<div className="shadow-sm hover:shadow-xl" />

// 组合效果
<div className="shadow-lg shadow-blue-500/30 ring-2 ring-blue-500 ring-offset-2" />
```

### 7. 状态变体

不同状态下的样式变化：

```tsx
<button className="bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 active:scale-95">
  按钮
</button>
```

### 8. 实用工具类

使用 Tailwind 内置的工具类：

```tsx
// 文本截断
<p className="line-clamp-2">长文本内容...</p>

// Flexbox 布局
<div className="flex items-center justify-between" />

// Grid 布局
<div className="grid grid-cols-3 gap-4" />

// 绝对定位
<div className="absolute bottom-4 left-4" />
```

## 功能特性

### 博客列表页

- **分类筛选**：按文章分类筛选内容
- **卡片布局**：优雅的网格布局展示文章
- **悬停效果**：流畅的交互反馈
- **统计信息**：显示文章、分类、标签数量
- **空状态处理**：友好的空状态提示

### 博客详情页

- **元数据展示**：发布日期、分类、标签
- **相关文章**：智能推荐同分类文章
- **面包屑导航**：返回列表页的快捷方式
- **SEO 优化**：动态生成页面标题和描述
- **错误处理**：404 页面友好提示

## 数据库结构

### blog_posts 表

```sql
CREATE TABLE blog_posts (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  content TEXT,
  date TEXT NOT NULL,
  category TEXT NOT NULL,
  tags TEXT[] NOT NULL,
  slug TEXT UNIQUE NOT NULL
);
```

## 使用示例

### 添加新文章

```sql
INSERT INTO blog_posts (id, title, description, content, date, category, tags, slug)
VALUES (
  'post-1',
  '我的第一篇文章',
  '这是文章的简介',
  '<h2>内容标题</h2><p>文章正文内容...</p>',
  '2024-01-01',
  '技术',
  ARRAY['React', 'Next.js', 'TypeScript'],
  'my-first-post'
);
```

### 查询文章

```tsx
// 获取所有文章
const posts = await sql`SELECT * FROM blog_posts ORDER BY date DESC`

// 根据 slug 获取文章
const post = await sql`SELECT * FROM blog_posts WHERE slug = ${slug}`

// 获取相关文章
const related = await sql`
  SELECT * FROM blog_posts 
  WHERE category = ${category} AND id != ${currentId}
  ORDER BY date DESC
  LIMIT 3
`
```

## 性能优化

1. **服务端渲染**：使用 Next.js App Router 的服务端组件
2. **类型安全**：完整的 TypeScript 类型定义
3. **按需加载**：路由级别的代码分割
4. **图片优化**：使用 Next.js Image 组件（如需要）
5. **CSS 优化**：Tailwind 的 JIT 编译和 tree-shaking

## 可访问性

1. **语义化 HTML**：使用 `<article>`, `<section>`, `<time>` 等标签
2. **键盘导航**：所有交互元素支持键盘操作
3. **ARIA 属性**：适当使用 ARIA 属性提升可访问性
4. **颜色对比**：确保文字与背景有足够的对比度

## 自定义样式

如果需要自定义样式，可以在 `app/globals.css` 中添加：

```css
@layer components {
  .custom-button {
    @apply rounded-lg px-6 py-3 font-semibold transition-all;
  }
}

@layer utilities {
  .text-shadow {
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
}
```

## 扩展建议

1. **搜索功能**：集成全文搜索
2. **评论系统**：添加评论功能
3. **分享功能**：社交媒体分享按钮
4. **阅读时间**：计算文章阅读时间
5. **目录导航**：自动生成文章目录
6. **代码高亮**：集成语法高亮插件

## 总结

本博客系统遵循了以下最佳实践：

- ✅ 组件化架构
- ✅ 服务端渲染
- ✅ 类型安全
- ✅ 响应式设计
- ✅ 暗色模式支持
- ✅ 流畅的动画
- ✅ 优秀的可访问性
- ✅ SEO 优化
- ✅ 性能优化
- ✅ 现代化的 UI 设计

通过以上实践，博客系统提供了出色的用户体验和开发者体验。
