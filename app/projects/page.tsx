import { projects } from '@/data/portfolio';
import ProjectCard from '@/components/common/ProjectCard';

export const metadata = {
  title: '作品 - 吴元波',
  description: '查看我的所有项目和作品',
};

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
          我的作品
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-12">
          这是我在开发过程中完成的一些项目和作品。
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </div>
  );
}
