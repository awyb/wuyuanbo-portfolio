'use client'

import { Book } from '@/data/books'
import { useEffect } from 'react'

interface PdfViewerProps {
  book: Book
  onClose: () => void
}

export function PdfViewer({ book, onClose }: PdfViewerProps) {
  useEffect(() => {
    // 禁止背景滚动
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
      <div className="flex h-full w-full max-w-7xl flex-col rounded-lg bg-white shadow-2xl dark:bg-gray-800">
        {/* 头部 */}
        <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{book.title}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">{book.author}</p>
          </div>
          <button
            onClick={onClose}
            className="ml-4 rounded-full bg-gray-200 p-2 transition-all hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
            aria-label="关闭"
          >
            <svg
              className="h-6 w-6 text-gray-600 dark:text-gray-300"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        {/* PDF 内容区域 */}
        <div className="flex-1 overflow-hidden">
          <iframe
            src={`${book.pdfUrl}#view=FitH`}
            className="h-full w-full border-0"
            title={book.title}
          />
        </div>

        {/* 底部操作栏 */}
        <div className="flex items-center justify-between border-t border-gray-200 p-4 dark:border-gray-700">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            提示：如果无法预览，请下载后查看
          </div>
          <div className="flex gap-2">
            <a
              href={book.pdfUrl}
              download
              className="rounded-lg bg-blue-500 px-4 py-2 font-medium text-white transition-all hover:bg-blue-600"
            >
              下载 PDF
            </a>
            <button
              onClick={onClose}
              className="rounded-lg border-2 border-gray-300 px-4 py-2 font-medium text-gray-700 transition-all hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              关闭
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
