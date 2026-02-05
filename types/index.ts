// 项目类型定义
export interface Project {
  id: string
  title: string
  description: string
  image: string
  tags: string[]
  link?: string
  github?: string
}

// 技能类型定义
export interface Skill {
  category: string
  items: string[]
}

// 博客文章类型定义
export interface BlogPost {
  id: string
  title: string
  description: string
  date: string
  category: string
  tags: string[]
  content?: string
  file_path?: string
  slug: string
}

// 工具/游戏类型定义
export interface Tool {
  id: string
  title: string
  description: string
  icon: string
  link: string
  category: 'tool' | 'game'
}

// 社交媒体链接
export interface SocialLink {
  name: string
  url: string
  icon: string
}
