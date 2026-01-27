'use client'

import React, { useState } from 'react'

// 类型定义
interface LotteryTicket {
  id: number
  redBalls: number[]
  blueBall: number
}

interface DrawResult {
  redBalls: number[]
  blueBall: number
  prizes: {
    ticketId: number
    redMatches: number
    blueMatch: boolean
    prize: string
    amount: number
  }[]
}

interface TicketStats {
  ticketId: number
  totalWins: number
  winCount: number
  bestPrize: string
  bestAmount: number
}

const PRIZE_LEVELS = [
  { name: '一等奖', condition: (red: number, blue: boolean) => red === 6 && blue, amount: 5000000 },
  { name: '二等奖', condition: (red: number, blue: boolean) => red === 6 && !blue, amount: 200000 },
  { name: '三等奖', condition: (red: number, blue: boolean) => red === 5 && blue, amount: 10000 },
  {
    name: '四等奖',
    condition: (red: number, blue: boolean) => (red === 5 && !blue) || (red === 4 && blue),
    amount: 3000,
  },
  {
    name: '五等奖',
    condition: (red: number, blue: boolean) => (red === 4 && !blue) || (red === 3 && blue),
    amount: 200,
  },
  {
    name: '六等奖',
    condition: (red: number, blue: boolean) =>
      (red === 2 && blue) || (red === 1 && blue) || (red === 0 && blue),
    amount: 10,
  },
]

const TICKET_PRICE = 2

