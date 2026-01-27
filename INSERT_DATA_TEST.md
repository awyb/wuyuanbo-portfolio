# 数据插入测试指南

本文档将指导你如何测试数据库插入功能。

## 📋 已创建的文件

1. **`app/api/insert-data/route.ts`** - 数据插入 API 接口
2. **`scripts/insert-test-data.sh`** - Shell 脚本测试（Linux/Mac）
3. **`scripts/import-existing-data.ts`** - 导入现有数据脚本

## 🚀 测试方法

### 方法 1: 使用 curl 命令（推荐）

#### 1.1 插入项目数据

```bash
curl -X POST http://localhost:3000/api/insert-data \
  -H "Content-Type: application/json" \
  -d '{
    "type": "project",
    "data": {
      "title": "我的新项目",
      "description": "这是一个测试项目的描述",
      "image": "/images/my-project.jpg",
      "tags": ["React", "TypeScript", "Next.js"],
      "link": "https://example.com",
      "github": "https://github.com/example/my-project"
    }
  }'
```

#### 1.2 插入技能数据

```bash
curl -X POST http://localhost:3000/api/insert-data \
  -H "Content-Type: application/json" \
  -d '{
    "type": "skill",
    "data": {
      "category": "前端框架",
      "items": ["React", "Vue", "Angular"]
    }
  }'
```

#### 1.3 插入博客数据

```bash
curl -X POST http://localhost:3000/api/insert-data \
  -H "Content-Type: application/json" \
  -d '{
    "type": "blog",
    "data": {
      "title": "如何使用 Next.js 构建应用",
      "description": "详细介绍 Next.js 的使用方法",
      "content": "完整的博客文章内容...",
      "date": "2024-01-26",
      "category": "教程",
      "tags": ["Next.js", "React", "教程"],
      "slug": "how-to-use-nextjs"
    }
  }'
```

### 方法 2: 使用 Postman 或 Insomnia

1. 创建新的 POST 请求
2. URL: `http://localhost:3000/api/insert-data`
3. Headers: `Content-Type: application/json`
4. Body (raw JSON):

```json
{
  "type": "project",
  "data": {
    "title": "测试项目",
    "description": "项目描述",
    "image": "/images/test.jpg",
    "tags": ["React", "TypeScript"],
    "link": "https://example.com",
    "github": "https://github.com/example/test"
  }
}
```

### 方法 3: 使用 JavaScript (浏览器控制台)

```javascript
fetch('http://localhost:3000/api/insert-data', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    type: 'project',
    data: {
      title: '浏览器测试项目',
      description: '通过浏览器控制台插入的测试数据',
      image: '/images/browser-test.jpg',
      tags: ['JavaScript', 'Fetch API'],
      link: 'https://example.com',
      github: 'https://github.com/example/browser-test',
    },
  }),
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error))
```

## 📦 导入现有数据

如果你想将 `data/portfolio.ts` 中的现有数据导入到数据库：

### 前置条件

1. 确保已安装 `tsx` 用于运行 TypeScript:

```bash
npm install -D tsx
```

2. 确保 `.env.local` 已配置数据库连接字符串

### 运行导入脚本

```bash
npx tsx scripts/import-existing-data.ts
```

导入脚本会：

- ✅ 导入所有项目数据
- ✅ 导入所有技能数据
- ✅ 导入所有博客数据
- ✅ 跳过已存在的数据（使用 `ON CONFLICT DO NOTHING`）
- ✅ 显示导入进度和结果

### 预期输出

