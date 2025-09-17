import Layout from '~/components/app/layout'
import { Head } from '@inertiajs/react'
import { InferPageProps } from '@adonisjs/inertia/types'
import type AppController from '#controllers/app_controller'
import Badge from '~/components/app/Badge'
import { useState } from 'react'
import { Button } from '~/components/form'

export default function Home(props: InferPageProps<AppController, 'show'>) {
  const [copied, setCopied] = useState(false)
  const link = props.app.services[0]
    ? `https://paas.greffetjules.fr/webhook/${props.app.services[0].id}`
    : ''
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link)
      setCopied(true)
      setTimeout(() => setCopied(false), 5000)
    } catch (err) {
      console.error('Erreur de copie :', err)
    }
  }
  return (
    <>
      <Head title="Show" />
      <Layout title={props.app.name}>
        <>
          {props.app.typeAppId === 2 && (
            <div className="flex items-center justify-center gap-4 my-5">
              {props.app.services[0] && (
                <>
                  {props.app.services[0].webhook && (
                    <Button onClick={handleCopy} className="text-sm !px-2 !py-1">
                      {copied ? 'Copié ✓' : 'Webhook'}
                    </Button>
                  )}
                  <h2 className="font-medium">nom du service : {props.app.services[0].name}</h2>
                  <h2 className="font-medium">dns : {props.app.services[0].dnsAddress}:{props.app.services[0].port}</h2>
                  <a href={props.app.services[0].repoUrl} target="_blank" className="hover:underline">repo git</a>
                  <h2 className="font-medium">type : {props.app.services[0].typeService.name}</h2>
                  <Badge status={!!props.app.services[0].isRunning} className="text-xs" />
                </>
              )}
            </div>
          )}
        </>
      </Layout>
    </>
  )
}
