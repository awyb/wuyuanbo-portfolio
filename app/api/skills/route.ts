import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function GET() {
  try {
    const skills = await sql`
      SELECT * FROM skills 
      ORDER BY category
    `

    return NextResponse.json({ success: true, data: skills })
  } catch (error) {
    console.error('Error fetching skills:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch skills' }, { status: 500 })
  }
}
