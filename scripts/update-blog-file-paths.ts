import { sql } from '@/lib/db'

async function updateBlogFilePaths() {
  try {
    console.log('Updating blog posts with file paths...')

    // Update each blog post with its file path
    const updates = [
      {
        slug: 'nextjs-13-app-router-guide',
        filePath: 'content/blog/nextjs-13-app-router-guide.md',
      },
      {
        slug: 'typescript-type-system-deep-dive',
        filePath: 'content/blog/typescript-type-system-deep-dive.md',
      },
      {
        slug: 'tailwind-css-best-practices',
        filePath: 'content/blog/tailwind-css-best-practices.md',
      },
    ]

    for (const { slug, filePath } of updates) {
      await sql`
        UPDATE blog_posts 
        SET file_path = ${filePath}
        WHERE slug = ${slug}
      `
      console.log(`✓ Updated ${slug}`)
    }

    console.log('\nAll blog posts have been updated with file paths!')
  } catch (error) {
    console.error('Failed to update blog posts:', error)
    process.exit(1)
  }
}

updateBlogFilePaths()
