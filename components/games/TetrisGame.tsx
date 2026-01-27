'use client'

import React, { useState, useEffect, useCallback } from 'react'

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
    setCurrentPiece({ ...currentPiece, position: newPosition })
    lockPiece() // 锁定方块
  }, [currentPiece, gameOver, checkCollision, lockPiece])

  // 处理键盘事件
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!gameStarted || gameOver) return

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
        <h3 className="mb-2 text-lg font-bold text-white">Next Piece</h3>
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
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-900 p-4">
      <h1 className="mb-4 text-4xl font-bold text-white">Tetris</h1>
      <div className="flex items-center justify-center gap-8">
        {/* 游戏区域 */}
        <div className="rounded-lg bg-black p-2 shadow-lg">{renderBoard()}</div>

        {/* 侧边栏 - 下一个方块和分数 */}
        <div className="flex flex-col gap-4">
          {renderNextPiece()}
          <div className="rounded-lg bg-gray-800 p-4">
            <h3 className="mb-2 text-lg font-bold text-white">Score</h3>
            <p className="text-2xl text-white">{score}</p>
          </div>
          <button
            onClick={initGame}
            className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
          >
            {gameOver ? 'Restart Game' : gameStarted ? 'Restart' : 'Start Game'}
          </button>
          {gameOver && <p className="text-xl font-bold text-red-500">Game Over!</p>}
        </div>
      </div>

      {/* 操作说明 */}
      <div className="mt-8 text-center text-white">
        <p>
          <span className="font-mono">←</span> <span className="font-mono">→</span> /{' '}
          <span className="font-mono">A</span> <span className="font-mono">D</span> : Move |{' '}
          <span className="font-mono">↓</span> / <span className="font-mono">S</span> : Soft Drop |{' '}
          <span className="font-mono">↑</span> / <span className="font-mono">W</span> : Rotate |{' '}
          <span className="font-mono">Space</span> : Hard Drop
        </p>
      </div>
    </div>
  )
}

export default TetrisGame
