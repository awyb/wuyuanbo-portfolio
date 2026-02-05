# 电子书资源说明

本目录用于存放技术类电子书 PDF 文件。

## 如何添加新的电子书

### 1. 添加 PDF 文件

将电子书 PDF 文件放到此目录下，建议命名格式：

```
{书名英译}-{年份}.pdf
```

例如：

```
react-quick-start-2017.pdf
vuejs-up-and-running-2020.pdf
```

### 2. 添加书籍封面（可选）

如果有书籍封面图片，将其放到 `public/images/books/` 目录下：

```
public/images/books/react-book-cover.jpg
```

### 3. 更新书籍数据

编辑 `data/books.ts` 文件，在 `books` 数组中添加新书籍的信息：

```typescript
{
  id: 'unique-id',                    // 唯一标识符
  title: '书籍标题',                    // 书名
  author: '作者名称',                   // 作者
  description: '书籍描述...',           // 简短描述
  category: '前端开发',                 // 分类（前端开发、后端开发、数据库、工具）
  tags: ['React', 'JavaScript'],      // 标签数组
  cover: '/images/books/cover.jpg',   // 封面图片路径（可选）
  pdfUrl: '/books/book-file.pdf',     // PDF文件路径
  fileSize: '15.2 MB',                // 文件大小
  pages: 280,                         // 页数
  publishYear: 2017,                  // 出版年份
  language: '中文',                   // 语言
}
```

## 支持的分类

- 前端开发
- 后端开发
- 数据库
- 工具

## 注意事项

1. **文件大小**：建议单个 PDF 文件不超过 50MB，以确保良好的加载体验
2. **版权**：请确保您有权分享这些电子书
3. **命名规范**：使用英文文件名，避免中文和特殊字符
4. **描述**：提供简洁准确的书籍描述，帮助用户了解内容

## 示例

已包含的示例书籍：

- React快速上手开发 (2017)
- Vue.js开发实战 (2020)
- Node.js设计模式 (2019)
- TypeScript完全指南 (2021)

您可以根据需要删除这些示例或替换为实际的电子书文件。
