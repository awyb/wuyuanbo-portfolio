'use client'

import React, { useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

const Base64Converter: React.FC = () => {
  const { t } = useLanguage()
  const [inputText, setInputText] = useState('')
  const [outputText, setOutputText] = useState('')
  const [mode, setMode] = useState<'encode' | 'decode'>('encode')

  const encodeToBase64 = (text: string) => {
    try {
      return btoa(unescape(encodeURIComponent(text)))
    } catch (error) {
      return t('tools.base64Converter.encodeError')
    }
  }

  const decodeFromBase64 = (text: string) => {
    try {
      return decodeURIComponent(escape(atob(text)))
    } catch (error) {
      return t('tools.base64Converter.decodeError')
    }
  }

  const handleConvert = () => {
    if (!inputText) {
      setOutputText('')
      return
    }

    if (mode === 'encode') {
      setOutputText(encodeToBase64(inputText))
    } else {
      setOutputText(decodeFromBase64(inputText))
    }
  }

  const clearAll = () => {
    setInputText('')
    setOutputText('')
  }

  const copyOutput = async () => {
    try {
      await navigator.clipboard.writeText(outputText)
      alert(t('tools.base64Converter.copied'))
    } catch (err) {
      alert('复制失败')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-100 p-4 dark:from-gray-900 dark:to-gray-800">
      <div className="mx-auto max-w-4xl rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
        <h1 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white">
          {t('tools.base64Converter.title')}
        </h1>

        {/* 模式选择 */}
        <div className="mb-6 flex gap-4">
          <button
            onClick={() => setMode('encode')}
            className={`flex-1 rounded-lg px-6 py-3 font-bold transition-all ${
              mode === 'encode'
                ? 'bg-gradient-to-r from-orange-600 to-yellow-600 text-white shadow-lg'
                : 'border-2 border-gray-300 bg-gray-100 text-gray-700 hover:bg-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600'
            }`}
          >
            {t('tools.base64Converter.encode')}
          </button>
          <button
            onClick={() => setMode('decode')}
            className={`flex-1 rounded-lg px-6 py-3 font-bold transition-all ${
              mode === 'decode'
                ? 'bg-gradient-to-r from-orange-600 to-yellow-600 text-white shadow-lg'
                : 'border-2 border-gray-300 bg-gray-100 text-gray-700 hover:bg-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600'
            }`}
          >
            {t('tools.base64Converter.decode')}
          </button>
        </div>

        {/* 输入区域 */}
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            {mode === 'encode'
              ? t('tools.base64Converter.inputText')
              : t('tools.base64Converter.inputBase64')}
          </label>
          <textarea
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            placeholder={
              mode === 'encode'
                ? t('tools.base64Converter.inputTextPlaceholder')
                : t('tools.base64Converter.inputBase64Placeholder')
            }
            rows={6}
            className="w-full rounded-lg border-2 border-gray-300 bg-gray-50 p-4 font-mono text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </div>

        {/* 按钮区域 */}
        <div className="mb-4 flex gap-4">
          <button
            onClick={handleConvert}
            className="flex-1 rounded-lg bg-gradient-to-r from-orange-600 to-yellow-600 px-6 py-3 font-bold text-white shadow-lg transition-all hover:from-orange-700 hover:to-yellow-700"
          >
            {t('tools.base64Converter.convert')}
          </button>
          <button
            onClick={clearAll}
            className="rounded-lg border-2 border-gray-300 bg-gray-100 px-6 py-3 font-bold text-gray-700 hover:bg-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
          >
            {t('tools.base64Converter.clear')}
          </button>
        </div>

        {/* 输出区域 */}
        {outputText && (
          <div className="mb-6 rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
            <div className="mb-2 flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {mode === 'encode'
                  ? t('tools.base64Converter.outputBase64')
                  : t('tools.base64Converter.outputText')}
              </label>
              <button
                onClick={copyOutput}
                className="rounded bg-blue-600 px-4 py-1 text-sm font-bold text-white hover:bg-blue-700"
              >
                {t('tools.base64Converter.copy')}
              </button>
            </div>
            <div className="max-h-64 overflow-y-auto rounded-lg border-2 border-gray-300 bg-white p-4 font-mono dark:border-gray-600 dark:bg-gray-800">
              <pre className="whitespace-pre-wrap break-words text-sm text-gray-900 dark:text-white">
                {outputText}
              </pre>
            </div>
            <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
              {t('tools.base64Converter.length')}: {outputText.length}
            </div>
          </div>
        )}

        {/* 使用说明 */}
        <div className="rounded-lg bg-orange-50 p-4 dark:bg-gray-700">
          <h3 className="mb-2 font-bold text-gray-900 dark:text-white">
            {t('tools.base64Converter.usage')}
          </h3>
          <ul className="list-inside list-disc space-y-1 text-sm text-gray-700 dark:text-gray-300">
            <li>{t('tools.base64Converter.tip1')}</li>
            <li>{t('tools.base64Converter.tip2')}</li>
            <li>{t('tools.base64Converter.tip3')}</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Base64Converter
