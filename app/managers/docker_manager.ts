import Docker from 'dockerode'
import { spawn } from 'node:child_process'
import { constants } from 'node:fs'
import { join } from 'node:path'
import { access } from 'node:fs/promises'

export default class DockerManager {
  private docker: Docker
  constructor() {
    this.docker = new Docker()
  }

  async getContainers() {
    try {
      const containers = await this.docker.listContainers({ all: true })
      return containers.map((container) => ({
        id: container.Id,
        names: (container.Names || []).map((n) => n.replace(/^\/+/, '')),
        status: container.State,
        image: container.Image,
      }))
    } catch (error) {
      console.error('Error fetching containers:', error)
      throw error
    }
  }

  async getContainerLogs(containerId: string) {
    try {
      const container = this.docker.getContainer(containerId)
      return await container.logs({ stdout: true, stderr: true, follow: true })
    } catch (error) {
      console.error('Error fetching container logs:', error)
      throw error
    }
  }

  async getContainersByService(serviceName: string) {
    if (!serviceName || !serviceName.trim()) {
      throw new Error('Service name is required to fetch containers.')
    }

    const needle = `${serviceName}-`
    const list = await this.docker.listContainers({ all: true })

    const matched = list.filter((c) =>
      (c.Names ?? []).some((n) => n.replace(/^\//, '').includes(needle))
    )

    // enrichir avec stats CPU & RAM
    const containers = await Promise.all(
      matched.map(async (info) => {
        const handle = this.docker.getContainer(info.Id)
        const stats = (await handle.stats({ stream: false })) as any

        // RAM
        const memoryUsage = stats.memory_stats?.usage ?? 0
        const memoryLimit = stats.memory_stats?.limit ?? 0
        const memoryPercent =
          memoryUsage > 0 && memoryLimit > 0 ? (memoryUsage / memoryLimit) * 100 : 0

        // CPU
        const cpuDelta =
          stats.cpu_stats.cpu_usage.total_usage - stats.precpu_stats.cpu_usage.total_usage
        const systemDelta = stats.cpu_stats.system_cpu_usage - stats.precpu_stats.system_cpu_usage

        const cpuPercent =
          systemDelta > 0 ? (cpuDelta / systemDelta) * stats.cpu_stats.online_cpus * 100 : 0

        return {
          info, // infos brutes de listContainers
          handle, // handle Dockerode
          stats: {
            cpuPercent: Number(cpuPercent.toFixed(2)),
            memoryPercent: Number(memoryPercent.toFixed(2)),
            memoryUsage,
            memoryLimit,
          },
        }
      })
    )

    return containers
  }

  async createContainersService(url: string) {
    return new Promise<string>((resolve, reject) => {
      const docker = spawn('docker', ['compose', 'up', '-d', '--wait'], { cwd: url })

      let stdout = ''
      let stderr = ''

      docker.stdout.setEncoding('utf8')
      docker.stderr.setEncoding('utf8')

      docker.stdout.on('data', (chunk) => {
        stdout += chunk
      })
      docker.stderr.on('data', (chunk) => {
        stderr += chunk
        console.error(chunk)
      })

      docker.on('error', reject)
      docker.on('close', (code) => {
        if (code === 0) resolve(stdout)
        else reject(new Error(stderr.trim() || `docker exited with code ${code}`))
      })
    })
  }

  async verifyFiles(destDir: string) {
    const requiredFiles = [
      ['compose.yml', 'docker-compose.yml'], // au moins un des deux
      ['Dockerfile'],
    ]

    for (const group of requiredFiles) {
      let found = false

      for (const file of group) {
        try {
          const filePath = join(destDir, file)
          await access(filePath, constants.F_OK)
          found = true
          break
        } catch {}
      }

      if (!found) return false
    }
  }
}
