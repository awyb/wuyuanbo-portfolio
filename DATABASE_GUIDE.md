# 数据库集成指南 - Neon PostgreSQL

## 📋 概述

本项目已成功集成 **Neon PostgreSQL** 数据库，用于存储和管理项目数据。Neon 是一个专为 Serverless 和边缘计算优化的 PostgreSQL 数据库服务，与 Vercel 完美集成。

## ✨ 为什么选择 Neon？

1. **Vercel 原生集成** - 一键配置，无需额外设置
2. **Serverless 优化** - 按需连接，无空闲成本
3. **自动扩展** - 根据流量自动调整资源
4. **PostgreSQL 兼容** - 完全支持标准 PostgreSQL 功能
5. **免费额度** - 提供慷慨的免费套餐（500MB 存储，3亿行读取）

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install @neondatabase/serverless
```

### 2. 配置环境变量

确保 `.env.local` 文件包含 `DATABASE_URL`：

```env
DATABASE_URL="postgresql://user:password@host/database?sslmode=require"
```

### 3. 初始化数据库表结构

```bash
npx tsx scripts/init-db.ts
```

这将创建以下表：

- `projects` - 项目数据
- `skills` - 技能分类和技能项
- `blog_posts` - 博客文章

## 📊 数据库表结构

### projects 表

```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image VARCHAR(255),
  link VARCHAR(255),
  github VARCHAR(255),
  tags TEXT[],
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

### skills 表

```sql
CREATE TABLE skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category VARCHAR(255) NOT NULL UNIQUE,
  items TEXT[],
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

### blog_posts 表

```sql
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  date DATE,
  category VARCHAR(255),
  tags TEXT[],
  slug VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

## 📝 使用示例

### 基本查询

```typescript
import { sql } from '@/lib/db'

// 查询所有项目
const projects = await sql`SELECT * FROM projects`

// 查询单个项目
const project = await sql`SELECT * FROM projects WHERE id = ${projectId}`

// 按标签筛选项目
const filteredProjects = await sql`
  SELECT * FROM projects 
  WHERE ${tag} = ANY(tags)
`
```

### 插入数据

```typescript
import { sql } from '@/lib/db'

const result = await sql`
  INSERT INTO projects (title, description, image, tags)
  VALUES (${title}, ${description}, ${image}, ${tags})
  RETURNING id, title
`
```

### 更新数据

```typescript
import { sql } from '@/lib/db'

await sql`
  UPDATE projects 
  SET title = ${newTitle}, description = ${newDescription}
  WHERE id = ${projectId}
`
```

### 删除数据

```typescript
import { sql } from '@/lib/db`

await sql`DELETE FROM projects WHERE id = ${projectId}`
```

## 🔧 可用脚本

### 初始化数据库

```bash
npx tsx scripts/init-db.ts
```

- 创建所有必需的表
- 设置约束和索引

### 导入现有数据

```bash
npx tsx scripts/import-existing-data.ts
```

- 从 `data/portfolio.ts` 导入数据到数据库
- 跳过已存在的数据（避免重复）

### 验证数据

```bash
npx tsx scripts/verify-data.ts
```

- 显示数据库中的所有数据
- 用于验证导入结果

### 清理重复数据

```bash
npx tsx scripts/cleanup-duplicate-skills.ts
```

- 删除 Skills 表中的重复分类
- 每个分类只保留一条记录

## 🌐 API 路由

### 测试数据库连接

```bash
GET /api/test-db
```

返回数据库连接状态和当前时间。

### 插入测试数据

```bash
POST /api/insert-data
```

插入一条测试项目到数据库。

## 📦 部署到 Vercel

### 1. 环境变量配置

在 Vercel 项目设置中添加以下环境变量：

```
DATABASE_URL=your_neon_database_url
```

### 2. 部署步骤

```bash
# 提交代码
git add .
git commit -m "Integrate Neon PostgreSQL database"
git push

