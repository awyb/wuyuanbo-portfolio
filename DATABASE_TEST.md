# 数据库连接测试指南

## 前置条件

1. 已创建 Neon PostgreSQL 数据库
2. 已在数据库的 `public` schema 中创建了表（projects, skills, blog_posts 等）
   - Neon 数据库默认使用 `public` schema
   - 你的表应该在 `neondb` 数据库的 `public` schema 下
3. 已安装 `@neondatabase/serverless` 依赖

## 配置步骤

### 1. 获取数据库连接字符串

1. 登录 [Neon Console](https://console.neon.tech/)
2. 选择你的项目
3. 在项目详情页找到 "Connection Details"
4. 复制 "Connection string"

### 2. 配置环境变量

在项目根目录创建 `.env.local` 文件（注意不要提交到 git）：

```bash
# Neon PostgreSQL 数据库连接字符串
DATABASE_URL=postgresql://username:password@hostname/database?sslmode=require
```

将上面的连接字符串替换为你实际的 Neon 连接字符串。

**重要提示**：

- `.env.local` 文件已在 `.gitignore` 中，不会被提交
- 确保 `DATABASE_URL` 以 `postgresql://` 开头
- 确保包含 `?sslmode=require` 参数

## 测试方法

### 方法 1: 启动开发服务器测试

1. 启动开发服务器：

```bash
npm run dev
```

2. 在浏览器中访问测试 API：

```
http://localhost:3000/api/test-db
```

3. 查看返回的 JSON 结果：

```json
{
  "success": true,
  "message": "数据库连接成功",
  "connection": {
    "now": "2024-01-26T09:30:00.000Z"
  },
  "tables": ["blog_posts", "comments", "projects", "skills"],
  "dataCount": {
    "projects": 3,
    "skills": 4,
    "blogPosts": 3
  }
}
```

### 方法 2: 使用 curl 测试

```bash
curl http://localhost:3000/api/test-db
```

### 方法 3: 在代码中直接测试

创建一个测试脚本 `test-db-connection.ts`：

```typescript
import { testConnection, getTables } from './lib/db'

async function runTests() {
  console.log('开始测试数据库连接...\n')

  // 测试连接
  const connectionTest = await testConnection()
  console.log('连接测试结果:', connectionTest)

  // 获取表列表
  const tablesResult = await getTables()
  console.log('\n数据库表:', tablesResult)
}

runTests().catch(console.error)
```

然后运行：

```bash
npx tsx test-db-connection.ts
```

## 预期结果

### 成功连接时：

- `success: true`
- `message: "数据库连接成功"`
- `connection.now` 显示当前数据库时间
- `tables` 数组包含你的所有表名
- `dataCount` 显示每个表的数据数量

### 连接失败时：

- `success: false`
- `message: "数据库连接失败"`
- `error` 字段包含详细的错误信息

## 常见问题排查

### 1. 错误: "DATABASE_URL is not defined in environment variables"

**原因**: `.env.local` 文件不存在或 `DATABASE_URL` 未设置

**解决方案**:

- 确保 `.env.local` 文件在项目根目录
- 检查变量名是否正确（注意大小写）
- 重启开发服务器（修改 .env.local 后需要重启）

### 2. 错误: "connection refused"

**原因**: 数据库连接字符串错误或数据库不可访问

**解决方案**:

- 检查连接字符串格式
- 确认 Neon 数据库正在运行
- 检查网络连接

### 3. 错误: "relation 'projects' does not exist"

**原因**: 数据库表尚未创建

**解决方案**:

- 在 Neon SQL Editor 中运行建表语句
- 或使用迁移工具创建表

## 验证数据库表结构

测试成功后，你可以在 Neon Console 中验证表结构：

```sql
-- 查看所有表
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public';

-- 查看表结构
\d projects
\d skills
\d blog_posts
```

## 下一步

测试连接成功后，你可以：

1. **创建数据操作函数** - 在 `lib/` 目录下创建 CRUD 操作
2. **创建 API Routes** - 为前端提供数据接口
3. **使用 Server Actions** - 在 Next.js App Router 中直接操作数据库
4. **添加数据验证** - 使用 Zod 验证输入数据
5. **实现缓存** - 使用 Vercel KV 缓存热点数据

## 安全提示

- 永远不要将 `.env.local` 提交到版本控制
- 生产环境使用 Vercel Environment Variables 设置
- 定期更新数据库密码
- 限制数据库访问 IP
- 使用 SSL 连接（已默认启用）
