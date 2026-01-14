import Link from 'next/link';
import { tools } from '@/data/portfolio';

export const metadata = {
  title: '游戏 - 吴元波',
  description: '有趣的小游戏',
};

export default function GamesPage() {
  const games = tools.filter((tool) => tool.category === 'game');

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
          🎮 小游戏
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-12">
          一些有趣的小游戏，来放松一下吧！
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {games.map((game) => (
            <Link
              key={game.id}
              href={game.link}
              className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-lg p-8 hover:shadow-xl transition-shadow text-center"
            >
              <div className="text-6xl mb-4">{game.icon}</div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {game.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {game.description}
              </p>
              <span className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                开始游戏 →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
