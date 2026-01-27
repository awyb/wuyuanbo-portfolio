import { sql } from '@/lib/db'

interface SkillRow {
  id: string
  category: string
  items: string[]
  created_at: string
}

async function getSkills() {
  const skills = await sql`
    SELECT * FROM skills 
    ORDER BY category
  `
  return (skills as SkillRow[]) || []
}

export default async function Skills() {
  const skills = await getSkills()

  return (
    <section className="bg-white py-20 dark:bg-gray-900">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-12 text-center text-4xl font-bold text-gray-900 dark:text-white">
          我的技能
        </h2>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {skills.map(skillGroup => (
            <div key={skillGroup.id} className="rounded-lg bg-gray-50 p-6 dark:bg-gray-800">
              <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                {skillGroup.category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {skillGroup.items.map((item: string) => (
                  <span
                    key={item}
                    className="rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-800 transition-colors hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
