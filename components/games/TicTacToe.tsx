'use client'
import React, { useState, useEffect } from 'react'

// --- 类型定义 ---
type Player = 'X' | 'O'
type Cell = Player | null
type GameStatus = 'IDLE' | 'PLAYING' | 'WIN' | 'DRAW'
type Difficulty = 'EASY' | 'MEDIUM' | 'HARD'

interface GameState {
  board: Cell[]
  currentPlayer: Player
  status: GameStatus
  winner: Player | null
  scores: { player: number; ai: number; draws: number }
}

// --- 游戏组件 ---
export default function TicTacToe() {
  // --- 游戏状态 ---
  const [gameState, setGameState] = useState<GameState>({
    board: Array(9).fill(null),
    currentPlayer: 'X',
    status: 'IDLE',
    winner: null,
    scores: { player: 0, ai: 0, draws: 0 },
  })

  const [difficulty, setDifficulty] = useState<Difficulty>('HARD')
  const [playerMark, setPlayerMark] = useState<Player>('X')
  const [winningLine, setWinningLine] = useState<number[]>([])
  const [aiThinking, setAiThinking] = useState(false)

  // --- 核心逻辑：获胜组合 ---
  const WINNING_COMBINATIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // 横向
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // 纵向
    [0, 4, 8],
    [2, 4, 6], // 对角线
  ]

  // --- 核心逻辑：检查获胜 ---
  const checkWinner = (board: Cell[]): Player | 'DRAW' | null => {
    for (const combination of WINNING_COMBINATIONS) {
      const [a, b, c] = combination
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a]
      }
    }
    if (board.every(cell => cell !== null)) {
      return 'DRAW'
    }
    return null
  }

  // --- 核心逻辑：获取获胜线 ---
  const getWinningLine = (board: Cell[]): number[] => {
    for (const combination of WINNING_COMBINATIONS) {
      const [a, b, c] = combination
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return combination
      }
    }
    return []
  }

  // --- AI 逻辑：获取可用位置 ---
  const getAvailableMoves = (board: Cell[]): number[] => {
    return board.map((cell, index) => (cell === null ? index : -1)).filter(index => index !== -1)
  }

  // --- AI 逻辑：Minimax 算法 ---
  const minimax = (
    board: Cell[],
    depth: number,
    isMaximizing: boolean,
    aiMark: Player,
    playerMark: Player,
  ): number => {
    const result = checkWinner(board)
    if (result === aiMark) return 10 - depth
    if (result === playerMark) return depth - 10
    if (result === 'DRAW') return 0

    if (isMaximizing) {
      let maxEval = -Infinity
      for (const move of getAvailableMoves(board)) {
        board[move] = aiMark
        const evalScore = minimax(board, depth + 1, false, aiMark, playerMark)
        board[move] = null
        maxEval = Math.max(maxEval, evalScore)
      }
      return maxEval
    } else {
      let minEval = Infinity
      for (const move of getAvailableMoves(board)) {
        board[move] = playerMark
        const evalScore = minimax(board, depth + 1, true, aiMark, playerMark)
        board[move] = null
        minEval = Math.min(minEval, evalScore)
      }
      return minEval
    }
  }

  // --- AI 逻辑：获取最佳移动 ---
  const getBestMove = (board: Cell[], aiMark: Player, playerMark: Player): number => {
    const moves = getAvailableMoves(board)

    // 简单难度：随机移动
    if (difficulty === 'EASY') {
      return moves[Math.floor(Math.random() * moves.length)]
    }

    // 中等难度：50% 随机，50% 最佳
    if (difficulty === 'MEDIUM' && Math.random() > 0.5) {
      return moves[Math.floor(Math.random() * moves.length)]
    }

    // 困难（或中等）：Minimax 算法
    let bestMove = moves[0]
    let bestValue = -Infinity

    for (const move of moves) {
      board[move] = aiMark
      const moveValue = minimax(board, 0, false, aiMark, playerMark)
      board[move] = null

      if (moveValue > bestValue) {
        bestValue = moveValue
        bestMove = move
      }
    }

    return bestMove
  }

  // --- AI 移动 ---
  useEffect(() => {
    if (gameState.status === 'PLAYING' && !aiThinking && gameState.currentPlayer !== playerMark) {
      setAiThinking(true)
      const aiMark: Player = playerMark === 'X' ? 'O' : 'X'
      setTimeout(() => {
        const boardCopy = [...gameState.board]
        const bestMove = getBestMove(boardCopy, aiMark, playerMark)
        makeMove(bestMove, aiMark)
        setAiThinking(false)
      }, 500)
    }
  }, [
    gameState.currentPlayer,
    gameState.status,
    gameState.board,
    aiThinking,
    playerMark,
    difficulty,
  ])

  // --- 核心逻辑：下棋 ---
  const makeMove = (index: number, player: Player) => {
    const newBoard = [...gameState.board]
    newBoard[index] = player

    const winner = checkWinner(newBoard)
    let newStatus: GameStatus = 'PLAYING'
    let newWinner: Player | null = null

    if (winner) {
      if (winner === 'DRAW') {
        newStatus = 'DRAW'
      } else {
        newStatus = 'WIN'
        newWinner = winner
      }
    }

    const newScores = { ...gameState.scores }
    if (newStatus === 'WIN') {
      if (winner === playerMark) {
        newScores.player++
      } else {
        newScores.ai++
      }
    } else if (newStatus === 'DRAW') {
      newScores.draws++
    }

    setWinningLine(getWinningLine(newBoard))
    setGameState({
      ...gameState,
      board: newBoard,
      currentPlayer: gameState.currentPlayer === 'X' ? 'O' : 'X',
      status: newStatus,
      winner: newWinner,
      scores: newScores,
    })
  }

  // --- 处理点击格子 ---
  const handleCellClick = (index: number) => {
    if (
      gameState.status !== 'PLAYING' ||
      gameState.board[index] !== null ||
      gameState.currentPlayer !== playerMark ||
      aiThinking
    ) {
      return
    }
    makeMove(index, playerMark)
  }

  // --- 开始游戏 ---
  const startGame = () => {
    setGameState({
      board: Array(9).fill(null),
      currentPlayer: 'X',
      status: 'PLAYING',
      winner: null,
      scores: gameState.scores,
    })
    setWinningLine([])
    setAiThinking(false)
  }

  // --- 重置分数 ---
  const resetScores = () => {
    setGameState({
      board: Array(9).fill(null),
      currentPlayer: 'X',
      status: 'IDLE',
      winner: null,
      scores: { player: 0, ai: 0, draws: 0 },
    })
    setWinningLine([])
    setAiThinking(false)
  }

  // --- 渲染格子 ---
  const renderCell = (index: number) => {
    const cell = gameState.board[index]
    const isWinningCell = winningLine.includes(index)
    const isPlayerCell = cell === playerMark
    const isAiCell = cell && cell !== playerMark

    return (
      <button
        key={index}
        onClick={() => handleCellClick(index)}
        disabled={cell !== null || gameState.status !== 'PLAYING' || aiThinking}
        className={`relative flex aspect-square items-center justify-center rounded-xl text-5xl font-bold transition-all duration-200 ${
          cell ? 'shadow-inner' : 'hover:scale-102 hover:shadow-lg active:scale-95'
        } ${
          isWinningCell
            ? 'bg-linear-to-br from-yellow-400 to-orange-500 shadow-lg shadow-yellow-500/50'
            : 'bg-linear-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800'
        } ${isPlayerCell ? 'text-blue-600 dark:text-blue-400' : ''} ${isAiCell ? 'text-red-600 dark:text-red-400' : ''} ${
          aiThinking && gameState.currentPlayer !== playerMark
            ? 'cursor-wait opacity-50'
            : 'cursor-pointer'
        } `}
      >
        {cell === 'X' && (
          <span className={`transition-all ${isWinningCell ? 'scale-110' : 'scale-100'}`}>X</span>
        )}
        {cell === 'O' && (
          <span className={`transition-all ${isWinningCell ? 'scale-110' : 'scale-100'}`}>O</span>
        )}
      </button>
    )
  }

  // --- 获取状态消息 ---
  const getStatusMessage = () => {
    if (gameState.status === 'IDLE') {
      return '准备开始'
    }
    if (gameState.status === 'WIN') {
      const winnerName = gameState.winner === playerMark ? '你' : 'AI'
      return `${winnerName}赢了！`
    }
    if (gameState.status === 'DRAW') {
      return '平局！'
    }
    if (aiThinking) {
      return 'AI 思考中...'
    }
    return gameState.currentPlayer === playerMark ? '轮到你了' : 'AI 的回合'
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col px-4">
      {/* 顶部统计栏 */}
      <div className="mb-6 grid grid-cols-3 gap-3">
        <div className="rounded-xl bg-blue-100 p-3 text-center backdrop-blur-sm dark:bg-blue-900/50">
          <p className="text-xs font-semibold uppercase text-blue-600 dark:text-blue-300">
            玩家 ({playerMark})
          </p>
          <p className="text-2xl font-bold text-blue-700 dark:text-blue-200">
            {gameState.scores.player}
          </p>
        </div>
        <div className="rounded-xl bg-gray-100 p-3 text-center backdrop-blur-sm dark:bg-gray-800/50">
          <p className="text-xs font-semibold uppercase text-gray-600 dark:text-gray-300">平局</p>
          <p className="text-2xl font-bold text-gray-700 dark:text-gray-200">
            {gameState.scores.draws}
          </p>
        </div>
        <div className="rounded-xl bg-red-100 p-3 text-center backdrop-blur-sm dark:bg-red-900/50">
          <p className="text-xs font-semibold uppercase text-red-600 dark:text-red-300">
            AI ({playerMark === 'X' ? 'O' : 'X'})
          </p>
          <p className="text-2xl font-bold text-red-700 dark:text-red-200">{gameState.scores.ai}</p>
        </div>
      </div>

      {/* 游戏设置面板 */}
      {gameState.status === 'IDLE' && (
        <div className="mb-6 rounded-xl bg-white/80 p-6 shadow-lg backdrop-blur-sm dark:bg-gray-800/80">
          <h3 className="mb-4 text-lg font-bold text-gray-800 dark:text-white">游戏设置</h3>

          {/* 选择难度 */}
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              AI 难度
            </label>
            <div className="flex gap-2">
              {(['EASY', 'MEDIUM', 'HARD'] as Difficulty[]).map(level => (
                <button
                  key={level}
                  onClick={() => setDifficulty(level)}
                  className={`flex-1 rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
                    difficulty === level
                      ? 'bg-linear-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {level === 'EASY' && '简单'}
                  {level === 'MEDIUM' && '中等'}
                  {level === 'HARD' && '困难'}
                </button>
              ))}
            </div>
          </div>

          {/* 选择先手 */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              先手棋子
            </label>
            <div className="flex gap-2">
              {(['X', 'O'] as Player[]).map(mark => (
                <button
                  key={mark}
                  onClick={() => setPlayerMark(mark)}
                  className={`flex-1 rounded-lg px-4 py-2 text-2xl font-bold transition-all ${
                    playerMark === mark
                      ? 'bg-linear-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {mark}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 游戏主区域 */}
      <div className="relative mb-6">
        <div className="bg-linear-to-br relative overflow-hidden rounded-2xl from-gray-100 to-gray-200 p-4 shadow-2xl dark:from-gray-800 dark:to-gray-900">
          {/* 棋盘 */}
          <div className="grid grid-cols-3 gap-3">
            {Array(9)
              .fill(null)
              .map((_, index) => renderCell(index))}
          </div>

          {/* 状态遮罩 */}
          {(gameState.status === 'IDLE' ||
            gameState.status === 'WIN' ||
            gameState.status === 'DRAW') && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity">
              <h2 className="mb-2 text-4xl font-black text-white drop-shadow-md">
                {gameState.status === 'IDLE'
                  ? '井字棋'
                  : gameState.status === 'DRAW'
                    ? '平局'
                    : '游戏结束'}
              </h2>
              {gameState.status === 'WIN' && (
                <p className="mb-6 text-2xl font-bold text-yellow-400">
                  {gameState.winner === playerMark ? '🎉 你赢了！' : '🤖 AI 赢了！'}
                </p>
              )}
              {gameState.status === 'IDLE' && (
                <p className="mb-6 text-lg text-gray-200">选择设置后开始游戏</p>
              )}
              <div className="flex gap-3">
                <button
                  onClick={startGame}
                  className="bg-linear-to-r group relative inline-flex items-center justify-center rounded-lg from-blue-500 to-purple-600 px-6 py-3 font-bold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl active:scale-95"
                >
                  {gameState.status === 'IDLE' ? '开始游戏' : '再来一局'}
                  <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
                </button>
                {gameState.status !== 'IDLE' && (
                  <button
                    onClick={resetScores}
                    className="rounded-lg bg-gray-600 px-6 py-3 font-bold text-white shadow-lg transition-all hover:scale-105 hover:bg-gray-700 active:scale-95"
                  >
                    重置分数
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 游戏状态指示器 */}
        {gameState.status === 'PLAYING' && (
          <div className="mt-4 rounded-xl bg-white/80 p-4 text-center shadow-lg backdrop-blur-sm dark:bg-gray-800/80">
            <p className="text-lg font-semibold text-gray-800 dark:text-white">
              {getStatusMessage()}
            </p>
            {aiThinking && (
              <div className="mt-2 flex items-center justify-center gap-2">
                <div className="h-2 w-2 animate-bounce rounded-full bg-red-500" />
                <div className="h-2 w-2 animate-bounce rounded-full bg-red-500 delay-100" />
                <div className="h-2 w-2 animate-bounce rounded-full bg-red-500 delay-200" />
              </div>
            )}
          </div>
        )}
      </div>

      {/* 游戏说明 */}
      <div className="rounded-xl bg-white/60 p-4 text-center text-sm text-gray-600 shadow-md backdrop-blur-sm dark:bg-gray-800/60 dark:text-gray-400">
        <p className="mb-1 font-semibold">游戏规则</p>
        <p>三个相同棋子连成一线即获胜，先连成者胜！</p>
        <p className="mt-2 text-xs">AI 使用 Minimax 算法，困难模式下几乎不可战胜</p>
      </div>
    </div>
  )
}
