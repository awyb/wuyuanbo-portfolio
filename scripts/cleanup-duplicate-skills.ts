import dotenv from 'dotenv'
import path from 'path'

// 显式加载 .env.local 文件
dotenv.config({ path: path.join(__dirname, '../.env.local') })

import { sql } from '../lib/db'

async function cleanupDuplicateSkills() {
  console.log('🧹 清理 Skills 表中的重复数据...\n')

  try {
    // 删除重复的 skills，只保留每个 category 的第一个
    await sql`
      DELETE FROM skills s1
      WHERE EXISTS (
        SELECT 1
        FROM skills s2
        WHERE s1.category = s2.category
        AND s1.id > s2.id
      )
    `

    console.log('✅ 重复数据清理完成\n')

    // 验证
    const skills = await sql`SELECT * FROM skills`
    console.log(`📦 当前 Skills 总数: ${skills.length}`)
    console.log('Skills 分类:')
    skills.forEach((s: any) => {
      console.log(`  - ${s.category} (${s.items.length} 项技能)`)
    })
  } catch (error: unknown) {
    const err = error as { message?: string }
    console.error('❌ 清理失败:', err.message)
    process.exit(1)
  }
}

cleanupDuplicateSkills()