```
🚀 开始从 data/portfolio.ts 导入数据到数据库

==================================================

📝 开始导入项目数据...

✅ 项目 "个人作品集网站" 导入成功 (ID: 550e8400-e29b-41d4-a716-446655440000)
✅ 项目 "React 组件库" 导入成功 (ID: 550e8400-e29b-41d4-a716-446655440001)
✅ 项目 "任务管理应用" 导入成功 (ID: 550e8400-e29b-41d4-a716-446655440002)

✅ 项目数据导入完成

📝 开始导入技能数据...

✅ 技能分类 "前端技术" 导入成功 (ID: 550e8400-e29b-41d4-a716-446655440003)
✅ 技能分类 "后端技术" 导入成功 (ID: 550e8400-e29b-41d4-a716-446655440004)
✅ 技能分类 "工具与平台" 导入成功 (ID: 550e8400-e29b-41d4-a716-446655440005)
✅ 技能分类 "其他技能" 导入成功 (ID: 550e8400-e29b-41d4-a716-446655440006)

✅ 技能数据导入完成

📝 开始导入博客数据...

✅ 博客 "Next.js 13 App Router 完全指南" 导入成功 (ID: 550e8400-e29b-41d4-a716-446655440007)
✅ 博客 "Tailwind CSS 最佳实践" 导入成功 (ID: 550e8400-e29b-41d4-a716-446655440008)
✅ 博客 "TypeScript 类型系统深度解析" 导入成功 (ID: 550e8400-e29b-41d4-a716-446655440009)

✅ 博客数据导入完成

📊 验证导入的数据...

📦 项目总数: 3
📦 技能分类总数: 4
📦 博客文章总数: 3

==================================================
✅ 所有数据导入完成！
```

## 🔍 验证插入的数据

### 访问测试 API

在浏览器中打开：

```
http://localhost:3000/api/test-db
```

你会看到类似这样的响应：

```json
{
  "success": true,
  "message": "数据库连接成功",
  "connection": {
    "now": "2024-01-26T09:30:00.000Z"
  },
  "tables": ["blog_posts", "projects", "skills"],
  "dataCount": {
    "projects": 4,
    "skills": 5,
    "blogPosts": 4
  }
}
```

### 在 Neon Console 中查看

1. 登录 [Neon Console](https://console.neon.tech/)
2. 选择你的项目
3. 打开 SQL Editor
4. 运行查询：

```sql
-- 查看所有项目
SELECT * FROM projects;

-- 查看所有技能
SELECT * FROM skills;

-- 查看所有博客
SELECT * FROM blog_posts;
```

## 📝 数据格式说明

### 项目数据

```typescript
{
  title: string        // 必需
  description: string  // 必需
  image?: string       // 可选
  tags?: string[]      // 可选
  link?: string        // 可选
  github?: string      // 可选
}
```

### 技能数据

```typescript
{
  category: string     // 必需
  items: string[]      // 必需，数组类型
}
```

### 博客数据

```typescript
{
  title: string        // 必需
  slug: string         // 必需，URL 友好的唯一标识
  description?: string // 可选
  content?: string     // 可选
  date?: string        // 可选，格式: YYYY-MM-DD
  category?: string    // 可选
  tags?: string[]      // 可选
}
```

## ⚠️ 常见错误

### 1. 缺少必需字段

```json
{
  "success": false,
  "message": "项目必须包含 title 和 description"
}
```

**解决方案**: 确保提供了所有必需字段

### 2. 数据库连接失败

```json
{
  "success": false,
  "message": "插入数据失败",
  "error": "connection refused"
}
```

**解决方案**:

- 检查 `.env.local` 文件中的 `DATABASE_URL`
- 确保数据库正在运行
- 查看数据库连接字符串是否正确

### 3. 类型不匹配

```json
{
  "success": false,
  "message": "插入数据失败",
  "error": "column \"items\" is of type text[] but expression is of type text"
}
```

**解决方案**: 确保 `items` 字段是数组类型

### 4. Slug 冲突

```json
{
  "success": false,
  "message": "插入数据失败",
  "error": "duplicate key value violates unique constraint \"blog_posts_slug_key\""
}
```

**解决方案**: 使用唯一的 slug 值

## 🎯 下一步

测试成功后，你可以：

1. **创建查询 API** - 在 `app/api/` 下创建查询接口
2. **创建更新/删除 API** - 实现完整的 CRUD 功能
3. **添加数据验证** - 使用 Zod 进行输入验证
4. **实现分页** - 为大量数据添加分页功能
5. **添加搜索** - 实现全文搜索功能
6. **集成到页面** - 修改页面组件从数据库获取数据

## 🔗 相关文档

- [DATABASE_TEST.md](./DATABASE_TEST.md) - 数据库连接测试指南
- [Neon Documentation](https://neon.tech/docs)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
