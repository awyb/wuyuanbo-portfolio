import NumberStack from '@/components/games/NumberStack'

export const metadata = {
  title: '数字堆叠游戏 - 吴元波',
  description: '一个有趣的益智小游戏，适合手机游玩',
}

export default function NumberStackPage() {
  return (
    <div className="bg-linear-to-br min-h-screen from-gray-900 to-gray-800 px-4 py-12">
      <div className="mx-auto w-full max-w-6xl">
        {/* 标题 */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-6xl font-bold text-white md:text-7xl">🔢 数字堆叠</h1>
          <p className="text-xl text-gray-400 md:text-2xl">合并相同的数字，挑战你的策略能力</p>
        </div>

        {/* 游戏组件 */}
        <div className="rounded-xl bg-gray-800 p-8 shadow-2xl md:p-12">
          <NumberStack />
        </div>

        {/* 底部提示 */}
        <div className="mt-12 text-center text-gray-400">
          <p>💡 提示：这款游戏特别适合在手机上游玩，随时随地享受益智乐趣</p>
        </div>
      </div>
    </div>
  )
}
