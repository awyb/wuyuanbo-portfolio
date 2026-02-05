import { sql } from '@/lib/db'
import Link from 'next/link'
import { BlogPost } from '@/types'
import fs from 'fs/promises'
import path from 'path'
import CustomMarkdown from '@/components/common/CustomMarkdown'
import '../blog-markdown.css'
import 'highlight.js/styles/github-dark.css'

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const result = await sql`
    SELECT * FROM blog_posts 
    WHERE slug = ${slug}
  `
  const post = (result[0] as BlogPost) || null

  if (post?.file_path) {
    try {
      const markdown = await fs.readFile(path.join(process.cwd(), post.file_path), 'utf-8')
      return { ...post, content: markdown }
    } catch (error) {
      console.error('Error reading blog content:', error)
      return post
    }
  }

  return post
}

async function getRelatedPosts(category: string, currentId: string): Promise<BlogPost[]> {
  const result = await sql`
    SELECT * FROM blog_posts 
    WHERE category = ${category} AND id != ${currentId}
    ORDER BY date DESC
    LIMIT 3
  `
  return (result as BlogPost[]) || []
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)

  if (!post) {
    return {
      title: '文章未找到',
    }
  }

  return {
    title: `${post.title} - 吴元波`,
    description: post.description,
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)
  const relatedPosts = post ? await getRelatedPosts(post.category, post.id) : []

  if (!post) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white py-20 dark:bg-gray-900">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">文章未找到</h1>
          <p className="mb-8 text-gray-600 dark:text-gray-400">
            抱歉，您查找的文章不存在或已被删除。
          </p>
          <Link
            href="/blog"
            className="inline-block rounded-lg bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700"
          >
            返回博客列表
          </Link>
        </div>
      </div>
    )
  }

  const formattedDate = new Date(post.date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <article className="bg-linear-to-b min-h-screen from-gray-50 to-white py-20 dark:from-gray-950 dark:to-gray-900">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          href="/blog"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          返回博客列表
        </Link>

        {/* Article Header */}
        <header className="mb-10">
          {/* Category Badge */}
          <span className="bg-linear-to-r mb-4 inline-block rounded-full from-blue-100 to-purple-100 px-4 py-1.5 text-sm font-semibold text-blue-700 shadow-sm ring-1 ring-blue-200 dark:from-blue-900/30 dark:to-purple-900/30 dark:text-blue-300 dark:ring-blue-800">
            {post.category}
          </span>

          {/* Title */}
          <h1 className="bg-linear-to-r mb-6 from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-4xl font-bold text-transparent sm:text-5xl dark:from-white dark:via-gray-200 dark:to-white">
            {post.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <svg
                className="h-5 w-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <time dateTime={post.date} className="font-medium">
                {formattedDate}
              </time>
            </div>
          </div>

          {/* Tags */}
          <div className="mt-4 flex flex-wrap gap-2">
            {post.tags.map(tag => (
              <span
                key={tag}
                className="bg-linear-to-r rounded-full from-gray-100 to-gray-200 px-3 py-1 text-sm font-medium text-gray-700 transition-all hover:from-blue-100 hover:to-purple-100 hover:text-blue-700 dark:from-gray-800 dark:to-gray-700 dark:text-gray-300 dark:hover:from-blue-900/40 dark:hover:to-purple-900/40 dark:hover:text-blue-300"
              >
                #{tag}
              </span>
            ))}
          </div>
        </header>

        {/* Divider */}
        <hr className="border-gradient-to-r mb-8 border-transparent from-transparent via-gray-300 to-transparent dark:via-gray-700" />

        {/* Article Content */}
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <div className="bg-linear-to-br mb-8 rounded-lg from-blue-50 to-purple-50 p-6 text-gray-700 shadow-sm ring-1 ring-gray-200 dark:from-blue-950/20 dark:to-purple-950/20 dark:text-gray-300 dark:ring-gray-800">
            {post.description}
          </div>

          {post.content && <CustomMarkdown content={post.content} />}
        </div>

        {/* Divider */}
        <hr className="border-gradient-to-r my-12 border-transparent from-transparent via-gray-300 to-transparent dark:via-gray-700" />

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section>
            <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">相关文章</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map(relatedPost => (
                <Link
                  key={relatedPost.id}
                  href={`/blog/${relatedPost.slug}`}
                  className="group flex flex-col overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-gray-200 transition-all hover:shadow-xl hover:shadow-blue-500/10 hover:ring-blue-300 dark:bg-gray-800 dark:ring-gray-700 dark:hover:shadow-blue-900/20 dark:hover:ring-blue-800"
                >
                  <div className="p-5">
                    <span className="bg-linear-to-r mb-2 inline-block rounded-full from-blue-100 to-purple-100 px-2.5 py-1 text-xs font-semibold text-blue-700 ring-1 ring-blue-200 dark:from-blue-900/30 dark:to-purple-900/30 dark:text-blue-300 dark:ring-blue-800">
                      {relatedPost.category}
                    </span>
                    <h3 className="mb-2 text-lg font-semibold text-gray-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                      {relatedPost.title}
                    </h3>
                    <p className="line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
                      {relatedPost.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Back to List Button */}
        <div className="mt-12 text-center">
          <Link
            href="/blog"
            className="bg-linear-to-r inline-flex items-center gap-2 rounded-lg from-blue-600 to-purple-600 px-8 py-3 font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:shadow-xl hover:shadow-blue-500/40 dark:from-blue-500 dark:to-purple-500 dark:shadow-blue-900/30 dark:hover:shadow-blue-900/50"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            返回博客列表
          </Link>
        </div>
      </div>
    </article>
  )
}
