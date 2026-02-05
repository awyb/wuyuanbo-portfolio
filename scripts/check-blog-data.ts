import { sql } from '@/lib/db'

async function checkBlogData() {
  try {
    console.log('Checking blog_posts table structure and data...\n')

    // Check table structure
    const columns = await sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'blog_posts'
      ORDER BY ordinal_position
    `

    console.log('Table columns:')
    columns.forEach((col: any) => {
      console.log(`  - ${col.column_name} (${col.data_type})`)
    })
    console.log('')

    // Check all blog posts
    const posts = await sql`SELECT * FROM blog_posts ORDER BY date DESC`

    console.log(`Found ${posts.length} blog posts:\n`)
    posts.forEach((post: any, index: number) => {
      console.log(`\n${index + 1}. ${post.title}`)
      console.log(`   Slug: ${post.slug}`)
      console.log(`   ID: ${post.id}`)
      console.log(`   Category: ${post.category}`)
      console.log(`   Tags: ${JSON.stringify(post.tags)}`)

      // Check both possible field names
      console.log(`   file_path: ${post.file_path || '(not set)'}`)
      console.log(`   filePath: ${post.filepath || '(not set)'}`)

      if (post.content) {
        console.log(`   Content length: ${post.content.length} chars`)
      } else {
        console.log(`   Content: (empty)`)
      }
    })
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

checkBlogData()
