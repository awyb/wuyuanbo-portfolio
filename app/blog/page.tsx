import { sql } from '@/lib/db'
import BlogPageContent from '@/components/common/BlogPageContent'
import { BlogPost } from '@/types'

export const metadata = {
  title: '博客 - 吴元波',
  description: '我的技术博客和文章',
}

async function getBlogPosts(): Promise<BlogPost[]> {
  const blogPosts = await sql`
    SELECT * FROM blog_posts 
    ORDER BY date DESC
  `
  return (blogPosts as BlogPost[]) || []
}

export default async function BlogPage() {
  const blogPosts = await getBlogPosts()

  return <BlogPageContent posts={blogPosts} />
}
