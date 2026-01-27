import dotenv from 'dotenv'
import path from 'path'

// 显式加载 .env.local 文件
dotenv.config({ path: path.join(__dirname, '../.env.local') })

import { sql } from '../lib/db'

async function verifyData() {
  console.log('🔍 验证数据库中的数据...\n')

  const projects = await sql`SELECT * FROM projects`
  console.log('📦 Projects:')
  console.log(JSON.stringify(projects, null, 2))
  console.log('')

  const skills = await sql`SELECT * FROM skills`
  console.log('📦 Skills:')
  console.log(JSON.stringify(skills, null, 2))
  console.log('')

  const blogs = await sql`SELECT id, title, slug, category FROM blog_posts`
  console.log('📦 Blog Posts:')
  console.log(JSON.stringify(blogs, null, 2))
}

verifyData().catch(console.error)
