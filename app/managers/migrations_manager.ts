import { spawn } from 'node:child_process'

export default class MigrationsManager {
  makeMigration(url: string, migrations: string) {
    return new Promise<string>((resolve, reject) => {
      const exec = spawn(
        'docker',
        ['compose', 'exec', 'app', 'sh', '-lc', '-T', `"${migrations}"`],
        { cwd: url }
      )

      let stdout = ''
      let stderr = ''

      exec.stdout.setEncoding('utf8')
      exec.stderr.setEncoding('utf8')

      exec.stdout.on('data', (chunk) => {
        stdout += chunk
      })
      exec.stderr.on('data', (chunk) => {
        stderr += chunk
        console.error(chunk)
      })

      exec.on('error', reject)
      exec.on('close', (code) => {
        if (code === 0) resolve(stdout)
        else reject(new Error(stderr.trim() || `exec exited with code ${code}`))
      })
    })
  }
}
