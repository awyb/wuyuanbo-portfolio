'use client'

import { useState } from 'react'
import { BookCard } from '@/components/resources/BookCard'
import { books } from '@/data/books'

const categories = ['全部', '前端开发', '后端开发', '数据库', '工具']

export function ResourcesContent() {
  const [selectedCategory, setSelectedCategory] = useState('全部')

  // 根据选中的分类筛选书籍
  const filteredBooks =
    selectedCategory === '全部' ? books : books.filter(book => book.category === selectedCategory)

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* 页面头部 */}
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">📚 技术资源</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          精选技术电子书和学习资源，支持在线预览和下载
        </p>
      </div>

      {/* 分类筛选 */}
      <div className="mb-8 flex flex-wrap gap-2">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              selectedCategory === category
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-400 hover:text-gray-900 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* 书籍数量 */}
      <div className="mb-6 text-sm text-gray-600 dark:text-gray-400">
        显示 {filteredBooks.length} 本书籍
      </div>

      {/* 书籍卡片网格 */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredBooks.map(book => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>

      {/* 空状态 */}
      {filteredBooks.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-4 text-6xl">📚</div>
          <h3 className="mb-2 text-xl font-semibold text-gray-700 dark:text-gray-300">
            暂无该分类资源
          </h3>
          <p className="text-gray-500 dark:text-gray-400">请选择其他分类查看</p>
        </div>
      )}
    </div>
  )
}
