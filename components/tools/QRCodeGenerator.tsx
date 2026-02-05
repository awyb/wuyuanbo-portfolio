'use client'

import React, { useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

const QRCodeGenerator: React.FC = () => {
  const { t } = useLanguage()
  const [text, setText] = useState('')
  const [qrCodeUrl, setQrCodeUrl] = useState('')

  const generateQRCode = () => {
    if (!text.trim()) {
      alert('请输入内容')
      return
    }
    // 使用免费的 QR Code API
    const encodedText = encodeURIComponent(text)
    setQrCodeUrl(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodedText}`)
  }

  const clearQRCode = () => {
    setText('')
    setQrCodeUrl('')
  }

  return (
    <div className="bg-linear-to-br min-h-screen from-purple-50 to-pink-100 p-4 dark:from-gray-900 dark:to-gray-800">
      <div className="mx-auto max-w-2xl rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
        <h1 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white">
          {t('tools.qrCodeGenerator.title')}
        </h1>

        {/* 输入区域 */}
        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('tools.qrCodeGenerator.inputLabel')}
          </label>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder={t('tools.qrCodeGenerator.placeholder')}
            rows={4}
            className="w-full rounded-lg border-2 border-gray-300 bg-gray-50 p-4 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </div>

        {/* 按钮区域 */}
        <div className="mb-6 flex gap-4">
          <button
            onClick={generateQRCode}
            className="bg-linear-to-r flex-1 rounded-lg from-purple-600 to-pink-600 px-6 py-3 font-bold text-white shadow-lg transition-all hover:from-purple-700 hover:to-pink-700"
          >
            {t('tools.qrCodeGenerator.generate')}
          </button>
          <button
            onClick={clearQRCode}
            className="rounded-lg border-2 border-gray-300 bg-gray-100 px-6 py-3 font-bold text-gray-700 hover:bg-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
          >
            {t('tools.qrCodeGenerator.clear')}
          </button>
        </div>

        {/* 二维码显示区域 */}
        {qrCodeUrl && (
          <div className="mb-6 rounded-lg bg-gray-50 p-6 text-center dark:bg-gray-700">
            <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">
              {t('tools.qrCodeGenerator.result')}
            </h3>
            <div className="inline-block rounded-lg bg-white p-4 shadow-md">
              <img src={qrCodeUrl} alt="QR Code" className="h-48 w-48" />
            </div>
            <div className="mt-4">
              <button
                onClick={() => {
                  const link = document.createElement('a')
                  link.href = qrCodeUrl
                  link.download = 'qrcode.png'
                  link.click()
                }}
                className="rounded-lg bg-blue-600 px-6 py-2 font-bold text-white hover:bg-blue-700"
              >
                {t('tools.qrCodeGenerator.download')}
              </button>
            </div>
          </div>
        )}

        {/* 使用说明 */}
        <div className="rounded-lg bg-purple-50 p-4 dark:bg-gray-700">
          <h3 className="mb-2 font-bold text-gray-900 dark:text-white">
            {t('tools.qrCodeGenerator.usage')}
          </h3>
          <ul className="list-inside list-disc space-y-1 text-sm text-gray-700 dark:text-gray-300">
            <li>{t('tools.qrCodeGenerator.tip1')}</li>
            <li>{t('tools.qrCodeGenerator.tip2')}</li>
            <li>{t('tools.qrCodeGenerator.tip3')}</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default QRCodeGenerator
