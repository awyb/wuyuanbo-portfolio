import TicTacToe from '@/components/games/TicTacToe'

export const metadata = {
  title: '井字棋游戏 | AI对战',
  description: '与AI对战的井字棋游戏，支持多种难度选择',
}

export default function TicTacToePage() {
  return (
    <div className="bg-linear-to-br min-h-screen from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8 text-center">
          <h1 className="bg-linear-to-r mb-4 from-blue-600 to-purple-600 bg-clip-text text-4xl font-black text-transparent md:text-5xl">
            井字棋
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">与AI对战的经典井字棋游戏</p>
        </div>

        <TicTacToe />
      </div>
    </div>
  )
}
