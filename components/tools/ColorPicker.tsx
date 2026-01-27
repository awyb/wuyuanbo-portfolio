'use client'
import React, { useState, useEffect } from 'react'

// --- 类型定义 ---
type ColorFormat = 'hex' | 'rgb' | 'hsl'
type PresetColor = string

// --- 预设颜色 ---
const PRESET_COLORS: PresetColor[] = [
  '#FF0000',
  '#FF4500',
  '#FF8C00',
  '#FFA500',
  '#FFD700',
  '#FFFF00',
  '#ADFF2F',
  '#00FF00',
  '#00FF7F',
  '#00FFFF',
  '#00BFFF',
  '#0000FF',
  '#4169E1',
  '#8A2BE2',
  '#9400D3',
  '#FF1493',
  '#FF69B4',
  '#FF00FF',
  '#DC143C',
  '#FFFFFF',
  '#808080',
  '#000000',
]

// --- 渐变预设 ---
const GRADIENT_PRESETS = [
  { name: '日落', colors: ['#FF6B6B', '#FFE66D'] },
  { name: '海洋', colors: ['#667eea', '#764ba2'] },
  { name: '森林', colors: ['#11998e', '#38ef7d'] },
  { name: '火焰', colors: ['#f12711', '#f5af19'] },
  { name: '午夜', colors: ['#232526', '#414345'] },
  { name: '极光', colors: ['#00c6ff', '#0072ff'] },
  { name: '樱花', colors: ['#ff9a9e', '#fecfef'] },
  { name: '咖啡', colors: ['#614385', '#516395'] },
]

