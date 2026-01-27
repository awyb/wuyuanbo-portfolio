import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { type, data } = body

    if (!type || !data) {
      return NextResponse.json(
        { success: false, message: '缺少必需参数: type 和 data' },
        { status: 400 },
      )
    }

    let result

    switch (type) {
      case 'project':
        result = await insertProject(data)
        break
      case 'skill':
        result = await insertSkill(data)
        break
      case 'blog':
        result = await insertBlog(data)
        break
      default:
        return NextResponse.json(
          { success: false, message: `不支持的数据类型: ${type}` },
          { status: 400 },
        )
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('插入数据失败:', error)
    return NextResponse.json(
      {
        success: false,
        message: '插入数据失败',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

// 插入项目数据
async function insertProject(data: {
  title: string
  description: string
  image?: string
  tags?: string[]
  link?: string
  github?: string
}) {
  const { title, description, image, tags, link, github } = data

  if (!title || !description) {
    return { success: false, message: '项目必须包含 title 和 description' }
  }

  const result = await sql`
    INSERT INTO projects (title, description, image, tags, link, github)
    VALUES (${title}, ${description}, ${image || null}, ${tags || []}, ${link || null}, ${github || null})
    RETURNING *
  `

  return {
    success: true,
    message: '项目插入成功',
    data: result[0],
  }
}

// 插入技能数据
async function insertSkill(data: { category: string; items: string[] }) {
  const { category, items } = data

  if (!category || !items || !Array.isArray(items)) {
    return { success: false, message: '技能必须包含 category 和 items 数组' }
  }

  const result = await sql`
    INSERT INTO skills (category, items)
    VALUES (${category}, ${items})
    RETURNING *
  `

  return {
    success: true,
    message: '技能插入成功',
    data: result[0],
  }
}

// 插入博客数据
async function insertBlog(data: {
  title: string
  description?: string
  content?: string
  date?: string
  category?: string
  tags?: string[]
  slug: string
}) {
  const { title, description, content, date, category, tags, slug } = data

  if (!title || !slug) {
    return { success: false, message: '博客必须包含 title 和 slug' }
  }

  const result = await sql`
    INSERT INTO blog_posts (title, description, content, date, category, tags, slug)
    VALUES (
      ${title}, 
      ${description || null}, 
      ${content || null}, 
      ${date || null}, 
      ${category || null}, 
      ${tags || []}, 
      ${slug}
    )
    RETURNING *
  `

  return {
    success: true,
    message: '博客插入成功',
    data: result[0],
  }
}
