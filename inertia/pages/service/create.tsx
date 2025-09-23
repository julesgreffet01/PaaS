import { Head, useForm } from '@inertiajs/react'
import Layout from '~/components/app/layout'
import React from 'react'
import { Button, Input, Label } from '~/components/form'
import type { InferPageProps } from '@adonisjs/inertia/types'
import type AppController from '#controllers/app_controller'

export default function Publication(props: InferPageProps<AppController, 'publication'>) {
  const { setData, data, post, errors } = useForm<{
    serviceName: string
    typeServiceId: string
    dns: string
    env: File | null
    migrations: string,
    repoURL: string,
    port: string,
    webhook: boolean,
    branch: string,
    dockerfile: File | null,
    compose: File | null
  }>({
    serviceName: '',
    typeServiceId: '4',
    dns: '',
    env: null ,
    migrations: '',
    repoURL: '',
    port: '',
    webhook: false,
    branch: '',
    dockerfile: null,
    compose: null,
  })

  function publish(e: React.FormEvent) {
    e.preventDefault()
    post('')
  }
  return (
    <>
      <Head title="Add service" />
      <Layout title="Add service">
        <div className="flex items-center justify-center flex-col my-7">
          <form onSubmit={publish} className="flex flex-col gap-3 min-w-[350px]">
            <div className="flex flex-col gap-1">
              <Label className="block text-xl font-medium">Service Name</Label>
              <Input
                id="serviceName"
                value={data.serviceName}
                className="min-w-[250px]"
                type="text"
                aria-invalid={!!errors.serviceName}
                onChange={(e) => setData('serviceName', e.target.value)}
              />
              {errors.serviceName && <span className="text-sm text-destructive">{errors.serviceName}</span>}
            </div>
            <div className="flex flex-col gap-1">
              <Label className="block text-xl font-medium">Type de service</Label>
              <select
                id="typeServiceId"
                className="mt-1 w-full bg-input rounded-sm p-2"
                onChange={(e) => setData('typeServiceId', e.target.value)}
              >
                {props.types?.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
              {errors.typeServiceId && (
                <span className="text-sm text-destructive">{errors.typeServiceId}</span>
              )}
            </div>
            {(data.typeServiceId === '1' || data.typeServiceId === '3') && (
            <>
                <div className="flex flex-col gap-1">
                  <Label htmlFor="dns" className="block text-xl font-medium">
                    Dns
                  </Label>
                  <Input
                    id="dns"
                    type="text"
                    className="min-w-[250px]"
                    onChange={(e)=> setData('dns', e.target.value)}
                    value={data.dns}
                  />
                  {errors.dns && <span className="text-sm text-destructive">{errors.dns}</span>}
                </div>
                <div className="flex flex-col gap-1">
                  <Label htmlFor="env" className="block text-xl font-medium">
                    .env
                  </Label>
                  <Input
                    id="env"
                    className="min-w-[250px]"
                    onChange={(e) => {const file = e.target.files?.[0] ?? null
                      setData('env', file)
                    }}
                    accept=".env"
                    type="file"
                  />
                  {errors.env && <span className="text-sm text-destructive">{errors.env}</span>}
                </div>
                <div className="flex flex-col gap-1">
                  <Label htmlFor="migrations_cmd" className="block text-xl font-medium">
                    Commande migrations (avec seed si besoin)
                  </Label>
                  <Input
                    id="migrations_cmd"
                    type="text"
                    list="migrations-suggestions"
                    autoComplete="off"
                    className="min-w-[250px]"
                    onChange={(e)=> setData('migrations', e.target.value)}
                    value={data.migrations}
                  />
                  <datalist id="migrations-suggestions">
                    <option value="node ace migration:run --force && node ace db:seed"></option>
                    <option value="php artisan migrate --force && php artisan db:seed --force"></option>
                    <option value="npx prisma migrate deploy && npx prisma db seed"></option>
                  </datalist>
                  {errors.migrations && <span className="text-sm text-destructive">{errors.migrations}</span>}
                </div>
                <div className="flex flex-col gap-1">
                  <Label htmlFor="repo_url" className="block text-xl font-medium">
                    Git url
                  </Label>
                  <Input
                    id="repo_url"
                    onChange={(e) => setData('repoURL', e.target.value)}
                    type="text"
                    className="min-w-[250px]"
                    value={data.repoURL}
                  />
                  {errors.repoURL && <span className="text-sm text-destructive">{errors.repoURL}</span>}
                </div>
                <div className="flex flex-col gap-1">
                  <Label htmlFor="port" className="block text-xl font-medium">
                    Port
                  </Label>
                  <Input
                    id="port"
                    value={data.port}
                    type="number"
                    onChange={(e) => setData('port',e.target.value)}
                    className="min-w-[250px]"
                  />
                  {errors.port && <span className="text-sm text-destructive">{errors.port}</span>}
                </div>
                <div className="flex items-center gap-4 min-h-[40px]">
                  {/* Checkbox webhook */}
                  <div className="flex items-center gap-2">
                    <Label htmlFor="webhook" className="text-xl font-medium">
                      webhook
                    </Label>
                    <Input
                      id="webhook"
                      type="checkbox"
                      checked={data.webhook}
                      onChange={(e) => setData('webhook', e.target.checked)}
                    />
                    {errors.webhook && <span className="text-sm text-destructive">{errors.webhook}</span>}
                  </div>

                  {/* Champ branch réservé */}
                  {data.webhook && (
                    <div className="flex items-center gap-2">
                      <Label htmlFor="branch" className="text-xl font-medium">
                        branch de git
                      </Label>
                      <Input
                        id="branch"
                        type="text"
                        value={data.branch}
                        onChange={(e) => setData('branch', e.target.value)}
                        className="max-w-[150px]"
                      />
                      {errors.branch && <span className="text-sm text-destructive">{errors.branch}</span>}
                    </div>
                  )}
                </div>
              </>
            )}
            { data.typeServiceId === '2' && (
              <>
                <div className="flex flex-col gap-1">
                  <Label htmlFor="env" className="block text-xl font-medium">
                    Dockerfile
                  </Label>
                  <Input
                    id="dockerfile"
                    className="min-w-[250px]"
                    onChange={(e) => {const file = e.target.files?.[0] ?? null
                      setData('dockerfile', file)
                    }}
                    type="file"
                  />
                  {errors.dockerfile && <span className="text-sm text-destructive">{errors.dockerfile}</span>}
                </div>
                <div className="flex flex-col gap-1">
                  <Label htmlFor="env" className="block text-xl font-medium">
                    Compose
                  </Label>
                  <Input
                    id="compose"
                    className="min-w-[250px]"
                    onChange={(e) => {const file = e.target.files?.[0] ?? null
                      setData('compose', file)
                    }}
                    accept=".yml,.yaml"
                    type="file"
                  />
                  {errors.compose && <span className="text-sm text-destructive">{errors.compose}</span>}
                </div>
              </>
            )

            }
            <Button className="mt-2">Publish</Button>
          </form>
        </div>
      </Layout>
    </>
  )
}
