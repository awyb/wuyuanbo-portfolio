import { marked } from 'marked'

/**
 * Convert Markdown content to HTML
 * @param markdown - The markdown string to convert
 * @returns HTML string
 */
export async function markdownToHtml(markdown: string): Promise<string> {
  return await marked(markdown)
}
