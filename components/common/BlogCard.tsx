import Link from 'next/link'
import { BlogPost } from '@/types'

interface BlogCardProps {
  post: BlogPost
}

export default function BlogCard({ post }: BlogCardProps) {
  const formattedDate = new Date(post.date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <Link href={`/blog/${post.slug}`} className="block">
      <article className="group h-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:border-blue-500 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-400">
        <div className="flex flex-col p-6">
          {/* Header: Date and Category */}
          <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-3 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                {post.category}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">{formattedDate}</span>
            </div>
            <svg
              className="h-4 w-4 text-gray-400 transition-colors group-hover:text-blue-600 dark:text-gray-500 dark:group-hover:text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>

          {/* Title */}
          <h2 className="mb-3 text-xl font-bold text-gray-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
            {post.title}
          </h2>

          {/* Description */}
          <p className="mb-4 line-clamp-2 flex-grow text-sm leading-relaxed text-gray-600 dark:text-gray-400">
            {post.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {post.tags.slice(0, 3).map(tag => (
              <span
                key={tag}
                className="rounded-full border border-gray-300 px-2.5 py-1 text-xs font-medium text-gray-700 transition-colors hover:border-blue-400 hover:bg-blue-50 dark:border-gray-600 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:bg-blue-900/20"
              >
                #{tag}
              </span>
            ))}
            {post.tags.length > 3 && (
              <span className="rounded-full border border-gray-300 px-2.5 py-1 text-xs font-medium text-gray-700 dark:border-gray-600 dark:text-gray-300">
                +{post.tags.length - 3}
              </span>
            )}
          </div>
        </div>
      </article>
    </Link>
  )
}
