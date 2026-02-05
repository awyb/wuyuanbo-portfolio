'use client'
import React, { useState, useEffect, useCallback } from 'react'

type Cell = { value: number; initial: boolean; error: boolean }
type Board = Cell[][]

// 生成完整的数独解
const generateSolvedBoard = (): number[][] => {
  const board = Array(9)
    .fill(0)
    .map(() => Array(9).fill(0))

  const isValid = (board: number[][], row: number, col: number, num: number): boolean => {
    for (let x = 0; x < 9; x++) {
      if (board[row][x] === num || board[x][col] === num) return false
    }
    const startRow = Math.floor(row / 3) * 3
    const startCol = Math.floor(col / 3) * 3
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[startRow + i][startCol + j] === num) return false
      }
    }
    return true
  }

  const solve = (board: number[][]): boolean => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === 0) {
          const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5)
          for (const num of nums) {
            if (isValid(board, row, col, num)) {
              board[row][col] = num
              if (solve(board)) return true
              board[row][col] = 0
            }
          }
          return false
        }
      }
    }
    return true
  }

  solve(board)
  return board
}

// 根据难度移除数字
const createPuzzle = (solved: number[][], difficulty: number): Board => {
  const puzzle = solved.map(row =>
    row.map(value => ({
      value,
      initial: true,
      error: false,
    })),
  )

  const removeCount = difficulty
  const positions = []
  for (let i = 0; i < 81; i++) positions.push(i)
  positions.sort(() => Math.random() - 0.5)

  for (const pos of positions.slice(0, removeCount)) {
    const row = Math.floor(pos / 9)
    const col = pos % 9
    puzzle[row][col].value = 0
    puzzle[row][col].initial = false
  }

  return puzzle
}

// 检查是否完成
const checkCompletion = (board: Board): boolean => {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col].value === 0) return false
    }
  }
  return true
}

// 验证整个棋盘
const validateBoard = (board: Board): Board => {
  const newBoard = board.map(row => row.map(cell => ({ ...cell, error: false })))

  // 检查行
  for (let row = 0; row < 9; row++) {
    const seen = new Set<number>()
    for (let col = 0; col < 9; col++) {
      const val = board[row][col].value
      if (val !== 0) {
        if (seen.has(val)) {
          for (let c = 0; c < 9; c++) {
            if (board[row][c].value === val) {
              newBoard[row][c].error = true
            }
          }
        }
        seen.add(val)
      }
    }
  }

  // 检查列
  for (let col = 0; col < 9; col++) {
    const seen = new Set<number>()
    for (let row = 0; row < 9; row++) {
      const val = board[row][col].value
      if (val !== 0) {
        if (seen.has(val)) {
          for (let r = 0; r < 9; r++) {
            if (board[r][col].value === val) {
              newBoard[r][col].error = true
            }
          }
        }
        seen.add(val)
      }
    }
  }

  // 检查3x3宫
  for (let boxRow = 0; boxRow < 3; boxRow++) {
    for (let boxCol = 0; boxCol < 3; boxCol++) {
      const seen = new Set<number>()
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          const row = boxRow * 3 + i
          const col = boxCol * 3 + j
          const val = board[row][col].value
          if (val !== 0) {
            if (seen.has(val)) {
              for (let bi = 0; bi < 3; bi++) {
                for (let bj = 0; bj < 3; bj++) {
                  const r = boxRow * 3 + bi
                  const c = boxCol * 3 + bj
                  if (board[r][c].value === val) {
                    newBoard[r][c].error = true
                  }
                }
              }
            }
            seen.add(val)
          }
        }
      }
    }
  }

  return newBoard
}

