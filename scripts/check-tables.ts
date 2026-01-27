import dotenv from 'dotenv'
import path from 'path'

// 显式加载 .env.local 文件
dotenv.config({ path: path.join(__dirname, '../.env.local') })

import { sql } from '../lib/db'

async function checkTables() {
  console.log('🔍 检查数据库中的表结构...\n')

  // 查看所有表
  const tables = await sql`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public'
    ORDER BY table_name
  `

  console.log('📋 数据库中的表:')
  if (Array.isArray(tables)) {
    tables.forEach((table: { table_name?: string }) => {
      console.log(`  - ${table.table_name}`)
    })
  } else {
    console.log('  (无表)')
  }
  console.log('')

  // 尝试查询每个表
  const tableNames = ['projects', 'skills', 'blog_posts']

  for (const tableName of tableNames) {
    try {
      const result = await sql`SELECT 1 FROM ${tableName} LIMIT 1`
      console.log(`✅ 表 "${tableName}" 存在且可访问`)
    } catch (error: unknown) {
      const err = error as { message?: string }
      if (err.message?.includes('does not exist')) {
        console.log(`❌ 表 "${tableName}" 不存在`)
      } else {
        console.log(`⚠️  表 "${tableName}" 查询失败: ${err.message}`)
      }
    }
  }
  console.log('')

  // 测试插入一个简单项目
  console.log('🧪 测试插入数据...')
  try {
    const result = await sql`
      INSERT INTO projects (title, description, image, tags, link, github)
      VALUES ('测试项目', '这是一个测试项目', null, ARRAY['Test'], null, null)
      ON CONFLICT DO NOTHING
      RETURNING id, title
    `

    if (result.length > 0) {
      console.log(`✅ 测试插入成功: ${result[0].title} (ID: ${result[0].id})`)
    } else {
      console.log('⏭️  测试插入已存在或表有冲突')
    }
  } catch (error: unknown) {
    const err = error as { message?: string }
    console.log('❌ 测试插入失败:', err.message)
  }
  console.log('')

  // 再次查询所有项目
  console.log('📦 查询所有项目...')
  const allProjects = await sql`SELECT * FROM projects`
  console.log(`找到 ${allProjects.length} 个项目:`)
  allProjects.forEach((p: { title?: string }, index: number) => {
    console.log(`  ${index + 1}. ${p.title}`)
  })
}

checkTables().catch(console.error)
