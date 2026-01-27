import { NextResponse } from 'next/server'
import { testConnection, getTables, sql } from '@/lib/db'

export async function GET() {
  // 测试连接
  const connectionTest = await testConnection()

  if (!connectionTest.success) {
    return NextResponse.json(
      {
        success: false,
        message: '数据库连接失败',
        error: connectionTest.error,
      },
      { status: 500 },
    )
  }

  // 获取表列表
  const tablesResult = await getTables()

  // 测试查询项目数据
  let projectsCount = 0
  try {
    const result = await sql`SELECT COUNT(*) as count FROM projects`
    projectsCount = result[0]?.count || 0
  } catch (error) {
    console.error('查询项目数据失败:', error)
  }

  // 测试查询技能数据
  let skillsCount = 0
  try {
    const result = await sql`SELECT COUNT(*) as count FROM skills`
    skillsCount = result[0]?.count || 0
  } catch (error) {
    console.error('查询技能数据失败:', error)
  }

  // 测试查询博客数据
  let blogPostsCount = 0
  try {
    const result = await sql`SELECT COUNT(*) as count FROM blog_posts`
    blogPostsCount = result[0]?.count || 0
  } catch (error) {
    console.error('查询博客数据失败:', error)
  }

  return NextResponse.json({
    success: true,
    message: '数据库连接成功',
    connection: connectionTest.data,
    tables: tablesResult.success ? tablesResult.tables : [],
    dataCount: {
      projects: projectsCount,
      skills: skillsCount,
      blogPosts: blogPostsCount,
    },
  })
}
