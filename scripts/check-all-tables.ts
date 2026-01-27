import dotenv from 'dotenv'
import path from 'path'

// 显式加载 .env.local 文件
dotenv.config({ path: path.join(__dirname, '../.env.local') })

import { sql } from '../lib/db'

async function checkAllTables() {
  console.log('🔍 检查所有数据库表...\n')

  // 检查所有 schema
  const schemas = await sql`
    SELECT schema_name 
    FROM information_schema.schemata 
    WHERE schema_name NOT IN ('pg_catalog', 'information_schema')
  `

  console.log('📋 所有 Schema:')
  schemas.forEach((s: { schema_name?: string }) => {
    console.log(`  - ${s.schema_name}`)
  })
  console.log('')

  // 检查所有 schema 中的表
  const allTables = await sql`
    SELECT table_schema, table_name 
    FROM information_schema.tables 
    WHERE table_schema NOT IN ('pg_catalog', 'information_schema')
    ORDER BY table_schema, table_name
  `

  console.log('📦 所有表:')
  if (allTables.length === 0) {
    console.log('  (没有表)')
  } else {
    allTables.forEach((t: { table_schema?: string; table_name?: string }) => {
      console.log(`  ${t.table_schema}.${t.table_name}`)
    })
  }
  console.log('')

  // 创建一个测试表
  console.log('🧪 创建测试表...')
  try {
    await sql`CREATE TABLE IF NOT EXISTS test_table (id SERIAL PRIMARY KEY, name VARCHAR(255))`
    console.log('✅ 测试表创建成功')

    // 插入数据
    await sql`INSERT INTO test_table (name) VALUES ('test')`
    console.log('✅ 测试数据插入成功')

    // 查询
    const result = await sql`SELECT * FROM test_table`
    console.log(`📦 查询结果: ${JSON.stringify(result)}`)

    // 删除测试表
    await sql`DROP TABLE test_table`
    console.log('✅ 测试表删除成功\n')
  } catch (error: unknown) {
    const err = error as { message?: string }
    console.log(`❌ 测试失败: ${err.message}\n`)
  }
}

checkAllTables().catch(console.error)
