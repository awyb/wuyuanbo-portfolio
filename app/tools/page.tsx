import Link from 'next/link';
import { tools } from '@/data/portfolio';

export const metadata = {
  title: '工具 - 吴元波',
  description: '我开发的实用工具和小游戏',
};

export default function ToolsPage() {
  const toolsList = tools.filter((tool) => tool.category === 'tool');
  const gamesList = tools.filter((tool) => tool.category === 'game');

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
          工具 & 游戏
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-12">
          一些实用的工具和有趣的小游戏。
        </p>

        {/* Tools Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            🛠️ 工具
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {toolsList.map((tool) => (
              <Link
                key={tool.id}
                href={tool.link}
                className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                <div className="text-4xl mb-4">{tool.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {tool.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {tool.description}
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* Games Section */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            🎮 游戏
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gamesList.map((game) => (
              <Link
                key={game.id}
                href={game.link}
                className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                <div className="text-4xl mb-4">{game.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {game.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {game.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
