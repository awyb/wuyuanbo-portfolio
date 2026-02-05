'use client'

import { useState } from 'react'
import { Book } from '@/data/books'
import { PdfViewer } from './PdfViewer'

interface BookCardProps {
  book: Book
}

export function BookCard({ book }: BookCardProps) {
  const [showPdfViewer, setShowPdfViewer] = useState(false)

  return (
    <>
      <div className="flex h-full flex-col overflow-hidden rounded-xl bg-white shadow-lg transition-all hover:scale-105 hover:shadow-xl dark:bg-gray-800">
        {/* 书籍封面 */}
        <div className="bg-linear-to-br relative h-48 shrink-0 from-blue-500 to-purple-600">
          <div className="flex h-full items-center justify-center">
            <span className="text-6xl">📖</span>
          </div>
          <div className="absolute right-2 top-2 rounded-full bg-white/90 px-2 py-1 text-xs font-semibold text-gray-800 backdrop-blur-sm">
            {book.category}
          </div>
        </div>

        {/* 书籍信息 */}
        <div className="flex flex-1 flex-col p-5">
          <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">{book.title}</h3>
          <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">作者: {book.author}</p>
          <p className="mb-4 line-clamp-3 flex-1 text-sm text-gray-700 dark:text-gray-300">
            {book.description}
          </p>

          {/* 标签 */}
          <div className="mb-4 flex flex-wrap gap-2">
            {book.tags.map(tag => (
              <span
                key={tag}
                className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* 书籍元信息 */}
          <div className="mb-4 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>{book.pages} 页</span>
            <span>{book.fileSize}</span>
            <span>{book.publishYear}</span>
            <span>{book.language}</span>
          </div>

          {/* 操作按钮 */}
          <div className="flex gap-2">
            <button
              onClick={() => setShowPdfViewer(true)}
              className="flex-1 rounded-lg bg-blue-500 px-4 py-2 font-medium text-white transition-all hover:bg-blue-600"
            >
              在线预览
            </button>
            <a
              href={book.pdfUrl}
              download
              className="flex-1 rounded-lg border-2 border-gray-300 px-4 py-2 text-center font-medium text-gray-700 transition-all hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              下载
            </a>
          </div>
        </div>
      </div>

      {/* PDF 查看器弹窗 */}
      {showPdfViewer && <PdfViewer book={book} onClose={() => setShowPdfViewer(false)} />}
    </>
  )
}
