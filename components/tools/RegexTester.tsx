'use client'

import React, { useState, useMemo } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

interface MatchResult {
  text: string
  index: number
  groups: string[]
}

const RegexTester: React.FC = () => {
  const { t } = useLanguage()
  const [pattern, setPattern] = useState('')
  const [text, setText] = useState('')
  const [flags, setFlags] = useState('g')

  const matches = useMemo(() => {
    if (!pattern || !text) return []

    try {
      const regex = new RegExp(pattern, flags)
      const results: MatchResult[] = []
      let match
      let index = 0

      if (flags.includes('g')) {
        while ((match = regex.exec(text)) !== null) {
          results.push({
            text: match[0],
            index: match.index,
            groups: match.slice(1),
          })
          if (!flags.includes('y')) regex.lastIndex = match.index + 1
          index = regex.lastIndex
        }
      } else {
        match = regex.exec(text)
        if (match) {
          results.push({
            text: match[0],
            index: match.index,
            groups: match.slice(1),
          })
        }
      }

      return results
    } catch (error) {
      return []
    }
  }, [pattern, text, flags])

  const isValidPattern = useMemo(() => {
    if (!pattern) return true
    try {
      new RegExp(pattern, flags)
      return true
    } catch (error) {
      return false
    }
  }, [pattern, flags])

  const renderHighlightedText = () => {
    if (!text) return null

    const parts = []
    let lastIndex = 0

    matches.forEach((match, i) => {
      // 添加匹配前的文本
      if (match.index > lastIndex) {
        parts.push(
          <span key={`text-${i}`} className="text-gray-900 dark:text-white">
            {text.slice(lastIndex, match.index)}
          </span>,
        )
      }

      // 添加匹配的文本
      parts.push(
        <span key={`match-${i}`} className="rounded bg-green-200 px-1 dark:bg-green-800">
          {match.text}
        </span>,
      )

      lastIndex = match.index + match.text.length
    })

    // 添加剩余的文本
    if (lastIndex < text.length) {
      parts.push(
        <span key="remaining" className="text-gray-900 dark:text-white">
          {text.slice(lastIndex)}
        </span>,
      )
    }

    return <div className="whitespace-pre-wrap break-words p-4 font-mono">{parts}</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 p-4 dark:from-gray-900 dark:to-gray-800">
      <div className="mx-auto max-w-4xl rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
        <h1 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white">
          {t('tools.regexTester.title')}
        </h1>

        {/* 正则表达式输入 */}
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('tools.regexTester.patternLabel')}
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={pattern}
              onChange={e => setPattern(e.target.value)}
              placeholder={t('tools.regexTester.patternPlaceholder')}
              className={`flex-1 rounded-lg border-2 p-4 font-mono text-lg ${
                isValidPattern
                  ? 'border-gray-300 bg-gray-50 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                  : 'border-red-500 bg-red-50 text-red-900 dark:border-red-600 dark:bg-red-900/20 dark:text-red-300'
              }`}
            />
            <input
              type="text"
              value={flags}
              onChange={e => setFlags(e.target.value)}
              placeholder="flags"
              className="w-20 rounded-lg border-2 border-gray-300 bg-gray-50 p-4 font-mono text-lg text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
          {!isValidPattern && pattern && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
              {t('tools.regexTester.invalidPattern')}
            </p>
          )}
        </div>

        {/* 标志位说明 */}
        <div className="mb-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
          <h3 className="mb-2 text-sm font-bold text-gray-900 dark:text-white">
            {t('tools.regexTester.flagsLabel')}
          </h3>
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-700 sm:grid-cols-4 dark:text-gray-300">
            <div>
              <code className="rounded bg-blue-100 px-2 py-1 dark:bg-blue-900 dark:text-blue-200">
                g
              </code>
              <span className="ml-1">全局匹配</span>
            </div>
            <div>
              <code className="rounded bg-blue-100 px-2 py-1 dark:bg-blue-900 dark:text-blue-200">
                i
              </code>
              <span className="ml-1">忽略大小写</span>
            </div>
            <div>
              <code className="rounded bg-blue-100 px-2 py-1 dark:bg-blue-900 dark:text-blue-200">
                m
              </code>
              <span className="ml-1">多行模式</span>
            </div>
            <div>
              <code className="rounded bg-blue-100 px-2 py-1 dark:bg-blue-900 dark:text-blue-200">
                y
              </code>
              <span className="ml-1">粘性匹配</span>
            </div>
          </div>
        </div>

        {/* 测试文本输入 */}
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('tools.regexTester.textLabel')}
          </label>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder={t('tools.regexTester.textPlaceholder')}
            rows={6}
            className="w-full rounded-lg border-2 border-gray-300 bg-gray-50 p-4 font-mono text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </div>

        {/* 匹配结果 */}
        {matches.length > 0 && (
          <div className="mb-4 rounded-lg bg-green-50 p-4 dark:bg-gray-700">
            <h3 className="mb-2 text-sm font-bold text-gray-900 dark:text-white">
              {t('tools.regexTester.matchResults')} ({matches.length})
            </h3>
            {renderHighlightedText()}
          </div>
        )}

        {/* 详细匹配信息 */}
        {matches.length > 0 && (
          <div className="rounded-lg bg-blue-50 p-4 dark:bg-gray-700">
            <h3 className="mb-2 text-sm font-bold text-gray-900 dark:text-white">
              {t('tools.regexTester.matchDetails')}
            </h3>
            <div className="space-y-2">
              {matches.map((match, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-blue-200 bg-white p-3 dark:border-blue-800 dark:bg-gray-800"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm text-gray-700 dark:text-gray-300">
                      {t('tools.regexTester.match')} {i + 1}:
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {t('tools.regexTester.position')}: {match.index}
                    </span>
                  </div>
                  <div className="mt-2 overflow-x-auto">
                    <code className="rounded bg-green-100 px-2 py-1 text-sm text-green-900 dark:bg-green-900 dark:text-green-200">
                      {match.text}
                    </code>
                  </div>
                  {match.groups.length > 0 && (
                    <div className="mt-2">
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        {t('tools.regexTester.groups')}:
                      </span>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {match.groups.map((group, gi) => (
                          <code
                            key={gi}
                            className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-900 dark:bg-blue-900 dark:text-blue-200"
                          >
                            ${gi + 1}: {group}
                          </code>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 使用说明 */}
        <div className="mt-6 rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
          <h3 className="mb-2 font-bold text-gray-900 dark:text-white">
            {t('tools.regexTester.usage')}
          </h3>
          <ul className="list-inside list-disc space-y-1 text-sm text-gray-700 dark:text-gray-300">
            <li>{t('tools.regexTester.tip1')}</li>
            <li>{t('tools.regexTester.tip2')}</li>
            <li>{t('tools.regexTester.tip3')}</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default RegexTester
