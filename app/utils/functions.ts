import path from 'node:path'
import { promises as fs } from 'node:fs'
export async function environnement(env: string, destDir: string, filename = '.env') {
  const targetDir = path.resolve(destDir)
  const targetPath = path.join(targetDir, filename)
  const tmpPath = path.join(
    targetDir,
    `.${filename}.tmp-${Date.now()}-${Math.random().toString(36).slice(2)}`
  )

  await fs.mkdir(targetDir, { recursive: true })

  const content = (env.replace(/\r\n?/g, '\n').endsWith('\n') ? env : env + '\n').replace(
    /\r\n?/g,
    '\n'
  )

  await fs.writeFile(tmpPath, content, { encoding: 'utf8', mode: 0o600 })
  await fs.rename(tmpPath, targetPath)

  try {
    await fs.chmod(targetPath, 0o600)
  } catch {}

  return targetPath
}
