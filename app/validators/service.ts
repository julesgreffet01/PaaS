import vine from '@vinejs/vine'

export const serviceAppValidator = vine.compile(
  vine.object({
    serviceName: vine.string().trim(),
    repoURL: vine.string().trim(),
    migrations: vine.string().nullable(),
    webhook: vine.boolean(),
    branch: vine.string().nullable(),
    dns: vine.string().trim(),
    port: vine.number().nullable(),
    appId: vine.number().positive(),
    typeServiceId: vine.number().positive(),
  })
)

export const serviceDatabaseValidator = vine.compile(
  vine.object({
    serviceName: vine.string().trim(),
    dockerfile: vine.string().nullable(),
    compose: vine.string().trim(),
    typeServiceId: vine.number().positive(),
  })
)
