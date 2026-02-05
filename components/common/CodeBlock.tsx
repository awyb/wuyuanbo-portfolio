'use client'

import React, { useState } from 'react'

interface CodeBlockProps {
  children: React.ReactNode
  className?: string
  language?: string
}

export default function CodeBlock({ children, className = '', language = 'code' }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    let codeText = ''

    // 尝试从React元素中提取文本内容
    if (React.isValidElement(children)) {
      const childProps = children.props as { children?: React.ReactNode }
      if (typeof childProps.children === 'string') {
        codeText = childProps.children
      } else if (typeof childProps.children === 'object' && childProps.children) {
        // 处理嵌套的情况
        codeText = String(childProps.children)
      }
    } else if (typeof children === 'string') {
      codeText = children
    } else {
      codeText = String(children)
    }

    try {
      await navigator.clipboard.writeText(codeText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="group relative">
      <div className="absolute right-3 top-3 z-10">
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-md bg-gray-700/80 px-3 py-1.5 text-xs font-medium text-white opacity-0 backdrop-blur-sm transition-all hover:bg-gray-600 group-hover:opacity-100"
        >
          {copied ? (
            <>
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              已复制
            </>
          ) : (
            <>
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              复制
            </>
          )}
        </button>
      </div>
      <pre className={className}>{children}</pre>
    </div>
  )
}
