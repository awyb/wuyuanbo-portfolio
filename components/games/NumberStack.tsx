'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

// 游戏常量
const GRID_WIDTH = 3 // 3列
const GRID_HEIGHT = 12 // 12行
const STACK_WARNING_HEIGHT = 8 // 警戒线高度

// 响应式单元格大小
const CELL_SIZE_DESKTOP = 60
const CELL_SIZE_MOBILE = 50

// 方块类型
interface Block {
  id: string
  value: number
  row: number
  col: number
}

export default function NumberStack() {
  const { t } = useLanguage()
  // 游戏状态
  const [blocks, setBlocks] = useState<Block[]>([])
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)
  const [nextBlock, setNextBlock] = useState<{
    value: number
    col: number
  } | null>(null)
  const [cellSize, setCellSize] = useState(CELL_SIZE_DESKTOP)

  // 生成随机方块
  const generateRandomBlock = useCallback(() => {
    const value = Math.random() < 0.8 ? 2 : 4
    const col = Math.floor(Math.random() * GRID_WIDTH)
    return { value, col }
  }, [])

  // 初始化游戏
  const initializeGame = useCallback(() => {
    setBlocks([])
    setScore(0)
    setGameOver(false)
    setGameStarted(true)
    setNextBlock(generateRandomBlock())
  }, [generateRandomBlock])

  // 获取列中最低的行
  const getLowestRow = useCallback((col: number, currentBlocks: Block[]): number => {
    // 找到该列中所有方块的最大行号（最小的行号值，因为0是顶部）
    let highestOccupiedRow = -1
    for (const block of currentBlocks) {
      if (block.col === col && block.row > highestOccupiedRow) {
        highestOccupiedRow = block.row
      }
    }
    // 如果列是空的，返回最底部的行
    if (highestOccupiedRow === -1) {
      return GRID_HEIGHT - 1
    }
    // 否则返回最高占用行上方的行
    const nextRow = highestOccupiedRow - 1
    // 如果上方没有空间了，返回-1表示列已满
    return nextRow >= 0 ? nextRow : -1
  }, [])

  // 检查并合并方块
  const checkAndMergeBlocks = useCallback((currentBlocks: Block[]): Block[] => {
    let newBlocks = [...currentBlocks]
    let merged = true
    let scoreGain = 0

    while (merged) {
      merged = false
      // 按列分组
      const blocksByCol: { [col: number]: Block[] } = {}
      newBlocks.forEach(block => {
        if (!blocksByCol[block.col]) {
          blocksByCol[block.col] = []
        }
        blocksByCol[block.col].push(block)
      })

      // 对每列按行排序（从上到下，行号小的在上）
      Object.keys(blocksByCol).forEach(colStr => {
        const col = parseInt(colStr)
        blocksByCol[col].sort((a, b) => a.row - b.row)
      })

      // 检查每列中是否有相邻的相同方块
      for (const colStr in blocksByCol) {
        const col = parseInt(colStr)
        const columnBlocks = blocksByCol[col]

        for (let i = 0; i < columnBlocks.length - 1; i++) {
          const block1 = columnBlocks[i]
          const block2 = columnBlocks[i + 1]

          // 检查是否相邻且相同
          if (block1.value === block2.value && Math.abs(block1.row - block2.row) === 1) {
            // 合并
            const mergedRow = Math.min(block1.row, block2.row)
            const mergedValue = block1.value * 2
            scoreGain += mergedValue * 10

            // 移除旧方块，添加新方块
            newBlocks = newBlocks.filter(b => b.id !== block1.id && b.id !== block2.id)
            newBlocks.push({
              id: `merged-${Date.now()}-${Math.random()}`,
              value: mergedValue,
              row: mergedRow,
              col: col,
            })

            merged = true
            break
          }
        }
        if (merged) break
      }
    }

    if (scoreGain > 0) {
      setScore(prev => {
        const newScore = prev + scoreGain
        setHighScore(prevHigh => Math.max(prevHigh, newScore))
        return newScore
      })
    }

    return newBlocks
  }, [])

  // 放置方块
  const placeBlock = useCallback(
    (col: number) => {
      if (!gameStarted || gameOver || !nextBlock) return

      const lowestRow = getLowestRow(col, blocks)

      if (lowestRow < 0) {
        // 列已满
        setGameOver(true)
        return
      }

      const newBlock: Block = {
        id: `block-${Date.now()}-${Math.random()}`,
        value: nextBlock.value,
        row: lowestRow,
        col: col,
      }

      const newBlocks = [...blocks, newBlock]
      const mergedBlocks = checkAndMergeBlocks(newBlocks)

      // 检查是否超过警戒线
      const maxHeight = mergedBlocks.reduce((max, block) => Math.min(max, block.row), GRID_HEIGHT)
      if (maxHeight < 0) {
        setGameOver(true)
        return
      }

      setBlocks(mergedBlocks)
      setNextBlock(generateRandomBlock())
    },
    [
      gameStarted,
      gameOver,
      nextBlock,
      blocks,
      getLowestRow,
      checkAndMergeBlocks,
      generateRandomBlock,
    ],
  )

  // 处理键盘输入
  const handleKeyPress = useCallback(
    (e: KeyboardEvent) => {
      if (!gameStarted && (e.key === ' ' || e.key === 'Enter')) {
        e.preventDefault()
        initializeGame()
        return
      }

      if (gameOver && (e.key === ' ' || e.key === 'Enter')) {
        e.preventDefault()
        initializeGame()
        return
      }

      if (e.key === '1') {
        e.preventDefault()
        placeBlock(0)
      }
      if (e.key === '2') {
        e.preventDefault()
        placeBlock(1)
      }
      if (e.key === '3') {
        e.preventDefault()
        placeBlock(2)
      }
    },
    [gameStarted, gameOver, initializeGame, placeBlock],
  )

  // 监听键盘事件
  useEffect(() => {
    // 只在桌面端添加键盘事件监听
    if (typeof window !== 'undefined' && window.innerWidth >= 768) {
      window.addEventListener('keydown', handleKeyPress)
      return () => window.removeEventListener('keydown', handleKeyPress)
    }
  }, [handleKeyPress])

  // 监听窗口大小变化，调整单元格大小
  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== 'undefined') {
        setCellSize(window.innerWidth < 768 ? CELL_SIZE_MOBILE : CELL_SIZE_DESKTOP)
      }
    }

    // 初始化
    handleResize()

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }
  }, [])

  // 重置游戏
  const resetGame = useCallback(() => {
    initializeGame()
  }, [initializeGame])

  // 获取方块颜色
  const getBlockColor = (value: number): string => {
    const colors: { [key: number]: string } = {
      2: 'bg-blue-400',
      4: 'bg-blue-500',
      8: 'bg-blue-600',
      16: 'bg-purple-500',
      32: 'bg-purple-600',
      64: 'bg-pink-500',
      128: 'bg-pink-600',
      256: 'bg-red-500',
      512: 'bg-red-600',
      1024: 'bg-orange-500',
      2048: 'bg-yellow-500',
    }
    return colors[value] || 'bg-gray-500'
  }

  // 获取最高的方块（最小行号）
  const getMinRow = (): number => {
    if (blocks.length === 0) return GRID_HEIGHT
    return Math.min(...blocks.map(b => b.row))
  }

  const minRow = getMinRow()
  const isWarning = minRow <= GRID_HEIGHT - STACK_WARNING_HEIGHT

  return (
    <div className="mx-auto w-full max-w-md">
      {/* 游戏信息 */}
      <div className="mb-6 grid grid-cols-2 gap-4">
        <div className="rounded-lg bg-blue-100 p-4 text-center dark:bg-blue-900">
          <p className="text-sm text-gray-600 dark:text-gray-400">{t('games.numberStack.score')}</p>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{score}</p>
        </div>
        <div className="rounded-lg bg-purple-100 p-4 text-center dark:bg-purple-900">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t('games.numberStack.highScore')}
          </p>
          <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{highScore}</p>
        </div>
      </div>

      {/* 游戏画布 */}
      <div
        className={`relative mb-6 overflow-hidden rounded-lg border-4 transition-colors ${
          isWarning ? 'border-red-500 bg-red-50 dark:bg-red-900' : 'border-gray-700 bg-gray-900'
        }`}
        style={{
          width: GRID_WIDTH * cellSize,
          height: GRID_HEIGHT * cellSize,
          margin: '0 auto',
        }}
      >
        {/* 警戒线 */}
        <div
          className="absolute left-0 right-0 border-t-2 border-dashed border-yellow-400 opacity-50"
          style={{
            top: (GRID_HEIGHT - STACK_WARNING_HEIGHT) * cellSize,
          }}
        />

        {/* 方块 */}
        {blocks.map(block => (
          <div
            key={block.id}
            className={`absolute flex items-center justify-center rounded-lg font-bold text-white transition-all ${getBlockColor(
              block.value,
            )}`}
            style={{
              left: block.col * cellSize + 2,
              top: block.row * cellSize + 2,
              width: cellSize - 4,
              height: cellSize - 4,
              fontSize:
                block.value > 128
                  ? cellSize > 50
                    ? '20px'
                    : '16px'
                  : cellSize > 50
                    ? '24px'
                    : '20px',
            }}
          >
            {block.value}
          </div>
        ))}

        {/* 网格线 */}
        <svg className="absolute inset-0 h-full w-full" style={{ opacity: 0.1 }}>
          {Array.from({ length: GRID_WIDTH + 1 }).map((_, i) => (
            <line
              key={`v-${i}`}
              x1={i * cellSize}
              y1={0}
              x2={i * cellSize}
              y2={GRID_HEIGHT * cellSize}
              stroke="white"
            />
          ))}
          {Array.from({ length: GRID_HEIGHT + 1 }).map((_, i) => (
            <line
              key={`h-${i}`}
              x1={0}
              y1={i * cellSize}
              x2={GRID_WIDTH * cellSize}
              y2={i * cellSize}
              stroke="white"
            />
          ))}
        </svg>
      </div>

      {/* 下一个方块预览 */}
      {nextBlock && gameStarted && !gameOver && (
        <div className="mb-6 rounded-lg bg-gray-50 p-4 text-center dark:bg-gray-800">
          <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
            {t('games.numberStack.nextBlock')}
          </p>
          <div className="flex justify-center">
            <div
              className={`flex h-16 w-16 items-center justify-center rounded-lg font-bold text-white ${getBlockColor(
                nextBlock.value,
              )}`}
              style={{
                fontSize: cellSize > 50 ? '24px' : '20px',
              }}
            >
              {nextBlock.value}
            </div>
          </div>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            {t('games.numberStack.willPlaceInColumn').replace('{col}', String(nextBlock.col + 1))}
          </p>
        </div>
      )}

      {/* 游戏状态提示 */}
      {!gameStarted && !gameOver && (
        <div className="mb-6 rounded-lg bg-blue-50 p-4 text-center dark:bg-blue-900">
          <p className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
            {t('games.numberStack.ready')}
          </p>
          <p className="text-gray-600 dark:text-gray-400">{t('games.numberStack.pressToStart')}</p>
        </div>
      )}

      {gameOver && (
        <div className="mb-6 rounded-lg bg-red-50 p-4 text-center dark:bg-red-900">
          <p className="mb-2 text-2xl font-bold text-red-600 dark:text-red-400">
            {t('games.numberStack.gameOver')}
          </p>
          <p className="mb-3 text-gray-600 dark:text-gray-400">
            {t('games.numberStack.finalScore').replace('{score}', String(score))}
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            {t('games.numberStack.pressToRestart')}
          </p>
        </div>
      )}

      {gameStarted && !gameOver && (
        <div className="mb-6 rounded-lg bg-green-50 p-4 text-center dark:bg-green-900">
          <p className="text-lg font-semibold text-green-600 dark:text-green-400">
            {t('games.numberStack.playing')}
          </p>
        </div>
      )}

      {/* 控制按钮（移动端） */}
      <div className="mb-6">
        <p className="mb-3 text-center text-sm text-gray-600 dark:text-gray-400">
          {t('games.numberStack.tapToPlace')}
        </p>
        <div className="grid grid-cols-3 gap-2">
          {Array.from({ length: 3 }).map((_, col) => (
            <button
              key={col}
              onClick={() => placeBlock(col)}
              disabled={!gameStarted || gameOver}
              className={`transform rounded-lg px-3 py-4 font-bold text-white transition-all active:scale-95 ${
                gameStarted && !gameOver
                  ? 'cursor-pointer bg-blue-500 hover:bg-blue-600'
                  : 'cursor-not-allowed bg-gray-400 opacity-50'
              }`}
            >
              {t('games.numberStack.column').replace('{num}', String(col + 1))}
            </button>
          ))}
        </div>
      </div>

      {/* 游戏规则 */}
      <div className="rounded-lg bg-gray-50 p-6 dark:bg-gray-800">
        <h3 className="mb-3 text-lg font-bold text-gray-900 dark:text-white">
          📖 {t('games.numberStack.rules')}
        </h3>
        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li>{t('games.numberStack.rule1')}</li>
          <li>{t('games.numberStack.rule2')}</li>
          <li>{t('games.numberStack.rule3')}</li>
          <li>{t('games.numberStack.rule4')}</li>
          <li>{t('games.numberStack.rule5')}</li>
          <li>{t('games.numberStack.rule6')}</li>
        </ul>
      </div>

      {/* 重置按钮 */}
      <div className="mt-6 text-center">
        <button
          onClick={resetGame}
          className="rounded-lg bg-gray-500 px-6 py-2 font-bold text-white transition-colors hover:bg-gray-600"
        >
          {t('games.numberStack.reset')}
        </button>
      </div>
    </div>
  )
}
