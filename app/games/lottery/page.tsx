import LotteryGame from '@/components/games/LotteryGame'

export const metadata = {
  title: '双色球游戏 - 吴元波',
  description: '双色球模拟器，支持随机选号和多次开奖模拟',
}

export default function LotteryPage() {
  return (
    <div className="bg-linear-to-br min-h-screen from-gray-900 to-gray-800 px-4 py-12">
      <div className="mx-auto max-w-6xl">
        {/* 标题 */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-5xl font-bold text-white">🎱 双色球游戏</h1>
          <p className="text-xl text-gray-400">模拟双色球开奖，计算收益亏损，体验中奖的快感</p>
        </div>

        {/* 游戏组件 */}
        <div className="rounded-xl bg-gray-800 p-8 shadow-2xl">
          <LotteryGame />
        </div>

        {/* 底部提示 */}
        <div className="mt-12 text-center text-gray-400">
          <p>💡 提示：双色球仅供参考娱乐，请理性购彩</p>
        </div>
      </div>
    </div>
  )
}
