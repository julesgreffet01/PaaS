import { promises as fs } from 'node:fs'
import path from 'node:path'

export default class DirManager {
  async createDir(destDir: string, dirName: string): Promise<void> {
    const fullPath = path.join(destDir, dirName)
    await fs.mkdir(fullPath, { recursive: true })
  }
}