export default function LotteryGame() {
  const [tickets, setTickets] = useState<LotteryTicket[]>([])
  const [drawCount, setDrawCount] = useState(1)
  const [drawResults, setDrawResults] = useState<DrawResult[]>([])
  const [isSimulating, setIsSimulating] = useState(false)

  // 手动选号状态
  const [selectedRedBalls, setSelectedRedBalls] = useState<number[]>([])
  const [selectedBlueBall, setSelectedBlueBall] = useState<number | null>(null)
  const [showManualInput, setShowManualInput] = useState(false)

  // 过滤状态
  const [filterPrize, setFilterPrize] = useState<string>('all')

  // 生成随机红球
  const generateRandomRedBalls = (): number[] => {
    const balls: number[] = []
    while (balls.length < 6) {
      const num = Math.floor(Math.random() * 33) + 1
      if (!balls.includes(num)) {
        balls.push(num)
      }
    }
    return balls.sort((a, b) => a - b)
  }

  // 生成随机蓝球
  const generateRandomBlueBall = (): number => {
    return Math.floor(Math.random() * 16) + 1
  }

  // 添加一张随机彩票
  const addRandomTicket = () => {
    const newTicket: LotteryTicket = {
      id: Date.now(),
      redBalls: generateRandomRedBalls(),
      blueBall: generateRandomBlueBall(),
    }
    setTickets([...tickets, newTicket])
    setDrawResults([])
  }

  // 添加多张随机彩票
  const addMultipleRandomTickets = (count: number) => {
    const newTickets: LotteryTicket[] = []
    for (let i = 0; i < count; i++) {
      newTickets.push({
        id: Date.now() + i,
        redBalls: generateRandomRedBalls(),
        blueBall: generateRandomBlueBall(),
      })
    }
    setTickets([...tickets, ...newTickets])
    setDrawResults([])
  }

  // 切换红球选择
  const toggleRedBall = (num: number) => {
    if (selectedRedBalls.includes(num)) {
      setSelectedRedBalls(selectedRedBalls.filter(b => b !== num))
    } else if (selectedRedBalls.length < 6) {
      setSelectedRedBalls([...selectedRedBalls, num].sort((a, b) => a - b))
    }
  }

  // 切换蓝球选择
  const toggleBlueBall = (num: number) => {
    setSelectedBlueBall(selectedBlueBall === num ? null : num)
  }

  // 添加手动选择的彩票
  const addManualTicket = () => {
    if (selectedRedBalls.length !== 6) {
      alert('请选择6个红球')
      return
    }
    if (selectedBlueBall === null) {
      alert('请选择1个蓝球')
      return
    }
    const newTicket: LotteryTicket = {
      id: Date.now(),
      redBalls: [...selectedRedBalls],
      blueBall: selectedBlueBall,
    }
    setTickets([...tickets, newTicket])
    setDrawResults([])
    setSelectedRedBalls([])
    setSelectedBlueBall(null)
  }

  // 清空所有彩票
  const clearTickets = () => {
    setTickets([])
    setDrawResults([])
  }

  // 单次开奖
  const drawOnce = () => {
    const result: DrawResult = {
      redBalls: generateRandomRedBalls(),
      blueBall: generateRandomBlueBall(),
      prizes: [],
    }

    tickets.forEach(ticket => {
      const redMatches = ticket.redBalls.filter(ball => result.redBalls.includes(ball)).length
      const blueMatch = ticket.blueBall === result.blueBall

      const prize = PRIZE_LEVELS.find(level => level.condition(redMatches, blueMatch))

      result.prizes.push({
        ticketId: ticket.id,
        redMatches,
        blueMatch,
        prize: prize ? prize.name : '未中奖',
        amount: prize ? prize.amount : 0,
      })
    })

    setDrawResults([...drawResults, result])
  }

  // 模拟多次开奖
  const simulateMultipleDraws = () => {
    setIsSimulating(true)
    const results: DrawResult[] = []
    let count = 0

    const interval = setInterval(() => {
      const result: DrawResult = {
        redBalls: generateRandomRedBalls(),
        blueBall: generateRandomBlueBall(),
        prizes: [],
      }

      tickets.forEach(ticket => {
        const redMatches = ticket.redBalls.filter(ball => result.redBalls.includes(ball)).length
        const blueMatch = ticket.blueBall === result.blueBall

        const prize = PRIZE_LEVELS.find(level => level.condition(redMatches, blueMatch))

        result.prizes.push({
          ticketId: ticket.id,
          redMatches,
          blueMatch,
          prize: prize ? prize.name : '未中奖',
          amount: prize ? prize.amount : 0,
        })
      })

      results.push(result)
      setDrawResults([...drawResults, ...results])
      count++

      if (count >= drawCount) {
        clearInterval(interval)
        setIsSimulating(false)
      }
    }, 500)
  }

  // 计算每个彩票的统计
  const calculateTicketStats = (): TicketStats[] => {
    return tickets.map(ticket => {
      let totalWins = 0
      let winCount = 0
      let bestPrize = '未中奖'
      let bestAmount = 0

      drawResults.forEach(result => {
        const prize = result.prizes.find(p => p.ticketId === ticket.id)
        if (prize && prize.amount > 0) {
          totalWins += prize.amount
          winCount++
          if (prize.amount > bestAmount) {
            bestAmount = prize.amount
            bestPrize = prize.prize
          }
        }
      })

      return {
        ticketId: ticket.id,
        totalWins,
        winCount,
        bestPrize,
        bestAmount,
      }
    })
  }

  // 计算总投入和总收益
  const calculateStats = () => {
    const totalCost = tickets.length * TICKET_PRICE * drawResults.length
    const totalWin = drawResults.reduce((sum, result) => {
      return sum + result.prizes.reduce((ticketSum, prize) => ticketSum + prize.amount, 0)
    }, 0)
    const profit = totalWin - totalCost

    return { totalCost, totalWin, profit }
  }

  const stats = calculateStats()
  const ticketStats = calculateTicketStats()

  // 过滤开奖结果
  const filteredResults = drawResults.map(result => ({
    ...result,
    prizes: result.prizes.filter(prize => {
      if (filterPrize === 'all') return true
      if (filterPrize === 'win') return prize.amount > 0
      if (filterPrize === 'lose') return prize.amount === 0
      return prize.prize === filterPrize
    }),
  }))

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4">
      {/* 操作面板 */}
      <div className="bg-linear-to-br grid gap-4 rounded-xl from-red-50 to-orange-50 p-6 shadow-lg dark:from-red-900/20 dark:to-orange-900/20">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">📝 号码选择</h3>

        {/* 随机生成区域 */}
        <div className="grid gap-3 md:grid-cols-2">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={addRandomTicket}
              className="rounded-lg bg-red-500 px-4 py-2 font-bold text-white transition-all hover:scale-105 hover:bg-red-600"
            >
              随机生成1注
            </button>
            <button
              onClick={() => addMultipleRandomTickets(5)}
              className="rounded-lg bg-red-500 px-4 py-2 font-bold text-white transition-all hover:scale-105 hover:bg-red-600"
            >
              随机生成5注
            </button>
            <button
              onClick={() => addMultipleRandomTickets(10)}
              className="rounded-lg bg-red-500 px-4 py-2 font-bold text-white transition-all hover:scale-105 hover:bg-red-600"
            >
              随机生成10注
            </button>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="1"
              max="100"
              defaultValue="1"
              onChange={e => setDrawCount(parseInt(e.target.value) || 1)}
              className="w-20 rounded-lg border border-gray-300 px-3 py-2 text-center dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">注</span>
            <button
              onClick={() => addMultipleRandomTickets(drawCount)}
              className="rounded-lg bg-orange-500 px-4 py-2 font-bold text-white transition-all hover:scale-105 hover:bg-orange-600"
            >
              自定义生成
            </button>
          </div>
        </div>

        {/* 手动输入按钮 */}
        <button
          onClick={() => setShowManualInput(!showManualInput)}
          className="rounded-lg bg-indigo-500 px-4 py-2 font-bold text-white transition-all hover:scale-105 hover:bg-indigo-600"
        >
          {showManualInput ? '收起手动输入' : '手动输入号码'}
        </button>

        {/* 手动输入区域 */}
        {showManualInput && (
          <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-800">
            {/* 红球选择 */}
            <div className="mb-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  红球选择 (已选 {selectedRedBalls.length}/6)
                </span>
                <button
                  onClick={() => setSelectedRedBalls([])}
                  className="text-xs text-red-500 hover:text-red-700"
                >
                  清空选择
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {Array.from({ length: 33 }, (_, i) => i + 1).map(num => (
                  <button
                    key={num}
                    onClick={() => toggleRedBall(num)}
                    className={`h-9 w-9 rounded-full text-sm font-bold transition-all hover:scale-110 ${
                      selectedRedBalls.includes(num)
                        ? 'bg-red-500 text-white shadow-md'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    {num < 10 ? `0${num}` : num}
                  </button>
                ))}
              </div>
            </div>

            {/* 蓝球选择 */}
            <div className="mb-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  蓝球选择 (已选 {selectedBlueBall ? '1' : '0'}/1)
                </span>
                <button
                  onClick={() => setSelectedBlueBall(null)}
                  className="text-xs text-blue-500 hover:text-blue-700"
                >
                  清空选择
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {Array.from({ length: 16 }, (_, i) => i + 1).map(num => (
                  <button
                    key={num}
                    onClick={() => toggleBlueBall(num)}
                    className={`h-9 w-9 rounded-full text-sm font-bold transition-all hover:scale-110 ${
                      selectedBlueBall === num
                        ? 'bg-blue-500 text-white shadow-md'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    {num < 10 ? `0${num}` : num}
                  </button>
                ))}
              </div>
            </div>

            {/* 添加按钮 */}
            <button
              onClick={addManualTicket}
              disabled={selectedRedBalls.length !== 6 || selectedBlueBall === null}
              className="w-full rounded-lg bg-green-500 px-4 py-3 font-bold text-white transition-all hover:scale-105 hover:bg-green-600 disabled:bg-gray-400 disabled:hover:scale-100"
            >
              添加手动选择的号码
            </button>
          </div>
        )}

        <button
          onClick={clearTickets}
          className="rounded-lg bg-gray-500 px-4 py-2 font-bold text-white transition-all hover:bg-gray-600"
        >
          清空所有号码
        </button>
      </div>

      {/* 已选号码展示 */}
      {tickets.length > 0 && (
        <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              🎫 已选号码 ({tickets.length}注)
            </h3>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              总投入: {tickets.length * TICKET_PRICE * (drawResults.length || 1)}元
            </span>
          </div>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {tickets.map((ticket, index) => {
              const stat = ticketStats.find(s => s.ticketId === ticket.id)
              return (
                <div key={ticket.id} className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                      第{index + 1}注
                    </div>
                    {stat && stat.totalWins > 0 && (
                      <div className="rounded-full bg-green-100 px-2 py-1 text-xs font-bold text-green-700 dark:bg-green-900/30 dark:text-green-400">
                        +¥{stat.totalWins}
                      </div>
                    )}
                  </div>
                  <div className="mb-2 flex flex-wrap gap-2">
                    {ticket.redBalls.map((ball, i) => (
                      <div
                        key={`red-${i}`}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-sm font-bold text-white"
                      >
                        {ball < 10 ? `0${ball}` : ball}
                      </div>
                    ))}
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-sm font-bold text-white">
                      {ticket.blueBall < 10 ? `0${ticket.blueBall}` : ticket.blueBall}
                    </div>
                  </div>
                  {stat && drawResults.length > 0 && (
                    <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      中奖 {stat.winCount}/{drawResults.length} 次
                      {stat.bestAmount > 0 && ` · 最高: ${stat.bestPrize}`}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* 开奖控制 */}
      <div className="bg-linear-to-br grid gap-4 rounded-xl from-blue-50 to-purple-50 p-6 shadow-lg dark:from-blue-900/20 dark:to-purple-900/20">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">🎲 开奖模拟</h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={drawOnce}
            disabled={tickets.length === 0 || isSimulating}
            className="rounded-lg bg-blue-500 px-6 py-2 font-bold text-white transition-all hover:scale-105 hover:bg-blue-600 disabled:bg-gray-400 disabled:hover:scale-100"
          >
            单次开奖
          </button>
          <button
            onClick={simulateMultipleDraws}
            disabled={tickets.length === 0 || isSimulating}
            className="rounded-lg bg-purple-500 px-6 py-2 font-bold text-white transition-all hover:scale-105 hover:bg-purple-600 disabled:bg-gray-400 disabled:hover:scale-100"
          >
            模拟{drawCount}次开奖
          </button>
          <input
            type="number"
            min="1"
            max="1000"
            value={drawCount}
            onChange={e => setDrawCount(parseInt(e.target.value) || 1)}
            className="w-20 rounded-lg border border-gray-300 px-3 py-2 text-center dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          />
          {isSimulating && (
            <span className="flex items-center text-sm text-blue-600 dark:text-blue-400">
              ⏳ 正在模拟中...
            </span>
          )}
        </div>
      </div>

      {/* 收益统计 */}
      {drawResults.length > 0 && (
        <div className="bg-linear-to-br rounded-xl from-green-50 to-emerald-50 p-6 shadow-lg dark:from-green-900/20 dark:to-emerald-900/20">
          <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">💰 收益统计</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-lg bg-white p-4 text-center shadow dark:bg-gray-800">
              <div className="text-sm text-gray-600 dark:text-gray-400">总投入</div>
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                ¥{stats.totalCost}
              </div>
            </div>
            <div className="rounded-lg bg-white p-4 text-center shadow dark:bg-gray-800">
              <div className="text-sm text-gray-600 dark:text-gray-400">总收益</div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                ¥{stats.totalWin}
              </div>
            </div>
            <div className="rounded-lg bg-white p-4 text-center shadow dark:bg-gray-800">
              <div className="text-sm text-gray-600 dark:text-gray-400">盈亏</div>
              <div
                className={`text-2xl font-bold ${
                  stats.profit >= 0
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                }`}
              >
                {stats.profit >= 0 ? '+' : ''}¥{stats.profit}
              </div>
            </div>
          </div>
          <div className="mt-4 text-center">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              共开奖{drawResults.length}次 · {tickets.length}注彩票
            </div>
            <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              平均收益率:{' '}
              <span
                className={`font-bold ${
                  (stats.totalWin / stats.totalCost - 1) * 100 >= 0
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                }`}
              >
                {((stats.totalWin / stats.totalCost - 1) * 100).toFixed(2)}%
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 开奖结果 */}
      {drawResults.length > 0 && (
        <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
          <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              🎯 开奖结果 ({drawResults.length}次)
            </h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilterPrize('all')}
                className={`rounded-full px-3 py-1 text-sm font-medium transition-all ${
                  filterPrize === 'all'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                全部
              </button>
              <button
                onClick={() => setFilterPrize('win')}
                className={`rounded-full px-3 py-1 text-sm font-medium transition-all ${
                  filterPrize === 'win'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                只看中奖
              </button>
              <button
                onClick={() => setFilterPrize('lose')}
                className={`rounded-full px-3 py-1 text-sm font-medium transition-all ${
                  filterPrize === 'lose'
                    ? 'bg-gray-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                只看未中
              </button>
              {PRIZE_LEVELS.map(level => (
                <button
                  key={level.name}
                  onClick={() => setFilterPrize(level.name)}
                  className={`rounded-full px-3 py-1 text-sm font-medium transition-all ${
                    filterPrize === level.name
                      ? 'bg-yellow-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {level.name}
                </button>
              ))}
            </div>
          </div>
          <div className="max-h-96 space-y-4 overflow-y-auto">
            {filteredResults.map((result, index) => (
              <div
                key={index}
                className="bg-linear-to-r rounded-lg from-yellow-50 to-orange-50 p-4 dark:from-yellow-900/20 dark:to-orange-900/20"
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="font-bold text-gray-900 dark:text-white">
                    第{index + 1}次开奖
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    当次收益: ¥{result.prizes.reduce((sum, prize) => sum + prize.amount, 0)}
                  </span>
                </div>
                <div className="mb-3 flex flex-wrap gap-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">开奖号码:</span>
                  {result.redBalls.map((ball, i) => (
                    <div
                      key={`draw-red-${i}`}
                      className="flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white"
                    >
                      {ball < 10 ? `0${ball}` : ball}
                    </div>
                  ))}
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-500 text-xs font-bold text-white">
                    {result.blueBall < 10 ? `0${result.blueBall}` : result.blueBall}
                  </div>
                </div>
                <div className="space-y-2">
                  {result.prizes.map(prize => {
                    const ticket = tickets.find(t => t.id === prize.ticketId)
                    const ticketIndex = tickets.indexOf(ticket!)
                    return (
                      <div
                        key={prize.ticketId}
                        className={`rounded-lg p-3 ${
                          prize.amount > 0
                            ? 'bg-green-100 dark:bg-green-900/30'
                            : 'bg-gray-100 dark:bg-gray-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            第{ticketIndex + 1}注: {prize.redMatches}红
                            {prize.blueMatch ? '+蓝' : ''}
                          </span>
                          <span
                            className={`font-bold ${
                              prize.amount > 0
                                ? 'text-green-600 dark:text-green-400'
                                : 'text-gray-600 dark:text-gray-400'
                            }`}
                          >
                            {prize.prize} {prize.amount > 0 && `(¥${prize.amount})`}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 游戏规则 */}
      <div className="rounded-xl bg-gray-50 p-6 shadow-lg dark:bg-gray-800">
        <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">📖 游戏规则</h3>
        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <p>• 红球: 1-33中选6个，蓝球: 1-16中选1个</p>
          <p>• 一等奖: 6红+1蓝 (500万元)</p>
          <p>• 二等奖: 6红 (20万元)</p>
          <p>• 三等奖: 5红+1蓝 (1万元)</p>
          <p>• 四等奖: 5红 或 4红+1蓝 (3000元)</p>
          <p>• 五等奖: 4红 或 3红+1蓝 (200元)</p>
          <p>• 六等奖: 2红+1蓝 或 1红+1蓝 或 0红+1蓝 (10元)</p>
          <p>• 每注彩票2元</p>
        </div>
      </div>
    </div>
  )
}