export default function ColorPicker() {
  const [hexColor, setHexColor] = useState('#3B82F6')
  const [format, setFormat] = useState<ColorFormat>('hex')
  const [copied, setCopied] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [savedColors, setSavedColors] = useState<string[]>([])

  // --- 核心逻辑：HEX 转 RGB ---
  const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 0, g: 0, b: 0 }
  }

  // --- 核心逻辑：RGB 转 HEX ---
  const rgbToHex = (r: number, g: number, b: number): string => {
    return (
      '#' +
      [r, g, b]
        .map(x => {
          const hex = x.toString(16)
          return hex.length === 1 ? '0' + hex : hex
        })
        .join('')
    )
  }

  // --- 核心逻辑：RGB 转 HSL ---
  const rgbToHsl = (r: number, g: number, b: number): { h: number; s: number; l: number } => {
    r /= 255
    g /= 255
    b /= 255
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h = 0
    let s = 0
    const l = (max + min) / 2

    if (max !== min) {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
      switch (max) {
        case r:
          h = ((g - b) / d + (g < b ? 6 : 0)) / 6
          break
        case g:
          h = ((b - r) / d + 2) / 6
          break
        case b:
          h = ((r - g) / d + 4) / 6
          break
      }
    }

    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
  }

  // --- 核心逻辑：HSL 转 RGB ---
  const hslToRgb = (h: number, s: number, l: number): { r: number; g: number; b: number } => {
    s /= 100
    l /= 100
    const k = (n: number) => (n + h / 30) % 12
    const a = s * Math.min(l, 1 - l)
    const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))
    return {
      r: Math.round(f(0) * 255),
      g: Math.round(f(8) * 255),
      b: Math.round(f(4) * 255),
    }
  }

  // --- 核心逻辑：获取颜色字符串 ---
  const getColorString = (color: string, fmt: ColorFormat): string => {
    const rgb = hexToRgb(color)
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)

    switch (fmt) {
      case 'hex':
        return color.toUpperCase()
      case 'rgb':
        return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`
      case 'hsl':
        return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`
      default:
        return color
    }
  }

  // --- 核心逻辑：复制到剪贴板 ---
  const copyToClipboard = () => {
    const colorString = getColorString(hexColor, format)
    navigator.clipboard.writeText(colorString).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  // --- 核心逻辑：保存颜色 ---
  const saveColor = () => {
    if (!savedColors.includes(hexColor)) {
      setSavedColors([hexColor, ...savedColors.slice(0, 9)])
    }
  }

  // --- 核心逻辑：删除保存的颜色 ---
  const removeSavedColor = (color: string) => {
    setSavedColors(savedColors.filter(c => c !== color))
  }

  // --- 核心逻辑：处理饱和度亮度变化 ---
  const handleSaturationLightnessChange = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const saturation = Math.round((x / rect.width) * 100)
    const lightness = Math.round(100 - (y / rect.height) * 100)

    const rgb = hslToRgb(
      hsl.h,
      Math.max(0, Math.min(100, saturation)),
      Math.max(0, Math.min(100, lightness)),
    )
    setHexColor(rgbToHex(rgb.r, rgb.g, rgb.b))
  }

  // --- 核心逻辑：生成随机颜色 ---
  const generateRandomColor = () => {
    const randomColor =
      '#' +
      Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, '0')
    setHexColor(randomColor)
  }

  // --- 计算对比色（用于文字） ---
  const getContrastColor = (hex: string): string => {
    const rgb = hexToRgb(hex)
    const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255
    return luminance > 0.5 ? '#000000' : '#FFFFFF'
  }

  const rgb = hexToRgb(hexColor)
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
  const contrastColor = getContrastColor(hexColor)

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4">
      {/* 标题 */}
      <div className="text-center">
        <h1 className="bg-linear-to-r mb-2 from-pink-600 to-purple-600 bg-clip-text text-4xl font-black text-transparent">
          🎨 颜色选择器
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">选择、转换和管理你的颜色</p>
      </div>

      {/* 主颜色预览 */}
      <div className="rounded-2xl p-8 shadow-2xl" style={{ backgroundColor: hexColor }}>
        <div className="flex flex-col items-center gap-4">
          <div className="text-5xl font-black transition-colors" style={{ color: contrastColor }}>
            {getColorString(hexColor, format)}
          </div>
          <div className="flex gap-2">
            {(['hex', 'rgb', 'hsl'] as ColorFormat[]).map(fmt => (
              <button
                key={fmt}
                onClick={() => setFormat(fmt)}
                className={`rounded-lg px-4 py-2 text-sm font-bold uppercase transition-all ${
                  format === fmt
                    ? 'bg-white text-gray-900 shadow-lg'
                    : 'bg-black/20 text-white hover:bg-black/30'
                }`}
                style={{
                  color: format === fmt ? hexColor : contrastColor,
                  backgroundColor: format === fmt ? '#FFFFFF' : 'rgba(0,0,0,0.2)',
                }}
              >
                {fmt}
              </button>
            ))}
          </div>
          <button
            onClick={copyToClipboard}
            className="rounded-lg bg-white/20 px-6 py-3 font-bold text-white backdrop-blur-sm transition-all hover:scale-105 hover:bg-white/30"
          >
            {copied ? '✓ 已复制' : '📋 复制'}
          </button>
        </div>
      </div>

      {/* 颜色信息 */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
          <h3 className="mb-3 text-sm font-semibold text-gray-600 dark:text-gray-400">HEX</h3>
          <div className="font-mono text-xl font-bold text-gray-900 dark:text-white">
            {hexColor.toUpperCase()}
          </div>
        </div>
        <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
          <h3 className="mb-3 text-sm font-semibold text-gray-600 dark:text-gray-400">RGB</h3>
          <div className="font-mono text-xl font-bold text-gray-900 dark:text-white">
            {rgb.r}, {rgb.g}, {rgb.b}
          </div>
        </div>
        <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
          <h3 className="mb-3 text-sm font-semibold text-gray-600 dark:text-gray-400">HSL</h3>
          <div className="font-mono text-xl font-bold text-gray-900 dark:text-white">
            {hsl.h}°, {hsl.s}%, {hsl.l}%
          </div>
        </div>
      </div>

      {/* 颜色面板选择器 */}
      <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
        <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">🎨 颜色面板</h3>
        <div className="flex flex-col gap-4">
          {/* 色相饱和度面板 */}
          <div
            className="relative h-48 w-full cursor-crosshair rounded-lg shadow-inner"
            style={{
              background: `
                linear-gradient(to right, #fff, rgba(255,255,255,0)),
                linear-gradient(to top, #000, rgba(0,0,0,0)),
                hsl(${hsl.h}, 100%, 50%)
              `,
            }}
            onMouseDown={handleSaturationLightnessChange}
            onClick={handleSaturationLightnessChange}
          >
            {/* 选中的颜色指示器 */}
            <div
              className="absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-lg"
              style={{
                left: `${hsl.s}%`,
                top: `${100 - hsl.l}%`,
                boxShadow: '0 0 0 1px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.2)',
              }}
            />
          </div>

          {/* 色相滑块 */}
          <div className="relative h-6 w-full rounded-lg shadow-inner">
            <input
              type="range"
              min="0"
              max="360"
              value={hsl.h}
              onChange={e => {
                const rgb = hslToRgb(parseInt(e.target.value), hsl.s, hsl.l)
                setHexColor(rgbToHex(rgb.r, rgb.g, rgb.b))
              }}
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              style={{ appearance: 'none' }}
            />
            <div
              className="h-full w-full rounded-lg"
              style={{
                background: `linear-gradient(to right, 
                  hsl(0, 100%, 50%),
                  hsl(60, 100%, 50%),
                  hsl(120, 100%, 50%),
                  hsl(180, 100%, 50%),
                  hsl(240, 100%, 50%),
                  hsl(300, 100%, 50%),
                  hsl(360, 100%, 50%)
                )`,
              }}
            />
            <div
              className="absolute top-1/2 h-6 w-4 -translate-x-1/2 -translate-y-1/2 rounded border-2 border-white shadow-md"
              style={{
                left: `${(hsl.h / 360) * 100}%`,
                backgroundColor: hexColor,
              }}
            />
          </div>
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={generateRandomColor}
          className="bg-linear-to-r rounded-lg from-purple-500 to-pink-500 px-6 py-3 font-bold text-white shadow-md transition-all hover:scale-105 hover:shadow-lg"
        >
          🎲 随机颜色
        </button>
        <button
          onClick={saveColor}
          className="bg-linear-to-r rounded-lg from-blue-500 to-cyan-500 px-6 py-3 font-bold text-white shadow-md transition-all hover:scale-105 hover:shadow-lg"
        >
          💾 保存颜色
        </button>
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="bg-linear-to-r rounded-lg from-gray-500 to-gray-600 px-6 py-3 font-bold text-white shadow-md transition-all hover:scale-105 hover:shadow-lg"
        >
          {showAdvanced ? '📖 隐藏详情' : '📖 显示详情'}
        </button>
      </div>

      {/* 高级控制面板 */}
      {showAdvanced && (
        <div className="bg-linear-to-br rounded-xl from-gray-50 to-gray-100 p-6 shadow-lg dark:from-gray-800 dark:to-gray-900">
          <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">🎛️ 手动调整</h3>
          <div className="space-y-4">
            {/* RGB 滑块 */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-red-600">红色 (R)</label>
              <input
                type="range"
                min="0"
                max="255"
                value={rgb.r}
                onChange={e => setHexColor(rgbToHex(parseInt(e.target.value), rgb.g, rgb.b))}
                className="h-2 w-full cursor-pointer accent-red-500"
              />
              <div className="mt-1 text-right font-mono text-sm text-gray-600 dark:text-gray-400">
                {rgb.r}
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-green-600">绿色 (G)</label>
              <input
                type="range"
                min="0"
                max="255"
                value={rgb.g}
                onChange={e => setHexColor(rgbToHex(rgb.r, parseInt(e.target.value), rgb.b))}
                className="h-2 w-full cursor-pointer accent-green-500"
              />
              <div className="mt-1 text-right font-mono text-sm text-gray-600 dark:text-gray-400">
                {rgb.g}
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-blue-600">蓝色 (B)</label>
              <input
                type="range"
                min="0"
                max="255"
                value={rgb.b}
                onChange={e => setHexColor(rgbToHex(rgb.r, rgb.g, parseInt(e.target.value)))}
                className="h-2 w-full cursor-pointer accent-blue-500"
              />
              <div className="mt-1 text-right font-mono text-sm text-gray-600 dark:text-gray-400">
                {rgb.b}
              </div>
            </div>

            {/* HSL 滑块 */}
            <div className="mt-6 border-t border-gray-300 pt-6 dark:border-gray-700">
              <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                色相 (H)
              </label>
              <input
                type="range"
                min="0"
                max="360"
                value={hsl.h}
                onChange={e => {
                  const rgb = hslToRgb(parseInt(e.target.value), hsl.s, hsl.l)
                  setHexColor(rgbToHex(rgb.r, rgb.g, rgb.b))
                }}
                className="h-2 w-full cursor-pointer"
                style={{
                  background: `linear-gradient(to right, ${['#ff0000', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#ff00ff', '#ff0000'].join(',')})`,
                }}
              />
              <div className="mt-1 text-right font-mono text-sm text-gray-600 dark:text-gray-400">
                {hsl.h}°
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                饱和度 (S)
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={hsl.s}
                onChange={e => {
                  const rgb = hslToRgb(hsl.h, parseInt(e.target.value), hsl.l)
                  setHexColor(rgbToHex(rgb.r, rgb.g, rgb.b))
                }}
                className="h-2 w-full cursor-pointer"
                style={{
                  background: `linear-gradient(to right, hsl(${hsl.h}, 0%, ${hsl.l}%), hsl(${hsl.h}, 100%, ${hsl.l}%))`,
                }}
              />
              <div className="mt-1 text-right font-mono text-sm text-gray-600 dark:text-gray-400">
                {hsl.s}%
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                亮度 (L)
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={hsl.l}
                onChange={e => {
                  const rgb = hslToRgb(hsl.h, hsl.s, parseInt(e.target.value))
                  setHexColor(rgbToHex(rgb.r, rgb.g, rgb.b))
                }}
                className="h-2 w-full cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #000000, hsl(${hsl.h}, ${hsl.s}%, 50%), #ffffff)`,
                }}
              />
              <div className="mt-1 text-right font-mono text-sm text-gray-600 dark:text-gray-400">
                {hsl.l}%
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 预设颜色 */}
      <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
        <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">🎨 预设颜色</h3>
        <div className="grid gap-3 sm:grid-cols-5 md:grid-cols-10 lg:grid-cols-11">
          {PRESET_COLORS.map((color, index) => (
            <button
              key={index}
              onClick={() => setHexColor(color)}
              className="aspect-square rounded-lg transition-all hover:scale-110 hover:shadow-lg active:scale-95"
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      </div>

      {/* 渐变预设 */}
      <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
        <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">🌈 渐变预设</h3>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          {GRADIENT_PRESETS.map((gradient, index) => (
            <button
              key={index}
              onClick={() => setHexColor(gradient.colors[0])}
              className="h-24 rounded-xl transition-all hover:scale-105 hover:shadow-lg active:scale-95"
              style={{
                background: `linear-gradient(135deg, ${gradient.colors.join(', ')})`,
              }}
              title={gradient.name}
            >
              <span className="flex h-full items-center justify-center text-lg font-bold text-white drop-shadow-md">
                {gradient.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 保存的颜色 */}
      {savedColors.length > 0 && (
        <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">💾 保存的颜色</h3>
            <button
              onClick={() => setSavedColors([])}
              className="rounded-lg bg-red-500 px-3 py-1 text-sm font-bold text-white transition-all hover:bg-red-600"
            >
              清空
            </button>
          </div>
          <div className="grid gap-3 sm:grid-cols-5 md:grid-cols-10">
            {savedColors.map((color, index) => (
              <div
                key={index}
                onClick={() => setHexColor(color)}
                className="relative aspect-square cursor-pointer rounded-lg transition-all hover:scale-110 hover:shadow-lg active:scale-95"
                style={{ backgroundColor: color }}
              >
                <button
                  onClick={e => {
                    e.stopPropagation()
                    removeSavedColor(color)
                  }}
                  className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white transition-opacity hover:bg-red-600"
                  title="删除颜色"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 使用说明 */}
      <div className="rounded-xl bg-gray-50 p-6 shadow-md dark:bg-gray-800">
        <h3 className="mb-3 text-lg font-bold text-gray-900 dark:text-white">📖 使用说明</h3>
        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <p>
            • <strong>颜色面板</strong>：在色相饱和度面板中点击选择颜色，使用色相滑块调整色相
          </p>
          <p>
            • <strong>选择颜色</strong>：点击预设颜色或使用滑块手动调整
          </p>
          <p>
            • <strong>格式切换</strong>：在 HEX、RGB、HSL 之间切换显示格式
          </p>
          <p>
            • <strong>复制颜色</strong>：点击复制按钮将颜色代码复制到剪贴板
          </p>
          <p>
            • <strong>随机生成</strong>：点击随机颜色按钮生成随机颜色
          </p>
          <p>
            • <strong>保存颜色</strong>：点击保存按钮将当前颜色保存到收藏夹
          </p>
          <p>
            • <strong>高级调整</strong>：显示详情后可使用 RGB 和 HSL 滑块精确调整
          </p>
        </div>
      </div>
    </div>
  )
}
