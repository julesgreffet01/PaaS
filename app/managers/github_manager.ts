import { spawn } from 'node:child_process'
import { mkdir } from 'node:fs/promises'
import { dirname } from 'node:path'
import env from '#start/env'

export default class GithubManager {
  async gitClone(url: string, destDir: string) {
    const token = env.get('GITHUB_TOKEN') ?? ''
    await mkdir(dirname(destDir), { recursive: true })

    const cloneUrl = token
      ? url.replace(/^https:\/\//, `https://${encodeURIComponent(token)}@`)
      : url

    await new Promise<void>((resolve, reject) => {
      const child = spawn('git', ['clone', '--depth', '1', cloneUrl, destDir], {
        stdio: 'inherit',
      })

      child.once('error', reject)
      child.once('exit', (code) =>
        code === 0 ? resolve() : reject(new Error(`git clone failed (exit code ${code})`))
      )
    })

    return destDir
  }
}
