'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

// 定义方块的形状和颜色
const SHAPES = [
  // I
  [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  // J
  [
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  // L
  [
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 0],
  ],
  // O
  [
    [1, 1],
    [1, 1],
  ],
  // S
  [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0],
  ],
  // T
  [
    [0, 1, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  // Z
  [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0],
  ],
]

const COLORS = [
  'bg-cyan-500', // I
  'bg-blue-500', // J
  'bg-orange-500', // L
  'bg-yellow-500', // O
  'bg-green-500', // S
  'bg-purple-500', // T
  'bg-red-500', // Z
]

const BOARD_WIDTH = 10
const BOARD_HEIGHT = 20

interface Position {
  x: number
  y: number
}

interface Tetromino {
  shape: number[][]
  color: string
  position: Position
}

const TetrisGame: React.FC = () => {
  const { t } = useLanguage()
  const [board, setBoard] = useState<(string | null)[][]>(
    Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(null)),
  )
  const [currentPiece, setCurrentPiece] = useState<Tetromino | null>(null)
  const [nextPiece, setNextPiece] = useState<Tetromino | null>(null)
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameSpeed, setGameSpeed] = useState(1000) // ms per drop

  // 创建一个新的方块
  const createPiece = useCallback((): Tetromino => {
    const typeId = Math.floor(Math.random() * SHAPES.length)
    return {
      shape: SHAPES[typeId],
      color: COLORS[typeId],
      position: { x: Math.floor(BOARD_WIDTH / 2) - Math.floor(SHAPES[typeId][0].length / 2), y: 0 },
    }
  }, [])

  // 初始化游戏
  const initGame = useCallback(() => {
    const newBoard = Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(null))
    setBoard(newBoard)
    const firstPiece = createPiece()
    const secondPiece = createPiece()
    setCurrentPiece(firstPiece)
    setNextPiece(secondPiece)
    setScore(0)
    setGameOver(false)
    setGameStarted(true)
    setGameSpeed(1000)
  }, [createPiece])

  // 检查碰撞
  const checkCollision = useCallback(
    (piece: Tetromino, position: Position = piece.position): boolean => {
      for (let y = 0; y < piece.shape.length; y++) {
        for (let x = 0; x < piece.shape[y].length; x++) {
          // 检查是否是方块的一部分
          if (piece.shape[y][x] !== 0) {
            const boardX = position.x + x
            const boardY = position.y + y

            // 检查是否超出边界
            if (boardX < 0 || boardX >= BOARD_WIDTH || boardY >= BOARD_HEIGHT) {
              return true
            }

            // 检查是否与已有方块重叠
            if (boardY >= 0 && board[boardY][boardX] !== null) {
              return true
            }
          }
        }
      }
      return false
    },
    [board],
  )

  // 旋转方块
  const rotatePiece = useCallback(() => {
    if (!currentPiece || gameOver) return

    const rotatedShape = currentPiece.shape[0].map((_, index) =>
      currentPiece.shape.map(row => row[index]).reverse(),
    )

    const rotatedPiece = {
      ...currentPiece,
      shape: rotatedShape,
    }

    if (!checkCollision(rotatedPiece)) {
      setCurrentPiece(rotatedPiece)
    }
  }, [currentPiece, gameOver, checkCollision])

  // 移动方块
  const movePiece = useCallback(
    (direction: 'left' | 'right' | 'down') => {
      if (!currentPiece || gameOver) return

      const newPosition = { ...currentPiece.position }
      switch (direction) {
        case 'left':
          newPosition.x -= 1
          break
        case 'right':
          newPosition.x += 1
          break
        case 'down':
          newPosition.y += 1
          break
      }

      if (!checkCollision(currentPiece, newPosition)) {
        setCurrentPiece({ ...currentPiece, position: newPosition })
      } else if (direction === 'down') {
        // 如果向下移动发生碰撞，则固定方块
        lockPiece()
      }
    },
    [currentPiece, gameOver, checkCollision],
  )

  // 固定方块到游戏板
  const lockPiece = useCallback(() => {
    if (!currentPiece) return

    const newBoard = [...board]
    let pieceLocked = false

    for (let y = 0; y < currentPiece.shape.length; y++) {
      for (let x = 0; x < currentPiece.shape[y].length; x++) {
        if (currentPiece.shape[y][x] !== 0) {
          const boardY = currentPiece.position.y + y
          const boardX = currentPiece.position.x + x

          if (boardY >= 0) {
            newBoard[boardY][boardX] = currentPiece.color
          } else {
            // 如果新方块出现在游戏区域顶部之上，则游戏结束
            setGameOver(true)
            setGameStarted(false)
            pieceLocked = true
            break
          }
        }
      }
      if (pieceLocked) break
    }

    if (!pieceLocked) {
      setBoard(newBoard)
      clearLines()
      spawnNewPiece()
    }
  }, [currentPiece, board])

  // 生成新方块
  const spawnNewPiece = useCallback(() => {
    if (nextPiece) {
      setCurrentPiece(nextPiece)
      const newNextPiece = createPiece()
      setNextPiece(newNextPiece)

      if (checkCollision(nextPiece)) {
        setGameOver(true)
        setGameStarted(false)
      }
    } else {
      // 如果没有下一个方块（例如游戏刚开始），创建两个
      const newPiece = createPiece()
      const newNextPiece = createPiece()
      setCurrentPiece(newPiece)
      setNextPiece(newNextPiece)
    }
  }, [nextPiece, createPiece, checkCollision])

  // 清除完整的行
  const clearLines = useCallback(() => {
    let linesCleared = 0
    const newBoard = [...board]

    for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
      if (newBoard[y].every(cell => cell !== null)) {
        newBoard.splice(y, 1)
        newBoard.unshift(Array(BOARD_WIDTH).fill(null))
        linesCleared++
        y++ // 重新检查当前行，因为上方行下移了
      }
    }

    if (linesCleared > 0) {
      setBoard(newBoard)
      // 更新分数
      const points = [40, 100, 300, 1200] // 1, 2, 3, 4 lines
      setScore(prevScore => prevScore + points[linesCleared - 1] * (gameSpeed / 1000))
      // 每清除10行，速度增加
      if (
        score > 0 &&
        (score + points[linesCleared - 1] * (gameSpeed / 1000)) % 1000 <
          linesCleared * points[linesCleared - 1] * (gameSpeed / 1000)
      ) {
        setGameSpeed(prevSpeed => Math.max(100, prevSpeed - 50)) // 增加速度，最小100ms
      }
    }
  }, [board, gameSpeed, score])

  // 硬降（直接降到底部）
  const hardDrop = useCallback(() => {
    if (!currentPiece || gameOver) return

    const newPosition = { ...currentPiece.position }
    while (!checkCollision(currentPiece, { ...newPosition, y: newPosition.y + 1 })) {
      newPosition.y += 1
    }

    // 直接使用新位置锁定方块
    const newBoard = [...board]
    let pieceLocked = false

    for (let y = 0; y < currentPiece.shape.length; y++) {
      for (let x = 0; x < currentPiece.shape[y].length; x++) {
        if (currentPiece.shape[y][x] !== 0) {
          const boardY = newPosition.y + y
          const boardX = newPosition.x + x

          if (boardY >= 0) {
            newBoard[boardY][boardX] = currentPiece.color
          } else {
            // 如果新方块出现在游戏区域顶部之上，则游戏结束
            setGameOver(true)
            setGameStarted(false)
            pieceLocked = true
            break
          }
        }
      }
      if (pieceLocked) break
    }

    if (!pieceLocked) {
      setBoard(newBoard)
      // 清除行后生成新方块（这里不调用 clearLines，因为它会再次读取 board）
      let linesCleared = 0
      for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
        if (newBoard[y].every(cell => cell !== null)) {
          newBoard.splice(y, 1)
          newBoard.unshift(Array(BOARD_WIDTH).fill(null))
          linesCleared++
          y++
        }
      }

      if (linesCleared > 0) {
        const points = [40, 100, 300, 1200]
        setScore(prevScore => prevScore + points[linesCleared - 1] * (gameSpeed / 1000))
        if (
          score > 0 &&
          (score + points[linesCleared - 1] * (gameSpeed / 1000)) % 1000 <
            linesCleared * points[linesCleared - 1] * (gameSpeed / 1000)
        ) {
          setGameSpeed(prevSpeed => Math.max(100, prevSpeed - 50))
        }
      }

      // 生成新方块
      if (nextPiece) {
        setCurrentPiece(nextPiece)
        const newNextPiece = createPiece()
        setNextPiece(newNextPiece)

        if (checkCollision(nextPiece)) {
          setGameOver(true)
          setGameStarted(false)
        }
      }
    }
  }, [currentPiece, gameOver, checkCollision, board, nextPiece, createPiece, gameSpeed, score])

  // 处理键盘事件
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!gameStarted || gameOver) return

      // 阻止游戏控制键的默认行为（如空格滚动页面）
      const gameKeys = [
        'ArrowLeft',
        'ArrowRight',
        'ArrowDown',
        'ArrowUp',
        ' ',
        'a',
        'A',
        'd',
        'D',
        's',
        'S',
        'w',
        'W',
      ]
      if (gameKeys.includes(event.key)) {
        event.preventDefault()
      }

      switch (event.key) {
        case 'ArrowLeft':
        case 'a':
        case 'A':
          movePiece('left')
          break
        case 'ArrowRight':
        case 'd':
        case 'D':
          movePiece('right')
          break
        case 'ArrowDown':
        case 's':
        case 'S':
          movePiece('down')
          break
        case 'ArrowUp':
        case 'w':
        case 'W':
          rotatePiece()
          break
        case ' ':
          hardDrop()
          break
        default:
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [gameStarted, gameOver, movePiece, rotatePiece, hardDrop])

  // 游戏循环 - 自动下降
  useEffect(() => {
    if (!gameStarted || gameOver) return

    const gameInterval = setInterval(() => {
      movePiece('down')
    }, gameSpeed)

    return () => {
      clearInterval(gameInterval)
    }
  }, [gameStarted, gameOver, movePiece, gameSpeed])

  // 渲染游戏板
  const renderBoard = () => {
    const displayBoard = board.map(row => [...row])

    // 将当前方块绘制到显示板上
    if (currentPiece) {
      for (let y = 0; y < currentPiece.shape.length; y++) {
        for (let x = 0; x < currentPiece.shape[y].length; x++) {
          if (currentPiece.shape[y][x] !== 0) {
            const boardY = currentPiece.position.y + y
            const boardX = currentPiece.position.x + x
            if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
              displayBoard[boardY][boardX] = currentPiece.color
            }
          }
        }
      }
    }

    return displayBoard.map((row, yIndex) => (
      <div key={yIndex} className="flex">
        {row.map((cell, xIndex) => (
          <div
            key={`${yIndex}-${xIndex}`}
            className={`h-6 w-6 border border-gray-700 ${cell || 'bg-gray-900'}`}
          />
        ))}
      </div>
    ))
  }

  // 渲染下一个方块预览
  const renderNextPiece = () => {
    if (!nextPiece) return null

    return (
      <div className="rounded-lg bg-gray-800 p-4">
        <h3 className="mb-2 text-lg font-bold text-white">{t('games.tetris.nextPiece')}</h3>
        <div className="flex flex-col items-center">
          {nextPiece.shape.map((row, yIndex) => (
            <div key={yIndex} className="flex">
              {row.map((cell, xIndex) => (
                <div
                  key={`next-${yIndex}-${xIndex}`}
                  className={`m-px h-4 w-4 ${cell ? nextPiece.color : 'bg-transparent'}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 p-2 md:p-4">
      <div className="flex flex-col items-center">
        <h1 className="mb-2 text-2xl font-bold text-white md:mb-4 md:text-4xl">
          {t('games.tetris.title')}
        </h1>

        {/* 游戏主区域 */}
        <div className="flex w-full max-w-4xl flex-col items-center gap-4 md:flex-row md:justify-center md:gap-8">
          {/* 游戏区域 */}
          <div className="rounded-lg bg-black p-2 shadow-lg">{renderBoard()}</div>

          {/* 侧边栏 - 下一个方块和分数 */}
          <div className="flex w-full flex-col gap-3 md:w-auto md:gap-4">
            {renderNextPiece()}
            <div className="rounded-lg bg-gray-800 p-3 md:p-4">
              <h3 className="mb-1 text-sm font-bold text-white md:mb-2 md:text-lg">
                {t('games.tetris.score')}
              </h3>
              <p className="text-xl text-white md:text-2xl">{score}</p>
            </div>
            <button
              onClick={initGame}
              className="rounded bg-blue-500 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700 md:px-4 md:py-2"
            >
              {gameOver
                ? t('games.tetris.restart')
                : gameStarted
                  ? t('games.tetris.restart')
                  : t('games.tetris.startGame')}
            </button>
            {gameOver && (
              <p className="text-lg font-bold text-red-500 md:text-xl">
                {t('games.tetris.gameOver')}
              </p>
            )}
          </div>
        </div>

        {/* 移动端控制按钮 */}
        <div className="mt-4 w-full md:hidden" style={{ touchAction: 'manipulation' }}>
          <div className="flex flex-col items-center gap-2">
            {/* 旋转按钮 */}
            <button
              onClick={rotatePiece}
              onTouchStart={e => {
                e.preventDefault()
                rotatePiece()
              }}
              className="flex h-16 w-16 select-none items-center justify-center rounded-full bg-purple-600 text-3xl font-bold text-white shadow-lg active:scale-95 active:bg-purple-700"
            >
              ↻
            </button>

            {/* 方向按钮 */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => movePiece('left')}
                onTouchStart={e => {
                  e.preventDefault()
                  movePiece('left')
                }}
                className="flex h-16 w-16 select-none items-center justify-center rounded-full bg-blue-600 text-3xl font-bold text-white shadow-lg active:scale-95 active:bg-blue-700"
              >
                ←
              </button>
              <button
                onClick={() => movePiece('down')}
                onTouchStart={e => {
                  e.preventDefault()
                  movePiece('down')
                }}
                className="flex h-16 w-16 select-none items-center justify-center rounded-full bg-green-600 text-3xl font-bold text-white shadow-lg active:scale-95 active:bg-green-700"
              >
                ↓
              </button>
              <button
                onClick={() => movePiece('right')}
                onTouchStart={e => {
                  e.preventDefault()
                  movePiece('right')
                }}
                className="flex h-16 w-16 select-none items-center justify-center rounded-full bg-blue-600 text-3xl font-bold text-white shadow-lg active:scale-95 active:bg-blue-700"
              >
                →
              </button>
              <button
                onClick={hardDrop}
                onTouchStart={e => {
                  e.preventDefault()
                  hardDrop()
                }}
                className="flex h-16 w-20 select-none items-center justify-center rounded-full bg-red-600 text-lg font-bold text-white shadow-lg active:scale-95 active:bg-red-700"
              >
                硬降
              </button>
            </div>
          </div>
        </div>

        {/* 桌面端操作说明 */}
        <div className="mt-4 hidden text-center text-white md:block">
          <p>{t('games.tetris.controls')}</p>
        </div>
      </div>
    </div>
  )
}

export default TetrisGame
