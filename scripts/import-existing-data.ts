import dotenv from 'dotenv'
import path from 'path'

// 显式加载 .env.local 文件
dotenv.config({ path: path.join(__dirname, '../.env.local') })

import { sql } from '../lib/db'
import { projects, skills, blogPosts } from '../data/portfolio'

async function importProjects() {
  console.log('📝 开始导入项目数据...\n')
  console.log(`准备导入 ${projects.length} 个项目\n`)

  for (const project of projects) {
    try {
      console.log(`正在插入: "${project.title}"`)
      const result = await sql`
        INSERT INTO projects (title, description, image, tags, link, github)
        VALUES (${project.title}, ${project.description}, ${project.image}, ${project.tags}, ${project.link || null}, ${project.github || null})
        RETURNING id, title
      `

      console.log(`  查询返回: ${JSON.stringify(result)}`)

      if (result.length > 0) {
        console.log(`✅ 项目 "${project.title}" 导入成功 (ID: ${result[0].id})`)
      } else {
        console.log(`⚠️  项目 "${project.title}" 插入返回空结果`)
      }
    } catch (error: unknown) {
      const err = error as { message?: string }
      console.error(`❌ 项目 "${project.title}" 导入失败:`, err.message)
    }
    console.log('')
  }

  console.log('✅ 项目数据导入完成\n')
}

async function importSkills() {
  console.log('📝 开始导入技能数据...\n')

  for (const skill of skills) {
    try {
      const result = await sql`
        INSERT INTO skills (category, items)
        VALUES (${skill.category}, ${skill.items})
        RETURNING id, category
      `

      if (result.length > 0) {
        console.log(`✅ 技能分类 "${skill.category}" 导入成功 (ID: ${result[0].id})`)
      }
    } catch (error: unknown) {
      const err = error as { message?: string }
      console.error(`❌ 技能分类 "${skill.category}" 导入失败:`, err.message)
    }
  }

  console.log('\n✅ 技能数据导入完成\n')
}

async function importBlogPosts() {
  console.log('📝 开始导入博客数据...\n')

  for (const blog of blogPosts) {
    try {
      const result = await sql`
        INSERT INTO blog_posts (title, description, date, category, tags, slug)
        VALUES (${blog.title}, ${blog.description}, ${blog.date}, ${blog.category}, ${blog.tags}, ${blog.slug})
        RETURNING id, title
      `

      if (result.length > 0) {
        console.log(`✅ 博客 "${blog.title}" 导入成功 (ID: ${result[0].id})`)
      }
    } catch (error: unknown) {
      const err = error as { message?: string }
      console.error(`❌ 博客 "${blog.title}" 导入失败:`, err.message)
    }
  }

  console.log('\n✅ 博客数据导入完成\n')
}

async function verifyData() {
  console.log('📊 验证导入的数据...\n')

  // 先检查表是否存在
  const tables = await sql`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public'
    ORDER BY table_name
  `

  console.log(
    '📋 数据库中的表:',
    tables.map((t: { table_name?: string }) => t.table_name).join(', '),
  )
  console.log('')

  const projectsResult = await sql`SELECT * FROM projects`
  const skillsResult = await sql`SELECT * FROM skills`
  const blogPostsResult = await sql`SELECT * FROM blog_posts`

  const pCount = Array.isArray(projectsResult) ? projectsResult.length : 0
  const sCount = Array.isArray(skillsResult) ? skillsResult.length : 0
  const bCount = Array.isArray(blogPostsResult) ? blogPostsResult.length : 0

  console.log(`📦 项目总数: ${pCount}`)
  console.log(`📦 技能分类总数: ${sCount}`)
  console.log(`📦 博客文章总数: ${bCount}`)
  console.log('')
}

async function main() {
  console.log('🚀 开始从 data/portfolio.ts 导入数据到数据库\n')
  console.log('='.repeat(50))
  console.log('')

  try {
    await importProjects()
    await importSkills()
    await importBlogPosts()
    await verifyData()

    console.log('='.repeat(50))
    console.log('✅ 所有数据导入完成！\n')
  } catch (error) {
    console.error('❌ 导入过程中发生错误:', error)
    process.exit(1)
  }
}

// 运行导入脚本
main()
