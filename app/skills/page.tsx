import { sql } from '@/lib/db'

export const metadata = {
  title: '技能 - 吴元波',
  description: '我的技能和专业领域',
}

async function getSkills() {
  const skills = await sql`
    SELECT * FROM skills 
    ORDER BY category
  `
  return skills || []
}

export default async function SkillsPage() {
  const skills = await getSkills()

  return (
    <div className="min-h-screen bg-white py-20 dark:bg-gray-900">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h1 className="mb-4 text-5xl font-bold text-gray-900 dark:text-white">我的技能</h1>
        <p className="mb-12 text-xl text-gray-600 dark:text-gray-400">
          多年的开发经验让我掌握了以下技能和工具。
        </p>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {skills.map((skillGroup: any) => (
            <div key={skillGroup.category} className="rounded-lg bg-gray-50 p-8 dark:bg-gray-800">
              <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
                {skillGroup.category}
              </h2>
              <div className="flex flex-wrap gap-3">
                {skillGroup.items.map((item: string) => (
                  <span
                    key={item}
                    className="rounded-full bg-blue-100 px-4 py-2 font-medium text-blue-800 transition-colors hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800"
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
  )
}
