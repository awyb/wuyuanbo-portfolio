'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import zhCN from '@/locales/zh-CN'
import enUS from '@/locales/en-US'

export type Language = 'zh-CN' | 'en-US'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const translations = {
  'zh-CN': zhCN,
  'en-US': enUS,
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('zh-CN')

  // 从 localStorage 读取保存的语言设置
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language
    if (savedLanguage && (savedLanguage === 'zh-CN' || savedLanguage === 'en-US')) {
      setLanguageState(savedLanguage)
    }
  }, [])

  // 更新 localStorage 和 HTML lang 属性
  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem('language', lang)
    document.documentElement.lang = lang
  }

  // 翻译函数
  const t = (key: string): string => {
    const keys = key.split('.')
    let value: any = translations[language]

    for (const k of keys) {
      value = value?.[k]
    }

    return value || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

// 自定义 Hook
export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
