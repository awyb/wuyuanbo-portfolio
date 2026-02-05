import { sql } from '@/lib/db'
import fs from 'fs/promises'
import path from 'path'
import { markdownToHtml } from '@/lib/markdown'

async function testFullPageFlow() {
  try {
    console.log('Testing full page flow...\n')

    // Get a post from database (same as in page.tsx)
    const result = await sql`
      SELECT * FROM blog_posts WHERE slug = 'nextjs-13-app-router-guide'
    `

    const post = (result[0] as any) || null
    console.log('Step 1: Got post from database')
    console.log(`  Title: ${post.title}`)
    console.log(`  Has content field: ${!!post.content}`)
    console.log(`  Content length: ${post.content?.length || 0}\n`)

    // Check file_path
    if (!post?.file_path) {
      console.log('Step 2: No file_path, returning post as-is')
      console.log('  Content will be empty!\n')
      return
    }

    console.log('Step 2: Reading file...')
    try {
      const markdown = await fs.readFile(path.join(process.cwd(), post.file_path), 'utf-8')
      console.log(`  File read: ${markdown.length} chars\n`)

      console.log('Step 3: Converting to HTML...')
      const htmlContent = await markdownToHtml(markdown)
      console.log(`  HTML generated: ${htmlContent.length} chars\n`)

      console.log('Step 4: Merging content with post...')
      const finalPost = { ...post, content: htmlContent }

      console.log('Final post object:')
      console.log(`  Title: ${finalPost.title}`)
      console.log(`  Has content: ${!!finalPost.content}`)
      console.log(`  Content length: ${finalPost.content?.length || 0}`)

      // Check what the page will render
      console.log('\nStep 5: Page will render:')
      console.log(`  Title will show: ${finalPost.title}`)
      console.log(`  Description will show: ${finalPost.description}`)
      console.log(`  Content will show: ${finalPost.content ? 'YES' : 'NO'}`)

      if (finalPost.content) {
        console.log(
          `  Content preview (first 200 chars): ${finalPost.content.substring(0, 200)}...`,
        )
      }

      console.log('\n✅ Full flow test completed!')
    } catch (error) {
      console.error('❌ Error in file processing:', error)
      console.log('  Returning post without content\n')
    }
  } catch (error) {
    console.error('❌ Test failed:', error)
  }
}

testFullPageFlow()
