import Link from 'next/link'
import { sql } from '@/lib/db'

export const metadata = {
  title: '博客 - 吴元波',
  description: '我的技术博客和文章',
}

async function getBlogPosts() {
  const blogPosts = await sql`
    SELECT * FROM blog_posts 
    ORDER BY date DESC
  `
  return blogPosts || []
}

export default async function BlogPage() {
  const blogPosts = await getBlogPosts()

  return (
    <div className="min-h-screen bg-white py-20 dark:bg-gray-900">
      <div className="text-x mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <h1 className="mb-4 text-5xl font-bold text-gray-900 dark:text-white">博客</h1>
        <p className="mb-12 text-xl text-gray-600 dark:text-gray-400">
          分享我的技术心得和学习笔记。
        </p>
        <div className="space-y-6">
          {blogPosts.map((post: any) => (
            <article
              key={post.id}
              className="rounded-lg bg-gray-50 p-6 transition-shadow hover:shadow-lg dark:bg-gray-800"
            >
              <div className="mb-3 flex items-start justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{post.title}</h2>
                <span className="ml-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {new Date(post.date).toLocaleDateString('zh-CN')}
                </span>
              </div>

              <p className="mb-4 text-gray-600 dark:text-gray-400">{post.description}</p>

              <div className="mb-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-purple-100 px-3 py-1 text-xs text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                  {post.category}
                </span>
                {post.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="rounded-full bg-blue-100 px-3 py-1 text-xs text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <Link
                href={`/blog/${post.slug}`}
                className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                阅读全文 →
              </Link>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
