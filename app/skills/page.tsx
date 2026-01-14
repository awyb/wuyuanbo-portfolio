import { skills } from '@/data/portfolio';

export const metadata = {
  title: '技能 - 吴元波',
  description: '我的技能和专业领域',
};

export default function SkillsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
          我的技能
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-12">
          多年的开发经验让我掌握了以下技能和工具。
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {skills.map((skillGroup) => (
            <div
              key={skillGroup.category}
              className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                {skillGroup.category}
              </h2>
              <div className="flex flex-wrap gap-3">
                {skillGroup.items.map((item) => (
                  <span
                    key={item}
                    className="px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full font-medium hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
