# Tailwind CSS 最佳实践

Tailwind CSS 是一个功能类优先的 CSS 框架，它可以帮助你快速构建现代化的用户界面。本文将分享一些 Tailwind CSS 的最佳实践。

## 基础配置

### 安装和初始化

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### 配置文件

```javascript
// tailwind.config.js
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          // ... 更多颜色
          900: '#0c4a6e',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

## 命名约定

### 组件化

不要直接在 JSX 中写长串的类名，而是创建可重用的组件：

```typescript
// ❌ 不推荐
<button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
  点击我
</button>

// ✅ 推荐
<Button variant="primary" size="medium">
  点击我
</Button>
```

### 提取常用类

使用 `@apply` 或创建工具类：

```css
/* styles.css */
.btn {
  @apply rounded px-4 py-2 font-semibold transition-colors;
}

.btn-primary {
  @apply bg-blue-500 text-white hover:bg-blue-700;
}
```

## 响应式设计

### 移动优先

```typescript
<div className="w-full md:w-1/2 lg:w-1/3">
  响应式内容
</div>
```

### 使用断点

```typescript
<div className="
  p-4        // 所有屏幕
  sm:p-6     // 小屏幕 (>= 640px)
  md:p-8     // 中等屏幕 (>= 768px)
  lg:p-12    // 大屏幕 (>= 1024px)
  xl:p-16    // 超大屏幕 (>= 1280px)
">
  内容
</div>
```

## 状态管理

### Hover 状态

```typescript
<button className="bg-blue-500 hover:bg-blue-700 transition-colors">
  悬停我
</button>
```

### Focus 状态

```typescript
<input
  className="border-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
  placeholder="输入内容"
/>
```

### Active 状态

```typescript
<button className="active:scale-95 transition-transform">
  点击我
</button>
```

## 布局技巧

### Flexbox

```typescript
<div className="flex items-center justify-between gap-4">
  <div>左侧</div>
  <div>右侧</div>
</div>
```

### Grid

```typescript
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <div>项目 1</div>
  <div>项目 2</div>
  <div>项目 3</div>
</div>
```

### 居中对齐

```typescript
<div className="flex items-center justify-center min-h-screen">
  居中内容
</div>
```

## 间距系统

### 使用一致的间距

```typescript
<div className="space-y-4">
  <div>项目 1</div>
  <div>项目 2</div>
  <div>项目 3</div>
</div>

<div className="space-x-4 flex">
  <div>项目 1</div>
  <div>项目 2</div>
</div>
```

### Padding 和 Margin

```typescript
<div className="p-4">padding: 1rem</div>
<div className="px-4 py-2">水平 padding, 垂直 padding</div>
<div className="m-4">margin: 1rem</div>
<div className="mx-auto">水平居中</div>
```

## 颜色系统

### 语义化颜色

```typescript
<div className="bg-blue-500 text-white">
  主要操作
</div>

<div className="bg-green-500 text-white">
  成功状态
</div>

<div className="bg-red-500 text-white">
  错误状态
</div>
```

### 渐变

```typescript
<div className="bg-linear-to-r from-blue-500 to-purple-600">
  渐变背景
</div>
```

## 文字排版

### 字体大小

```typescript
<h1 className="text-4xl font-bold">大标题</h1>
<h2 className="text-3xl font-semibold">中标题</h2>
<p className="text-base">正文</p>
<small className="text-sm text-gray-600">小字</small>
```

### 文字对齐

```typescript
<p className="text-left">左对齐</p>
<p className="text-center">居中</p>
<p className="text-right">右对齐</p>
```

## 动画和过渡

### 过渡效果

```typescript
<button className="transition-all duration-300 ease-in-out hover:scale-105">
  动画按钮
</button>
```

### 自定义动画

```javascript
// tailwind.config.js
theme: {
  extend: {
    animation: {
      'fade-in': 'fadeIn 0.5s ease-in-out',
    },
    keyframes: {
      fadeIn: {
        '0%': { opacity: '0' },
        '100%': { opacity: '1' },
      },
    },
  },
}
```

## 性能优化

### 使用 JIT 模式

Tailwind CSS 3.x 默认使用 JIT 模式，只生成你使用的类：

```javascript
// tailwind.config.js
module.exports = {
  mode: 'jit', // 默认启用
  // ...
}
```

### 清理未使用的样式

```bash
npm install -D @tailwindcss/typography
```

```javascript
// tailwind.config.js
plugins: [require('@tailwindcss/typography')]
```

## 暗色模式

### 使用暗色模式

```typescript
<div className="bg-white dark:bg-gray-900">
  <h1 className="text-gray-900 dark:text-white">
    响应暗色模式的标题
  </h1>
</div>
```

### 配置暗色模式

```javascript
// tailwind.config.js
module.exports = {
  darkMode: 'class', // 或 'media'
  // ...
}
```

## 最佳实践总结

1. **组件化** - 创建可重用的组件
2. **移动优先** - 从小屏幕开始设计
3. **一致性** - 使用统一的间距和颜色
4. **可访问性** - 关注键盘导航和屏幕阅读器
5. **性能** - 使用 JIT 模式和清理工具
6. **维护性** - 提取常用样式，保持代码整洁

## 总结

Tailwind CSS 是一个强大而灵活的工具，通过遵循这些最佳实践，你可以：

- 提高开发效率
- 保持代码一致性
- 创建更易维护的项目
- 构建更好的用户体验

持续学习和实践，你将能够充分利用 Tailwind CSS 的强大功能。
