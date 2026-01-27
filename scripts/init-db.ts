import dotenv from 'dotenv'
import path from 'path'

// 显式加载 .env.local 文件
dotenv.config({ path: path.join(__dirname, '../.env.local') })

import { sql } from '../lib/db'

async function initDatabase() {
  console.log('🚀 开始初始化数据库表结构...\n')

  try {
    // 创建 projects 表
    console.log('📋 创建 projects 表...')
    await sql`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        image VARCHAR(255),
        link VARCHAR(255),
        github VARCHAR(255),
        tags TEXT[],
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `
    console.log('✅ projects 表创建成功\n')

    // 创建 skills 表
    console.log('📋 创建 skills 表...')
    await sql`
      CREATE TABLE IF NOT EXISTS skills (
        id SERIAL PRIMARY KEY,
        category VARCHAR(255) NOT NULL UNIQUE,
        items TEXT[],
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `
    console.log('✅ skills 表创建成功\n')

    // 创建 blog_posts 表
    console.log('📋 创建 blog_posts 表...')
    await sql`
      CREATE TABLE IF NOT EXISTS blog_posts (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        date DATE,
        category VARCHAR(255),
        tags TEXT[],
        slug VARCHAR(255) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `
    console.log('✅ blog_posts 表创建成功\n')

    // 验证表是否创建成功
    console.log('🔍 验证表结构...')
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `

    console.log('📦 数据库中的表:')
    tables.forEach((t: { table_name?: string }) => {
      console.log(`  - ${t.table_name}`)
    })
    console.log('\n')

    console.log('✅ 数据库初始化完成！\n')
    console.log('现在可以运行导入脚本: npx tsx scripts/import-existing-data.ts\n')
  } catch (error: unknown) {
    const err = error as { message?: string }
    console.error('❌ 数据库初始化失败:', err.message)
    process.exit(1)
  }
}

initDatabase()
