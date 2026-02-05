'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

const GRID_SIZE = 4

type Direction = 'up' | 'down' | 'left' | 'right'

interface GameState {
  grid: number[][]
  score: number
  gameOver: boolean
  gameWon: boolean
}

const Game2048: React.FC = () => {
  const { t } = useLanguage()
  const [gameState, setGameState] = useState<GameState>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('game2048')
      if (saved) {
        return JSON.parse(saved)
      }
    }
    return {
      grid: Array(GRID_SIZE)
        .fill(null)
        .map(() => Array(GRID_SIZE).fill(0)),
      score: 0,
      gameOver: false,
      gameWon: false,
    }
  })
  const [gameStarted, setGameStarted] = useState(false)
  const [bestScore, setBestScore] = useState(() => {
    if (typeof window !== 'undefined') {
      return parseInt(localStorage.getItem('game2048-best') || '0')
    }
    return 0
  })

  // 保存游戏状态到localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && gameStarted) {
      localStorage.setItem('game2048', JSON.stringify(gameState))
    }
  }, [gameState, gameStarted])

  // 保存最高分
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('game2048-best', bestScore.toString())
    }
  }, [bestScore])

  // 在空白位置随机添加一个数字
  const addRandomTile = useCallback((grid: number[][]): number[][] => {
    const newGrid = grid.map(row => [...row])
    const emptyCells: [number, number][] = []
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        if (newGrid[y][x] === 0) {
          emptyCells.push([y, x])
        }
      }
    }

    if (emptyCells.length > 0) {
      const [y, x] = emptyCells[Math.floor(Math.random() * emptyCells.length)]
      newGrid[y][x] = Math.random() < 0.9 ? 2 : 4
    }
    return newGrid
  }, [])

  // 初始化游戏
  const initGame = useCallback(() => {
    let newGrid = Array(GRID_SIZE)
      .fill(null)
      .map(() => Array(GRID_SIZE).fill(0))
    newGrid = addRandomTile(newGrid)
    newGrid = addRandomTile(newGrid)
    setGameState({
      grid: newGrid,
      score: 0,
      gameOver: false,
      gameWon: false,
    })
    setGameStarted(true)
  }, [addRandomTile])

  // 检查游戏是否结束
  const checkGameOver = useCallback((grid: number[][]): boolean => {
    // 检查是否有空白格
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        if (grid[y][x] === 0) return false
      }
    }

    // 检查是否可以合并
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const current = grid[y][x]
        if (
          (y < GRID_SIZE - 1 && grid[y + 1][x] === current) ||
          (x < GRID_SIZE - 1 && grid[y][x + 1] === current)
        ) {
          return false
        }
      }
    }

    return true
  }, [])

  // 向左移动一行
  const slideRowLeft = (row: number[]): { newRow: number[]; score: number } => {
    // 移除0
    const filtered = row.filter(val => val !== 0)
    let score = 0

    // 合并
    for (let i = 0; i < filtered.length - 1; i++) {
      if (filtered[i] === filtered[i + 1]) {
        filtered[i] *= 2
        score += filtered[i]
        filtered.splice(i + 1, 1)
      }
    }

    // 填充0
    while (filtered.length < GRID_SIZE) {
      filtered.push(0)
    }

    return { newRow: filtered, score }
  }

  // 移动和合并
  const move = useCallback(
    (direction: Direction): boolean => {
      if (!gameStarted || gameState.gameOver) return false

      const grid = gameState.grid
      let moved = false
      let scoreGain = 0
      let newGrid: number[][]

      // 根据方向处理
      switch (direction) {
        case 'left': {
          newGrid = grid.map(row => {
            const { newRow, score } = slideRowLeft(row)
            scoreGain += score
            return newRow
          })
          break
        }
        case 'right': {
          newGrid = grid.map(row => {
            const reversed = [...row].reverse()
            const { newRow, score } = slideRowLeft(reversed)
            scoreGain += score
            return newRow.reverse()
          })
          break
        }
        case 'up': {
          newGrid = Array(GRID_SIZE)
            .fill(null)
            .map(() => Array(GRID_SIZE).fill(0))

          for (let x = 0; x < GRID_SIZE; x++) {
            const col = grid.map(row => row[x])
            const { newRow, score } = slideRowLeft(col)
            scoreGain += score
            for (let y = 0; y < GRID_SIZE; y++) {
              newGrid[y][x] = newRow[y]
            }
          }
          break
        }
        case 'down': {
          newGrid = Array(GRID_SIZE)
            .fill(null)
            .map(() => Array(GRID_SIZE).fill(0))

          for (let x = 0; x < GRID_SIZE; x++) {
            const col = grid.map(row => row[x]).reverse()
            const { newRow, score } = slideRowLeft(col)
            scoreGain += score
            const reversed = newRow.reverse()
            for (let y = 0; y < GRID_SIZE; y++) {
              newGrid[y][x] = reversed[y]
            }
          }
          break
        }
        default:
          newGrid = grid.map(row => [...row])
      }

      // 检查是否有移动
      for (let y = 0; y < GRID_SIZE; y++) {
        for (let x = 0; x < GRID_SIZE; x++) {
          if (newGrid[y][x] !== grid[y][x]) {
            moved = true
            break
          }
        }
        if (moved) break
      }

      if (moved) {
        const gridWithNewTile = addRandomTile(newGrid)
        const gameOver = checkGameOver(gridWithNewTile)
        const gameWon = gridWithNewTile.some((row: number[]) => row.includes(2048))

        setGameState({
          grid: gridWithNewTile,
          score: gameState.score + scoreGain,
          gameOver,
          gameWon,
        })

        if (gameState.score + scoreGain > bestScore) {
          setBestScore(gameState.score + scoreGain)
        }
      }

      return moved
    },
    [gameStarted, gameState, bestScore, checkGameOver, addRandomTile],
  )

  // 处理键盘事件
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!gameStarted || gameState.gameOver) return

      const keyMap: Record<string, Direction> = {
        ArrowLeft: 'left',
        ArrowRight: 'right',
        ArrowUp: 'up',
        ArrowDown: 'down',
        a: 'left',
        d: 'right',
        w: 'up',
        s: 'down',
        A: 'left',
        D: 'right',
        W: 'up',
        S: 'down',
      }

      if (keyMap[event.key]) {
        event.preventDefault()
        move(keyMap[event.key])
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [gameStarted, gameState.gameOver, move])

  // 获取数字的样式
  const getTileStyle = useMemo(() => {
    return (value: number): { bg: string; text: string; shadow: string } => {
      const styles: Record<number, { bg: string; text: string; shadow: string }> = {
        0: {
          bg: 'bg-[#cdc1b4] dark:bg-[#443f38]',
          text: 'text-transparent',
          shadow: '',
        },
        2: {
          bg: 'bg-[#eee4da] dark:bg-[#3d3a34]',
          text: 'text-[#776e65] dark:text-[#f9f6f2]',
          shadow: 'shadow-md',
        },
        4: {
          bg: 'bg-[#ede0c8] dark:bg-[#4a4540]',
          text: 'text-[#776e65] dark:text-[#f9f6f2]',
          shadow: 'shadow-md',
        },
        8: {
          bg: 'bg-[#f2b179]',
          text: 'text-[#f9f6f2]',
          shadow: 'shadow-lg',
        },
        16: {
          bg: 'bg-[#f59563]',
          text: 'text-[#f9f6f2]',
          shadow: 'shadow-lg',
        },
        32: {
          bg: 'bg-[#f67c5f]',
          text: 'text-[#f9f6f2]',
          shadow: 'shadow-lg',
        },
        64: {
          bg: 'bg-[#f65e3b]',
          text: 'text-[#f9f6f2]',
          shadow: 'shadow-lg',
        },
        128: {
          bg: 'bg-[#edcf72]',
          text: 'text-[#f9f6f2]',
          shadow: 'shadow-xl',
        },
        256: {
          bg: 'bg-[#edcc61]',
          text: 'text-[#f9f6f2]',
          shadow: 'shadow-xl',
        },
        512: {
          bg: 'bg-[#edc850]',
          text: 'text-[#f9f6f2]',
          shadow: 'shadow-xl',
        },
        1024: {
          bg: 'bg-[#edc53f]',
          text: 'text-[#f9f6f2]',
          shadow: 'shadow-2xl',
        },
        2048: {
          bg: 'bg-[#edc22e]',
          text: 'text-[#f9f6f2]',
          shadow: 'shadow-2xl',
        },
      }
      return (
        styles[value] || {
          bg: 'bg-[#3c3a32]',
          text: 'text-[#f9f6f2]',
          shadow: 'shadow-2xl',
        }
      )
    }
  }, [])

  // 获取字体大小
  const getFontSize = (value: number): string => {
    if (value < 100) return 'text-4xl md:text-5xl'
    if (value < 1000) return 'text-3xl md:text-4xl'
    return 'text-2xl md:text-3xl'
  }

  return (
    <div className="min-h-screen bg-[#faf8ef] p-4 dark:bg-[#1a1a1a]">
      <div className="mx-auto max-w-md">
        {/* 标题 */}
        <div className="mb-6 text-center">
          <h1 className="mb-2 text-5xl font-bold text-[#776e65] dark:text-[#f9f6f2]">2048</h1>
          <p className="text-sm text-[#776e65] dark:text-[#f9f6f2]">
            {t('games.game2048.subtitle')}
          </p>
        </div>

        {/* 分数面板 */}
        <div className="mb-6 flex justify-between gap-3">
          <div className="flex-1 rounded-xl bg-[#bbada0] px-4 py-3 dark:bg-[#5a4f45]">
            <div className="text-xs font-semibold text-[#eee4da] dark:text-[#cdc1b4]">
              {t('games.game2048.score')}
            </div>
            <div className="text-2xl font-bold text-white">{gameState.score}</div>
          </div>
          <div className="flex-1 rounded-xl bg-[#bbada0] px-4 py-3 dark:bg-[#5a4f45]">
            <div className="text-xs font-semibold text-[#eee4da] dark:text-[#cdc1b4]">
              {t('games.game2048.bestScore')}
            </div>
            <div className="text-2xl font-bold text-white">{bestScore}</div>
          </div>
        </div>

        {/* 游戏板 */}
        <div className="relative mb-6 rounded-xl bg-[#bbada0] p-3 dark:bg-[#5a4f45]">
          {/* 游戏结束遮罩 */}
          {gameState.gameOver && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-xl bg-[rgba(238,228,218,0.73)] dark:bg-[rgba(68,63,56,0.73)]">
              <p className="mb-4 text-4xl font-bold text-[#776e65] dark:text-[#f9f6f2]">
                {t('games.game2048.gameOver')}
              </p>
              <button
                onClick={initGame}
                className="rounded-xl bg-[#8f7a66] px-8 py-3 font-bold text-[#f9f6f2] hover:bg-[#9f8b77] dark:bg-[#6b5c51] dark:hover:bg-[#7b6c61]"
              >
                {t('games.game2048.tryAgain')}
              </button>
            </div>
          )}

          {/* 胜利遮罩 */}
          {gameState.gameWon && !gameState.gameOver && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-xl bg-[rgba(237,194,46,0.5)] dark:bg-[rgba(237,194,46,0.3)]">
              <p className="mb-4 text-4xl font-bold text-[#776e65] dark:text-[#f9f6f2]">
                {t('games.game2048.youWin')}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={initGame}
                  className="rounded-xl bg-[#8f7a66] px-6 py-3 font-bold text-[#f9f6f2] hover:bg-[#9f8b77] dark:bg-[#6b5c51] dark:hover:bg-[#7b6c61]"
                >
                  {t('games.game2048.newGame')}
                </button>
                <button
                  onClick={() => setGameState(prev => ({ ...prev, gameWon: false }))}
                  className="rounded-xl bg-[#8f7a66] px-6 py-3 font-bold text-[#f9f6f2] hover:bg-[#9f8b77] dark:bg-[#6b5c51] dark:hover:bg-[#7b6c61]"
                >
                  {t('games.game2048.continue')}
                </button>
              </div>
            </div>
          )}

          {/* 网格 */}
          <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}>
            {gameState.grid.map((row, y) =>
              row.map((value, x) => {
                const style = getTileStyle(value)
                return (
                  <div
                    key={`${y}-${x}`}
                    className={`flex aspect-square items-center justify-center rounded-xl font-bold transition-all duration-150 ${style.bg} ${style.text} ${style.shadow} ${getFontSize(value)}`}
                  >
                    {value || ''}
                  </div>
                )
              }),
            )}
          </div>
        </div>

        {/* 控制按钮 */}
        <div className="mb-6 flex justify-center">
          {!gameStarted ? (
            <button
              onClick={initGame}
              className="rounded-xl bg-[#8f7a66] px-10 py-4 text-lg font-bold text-[#f9f6f2] shadow-lg transition-all hover:bg-[#9f8b77] dark:bg-[#6b5c51] dark:hover:bg-[#7b6c61]"
            >
              {t('games.game2048.startGame')}
            </button>
          ) : (
            <button
              onClick={initGame}
              className="rounded-xl bg-[#8f7a66] px-10 py-4 text-lg font-bold text-[#f9f6f2] shadow-lg transition-all hover:bg-[#9f8b77] dark:bg-[#6b5c51] dark:hover:bg-[#7b6c61]"
            >
              {t('games.game2048.newGame')}
            </button>
          )}
        </div>

        {/* 移动端控制按钮 */}
        <div className="mb-6" style={{ touchAction: 'manipulation' }}>
          <div className="flex flex-col items-center gap-3">
            <button
              onClick={() => move('up')}
              onTouchStart={e => {
                e.preventDefault()
                move('up')
              }}
              className="flex h-16 w-16 select-none items-center justify-center rounded-2xl bg-[#8f7a66] text-3xl font-bold text-[#f9f6f2] shadow-xl transition-all active:scale-95 active:bg-[#9f8b77] dark:bg-[#6b5c51] dark:active:bg-[#7b6c61]"
            >
              ↑
            </button>
            <div className="flex items-center gap-3">
              <button
                onClick={() => move('left')}
                onTouchStart={e => {
                  e.preventDefault()
                  move('left')
                }}
                className="flex h-16 w-16 select-none items-center justify-center rounded-2xl bg-[#8f7a66] text-3xl font-bold text-[#f9f6f2] shadow-xl transition-all active:scale-95 active:bg-[#9f8b77] dark:bg-[#6b5c51] dark:active:bg-[#7b6c61]"
              >
                ←
              </button>
              <button
                onClick={() => move('down')}
                onTouchStart={e => {
                  e.preventDefault()
                  move('down')
                }}
                className="flex h-16 w-16 select-none items-center justify-center rounded-2xl bg-[#8f7a66] text-3xl font-bold text-[#f9f6f2] shadow-xl transition-all active:scale-95 active:bg-[#9f8b77] dark:bg-[#6b5c51] dark:active:bg-[#7b6c61]"
              >
                ↓
              </button>
              <button
                onClick={() => move('right')}
                onTouchStart={e => {
                  e.preventDefault()
                  move('right')
                }}
                className="flex h-16 w-16 select-none items-center justify-center rounded-2xl bg-[#8f7a66] text-3xl font-bold text-[#f9f6f2] shadow-xl transition-all active:scale-95 active:bg-[#9f8b77] dark:bg-[#6b5c51] dark:active:bg-[#7b6c61]"
              >
                →
              </button>
            </div>
          </div>
        </div>

        {/* 操作说明 */}
        <div className="rounded-xl bg-[#eee4da] p-5 dark:bg-[#3d3a34]">
          <h3 className="mb-3 text-lg font-bold text-[#776e65] dark:text-[#f9f6f2]">
            {t('games.game2048.howToPlay')}
          </h3>
          <ul className="space-y-2 text-sm text-[#776e65] dark:text-[#cdc1b4]">
            <li>• {t('games.game2048.rule1')}</li>
            <li>• {t('games.game2048.rule2')}</li>
            <li>• {t('games.game2048.rule3')}</li>
          </ul>
          <div className="mt-4 rounded-lg bg-[#cdc1b4] p-3 dark:bg-[#443f38]">
            <p className="text-center text-sm font-semibold text-[#776e65] dark:text-[#f9f6f2]">
              {t('games.game2048.controls')}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Game2048
