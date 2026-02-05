'use client'

import React, { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'

interface CustomMarkdownProps {
  content: string
}

function CodeBlock({ children, className }: { children: React.ReactNode; className?: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    const codeElement = children as React.ReactElement & { props: { children: string } }
    const codeText = codeElement?.props?.children || ''

    try {
      await navigator.clipboard.writeText(String(codeText))
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

export default function CustomMarkdown({ content }: CustomMarkdownProps) {
  return (
    <div className="prose prose-lg dark:prose-invert max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          pre: ({ children }) => <>{children}</>,
          code: (props: any) => {
            const { node, inline, className, children } = props
            const match = /language-(\w+)/.exec(className || '')
            return !inline && match ? (
              <CodeBlock className={className}>{children}</CodeBlock>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            )
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
