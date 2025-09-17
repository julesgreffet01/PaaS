import vine from '@vinejs/vine'

export const appValidator = vine.compile(
  vine.object({
    appName: vine.string().trim(),
    typeAppId: vine.number().positive(),
  })
)