export default function Sudoku() {
  const [board, setBoard] = useState<Board>([])
  const [solvedBoard, setSolvedBoard] = useState<number[][]>([])
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null)
  const [difficulty, setDifficulty] = useState<number>(40)
  const [timer, setTimer] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [mistakes, setMistakes] = useState(0)

  // 初始化游戏
  const initGame = useCallback(
    (diff?: number) => {
      const solved = generateSolvedBoard()
      setSolvedBoard(solved)
      const puzzle = createPuzzle(solved, diff || difficulty)
      setBoard(puzzle)
      setSelectedCell(null)
      setTimer(0)
      setIsRunning(true)
      setIsCompleted(false)
      setMistakes(0)
    },
    [difficulty],
  )

  // 开始新游戏
  const startNewGame = (diff: number) => {
    setDifficulty(diff)
    initGame(diff)
  }

  // 处理单元格点击
  const handleCellClick = (row: number, col: number) => {
    if (!board[row][col].initial && !isCompleted) {
      setSelectedCell({ row, col })
    }
  }

  // 处理数字输入
  const handleNumberInput = (num: number) => {
    if (selectedCell && !isCompleted) {
      const { row, col } = selectedCell
      const newBoard = board.map(r => [...r])
      newBoard[row][col] = {
        value: num,
        initial: false,
        error: false,
      }

      // 检查是否正确
      if (num !== 0 && num !== solvedBoard[row][col]) {
        newBoard[row][col].error = true
        setMistakes(mistakes + 1)
      }

      setBoard(newBoard)

      // 验证并检查完成
      const validated = validateBoard(newBoard)
      setBoard(validated)

      if (checkCompletion(validated)) {
        setIsRunning(false)
        setIsCompleted(true)
      }
    }
  }

  // 使用键盘输入
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (selectedCell && !isCompleted) {
        const num = parseInt(e.key)
        if (!isNaN(num) && num >= 1 && num <= 9) {
          handleNumberInput(num)
        } else if (e.key === 'Backspace' || e.key === 'Delete' || e.key === '0') {
          handleNumberInput(0)
        }
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [selectedCell, board, isCompleted])

  // 计时器
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRunning) {
      interval = setInterval(() => {
        setTimer(timer + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isRunning, timer])

  // 初始化
  useEffect(() => {
    initGame()
  }, [])

  // 格式化时间
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // 获取难度名称
  const getDifficultyName = (): string => {
    if (difficulty <= 30) return '简单'
    if (difficulty <= 45) return '中等'
    return '困难'
  }

  return (
    <div className="mx-auto max-w-4xl">
      {/* 标题 */}
      <div className="mb-6 text-center">
        <h1 className="bg-linear-to-r mb-2 from-blue-600 to-indigo-600 bg-clip-text text-4xl font-black text-transparent">
          🔢 数独游戏
        </h1>
        <p className="text-gray-600 dark:text-gray-400">经典的逻辑推理游戏，锻炼你的思维能力</p>
      </div>

      {/* 游戏控制面板 */}
      <div className="mb-6 rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-4">
            <div className="rounded-lg bg-blue-50 px-4 py-2 dark:bg-blue-900/30">
              <div className="text-xs text-gray-600 dark:text-gray-400">时间</div>
              <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                {formatTime(timer)}
              </div>
            </div>
            <div className="rounded-lg bg-purple-50 px-4 py-2 dark:bg-purple-900/30">
              <div className="text-xs text-gray-600 dark:text-gray-400">难度</div>
              <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                {getDifficultyName()}
              </div>
            </div>
            <div className="rounded-lg bg-red-50 px-4 py-2 dark:bg-red-900/30">
              <div className="text-xs text-gray-600 dark:text-gray-400">错误</div>
              <div className="text-lg font-bold text-red-600 dark:text-red-400">{mistakes}/3</div>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => startNewGame(30)}
              className="rounded-lg bg-green-500 px-4 py-2 font-bold text-white transition-all hover:bg-green-600"
            >
              简单
            </button>
            <button
              onClick={() => startNewGame(40)}
              className="rounded-lg bg-yellow-500 px-4 py-2 font-bold text-white transition-all hover:bg-yellow-600"
            >
              中等
            </button>
            <button
              onClick={() => startNewGame(50)}
              className="rounded-lg bg-red-500 px-4 py-2 font-bold text-white transition-all hover:bg-red-600"
            >
              困难
            </button>
          </div>
        </div>

        {mistakes >= 3 && !isCompleted && (
          <div className="rounded-lg bg-red-100 p-3 text-center text-red-700 dark:bg-red-900/30 dark:text-red-400">
            ⚠️ 错误次数过多！建议重新开始或使用提示
          </div>
        )}

        {isCompleted && (
          <div className="rounded-lg bg-green-100 p-3 text-center text-green-700 dark:bg-green-900/30 dark:text-green-400">
            🎉 恭喜完成！用时 {formatTime(timer)}，错误 {mistakes} 次
          </div>
        )}
      </div>

      {/* 数独棋盘 */}
      <div className="mb-6 overflow-x-auto">
        <div className="mx-auto inline-block min-w-full">
          <div className="inline-block rounded-xl bg-white p-4 shadow-xl dark:bg-gray-800">
            <div className="grid grid-cols-9 gap-1">
              {board.map((row, rowIndex) =>
                row.map((cell, colIndex) => {
                  const isSelected =
                    selectedCell?.row === rowIndex && selectedCell?.col === colIndex
                  const isRelated =
                    selectedCell &&
                    (selectedCell.row === rowIndex ||
                      selectedCell.col === colIndex ||
                      (Math.floor(selectedCell.row / 3) === Math.floor(rowIndex / 3) &&
                        Math.floor(selectedCell.col / 3) === Math.floor(colIndex / 3)))

                  // 计算单元格边框样式
                  const borderClasses = []
                  if (colIndex % 3 === 0 && colIndex !== 0) {
                    borderClasses.push('border-l-2')
                  }
                  if (rowIndex % 3 === 0 && rowIndex !== 0) {
                    borderClasses.push('border-t-2')
                  }

                  return (
                    <button
                      key={`${rowIndex}-${colIndex}`}
                      onClick={() => handleCellClick(rowIndex, colIndex)}
                      disabled={cell.initial || isCompleted}
                      className={`flex aspect-square items-center justify-center rounded-lg border-2 border-gray-200 font-bold transition-all duration-200 dark:border-gray-700 ${cell.initial ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white' : ''} ${!cell.initial && !isCompleted ? 'bg-white hover:bg-blue-50 dark:bg-gray-800 dark:hover:bg-gray-700' : ''} ${isSelected ? 'ring-4 ring-blue-500' : ''} ${isRelated && !isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : ''} ${cell.error ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' : ''} ${!cell.initial && cell.value !== 0 && !cell.error ? 'text-blue-600 dark:text-blue-400' : ''} ${borderClasses.join(' ')} text-xl sm:text-2xl`}
                    >
                      {cell.value !== 0 ? cell.value : ''}
                    </button>
                  )
                }),
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 数字输入面板 */}
      <div className="mb-6 rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
        <h3 className="mb-4 text-center text-lg font-bold text-gray-900 dark:text-white">
          选择数字
        </h3>
        <div className="grid grid-cols-5 gap-2 sm:grid-cols-10">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
            <button
              key={num}
              onClick={() => handleNumberInput(num)}
              disabled={!selectedCell || isCompleted}
              className="bg-linear-to-br rounded-lg from-blue-500 to-indigo-500 px-4 py-3 text-xl font-bold text-white shadow-md transition-all hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:hover:scale-100"
            >
              {num}
            </button>
          ))}
          <button
            onClick={() => handleNumberInput(0)}
            disabled={!selectedCell || isCompleted}
            className="bg-linear-to-br rounded-lg from-gray-500 to-gray-600 px-4 py-3 text-lg font-bold text-white shadow-md transition-all hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:hover:scale-100"
          >
            清除
          </button>
        </div>
      </div>

      {/* 游戏说明 */}
      <div className="rounded-xl bg-gray-50 p-6 shadow-md dark:bg-gray-800">
        <h3 className="mb-3 text-lg font-bold text-gray-900 dark:text-white">📖 游戏规则</h3>
        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <p>• 在每个9×9的格子中，填入1-9的数字</p>
          <p>• 每行、每列、每个3×3宫格内的数字不能重复</p>
          <p>• 点击空白格子，然后选择数字填入</p>
          <p>• 可以使用键盘数字键或点击数字按钮输入</p>
          <p>• 错误的数字会以红色显示，错误超过3次建议重新开始</p>
          <p>• 黑色数字是初始数字，不可修改</p>
        </div>
      </div>
    </div>
  )
}
