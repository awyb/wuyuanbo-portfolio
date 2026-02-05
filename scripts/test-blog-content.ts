import { sql } from '@/lib/db'
import fs from 'fs/promises'
import path from 'path'
import { markdownToHtml } from '@/lib/markdown'

async function testBlogContent() {
  try {
    console.log('Testing blog content loading...\n')

    // Get a post from database
    const result = await sql`
      SELECT * FROM blog_posts WHERE slug = 'nextjs-13-app-router-guide'
    `

    if (!result || result.length === 0) {
      console.error('Post not found in database')
      return
    }

    const post = result[0]
    console.log('Database post:')
    console.log(`  Title: ${post.title}`)
    console.log(`  Slug: ${post.slug}`)
    console.log(`  file_path: ${post.file_path}`)
    console.log(
      `  Content in DB: ${post.content ? 'YES' : 'NO'} (${post.content?.length || 0} chars)\n`,
    )

    // Try to read the file
    if (!post.file_path) {
      console.error('No file_path set in database')
      return
    }

    console.log('Reading file from:', post.file_path)
    const fullPath = path.join(process.cwd(), post.file_path)
    console.log('Full path:', fullPath)

    const markdown = await fs.readFile(fullPath, 'utf-8')
    console.log(`File read successfully: ${markdown.length} characters\n`)

    // Convert to HTML
    console.log('Converting Markdown to HTML...')
    const html = await markdownToHtml(markdown)
    console.log(`HTML generated: ${html.length} characters\n`)

    // Show preview of HTML
    console.log('First 500 chars of HTML:')
    console.log(html.substring(0, 500))
    console.log('\n✅ Test completed successfully!')
  } catch (error) {
    console.error('❌ Test failed:', error)
  }
}

testBlogContent()
