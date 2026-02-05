'use client'
import React, { useState, useEffect } from 'react'

// --- 类型定义 ---
type FortuneType = 'career' | 'love' | 'wealth' | 'health' | 'study' | 'general'
type FortuneLevel = '上上签' | '上吉' | '中吉' | '小吉' | '下吉' | '凶' | '大凶'
type DrawMethod = 'shake' | 'draw' | 'dice'

interface Fortune {
  id: number
  type: FortuneType
  level: FortuneLevel
  title: string
  content: string
  interpretation: string
  advice: string
  luckyNumber: number[]
  luckyColor: string[]
  luckyDirection: string
}

interface FortuneHistory {
  id: number
  date: string
  fortune: Fortune
  method: DrawMethod
}

// --- 签文数据库 ---
const FORTUNE_TITLES = {
  career: [
    { level: '上上签', title: '前程似锦' },
    { level: '上吉', title: '步步高升' },
    { level: '中吉', title: '稳步发展' },
    { level: '小吉', title: '机遇将至' },
    { level: '下吉', title: '需耐心等待' },
    { level: '凶', title: '暂避锋芒' },
    { level: '大凶', title: '需谨慎行事' },
  ],
  love: [
    { level: '上上签', title: '良缘天定' },
    { level: '上吉', title: '桃花盛开' },
    { level: '中吉', title: '心意相通' },
    { level: '小吉', title: '缘分将至' },
    { level: '下吉', title: '需主动出击' },
    { level: '凶', title: '需冷静思考' },
    { level: '大凶', title: '暂不适合' },
  ],
  wealth: [
    { level: '上上签', title: '财源滚滚' },
    { level: '上吉', title: '财运亨通' },
    { level: '中吉', title: '小有收获' },
    { level: '小吉', title: '投资有望' },
    { level: '下吉', title: '需谨慎理财' },
    { level: '凶', title: '暂勿投资' },
    { level: '大凶', title: '需守财为上' },
  ],
  health: [
    { level: '上上签', title: '健康长寿' },
    { level: '上吉', title: '身体安康' },
    { level: '中吉', title: '精力充沛' },
    { level: '小吉', title: '需注意休息' },
    { level: '下吉', title: '需适度锻炼' },
    { level: '凶', title: '需注意饮食' },
    { level: '大凶', title: '需及时就医' },
  ],
  study: [
    { level: '上上签', title: '学业大成' },
    { level: '上吉', title: '学有所成' },
    { level: '中吉', title: '进步明显' },
    { level: '小吉', title: '需加倍努力' },
    { level: '下吉', title: '需调整方法' },
    { level: '凶', title: '需冷静分析' },
    { level: '大凶', title: '需重新规划' },
  ],
  general: [
    { level: '上上签', title: '万事如意' },
    { level: '上吉', title: '吉星高照' },
    { level: '中吉', title: '平稳顺利' },
    { level: '小吉', title: '小有波折' },
    { level: '下吉', title: '需耐心等待' },
    { level: '凶', title: '需谨慎行事' },
    { level: '大凶', title: '宜静不宜动' },
  ],
}

const FORTUNE_CONTENTS = {
  上上签: [
    '天赐良机，运势如虹，把握当下，必定成功。',
    '贵人相助，顺风顺水，心想事成，万事大吉。',
    '祥云瑞气，吉星高照，前程似锦，未来可期。',
  ],
  上吉: [
    '机遇降临，把握良机，努力进取，必有收获。',
    '运势旺盛，积极行动，勇往直前，必获成功。',
    '紫气东来，贵人扶持，心想事成，步步高升。',
  ],
  中吉: [
    '平稳发展，稳步前进，坚持不懈，终将成功。',
    '运势平稳，脚踏实地，努力耕耘，必有回报。',
    '风调雨顺，按部就班，持之以恒，水到渠成。',
  ],
  小吉: [
    '小有波折，但终能克服，保持乐观，继续前行。',
    '机遇将至，需耐心等待，做好准备，把握时机。',
    '运势渐起，需积极主动，抓住机会，创造未来。',
  ],
  下吉: [
    '暂需等待，时机未到，耐心守候，静待花开。',
    '运势平平，需调整心态，积极面对，迎接挑战。',
    '暂不宜动，静观其变，积蓄力量，以待时机。',
  ],
  凶: [
    '需谨慎行事，三思后行，避免冲动，保持冷静。',
    '暂避锋芒，低调行事，积蓄力量，等待时机。',
    '困难当前，需冷静分析，寻求帮助，共渡难关。',
  ],
  大凶: [
    '宜静不宜动，谨慎行事，避免冒险，保重为上。',
    '运势低迷，需修身养性，调整心态，等待转机。',
    '多事之秋，需处处小心，低调行事，保平安为上。',
  ],
}

