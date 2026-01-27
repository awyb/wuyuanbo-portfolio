'use client'
import React, { useState } from 'react'

export default function JsonFormatter() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [indent, setIndent] = useState(2)
  const [copied, setCopied] = useState(false)

  // --- 核心逻辑：格式化JSON ---
  const formatJson = () => {
    try {
      const parsed = JSON.parse(input)
      const formatted = JSON.stringify(parsed, null, indent)
      setOutput(formatted)
      setError('')
    } catch (err) {
      setError(`解析错误: ${(err as Error).message}`)
      setOutput('')
    }
  }

  // --- 核心逻辑：压缩JSON ---
  const minifyJson = () => {
    try {
      const parsed = JSON.parse(input)
      const minified = JSON.stringify(parsed)
      setOutput(minified)
      setError('')
    } catch (err) {
      setError(`解析错误: ${(err as Error).message}`)
      setOutput('')
    }
  }

  // --- 核心逻辑：验证JSON ---
  const validateJson = () => {
    try {
      JSON.parse(input)
      setError('')
      setOutput('✅ JSON 格式正确！')
    } catch (err) {
      setError(`❌ 解析错误: ${(err as Error).message}`)
      setOutput('')
    }
  }

  // --- 核心逻辑：复制到剪贴板 ---
  const copyToClipboard = () => {
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  // --- 核心逻辑：清空 ---
  const clearAll = () => {
    setInput('')
    setOutput('')
    setError('')
  }

  // --- 核心逻辑：加载示例 ---
  const loadExample = () => {
    const example = {
      name: 'JSON 格式化工具',
      version: '1.0.0',
      features: ['格式化', '压缩', '验证'],
      author: { name: '开发者', email: 'dev@example.com' },
      settings: { theme: 'light', language: 'zh-CN' },
    }
    setInput(JSON.stringify(example))
  }

  // --- 核心逻辑：语法高亮 ---
  const syntaxHighlight = (json: string) => {
    json = json.replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>')
    return json.replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
      match => {
        let cls = 'text-orange-400'
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            cls = 'text-purple-400'
          } else {
            cls = 'text-green-400'
          }
        } else if (/true|false/.test(match)) {
          cls = 'text-blue-400'
        } else if (/null/.test(match)) {
          cls = 'text-gray-500'
        }
        return `<span class="${cls}">${match}</span>`
      },
    )
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4">
      {/* 标题 */}
      <div className="text-center">
        <h1 className="bg-linear-to-r mb-2 from-blue-600 to-cyan-600 bg-clip-text text-4xl font-black text-transparent">
          📋 JSON 格式化工具
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">快速格式化、压缩和验证 JSON 数据</p>
      </div>

      {/* 工具栏 */}
      <div className="bg-linear-to-br rounded-xl from-blue-50 to-cyan-50 p-6 shadow-lg dark:from-blue-900/20 dark:to-cyan-900/20">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* 缩进设置 */}
          <div className="flex items-center gap-3">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              缩进空格:
            </label>
            <div className="flex gap-2">
              {[2, 4].map(spaces => (
                <button
                  key={spaces}
                  onClick={() => setIndent(spaces)}
                  className={`rounded-lg px-4 py-2 font-semibold transition-all ${
                    indent === spaces
                      ? 'bg-linear-to-r from-blue-500 to-cyan-500 text-white shadow-md'
                      : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  {spaces} 空格
                </button>
              ))}
              <button
                onClick={() => setIndent(0)}
                className={`rounded-lg px-4 py-2 font-semibold transition-all ${
                  indent === 0
                    ? 'bg-linear-to-r from-blue-500 to-cyan-500 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                无缩进
              </button>
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={loadExample}
              className="rounded-lg bg-gray-500 px-4 py-2 font-semibold text-white transition-all hover:bg-gray-600"
            >
              📝 加载示例
            </button>
            <button
              onClick={clearAll}
              className="rounded-lg bg-red-500 px-4 py-2 font-semibold text-white transition-all hover:bg-red-600"
            >
              🗑️ 清空
            </button>
          </div>
        </div>
      </div>

      {/* 输入区域 */}
      <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">输入 JSON</h3>
          <span className="text-sm text-gray-500 dark:text-gray-400">字符数: {input.length}</span>
        </div>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="请输入 JSON 数据..."
          className="h-64 w-full rounded-lg border-2 border-gray-300 bg-gray-50 p-4 text-sm text-gray-800 transition-all focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-900 dark:text-gray-200 dark:focus:border-blue-400"
          style={{
            fontFamily: '"Fira Code", "Consolas", "Monaco", "Courier New", monospace',
            lineHeight: '1.6',
          }}
        />
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={formatJson}
            className="bg-linear-to-r rounded-lg from-blue-500 to-cyan-500 px-6 py-2 font-bold text-white shadow-md transition-all hover:scale-105 hover:shadow-lg"
          >
            ✨ 格式化
          </button>
          <button
            onClick={minifyJson}
            className="bg-linear-to-r rounded-lg from-purple-500 to-pink-500 px-6 py-2 font-bold text-white shadow-md transition-all hover:scale-105 hover:shadow-lg"
          >
            🗜️ 压缩
          </button>
          <button
            onClick={validateJson}
            className="bg-linear-to-r rounded-lg from-green-500 to-emerald-500 px-6 py-2 font-bold text-white shadow-md transition-all hover:scale-105 hover:shadow-lg"
          >
            ✅ 验证
          </button>
        </div>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="rounded-xl bg-red-100 p-4 text-left shadow-md dark:bg-red-900/30">
          <p className="font-semibold text-red-800 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* 输出区域 */}
      {output && !error && (
        <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">输出结果</h3>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                字符数: {output.length}
              </span>
              <button
                onClick={copyToClipboard}
                className="rounded-lg bg-gray-500 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-gray-600"
              >
                {copied ? '✓ 已复制' : '📋 复制'}
              </button>
            </div>
          </div>
          <div className="relative">
            <div
              className="h-64 overflow-auto rounded-lg border-2 border-gray-300 bg-[#1e1e1e] p-4 text-sm shadow-inner dark:border-gray-600"
              style={{
                fontFamily: '"Fira Code", "Consolas", "Monaco", "Courier New", monospace',
                lineHeight: '1.6',
              }}
            >
              <pre
                dangerouslySetInnerHTML={{
                  __html: syntaxHighlight(output),
                }}
                style={{
                  fontFamily: 'inherit',
                  lineHeight: 'inherit',
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* 功能说明 */}
      <div className="rounded-xl bg-gray-50 p-6 shadow-md dark:bg-gray-800">
        <h3 className="mb-3 text-lg font-bold text-gray-900 dark:text-white">📖 功能说明</h3>
        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <p>
            • <strong>格式化</strong>：将压缩的 JSON 数据格式化为易读的格式，支持自定义缩进空格数
          </p>
          <p>
            • <strong>压缩</strong>：移除所有空格和换行，最小化 JSON 数据大小
          </p>
          <p>
            • <strong>验证</strong>：检查 JSON 数据格式是否正确，并显示错误信息
          </p>
          <p>
            • <strong>复制</strong>：一键复制处理后的 JSON 数据到剪贴板
          </p>
          <p>
            • <strong>示例</strong>：加载示例 JSON 数据，快速体验工具功能
          </p>
        </div>
      </div>
    </div>
  )
}
