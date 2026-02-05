'use client'

import { useState } from 'react'
import BlogCard from './BlogCard'
import { BlogPost } from '@/types'

interface BlogPageContentProps {
  posts: BlogPost[]
}

export default function BlogPageContent({ posts }: BlogPageContentProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('全部')

  // 获取所有分类
  const categories = ['全部', ...Array.from(new Set(posts.map(post => post.category)))]

  // 过滤文章
  const filteredPosts =
    selectedCategory === '全部' ? posts : posts.filter(post => post.category === selectedCategory)

  return (
    <div className="bg-linear-to-b min-h-screen from-gray-50 to-white py-20 dark:from-gray-950 dark:to-gray-900">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 text-center">
          <h1 className="bg-linear-to-r mb-4 from-blue-600 to-purple-600 bg-clip-text text-5xl font-bold text-transparent dark:from-blue-400 dark:to-purple-400">
            技术博客
          </h1>
          <p className="mx-auto max-w-2xl text-xl text-gray-600 dark:text-gray-400">
            分享我的技术心得、学习笔记和开发经验
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-12 flex flex-wrap justify-center gap-3">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`rounded-full px-6 py-2.5 text-sm font-semibold transition-all duration-300 ${
                selectedCategory === category
                  ? 'bg-linear-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30 ring-2 ring-blue-500 ring-offset-2 dark:shadow-blue-400/30 dark:ring-offset-gray-900'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Blog Posts - Single Column */}
        {filteredPosts.length > 0 ? (
          <div className="space-y-6">
            {filteredPosts.map(post => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <svg
              className="mx-auto h-24 w-24 text-gray-300 dark:text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
              />
            </svg>
            <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">该分类下暂无文章</p>
          </div>
        )}

        {/* Stats */}
        <div className="mt-16 flex flex-wrap justify-center gap-8 border-t border-gray-200 pt-8 dark:border-gray-700">
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{posts.length}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">篇文章</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              {categories.length - 1}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">个分类</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">
              {posts.reduce((acc, post) => acc + post.tags.length, 0)}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">个标签</p>
          </div>
        </div>
      </div>
    </div>
  )
}