const INTERPRETATIONS = {
  上上签: '此乃上上之签，运势极佳，把握良机，必定成功。',
  上吉: '此为上吉之签，运势旺盛，积极进取，必有收获。',
  中吉: '此为中吉之签，运势平稳，脚踏实地，终将成功。',
  小吉: '此为小吉之签，运势渐起，积极准备，把握机会。',
  下吉: '此为下吉之签，需耐心等待，积蓄力量，等待时机。',
  凶: '此为凶签，需谨慎行事，避免冲动，保持冷静。',
  大凶: '此为大凶签，宜静不宜动，低调行事，保重为上。',
}

const ADVICES = {
  上上签: '把握当下，积极行动，相信自己的能力，勇往直前！',
  上吉: '抓住机遇，努力进取，贵人相助，必获成功！',
  中吉: '稳步前进，坚持不懈，脚踏实地，必有回报！',
  小吉: '做好准备，积极主动，抓住机会，创造未来！',
  下吉: '耐心等待，调整心态，积蓄力量，静待花开！',
  凶: '谨慎行事，保持冷静，寻求帮助，共渡难关！',
  大凶: '低调行事，修身养性，调整心态，等待转机！',
}

// --- 主组件 ---
export default function FortuneTelling() {
  const [selectedType, setSelectedType] = useState<FortuneType>('general')
  const [selectedMethod, setSelectedMethod] = useState<DrawMethod>('shake')
  const [isDrawing, setIsDrawing] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [currentFortune, setCurrentFortune] = useState<Fortune | null>(null)
  const [history, setHistory] = useState<FortuneHistory[]>([])
  const [isDailyUsed, setIsDailyUsed] = useState(false)
  const [animateShake, setAnimateShake] = useState(false)
  const [diceResult, setDiceResult] = useState(0)

  // --- 核心逻辑：生成签文 ---
  const generateFortune = (type: FortuneType, method: DrawMethod): Fortune => {
    const typeTitles = FORTUNE_TITLES[type]
    const randomTitleIndex = Math.floor(Math.random() * typeTitles.length)
    const { level, title } = typeTitles[randomTitleIndex]

    const contents = FORTUNE_CONTENTS[level as FortuneLevel]
    const randomContentIndex = Math.floor(Math.random() * contents.length)
    const content = contents[randomContentIndex]

    const interpretation = INTERPRETATIONS[level as FortuneLevel]
    const advice = ADVICES[level as FortuneLevel]

    // 生成幸运数字
    const luckyNumber = Array.from({ length: 3 }, () => Math.floor(Math.random() * 9) + 1)

    // 生成幸运颜色
    const colors = ['红色', '橙色', '黄色', '绿色', '蓝色', '紫色', '粉色', '金色']
    const luckyColor = [colors[Math.floor(Math.random() * colors.length)]]

    // 生成幸运方向
    const directions = ['东', '南', '西', '北', '东南', '东北', '西南', '西北']
    const luckyDirection = directions[Math.floor(Math.random() * directions.length)]

    return {
      id: Date.now(),
      type,
      level: level as FortuneLevel,
      title,
      content,
      interpretation,
      advice,
      luckyNumber,
      luckyColor,
      luckyDirection,
    }
  }

  // --- 核心逻辑：求签 ---
  const drawFortune = () => {
    if (isDrawing) return

    setIsDrawing(true)
    setShowResult(false)
    setCurrentFortune(null)

    if (selectedMethod === 'shake') {
      setAnimateShake(true)
    } else if (selectedMethod === 'dice') {
      const diceCount = Math.floor(Math.random() * 6) + 1
      setDiceResult(diceCount)
    }

    // 动画延迟
    setTimeout(() => {
      const fortune = generateFortune(selectedType, selectedMethod)
      setCurrentFortune(fortune)

      // 添加到历史记录
      const newHistory: FortuneHistory = {
        id: Date.now(),
        date: new Date().toLocaleString('zh-CN'),
        fortune,
        method: selectedMethod,
      }
      setHistory([newHistory, ...history.slice(0, 9)]) // 只保留最近10条

      setIsDrawing(false)
      setAnimateShake(false)
      setShowResult(true)

      // 检查是否今日已使用（简单实现：仅提示）
      const today = new Date().toDateString()
      const lastDraw = localStorage.getItem('lastFortuneDraw')
      if (lastDraw === today) {
        setIsDailyUsed(true)
      } else {
        localStorage.setItem('lastFortuneDraw', today)
      }
    }, 2000)
  }

  // --- 重置 ---
  const reset = () => {
    setShowResult(false)
    setCurrentFortune(null)
    setDiceResult(0)
  }

  // --- 获取类型名称 ---
  const getTypeName = (type: FortuneType): string => {
    const names: Record<FortuneType, string> = {
      career: '事业运势',
      love: '感情运势',
      wealth: '财运运势',
      health: '健康运势',
      study: '学业运势',
      general: '综合运势',
    }
    return names[type]
  }

  // --- 获取方法名称 ---
  const getMethodName = (method: DrawMethod): string => {
    const names: Record<DrawMethod, string> = {
      shake: '摇签筒',
      draw: '抽签',
      dice: '掷骰子',
    }
    return names[method]
  }

  // --- 获取等级颜色 ---
  const getLevelColor = (level: FortuneLevel): string => {
    const colors: Record<FortuneLevel, string> = {
      上上签: 'from-yellow-400 to-red-500',
      上吉: 'from-orange-400 to-red-400',
      中吉: 'from-green-400 to-blue-400',
      小吉: 'from-blue-300 to-purple-400',
      下吉: 'from-gray-400 to-gray-500',
      凶: 'from-gray-600 to-gray-700',
      大凶: 'from-red-700 to-black',
    }
    return colors[level]
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4">
      {/* 标题 */}
      <div className="text-center">
        <h1 className="bg-linear-to-r mb-2 from-purple-600 to-pink-600 bg-clip-text text-4xl font-black text-transparent">
          🎋 求签占卜 🎋
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">探寻命运指引，解读人生运势</p>
      </div>

      {/* 求签方式选择 */}
      {!showResult && !isDrawing && (
        <div className="bg-linear-to-br rounded-xl from-purple-50 to-pink-50 p-6 shadow-lg dark:from-purple-900/20 dark:to-pink-900/20">
          <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">🎯 选择求签方式</h3>
          <div className="grid gap-3 md:grid-cols-3">
            {(['shake', 'draw', 'dice'] as DrawMethod[]).map(method => (
              <button
                key={method}
                onClick={() => setSelectedMethod(method)}
                className={`rounded-xl p-4 transition-all hover:scale-105 ${
                  selectedMethod === method
                    ? 'bg-linear-to-br from-purple-500 to-pink-500 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                <div className="mb-2 text-3xl">
                  {method === 'shake' && '🏺'}
                  {method === 'draw' && '🎴'}
                  {method === 'dice' && '🎲'}
                </div>
                <div className="font-bold">{getMethodName(method)}</div>
                <div className="mt-1 text-xs opacity-80">
                  {method === 'shake' && '传统摇签筒，更有仪式感'}
                  {method === 'draw' && '随机抽取，简洁快速'}
                  {method === 'dice' && '掷骰子，更加神秘'}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 求签类型选择 */}
      {!showResult && !isDrawing && (
        <div className="bg-linear-to-br rounded-xl from-blue-50 to-cyan-50 p-6 shadow-lg dark:from-blue-900/20 dark:to-cyan-900/20">
          <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">📋 选择求签类型</h3>
          <div className="grid gap-2 md:grid-cols-3 lg:grid-cols-6">
            {(['career', 'love', 'wealth', 'health', 'study', 'general'] as FortuneType[]).map(
              type => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`rounded-lg p-3 text-sm font-semibold transition-all hover:scale-105 ${
                    selectedType === type
                      ? 'bg-linear-to-r from-blue-500 to-cyan-500 text-white shadow-md'
                      : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="mb-1 text-xl">
                    {type === 'career' && '💼'}
                    {type === 'love' && '💕'}
                    {type === 'wealth' && '💰'}
                    {type === 'health' && '🏥'}
                    {type === 'study' && '📚'}
                    {type === 'general' && '⭐'}
                  </div>
                  {getTypeName(type)}
                </button>
              ),
            )}
          </div>
        </div>
      )}

      {/* 求签动画区域 */}
      {!showResult && (
        <div className="bg-linear-to-br relative rounded-2xl from-amber-100 to-orange-100 p-8 shadow-2xl dark:from-amber-900/30 dark:to-orange-900/30">
          {isDrawing ? (
            <div className="flex flex-col items-center justify-center py-12">
              {selectedMethod === 'shake' && (
                <div className={`text-9xl ${animateShake ? 'animate-bounce' : ''}`}>🏺</div>
              )}
              {selectedMethod === 'draw' && <div className="animate-pulse text-9xl">🎴</div>}
              {selectedMethod === 'dice' && <div className="animate-spin text-9xl">🎲</div>}
              <p className="mt-6 text-xl font-bold text-gray-700 dark:text-gray-300">
                {selectedMethod === 'shake' && '正在摇签中...'}
                {selectedMethod === 'draw' && '正在抽签中...'}
                {selectedMethod === 'dice' && `骰子点数: ${diceResult}`}
              </p>
              {diceResult > 0 && (
                <div className="mt-2 text-lg text-gray-600 dark:text-gray-400">
                  根据点数解读签文...
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="mb-4 text-9xl">🎋</div>
              <button
                onClick={drawFortune}
                className="bg-linear-to-r rounded-xl from-purple-500 to-pink-500 px-12 py-4 text-xl font-bold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl active:scale-95"
              >
                开始求签
              </button>
              {isDailyUsed && (
                <p className="mt-4 text-sm text-yellow-600 dark:text-yellow-400">
                  ⚠️ 今日已求签，再次求签可能不准哦
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* 签文结果 */}
      {showResult && currentFortune && (
        <div className="bg-linear-to-br rounded-2xl from-amber-50 to-orange-50 p-6 shadow-2xl dark:from-amber-900/30 dark:to-orange-900/30">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">📜 签文结果</h3>
            <button
              onClick={reset}
              className="rounded-lg bg-gray-500 px-4 py-2 text-sm font-bold text-white transition-all hover:bg-gray-600"
            >
              再求一签
            </button>
          </div>

          {/* 签文标题和等级 */}
          <div className="bg-linear-to-r mb-6 rounded-xl from-yellow-400 to-red-500 p-6 text-center shadow-lg">
            <div className="mb-2 text-sm font-semibold text-white/80">
              {getTypeName(currentFortune.type)}
            </div>
            <div className="mb-2 text-4xl font-black text-white">{currentFortune.title}</div>
            <div className="inline-block rounded-full bg-white/30 px-4 py-1 text-lg font-bold text-white backdrop-blur-sm">
              {currentFortune.level}
            </div>
          </div>

          {/* 签文内容 */}
          <div className="mb-6 rounded-xl bg-white p-6 shadow-md dark:bg-gray-800">
            <div className="mb-3 text-sm font-semibold text-gray-600 dark:text-gray-400">
              签文内容
            </div>
            <div className="text-lg font-medium text-gray-800 dark:text-white">
              {currentFortune.content}
            </div>
          </div>

          {/* 解读 */}
          <div className="mb-6 rounded-xl bg-blue-50 p-6 shadow-md dark:bg-blue-900/30">
            <div className="mb-3 text-sm font-semibold text-blue-600 dark:text-blue-400">
              💡 签文解读
            </div>
            <div className="text-base text-gray-700 dark:text-gray-300">
              {currentFortune.interpretation}
            </div>
          </div>

          {/* 建议 */}
          <div className="mb-6 rounded-xl bg-green-50 p-6 shadow-md dark:bg-green-900/30">
            <div className="mb-3 text-sm font-semibold text-green-600 dark:text-green-400">
              🌟 建议
            </div>
            <div className="text-base text-gray-700 dark:text-gray-300">
              {currentFortune.advice}
            </div>
          </div>

          {/* 幸运信息 */}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="bg-linear-to-br rounded-xl from-purple-100 to-pink-100 p-4 text-center shadow-md dark:from-purple-900/30 dark:to-pink-900/30">
              <div className="mb-2 text-3xl">🔢</div>
              <div className="mb-2 text-sm font-semibold text-gray-600 dark:text-gray-400">
                幸运数字
              </div>
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {currentFortune.luckyNumber.join(' · ')}
              </div>
            </div>

            <div className="bg-linear-to-br rounded-xl from-red-100 to-orange-100 p-4 text-center shadow-md dark:from-red-900/30 dark:to-orange-900/30">
              <div className="mb-2 text-3xl">🎨</div>
              <div className="mb-2 text-sm font-semibold text-gray-600 dark:text-gray-400">
                幸运颜色
              </div>
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                {currentFortune.luckyColor.join(' · ')}
              </div>
            </div>

            <div className="bg-linear-to-br rounded-xl from-blue-100 to-cyan-100 p-4 text-center shadow-md dark:from-blue-900/30 dark:to-cyan-900/30">
              <div className="mb-2 text-3xl">🧭</div>
              <div className="mb-2 text-sm font-semibold text-gray-600 dark:text-gray-400">
                幸运方向
              </div>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {currentFortune.luckyDirection}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 历史记录 */}
      {history.length > 0 && (
        <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
          <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">📚 求签历史</h3>
          <div className="space-y-3">
            {history.map(item => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-lg bg-gray-50 p-4 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600"
              >
                <div className="flex items-center gap-4">
                  <div className="text-2xl">
                    {item.method === 'shake' && '🏺'}
                    {item.method === 'draw' && '🎴'}
                    {item.method === 'dice' && '🎲'}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {item.fortune.title}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {getTypeName(item.fortune.type)} · {item.date}
                    </div>
                  </div>
                </div>
                <div
                  className={`bg-linear-to-r rounded-full px-3 py-1 text-sm font-bold text-white ${getLevelColor(item.fortune.level)}`}
                >
                  {item.fortune.level}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 游戏说明 */}
      <div className="rounded-xl bg-gray-50 p-6 shadow-md dark:bg-gray-800">
        <h3 className="mb-3 text-lg font-bold text-gray-900 dark:text-white">📖 使用说明</h3>
        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <p>• 选择求签方式：摇签筒（传统）、抽签（快速）、掷骰子（神秘）</p>
          <p>• 选择求签类型：事业、感情、财运、健康、学业或综合运势</p>
          <p>
            • 签文等级：上上签 {'>'} 上吉 {'>'} 中吉 {'>'} 小吉 {'>'} 下吉 {'>'} 凶 {'>'} 大凶
          </p>
          <p>• 每日建议只求一次，多次求签可能影响准确性</p>
          <p>• 签文仅供参考，命运掌握在自己手中</p>
        </div>
      </div>
    </div>
  )
}
