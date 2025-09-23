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

export async function dockerfile(content: string, destDir: string, filename = 'Dockerfile') {
  const targetDir = path.resolve(destDir)
  const targetPath = path.join(targetDir, filename)
  const tmpPath = path.join(
    targetDir,
    `.${filename}.tmp-${Date.now()}-${Math.random().toString(36).slice(2)}`
  )

  // On s’assure que le dossier existe
  await fs.mkdir(targetDir, { recursive: true })

  // Normalisation des fins de lignes
  const normalizedContent = (
    content.replace(/\r\n?/g, '\n').endsWith('\n') ? content : content + '\n'
  ).replace(/\r\n?/g, '\n')

  // Écriture dans un fichier temporaire
  await fs.writeFile(tmpPath, normalizedContent, { encoding: 'utf8', mode: 0o644 })

  // Remplacement atomique
  await fs.rename(tmpPath, targetPath)

  try {
    // Permissions en lecture seule (644 : lecture pour tous, écriture pour le proprio)
    await fs.chmod(targetPath, 0o644)
  } catch {}

  return targetPath
}

export async function composeFile(
  content: string,
  destDir: string,
  filename = 'compose.yml'
) {
  const targetDir = path.resolve(destDir)
  const targetPath = path.join(targetDir, filename)
  const tmpPath = path.join(
    targetDir,
    `.${filename}.tmp-${Date.now()}-${Math.random().toString(36).slice(2)}`
  )

  // S'assurer que le dossier existe
  await fs.mkdir(targetDir, { recursive: true })

  // Normalisation des fins de lignes
  const normalizedContent = (
    content.replace(/\r\n?/g, '\n').endsWith('\n') ? content : content + '\n'
  ).replace(/\r\n?/g, '\n')

  // Écriture dans un fichier temporaire
  await fs.writeFile(tmpPath, normalizedContent, { encoding: 'utf8', mode: 0o644 })

  // Remplacement atomique
  await fs.rename(tmpPath, targetPath)

  try {
    // Permissions lecture/écriture standard pour YAML (pas besoin de restreindre comme un .env)
    await fs.chmod(targetPath, 0o644)
  } catch {}

  return targetPath
}
