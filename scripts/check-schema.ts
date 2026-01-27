import dotenv from 'dotenv'
import path from 'path'

// 显式加载 .env.local 文件
dotenv.config({ path: path.join(__dirname, '../.env.local') })

import { sql } from '../lib/db'

async function checkSchema() {
  console.log('🔍 检查数据库表结构...\n')

  const tables = ['projects', 'skills', 'blog_posts']

  for (const tableName of tables) {
    console.log(`\n📋 表: ${tableName}`)
    console.log('='.repeat(50))

    const columns = await sql`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = ${tableName}
      AND table_schema = 'public'
      ORDER BY ordinal_position
    `

    if (columns.length === 0) {
      console.log('  ⚠️  表中没有列（可能不存在）')
    } else {
      columns.forEach((col: { column_name?: string; data_type?: string; is_nullable?: string }) => {
        console.log(
          `  ${col.column_name?.padEnd(20) ?? ''} ${col.data_type?.padEnd(15) ?? ''} nullable: ${col.is_nullable}`,
        )
      })
    }

    // 尝试插入一条测试数据
    console.log('\n🧪 测试插入...')
    try {
      if (tableName === 'projects') {
        const result = await sql`
          INSERT INTO projects (title, description)
          VALUES ('测试', '描述')
          RETURNING id
        `
        console.log(`  ✅ 插入成功，返回: ${JSON.stringify(result)}`)

        // 立即查询
        const testRow = await sql`SELECT * FROM projects WHERE title = '测试'`
        console.log(`  📦 查询结果: ${JSON.stringify(testRow)}`)
      }
    } catch (error: unknown) {
      const err = error as { message?: string }
      console.log(`  ❌ 插入失败: ${err.message}`)
    }
  }
}

checkSchema().catch(console.error)
