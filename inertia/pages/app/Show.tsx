import Layout from '~/components/app/layout'
import { Head } from '@inertiajs/react'
import { InferPageProps } from '@adonisjs/inertia/types'
import type AppController from '#controllers/app_controller'
import { useState } from 'react'
import {
  FaDocker,
  FaEnvelope,
  FaFolderPlus,
  FaGitAlt,
  FaGithub,
  FaGlobe,
  FaPlus,
  FaRocket,
} from 'react-icons/fa'
import { LuAppWindow, LuArrowUpDown } from 'react-icons/lu'
import { CiCircleCheck, CiCircleRemove } from 'react-icons/ci'
import { FiDatabase } from 'react-icons/fi'
import { Button } from '~/components/form'
import Badge from '~/components/app/Badge'

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
            <div className="grid grid-cols-4 gap-4 my-6">
              <div className="h-fit col-span-3 flex flex-col gap-4 border border-ring rounded-lg hover:shadow-sm hover:shadow-ring transition-shadow duration-200 p-4">
                <h1 className="text-3xl font-bold">Containers</h1>
                <div className="w-full h-[0.1px] bg-ring"></div>
                <div className="grid grid-cols-3 gap-4 min-h-[50px]">
                  {props.containers?.map((container) => (
                    <div
                      className="col-span-1 bg-accent rounded-base p-2 text-accent-foreground flex flex-col gap-3"
                      key={container.info.Id}
                    >
                      <div className="flex justify-between mb-3">
                        <h2 className="font-medium max-w-2/3">
                          {container.info.Names[0].replace(/^\//, '')}
                        </h2>
                        <ContainerIcon name={container.info.Names[0]} />
                      </div>
                      <div className="flex justify-between gap-2">
                        <p>cpu : {container.stats.cpuPercent}%</p>
                        <p>ram : {container.stats.memoryPercent}%</p>
                      </div>
                      <div className="flex justify-between gap-2">
                        <Button className="text-base !py-1 !px-7">Logs</Button>
                        <div
                          className={`flex h-fit py-1 px-2 text-xs items-center gap-0.5 rounded-lg ${
                            container.info.Status.toLowerCase().includes('running') ||
                            container.info.Status.toLowerCase().includes('up')
                              ? 'bg-green-800 text-destructive-foreground'
                              : 'bg-destructive text-destructive-foreground'
                          }`}
                        >
                          {container.info.Status.toLowerCase().includes('running') ||
                          container.info.Status.toLowerCase().includes('up') ? (
                            <CiCircleCheck className="text-xl" />
                          ) : (
                            <CiCircleRemove className="text-xl" />
                          )}
                          <p className="font-medium">{container.info.Status.split(' ')[0]}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="h-fit flex flex-col gap-4 border border-ring rounded-lg hover:shadow-sm hover:shadow-ring transition-shadow duration-200 p-4 col-span-1">
                <h1 className="text-3xl font-bold">Infos</h1>
                <div className="w-full h-[0.1px] bg-ring"></div>
                <div className="flex flex-col gap-4">
                  <p className="text-sm">
                    Last update :{' '}
                    {new Date(props.app.services[0].updatedAt).toLocaleDateString('fr-FR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    })}
                  </p>
                  <p className="text-sm">Dns : {props.app.services[0].dnsAddress}</p>
                  <div className="flex justify-around">
                    <a
                      href={props.app.services[0].repoUrl}
                      target="_blank"
                      className="flex justify-center items-center gap-1"
                    >
                      <FaGithub className="text-xl text-primary" />
                    </a>
                    <Badge className="text-sm" status={props.app.services[0].status} />
                  </div>
                  <Button
                    onClick={handleCopy}
                    className="text-base !py-1 !px-7 flex items-center justify-center gap-2"
                  >
                    {copied ? (
                      <>
                        Copié
                        <CiCircleCheck className="text-primary-foreground text-lg" />
                      </>
                    ) : (
                      'WebHook'
                    )}
                  </Button>
                  <Button className="text-base !py-1 !px-7 flex items-center justify-center gap-2">
                    Upgrade
                  </Button>
                  <Button className="text-base !py-1 !px-7 flex items-center justify-center gap-2">
                    Edit
                  </Button>
                </div>
              </div>
              <div className="col-span-4 flex flex-col gap-4 border border-ring rounded-lg hover:shadow-sm hover:shadow-ring transition-shadow duration-200 p-4">
                <h1 className="text-3xl font-bold">Deployments Logs</h1>
                <div className="w-full h-[0.1px] bg-ring"></div>
                <div className="flex flex-col gap-4 min-h-[50px]">
                  {props.deployLogs?.map((log) => (
                    <div className="flex justify-between items-center gap-2 bg-accent p-2">
                      <div className="flex p-2 items-center gap-2 rounded-lg bg-input text-secondary-foreground text-xl">
                        <StepIcon step={log.step} />
                      </div>
                      {log.isSuccess ? (
                        <>
                        <p className="text-sm">{log.step}</p>
                        <div className="flex justify-center items-center w-fit bg-green-800 text-destructive-foreground rounded-base gap-1.5 py-0.5 px-1.5">
                          <CiCircleCheck />
                          success
                        </div>
                        </>
                      ) : (
                        <>
                          <p className="text-sm">{log.errorLogs}</p>
                          <div className="flex justify-center items-center w-fit bg-destructive text-destructive-foreground rounded-base gap-1.5 py-0.5 px-1.5">
                            <CiCircleRemove />
                            error
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {props.app.typeAppId === 1 && (
            <div className="my-6">
              <div className="w-full p-2">
                <Button className="flex items-center text-sm gap-2" onClick={() => window.location.href=`${props.app.id}/service/add`}><FaPlus/>Add Service</Button>
              </div>
              <div className="flex gap-4">
                {props.app.services ? (
                  props.app.services.map((service: any, index: number) => (
                    <div className="border border-ring rounded-lg p-5" key={index}>{service.name}</div>
                  ))
                ) : (
                  <p>pas de services pour le moment</p>
                )}
              </div>
            </div>
          )

          }
        </>
      </Layout>
    </>
  )
}

function ContainerIcon({ name }: { name: string }) {
  const lowerName = name.toLowerCase()

  let icon
  if (lowerName.includes('db')) {
    icon = <FiDatabase />
  } else if (lowerName.includes('app')) {
    icon = <LuAppWindow />
  } else {
    icon = <FaDocker />
  }

  return (
    <div className="w-[30px] h-[30px] rounded-base bg-input text-secondary-foreground flex justify-center items-center">
      {icon}
    </div>
  )
}

function StepIcon({ step }: { step: string }) {
  switch (step.toLowerCase()) {
    case "verification du dockerfile et compose":
      return <FaDocker />
    case "git clone repo":
      return <FaGitAlt />
    case "mkdir":
      return <FaFolderPlus />
    case "environnement":
      return <FaEnvelope />
    case "lancement docker":
      return <FaDocker />
    case "lancement des migrations":
      return <LuArrowUpDown/>
    case "changement caddy":
      return <FaGlobe />
    default:
      return <FaRocket />
  }
}

