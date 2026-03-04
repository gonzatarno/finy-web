import fs from 'fs'
import path from 'path'

// Try multiple possible paths
const possiblePaths = [
  path.join(process.cwd(), 'app/layout.tsx'),
  path.join(process.cwd(), '..', 'app/layout.tsx'),
  '/app/layout.tsx',
  path.resolve('app/layout.tsx'),
]

let layoutPath = null
for (const p of possiblePaths) {
  if (fs.existsSync(p)) {
    layoutPath = p
    console.log('[v0] Found layout.tsx at:', p)
    break
  }
  console.log('[v0] Not found at:', p)
}

if (!layoutPath) {
  console.log('[v0] cwd:', process.cwd())
  console.log('[v0] __dirname equiv:', import.meta.url)
  process.exit(1)
}

let content = fs.readFileSync(layoutPath, 'utf8')
console.log('[v0] File has duplicate fonts:', /V0_Font_Poppins/.test(content))

content = content.replace(
  `import { Poppins, Geist_Mono, Source_Serif_4, Poppins as V0_Font_Poppins, Geist_Mono as V0_Font_Geist_Mono, Source_Serif_4 as V0_Font_Source_Serif_4 } from 'next/font/google'`,
  `import { Poppins, Geist_Mono, Source_Serif_4 } from 'next/font/google'`
)
content = content.replace("\n// Initialize fonts", "")
content = content.replace(`\nconst _poppins = V0_Font_Poppins({ subsets: ['latin'], weight: ["100","200","300","400","500","600","700","800","900"] })`, "")
content = content.replace(`\nconst _geistMono = V0_Font_Geist_Mono({ subsets: ['latin'], weight: ["100","200","300","400","500","600","700","800","900"] })`, "")
content = content.replace(`\nconst _sourceSerif_4 = V0_Font_Source_Serif_4({ subsets: ['latin'], weight: ["200","300","400","500","600","700","800","900"] })`, "")
content = content.replace(/\n{3,}/g, '\n\n')

fs.writeFileSync(layoutPath, content, 'utf8')
console.log('[v0] Done. Remaining duplicates:', /V0_Font_Poppins/.test(fs.readFileSync(layoutPath, 'utf8')))
