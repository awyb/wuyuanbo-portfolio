import Link from 'next/link';
import { blogPosts } from '@/data/portfolio';

export const metadata = {
  title: '博客 - 吴元波',
  description: '我的技术博客和文章',
};

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
          博客
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-12">
          分享我的技术心得和学习笔记。
        </p>

        <div className="space-y-6">
          {blogPosts.map((post) => (
            <article
              key={post.id}
              className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-3">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {post.title}
                </h2>
                <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap ml-4">
                  {new Date(post.date).toLocaleDateString('zh-CN')}
                </span>
              </div>

              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {post.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-xs rounded-full">
                  {post.category}
                </span>
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <Link
                href={`/blog/${post.slug}`}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold"
              >
                阅读全文 →
              </Link>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
