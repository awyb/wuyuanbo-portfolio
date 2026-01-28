'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import ProjectCard from './ProjectCard'

interface ProjectsPageContentProps {
  projects: any[]
}

export default function ProjectsPageContent({ projects }: ProjectsPageContentProps) {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-white py-20 dark:bg-gray-900">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h1 className="mb-4 text-5xl font-bold text-gray-900 dark:text-white">
          {t('projects.title')}
        </h1>
        <p className="mb-12 text-xl text-gray-600 dark:text-gray-400">{t('projects.subtitle')}</p>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project: any) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </div>
  )
}
