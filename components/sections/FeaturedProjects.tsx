import Link from 'next/link'
import ProjectCard from '@/components/common/ProjectCard'
import { sql } from '@/lib/db'

async function getFeaturedProjects() {
  const projects = await sql`
    SELECT * FROM projects 
    ORDER BY created_at DESC 
    LIMIT 3
  `
  return projects || []
}

export default async function FeaturedProjects() {
  const featuredProjects = await getFeaturedProjects()

  return (
    <section className="bg-gray-50 py-20 dark:bg-gray-800">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex items-center justify-between">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white">精选作品</h2>
          <Link
            href="/projects"
            className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            查看全部 →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {featuredProjects.map((project: any) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  )
}
