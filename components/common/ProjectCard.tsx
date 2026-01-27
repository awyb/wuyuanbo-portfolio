import Link from 'next/link'
import { Project } from '@/types'

interface ProjectCardProps {
  project: Project
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg bg-white shadow-lg transition-shadow hover:shadow-xl dark:bg-gray-800">
      {/* Image */}
      <div className="bg-linear-to-br flex h-48 items-center justify-center from-blue-400 to-purple-500">
        <span className="text-4xl text-white">📦</span>
      </div>

      {/* Content */}
      <div className="flex grow flex-col p-6">
        <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">{project.title}</h3>
        <p className="mb-4 grow text-gray-600 dark:text-gray-400">{project.description}</p>

        {/* Tags */}
        <div className="mb-4 flex flex-wrap gap-2">
          {project.tags.map(tag => (
            <span
              key={tag}
              className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs text-blue-800 dark:bg-blue-900 dark:text-blue-200"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Links */}
        <div className="flex gap-3">
          <Link
            href={project.link || '#'}
            className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-center text-white transition-colors hover:bg-blue-700"
          >
            查看项目
          </Link>
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-center text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              GitHub
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
