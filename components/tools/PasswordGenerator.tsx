'use client'

import React, { useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

const PasswordGenerator: React.FC = () => {
  const { t } = useLanguage()
  const [password, setPassword] = useState('')
  const [length, setLength] = useState(16)
  const [includeUppercase, setIncludeUppercase] = useState(true)
  const [includeLowercase, setIncludeLowercase] = useState(true)
  const [includeNumbers, setIncludeNumbers] = useState(true)
  const [includeSymbols, setIncludeSymbols] = useState(false)

  const generatePassword = () => {
    let charset = ''
    if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz'
    if (includeNumbers) charset += '0123456789'
    if (includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?'

    if (charset === '') {
      setPassword('请至少选择一个字符类型')
      return
    }

    let result = ''
    for (let i = 0; i < length; i++) {
      result += charset.charAt(Math.floor(Math.random() * charset.length))
    }
    setPassword(result)
  }

  const copyPassword = async () => {
    try {
      await navigator.clipboard.writeText(password)
      alert(t('tools.passwordGenerator.copied'))
    } catch (err) {
      alert('复制失败')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 dark:from-gray-900 dark:to-gray-800">
      <div className="mx-auto max-w-2xl rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
        <h1 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white">
          {t('tools.passwordGenerator.title')}
        </h1>

        {/* 密码显示区域 */}
        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('tools.passwordGenerator.generatedPassword')}
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={password}
              readOnly
              className="flex-1 rounded-lg border-2 border-gray-300 bg-gray-50 p-4 font-mono text-lg text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              placeholder="点击生成按钮..."
            />
            <button
              onClick={copyPassword}
              className="rounded-lg bg-blue-600 px-6 font-bold text-white hover:bg-blue-700 disabled:bg-gray-400"
              disabled={!password}
            >
              {t('tools.passwordGenerator.copy')}
            </button>
          </div>
        </div>

        {/* 密码长度 */}
        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('tools.passwordGenerator.length')}: {length}
          </label>
          <input
            type="range"
            min="6"
            max="32"
            value={length}
            onChange={e => setLength(parseInt(e.target.value))}
            className="w-full"
          />
          <div className="mt-2 flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>6</span>
            <span>32</span>
          </div>
        </div>

        {/* 选项 */}
        <div className="mb-6 space-y-3">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="uppercase"
              checked={includeUppercase}
              onChange={e => setIncludeUppercase(e.target.checked)}
              className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
            />
            <label htmlFor="uppercase" className="ml-3 text-sm text-gray-700 dark:text-gray-300">
              {t('tools.passwordGenerator.includeUppercase')}
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="lowercase"
              checked={includeLowercase}
              onChange={e => setIncludeLowercase(e.target.checked)}
              className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
            />
            <label htmlFor="lowercase" className="ml-3 text-sm text-gray-700 dark:text-gray-300">
              {t('tools.passwordGenerator.includeLowercase')}
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="numbers"
              checked={includeNumbers}
              onChange={e => setIncludeNumbers(e.target.checked)}
              className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
            />
            <label htmlFor="numbers" className="ml-3 text-sm text-gray-700 dark:text-gray-300">
              {t('tools.passwordGenerator.includeNumbers')}
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="symbols"
              checked={includeSymbols}
              onChange={e => setIncludeSymbols(e.target.checked)}
              className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
            />
            <label htmlFor="symbols" className="ml-3 text-sm text-gray-700 dark:text-gray-300">
              {t('tools.passwordGenerator.includeSymbols')}
            </label>
          </div>
        </div>

        {/* 生成按钮 */}
        <button
          onClick={generatePassword}
          className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 font-bold text-white shadow-lg transition-all hover:from-blue-700 hover:to-indigo-700"
        >
          {t('tools.passwordGenerator.generate')}
        </button>

        {/* 使用说明 */}
        <div className="mt-6 rounded-lg bg-blue-50 p-4 dark:bg-gray-700">
          <h3 className="mb-2 font-bold text-gray-900 dark:text-white">
            {t('tools.passwordGenerator.usage')}
          </h3>
          <ul className="list-inside list-disc space-y-1 text-sm text-gray-700 dark:text-gray-300">
            <li>{t('tools.passwordGenerator.tip1')}</li>
            <li>{t('tools.passwordGenerator.tip2')}</li>
            <li>{t('tools.passwordGenerator.tip3')}</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default PasswordGenerator
