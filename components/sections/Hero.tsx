import Link from 'next/link'
import { personalInfo, socialLinks } from '@/data/portfolio'

export default function Hero() {
  return (
    <section className="bg-linear-to-br flex min-h-screen items-center justify-center from-gray-50 to-gray-100 px-4 dark:from-gray-900 dark:to-gray-800">
      <div className="mx-auto max-w-4xl text-center">
        {/* Avatar */}
        <div className="mb-8">
          <div className="bg-linear-to-br mx-auto flex h-24 w-24 items-center justify-center rounded-full from-blue-500 to-purple-600 text-5xl">
            👨‍💻
          </div>
        </div>

        {/* Title */}
        <h1 className="mb-4 text-5xl font-bold text-gray-900 md:text-7xl dark:text-white">
          {personalInfo.name}
        </h1>

        {/* Subtitle */}
        <p className="mb-6 text-2xl text-gray-600 md:text-3xl dark:text-gray-400">
          {personalInfo.title}
        </p>

        {/* Bio */}
        <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
          {personalInfo.bio}
        </p>

        {/* CTA Buttons */}
        <div className="mb-12 flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            href="/projects"
            className="rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
          >
            查看我的作品
          </Link>
          <a
            href={`mailto:${personalInfo.email}`}
            className="rounded-lg border-2 border-blue-600 px-8 py-3 font-semibold text-blue-600 transition-colors hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-gray-800"
          >
            联系我
          </a>
        </div>

        {/* Social Links */}
        <div className="flex justify-center gap-6">
          {socialLinks.map(link => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-gray-700 transition-colors hover:bg-blue-600 hover:text-white dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-blue-600"
              title={link.name}
            >
              <span className="text-lg">
                {link.icon === 'github' && '🐙'}
                {link.icon === 'twitter' && '𝕏'}
                {link.icon === 'linkedin' && '💼'}
                {link.icon === 'mail' && '✉️'}
              </span>
            </a>
          ))}
        </div>

        {/* Scroll Indicator */}
        <div className="mt-16 animate-bounce">
          <svg
            className="mx-auto h-6 w-6 text-gray-600 dark:text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </div>
    </section>
  )
}
