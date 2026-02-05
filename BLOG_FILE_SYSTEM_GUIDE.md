# 博客文件系统指南

## 概述

博客系统已从数据库存储内容迁移到基于文件的存储系统。文章元数据（标题、描述、标签等）存储在数据库中，而文章内容则存储在本地 Markdown 文件中。

## 架构

### 数据结构

**数据库 (blog_posts 表)**:

- `id` - 文章唯一标识
- `title` - 文章标题
- `description` - 文章描述
- `date` - 发布日期
- `category` - 文章分类
- `tags` - 标签数组
- `slug` - URL 友好的标识符
- `file_path` - Markdown 文件路径 (新字段)

**文件系统 (content/blog/)**:

- 包含所有博客文章的 Markdown 文件
- 文件名格式: `{slug}.md`
- 使用 Markdown 格式编写内容

## 工作流程

### 创建新博客文章

1. **准备 Markdown 文件**

在 `content/blog/` 目录下创建新的 Markdown 文件：

```markdown
# 文章标题

这里是文章的引言或摘要。

## 第一节

这里写第一节的详细内容...

### 子节

子节内容...

## 第二节

更多内容...

## 总结

文章总结...
```

2. **更新数据库**

使用 SQL 插入新的博客文章记录：

```sql
INSERT INTO blog_posts (id, title, description, date, category, tags, slug, file_path)
VALUES (
  'unique-id',
  '文章标题',
  '文章描述',
  '2024-01-01',
  '分类名称',
  ARRAY['标签1', '标签2'],
  'article-slug',
  'content/blog/article-slug.md'
);
```

或使用提供的脚本（如果有的话）。

3. **验证**

访问 `/blog/article-slug` 查看文章是否正确显示。

## 文件组织

### 目录结构

```
content/
└── blog/
    ├── nextjs-13-app-router-guide.md
    ├── typescript-type-system-deep-dive.md
    └── tailwind-css-best-practices.md
```

### 命名规范

- 使用小写字母、数字和连字符
- 使用连字符替换单词间的空格
- 保持文件名简短且描述性强
- 示例: `nextjs-13-app-router-guide.md`

## Markdown 规范

### 基础格式

```markdown
# 一级标题

## 二级标题

### 三级标题

**粗体文本**
_斜体文本_
`行内代码`
```

代码块

```

- 列表项 1
- 列表项 2

[链接文本](url)
![图片描述](image-url)
```

### 最佳实践

1. **使用清晰的标题层次**
   - 文章标题使用 H1 (#)
   - 主要章节使用 H2 (##)
   - 子章节使用 H3 (###)

2. **代码块指定语言**

   ```typescript
   const message = 'Hello World'
   ```

3. **列表使用正确的语法**
   - 使用 `-` 或 `*` 创建无序列表
   - 使用 `1.` 创建有序列表

4. **添加适当的空行**
   - 在段落之间添加空行
   - 在标题和内容之间添加空行

## 系统组件

### 核心文件

1. **lib/markdown.ts**
   - Markdown 转 HTML 的工具函数
   - 使用 `marked` 库进行转换

2. **app/blog/[slug]/page.tsx**
   - 博客文章详情页面
   - 从数据库读取元数据
   - 从文件系统读取内容
   - 将 Markdown 转换为 HTML

3. **app/api/blog/route.ts**
   - 博客文章列表 API
   - 返回所有博客文章的元数据

### 类型定义

```typescript
export interface BlogPost {
  id: string
  title: string
  description: string
  date: string
  category: string
  tags: string[]
  content?: string // 从文件读取的 HTML 内容
  filePath?: string // Markdown 文件路径
  slug: string
}
```

## 维护脚本

### 1. 迁移脚本

**scripts/migrate-blog-to-files.ts**

- 添加 `file_path` 列到数据库
- 显示当前的博客文章列表

```bash
npx tsx scripts/migrate-blog-to-files.ts
```

### 2. 更新文件路径脚本

**scripts/update-blog-file-paths.ts**

- 更新数据库中的文件路径
- 用于批量更新现有文章

```bash
npx tsx scripts/update-blog-file-paths.ts
```

## 常见操作

### 更新文章内容

1. 编辑对应的 Markdown 文件
2. 保存文件
3. 刷新浏览器查看更新

### 修改文章元数据

1. 使用 SQL 更新数据库记录：

```sql
UPDATE blog_posts
SET title = '新标题',
    description = '新描述',
    category = '新分类'
WHERE slug = 'article-slug';
```

### 删除文章

1. 删除 Markdown 文件
2. 从数据库删除记录：

```sql
DELETE FROM blog_posts WHERE slug = 'article-slug';
```

## 性能优化

### 缓存策略

- 文件系统读取有操作系统级别的缓存
- 数据库查询可以使用连接池
- 考虑添加 Next.js 的 ISR (Incremental Static Regeneration)

### 建议

- 保持 Markdown 文件大小合理（建议 < 100KB）
- 使用高效的 Markdown 解析器
- 考虑为图片使用 CDN

## 故障排查

### 文件未找到

**问题**: 文章显示为空或 404

**解决方案**:

1. 检查 `file_path` 是否正确
2. 确认 Markdown 文件存在于指定路径
3. 检查文件权限

### Markdown 未渲染

**问题**: 内容显示为纯文本而非格式化 HTML

**解决方案**:

1. 检查 `markdownToHtml` 函数是否正确导入
2. 确认 `marked` 库已安装
3. 检查控制台是否有错误

### 中文乱码

**问题**: 中文内容显示异常

**解决方案**:

1. 确认文件使用 UTF-8 编码保存
2. 检查文件读取时的编码设置

## 最佳实践

1. **版本控制**
   - 将 `content/blog/` 目录纳入 Git 版本控制
   - 使用有意义的提交信息

2. **备份**
   - 定期备份 Markdown 文件
   - 考虑使用数据库备份策略

3. **SEO 优化**
   - 在数据库中设置准确的描述
   - 使用描述性的 slug
   - 添加适当的标签

4. **图片管理**
   - 将图片存储在 `public/images/blog/` 目录
   - 使用相对路径引用图片
   - 优化图片大小和格式

## 迁移检查清单

从旧系统迁移到新系统时：

- [ ] 运行迁移脚本添加 `file_path` 列
- [ ] 创建 `content/blog/` 目录
- [ ] 将现有文章内容导出为 Markdown 文件
- [ ] 更新数据库记录指向新的文件路径
- [ ] 测试文章显示是否正常
- [ ] 检查所有链接和图片是否正常
- [ ] 验证 SEO 元数据是否正确
- [ ] 更新相关文档

## 总结

基于文件的博客系统提供了以下优势：

1. **更好的版本控制** - 文件内容可以被 Git 跟踪
2. **易于编辑** - 可以使用任何文本编辑器
3. **内容与数据分离** - 元数据在数据库，内容在文件
4. **更好的性能** - 文件系统缓存和 CDN 支持
5. **灵活性** - 可以轻松备份和迁移内容

通过遵循本指南，你可以有效地管理和维护博客系统。
