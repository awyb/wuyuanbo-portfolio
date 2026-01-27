import dotenv from 'dotenv'
import path from 'path'
import { neon } from '@neondatabase/serverless'

// 加载 .env.local 文件
const envPath = path.join(process.cwd(), '.env.local')
const envConfig = dotenv.config({ path: envPath })

if (envConfig.error) {
  console.warn('Warning: Failed to load .env.local file:', envConfig.error.message)
}

// 直接创建 sql 实例
export const sql = neon(process.env.DATABASE_URL || '')

// 测试数据库连接
export async function testConnection() {
  try {
    const result = await sql`SELECT NOW()`
    console.log('✅ 数据库连接成功:', result[0])
    return { success: true, message: '数据库连接成功', data: result[0] }
  } catch (error) {
    console.error('❌ 数据库连接失败:', error)
    return {
      success: false,
      message: '数据库连接失败',
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

// 获取数据库表列表
export async function getTables() {
  try {
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `
    return { success: true, tables: tables.map(t => t.table_name) }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}