# Vercel 自动部署
```

### 3. 在 Vercel 中配置 Neon

1. 进入 Vercel 项目设置
2. 选择 "Storage" 或 "Environment Variables"
3. 如果使用 Vercel 集成，可以直接链接 Neon 项目
4. 或者手动粘贴 `DATABASE_URL`

## 🔍 数据库管理

### 访问 Neon 控制台

1. 登录 [Neon Console](https://console.neon.tech)
2. 查看数据库详情
3. 执行 SQL 查询
4. 监控使用情况

### 备份数据

Neon 自动备份最近的 7 天数据。可以手动创建时间点备份：

1. 进入 Neon 控制台
2. 选择项目
3. 点击 "Branches"
4. 创建新分支作为备份

## 🎯 最佳实践

### 1. 连接管理

```typescript
// ✅ 好的做法 - 使用共享的 sql 实例
import { sql } from '@/lib/db'

// ❌ 不好的做法 - 每次创建新连接
import { neon } from '@neondatabase/serverless'
const sql = neon(process.env.DATABASE_URL)
```

### 2. 错误处理

```typescript
try {
  const result = await sql`SELECT * FROM projects`
  return { success: true, data: result }
} catch (error) {
  console.error('Database error:', error)
  return { success: false, error }
}
```

### 3. 参数化查询

```typescript
// ✅ 安全 - 使用参数化查询
await sql`SELECT * FROM projects WHERE id = ${projectId}`

// ❌ 不安全 - SQL 注入风险
await sql`SELECT * FROM projects WHERE id = '${projectId}'`
```

### 4. 环境变量

- `.env.local` - 本地开发环境
- Vercel 环境变量 - 生产环境
- 永远不要提交 `.env.local` 到版本控制

## 📈 性能优化

### 1. 使用连接池

Neon 使用 HTTP 无连接池模式，非常适合 Serverless：

```typescript
// 自动优化，无需额外配置
import { sql } from '@/lib/db'
```

### 2. 查询优化

```typescript
// 只选择需要的列
const projects = await sql`
  SELECT id, title, description, tags 
  FROM projects
`

// 使用 LIMIT 限制结果
const recentProjects = await sql`
  SELECT * FROM projects 
  ORDER BY created_at DESC 
  LIMIT 10
`
```

### 3. 添加索引（如需要）

```sql
CREATE INDEX idx_projects_title ON projects(title);
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
```

## 🛠️ 故障排除

### 连接问题

**问题**: `No database connection string was provided`

**解决方案**:

1. 检查 `.env.local` 文件是否存在
2. 验证 `DATABASE_URL` 格式正确
3. 确保 `.env.local` 在 `.gitignore` 中

### 表不存在

**问题**: `relation "projects" does not exist`

**解决方案**:

```bash
npx tsx scripts/init-db.ts
```

### 类型错误

**问题**: TypeScript 类型不匹配

**解决方案**:

```typescript
// 明确类型
const result = await sql<Record<string, any>[]>`SELECT * FROM projects`

// 或使用类型断言
const projects = result as Project[]
```

## 📚 相关资源

- [Neon 官方文档](https://neon.tech/docs)
- [@neondatabase/serverless 文档](https://neon.tech/docs/serverless/serverless-driver)
- [Vercel Neon 集成](https://vercel.com/docs/integrations/neon)
- [PostgreSQL 文档](https://www.postgresql.org/docs/)

## 📝 更新日志

### 2026-01-26

- ✅ 初始化 Neon PostgreSQL 数据库
- ✅ 创建三个核心表（projects, skills, blog_posts）
- ✅ 实现数据导入脚本
- ✅ 添加 API 测试端点
- ✅ 集成到 Vercel 项目

## 🤝 贡献

如果需要添加新的表或修改数据库结构：

1. 更新 `scripts/init-db.ts`
2. 重新运行初始化脚本
3. 更新此文档
4. 测试所有更改

## 📞 支持

遇到问题？

- 查看 Neon 控制台日志
- 检查 Vercel 部署日志
- 参考 [Neon 故障排除指南](https://neon.tech/docs/troubleshooting)
