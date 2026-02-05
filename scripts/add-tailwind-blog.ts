import dotenv from 'dotenv'
import path from 'path'

// 显式加载 .env.local 文件
dotenv.config({ path: path.join(__dirname, '../.env.local') })

import { sql } from '../lib/db'

async function addTailwindBlogPost() {
  console.log('📝 开始添加 Tailwind CSS 最佳实践文章...\n')

  const post = {
    title: 'Tailwind CSS 最佳实践',
    description:
      '分享在项目中使用 Tailwind CSS 的最佳实践和技巧，包括响应式设计、暗色模式、性能优化等方面',
    date: '2024-01-05',
    category: 'CSS',
    tags: ['Tailwind CSS', 'CSS', 'Web Design', '前端开发'],
    slug: 'tailwind-css-best-practices',
  }

  // 完整的文章内容（HTML格式）
  const content = `
<h2>引言</h2>
<p>Tailwind CSS 是一个功能类优先的 CSS 框架，它能够帮助开发者快速构建现代化的用户界面。相比传统的 CSS 方法，Tailwind 提供了更高的开发效率和更一致的样式系统。本文将分享在实际项目中使用 Tailwind CSS 的最佳实践和技巧。</p>

<h2>1. 响应式设计</h2>
<p>Tailwind 采用移动优先（Mobile First）的设计理念，使用断点系统实现响应式布局。</p>

<h3>1.1 断点系统</h3>
<p>Tailwind 提供了五个预设断点：</p>
<ul>
<li><code>sm</code>: 640px</li>
<li><code>md</code>: 768px</li>
<li><code>lg</code>: 1024px</li>
<li><code>xl</code>: 1280px</li>
<li><code>2xl</code>: 1536px</li>
</ul>

<h3>1.2 响应式网格布局</h3>
<pre><code><div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
  {items.map(item => (
    <div key={item.id}>{item.content}</div>
  ))}
</div>
</code></pre>

<h3>1.3 响应式字体和间距</h3>
<pre><code><h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
  响应式标题
</h1>

<div className="p-4 sm:p-6 md:p-8 lg:p-12">
  响应式内边距
</div>
</code></pre>

<h2>2. 暗色模式支持</h2>
<p>Tailwind 内置了对暗色模式的支持，通过 <code>dark:</code> 前缀可以轻松实现暗色主题。</p>

<h3>2.1 配置暗色模式</h3>
<p>在 <code>tailwind.config.js</code> 中配置：</p>
<pre><code>module.exports = {
  darkMode: 'class', // 或 'media'
  // ...
}
</code></pre>

<h3>2.2 暗色模式样式</h3>
<pre><code><div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
  自动适配主题的内容
</div>

<button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white">
  按钮
</button>
</code></pre>

<h3>2.3 动态切换主题</h3>
<pre><code>function toggleTheme() {
  document.documentElement.classList.toggle('dark')
}
</code></pre>

<h2>3. 渐变和透明度</h2>
<p>使用 Tailwind 的渐变和透明度功能可以创建现代化的视觉效果。</p>

<h3>3.1 渐变背景</h3>
<pre><code><div className="bg-linear-to-r from-blue-500 via-purple-500 to-pink-500">
  水平渐变
</div>

<div className="bg-linear-to-b from-green-400 to-blue-500">
  垂直渐变
</div>

<div className="bg-linear-to-br from-yellow-400 via-red-500 to-pink-500">
  对角渐变
</div>
</code></pre>

<h3>3.2 渐变文字</h3>
<pre><code><h1 className="bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
  渐变文字效果
</h1>
</code></pre>

<h3>3.3 透明度和毛玻璃效果</h3>
<pre><code><div className="bg-white/80 backdrop-blur-md">
  毛玻璃卡片
</div>

<div className="bg-black/50 backdrop-blur-sm">
  半透明遮罩
</div>
</code></pre>

<h2>4. 动画和过渡</h2>
<p>Tailwind 提供了丰富的动画和过渡效果，能够提升用户体验。</p>

<h3>4.1 过渡效果</h3>
<pre><code><button className="transition-all duration-300 hover:scale-105 hover:shadow-lg">
  悬停放大效果
</button>

<div className="transition-colors duration-200 hover:bg-blue-100">
  颜色过渡
</div>
</code></pre>

<h3>4.2 内置动画</h3>
<pre><code><div className="animate-spin">旋转动画</div>
<div className="animate-bounce">弹跳动画</div>
<div className="animate-pulse">脉冲动画</div>
<div className="animate-ping">波纹动画</div>
</code></pre>

<h3>4.3 自定义动画</h3>
<p>在 <code>tailwind.config.js</code> 中添加自定义动画：</p>
<pre><code>module.exports = {
  theme: {
    extend: {
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-in-out',
      },
    },
  },
}
</code></pre>

<h2>5. 排版优化</h2>
<p>使用 Tailwind 的 typography 插件可以快速美化文章内容的排版。</p>

<h3>5.1 安装 typography 插件</h3>
<pre><code>npm install @tailwindcss/typography
</code></pre>

<h3>5.2 配置插件</h3>
<pre><code>// tailwind.config.js
module.exports = {
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
</code></pre>

<h3>5.3 使用 prose 类</h3>
<pre><code><article className="prose prose-lg dark:prose-invert max-w-none">
  <h1>文章标题</h1>
  <p>段落内容会自动应用美观的排版样式</p>
  <ul>
    <li>列表项</li>
  </ul>
</article>
</code></pre>

<h2>6. Ring 和 Shadow 效果</h2>
<p>使用 ring 和 shadow 可以创建深度和层次感。</p>

<h3>6.1 Ring 边框</h3>
<pre><code><div className="ring-1 ring-gray-200">
  基础边框
</div>

<div className="ring-2 ring-blue-500 ring-offset-2">
  带偏移的边框
</div>

<input className="focus:ring-2 focus:ring-blue-500 focus:ring-offset-2" />
</code></pre>

<h3>6.2 Shadow 阴影</h3>
<pre><code><div className="shadow-sm">小阴影</div>
<div className="shadow-md">中等阴影</div>
<div className="shadow-lg">大阴影</div>
<div className="shadow-xl">超大阴影</div>

<div className="shadow-lg shadow-blue-500/30">
  带颜色的阴影
</div>
</code></pre>

<h2>7. 状态变体</h2>
<p>Tailwind 支持多种状态变体，可以在不同状态下应用不同样式。</p>

<h3>7.1 常用状态</h3>
<pre><code><button className="
  bg-blue-600 hover:bg-blue-700 active:bg-blue-800
  focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
  disabled:opacity-50 disabled:cursor-not-allowed
">
  多状态按钮
</button>

<div className="group">
  <p>正常状态</p>
  <p className="group-hover:text-blue-600">悬停时变色</p>
</div>
</code></pre>

<h3>7.2 自定义状态</h3>
<pre><code>// tailwind.config.js
module.exports = {
  variants: {
    extend: {
      opacity: ['disabled'],
      backgroundColor: ['active'],
    },
  },
}
</code></pre>

<h2>8. 实用工具类</h2>
<p>Tailwind 提供了大量实用工具类，可以快速实现各种效果。</p>

<h3>8.1 文本处理</h3>
<pre><code><p className="line-clamp-2">截断到两行的长文本内容...</p>
<p className="truncate">单行截断文本</p>
<p className="break-words">长单词换行</p>
</code></pre>

<h3>8.2 布局工具</h3>
<pre><code><!-- Flexbox -->
<div className="flex items-center justify-between">
  <span>左侧</span>
  <span>右侧</span>
</div>

<!-- Grid -->
<div className="grid grid-cols-3 gap-4">
  <div>1</div>
  <div>2</div>
  <div>3</div>
</div>

<!-- 定位 -->
<div className="relative">
  <div className="absolute top-4 left-4">绝对定位</div>
</div>
</code></pre>

<h3>8.3 间距和尺寸</h3>
<pre><code><div className="m-4 p-6">
  外边距 16px，内边距 24px
</div>

<div className="w-full h-screen">
  全宽全高
</div>

<div className="max-w-4xl mx-auto">
  最大宽度并居中
</div>
</code></pre>

<h2>9. 性能优化</h2>
<p>正确使用 Tailwind 可以显著提升应用性能。</p>

<h3>9.1 JIT 模式</h3>
<p>Tailwind CSS 3.0+ 默认使用 JIT 模式，按需生成样式：</p>
<pre><code>// tailwind.config.js
module.exports = {
  mode: 'jit',
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
}
</code></pre>

<h3>9.2 避免重复类</h3>
<pre><code>// ❌ 不推荐
<div className="bg-blue-500 text-white p-4 rounded">
<div className="bg-blue-500 text-white p-4 rounded">

// ✅ 推荐 - 创建组件类
<div className="card">
<div className="card">
</code></pre>

<h3>9.3 使用 @apply 提取公共样式</h3>
<pre><code>// 在 globals.css 中
@layer components {
  .btn-primary {
    @apply bg-blue-600 text-white px-6 py-3 rounded-lg
            hover:bg-blue-700 transition-colors;
  }
  
  .card {
    @apply bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg;
  }
}
</code></pre>

<h2>10. 最佳实践总结</h2>
<h3>10.1 命名规范</h3>
<ul>
<li>使用语义化的类名组合</li>
<li>保持一致的代码风格</li>
<li>使用配置文件自定义主题</li>
</ul>

<h3>10.2 代码组织</h3>
<ul>
<li>按功能模块组织组件</li>
<li>使用 @layer 管理样式层</li>
<li>合理划分 components 和 utilities</li>
</ul>

<h3>10.3 可维护性</h3>
<ul>
<li>提取重复的样式组合</li>
<li>使用 CSS 变量管理主题</li>
<li>保持 class 列表的简洁性</li>
</ul>

<h3>10.4 团队协作</h3>
<ul>
<li>建立团队样式规范</li>
<li>使用 TypeScript 提升类型安全</li>
<li>编写组件文档和示例</li>
</ul>

<h2>结语</h2>
<p>Tailwind CSS 是一个强大而灵活的工具，通过遵循这些最佳实践，你可以构建出既美观又高效的用户界面。记住，工具的强大在于如何使用它，合理地结合 Tailwind 的功能和项目需求，才能发挥其最大价值。</p>

<p>持续学习和实践是掌握 Tailwind CSS 的关键，建议多阅读官方文档和社区案例，不断提升自己的技能水平。</p>
`

  try {
    // 检查是否已存在该文章
    const existingPost = await sql`
      SELECT id, content FROM blog_posts WHERE slug = ${post.slug}
    `

    if (existingPost.length > 0) {
      console.log('📄 文章已存在，正在更新内容...')

      const result = await sql`
        UPDATE blog_posts
        SET title = ${post.title},
            description = ${post.description},
            content = ${content},
            date = ${post.date},
            category = ${post.category},
            tags = ${post.tags}
        WHERE slug = ${post.slug}
        RETURNING id, title
      `

      console.log(`✅ 文章 "${post.title}" 更新成功 (ID: ${result[0].id})`)
    } else {
      console.log('📄 文章不存在，正在创建新文章...')

      const result = await sql`
        INSERT INTO blog_posts (title, description, content, date, category, tags, slug)
        VALUES (${post.title}, ${post.description}, ${content}, ${post.date}, ${post.category}, ${post.tags}, ${post.slug})
        RETURNING id, title
      `

      console.log(`✅ 文章 "${post.title}" 创建成功 (ID: ${result[0].id})`)
    }

    // 验证文章内容
    const verifyPost = await sql`
      SELECT id, title, slug, LENGTH(content) as content_length 
      FROM blog_posts 
      WHERE slug = ${post.slug}
    `

    if (verifyPost.length > 0) {
      console.log(`\n📊 文章验证：`)
      console.log(`  标题: ${verifyPost[0].title}`)
      console.log(`  Slug: ${verifyPost[0].slug}`)
      console.log(`  内容长度: ${verifyPost[0].content_length} 字符`)
      console.log(`\n✅ 文章内容已成功添加到数据库！`)
    }
  } catch (error: unknown) {
    const err = error as { message?: string }
    console.error('❌ 操作失败:', err.message)
    throw error
  }
}

// 运行脚本
addTailwindBlogPost()
  .then(() => {
    console.log('\n🎉 操作完成！')
    process.exit(0)
  })
  .catch(error => {
    console.error('\n💥 发生错误:', error)
    process.exit(1)
  })
