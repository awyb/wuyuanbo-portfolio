import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function GET() {
  try {
    const blogPosts = await sql`
      SELECT * FROM blog_posts 
      ORDER BY date DESC
    `

    return NextResponse.json({ success: true, data: blogPosts })
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch blog posts' },
      { status: 500 },
    )
  }
}
