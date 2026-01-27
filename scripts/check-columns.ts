import dotenv from 'dotenv'
import path from 'path'

// 显式加载 .env.local 文件
dotenv.config({ path: path.join(__dirname, '../.env.local') })

import { sql } from '../lib/db'

async function checkColumns() {
  const columns = await sql`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'projects' 
    AND table_schema = 'public' 
    ORDER BY ordinal_position
  `

  console.log('Projects 表结构:')
  columns.forEach((c: any) => {
    console.log(`  ${c.column_name}: ${c.data_type}`)
  })
}

checkColumns().catch(console.error)
