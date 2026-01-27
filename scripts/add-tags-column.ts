import dotenv from 'dotenv'
import path from 'path'

// 显式加载 .env.local 文件
dotenv.config({ path: path.join(__dirname, '../.env.local') })

import { sql } from '../lib/db'

async function addTagsColumn() {
  console.log('🔧 添加 tags 列到 projects 表...\n')

  try {
    // 检查列是否已存在
    const existingColumn = await sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'projects' 
      AND column_name = 'tags'
      AND table_schema = 'public'
    `

    if (existingColumn.length === 0) {
      // 添加 tags 列
      await sql`
        ALTER TABLE projects 
        ADD COLUMN IF NOT EXISTS tags TEXT[]
      `
      console.log('✅ tags 列添加成功\n')
    } else {
      console.log('ℹ️  tags 列已存在，跳过添加\n')
    }

    // 验证
    const columns = await sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'projects' 
      AND table_schema = 'public' 
      ORDER BY ordinal_position
    `

    console.log('Projects 表结构:')
    columns.forEach((c: any) => {
      console.log(`  ${c.column_name}: ${c.data_type}`)
    })
  } catch (error: unknown) {
    const err = error as { message?: string }
    console.error('❌ 添加列失败:', err.message)
    process.exit(1)
  }
}

addTagsColumn()
