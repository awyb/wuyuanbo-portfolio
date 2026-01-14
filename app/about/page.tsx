import { personalInfo } from '@/data/portfolio';

export const metadata = {
  title: '关于 - 吴元波',
  description: '了解更多关于我的信息',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-8">
          关于我
        </h1>

        <div className="prose dark:prose-invert max-w-none">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              👋 你好，我是 {personalInfo.name}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
              {personalInfo.bio}
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              📍 {personalInfo.location}
            </p>
          </div>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              🎯 我的目标
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              我致力于构建高质量、用户体验良好的 Web 应用程序。通过不断学习和实践，
              我希望能够为社区做出贡献，并帮助其他开发者成长。
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              💼 工作经验
            </h2>
            <div className="space-y-6">
              <div className="border-l-4 border-blue-600 pl-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  高级前端开发工程师
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  某科技公司 | 2022 - 至今
                </p>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  负责公司主要产品的前端开发和维护，使用 React、Next.js 等技术栈。
                </p>
              </div>

              <div className="border-l-4 border-blue-600 pl-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  前端开发工程师
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  某互联网公司 | 2020 - 2022
                </p>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  参与多个项目的前端开发，积累了丰富的实战经验。
                </p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              🎓 教育背景
            </h2>
            <div className="border-l-4 border-blue-600 pl-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                计算机科学与技术
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                某大学 | 2016 - 2020
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              📞 联系我
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              如果你对我的工作感兴趣，或者想要合作，欢迎通过以下方式联系我：
            </p>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
              <li>📧 邮箱：{personalInfo.email}</li>
              <li>📍 位置：{personalInfo.location}</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
