import { sql } from '@/lib/db'
import ProjectCard from '@/components/common/ProjectCard'

export const metadata = {
  title: '作品 - 吴元波',
  description: '查看我的所有项目和作品',
}

async function getProjects() {
  const projects = await sql`
    SELECT * FROM projects 
    ORDER BY created_at DESC
  `
  return projects || []
}

export default async function ProjectsPage() {
  const projects = await getProjects()

  return (
    <div className="min-h-screen bg-white py-20 dark:bg-gray-900">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h1 className="mb-4 text-5xl font-bold text-gray-900 dark:text-white">我的作品</h1>
        <p className="mb-12 text-xl text-gray-600 dark:text-gray-400">
          这是我在开发过程中完成的一些项目和作品。
        </p>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project: any) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </div>
  )
}
