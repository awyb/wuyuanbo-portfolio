import { sql } from '@/lib/db'
import ProjectsPageContent from '@/components/common/ProjectsPageContent'

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

  return <ProjectsPageContent projects={projects} />
}
