import Service from '#models/service'
import DockerManager from '#managers/docker_manager'
import { inject } from '@adonisjs/core'

@inject()
export default class CaddyManager {
  constructor(private readonly dockerManager: DockerManager) {}
  async createRoute(dns: string, port: number, service: Service) {
    const containers = await this.dockerManager.getContainersByService(service.name)
    let appContainerName: string | null = null
    for (const container of containers) {
      if (container.info.Names[0].includes('app')) {
        appContainerName = container.info.Names[0].replace(/^\//, '')
        break
      }
    }
    await fetch('http://caddy:2019/config/apps/http/servers/static/routes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        handle: [
          {
            handler: 'reverse_proxy',
            upstreams: [{ dial: `${appContainerName + ':' + port}` }],
          },
        ],
        match: [
          {
            host: [`${dns}`],
          },
        ],
        terminal: true,
      }),
    })
  }
}
