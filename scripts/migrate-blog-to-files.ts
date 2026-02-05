import { sql } from '@/lib/db'

async function migrateBlogToFiles() {
  try {
    console.log('Starting migration to add filePath column to blog_posts table...')

    // Add filePath column if it doesn't exist
    await sql`
      ALTER TABLE blog_posts 
      ADD COLUMN IF NOT EXISTS file_path TEXT
    `
    console.log('✓ Added filePath column to blog_posts table')

    // Show current blog posts
    const posts = await sql`SELECT id, title, slug FROM blog_posts`
    console.log(`\nCurrent blog posts (${posts.length}):`)
    posts.forEach((post: any) => {
      console.log(`  - ${post.title} (slug: ${post.slug})`)
    })

    console.log('\nMigration completed successfully!')
    console.log('\nNext steps:')
    console.log('1. Create blog content files in: content/blog/')
    console.log('2. Update each blog post with its file path using:')
    console.log(
      `   UPDATE blog_posts SET file_path = 'content/blog/your-post.md' WHERE slug = 'your-slug';`,
    )
  } catch (error) {
    console.error('Migration failed:', error)
    process.exit(1)
  }
}

migrateBlogToFiles()
