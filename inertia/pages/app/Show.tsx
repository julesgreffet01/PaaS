import Layout from '~/components/app/layout'
import { Head } from '@inertiajs/react'
import { InferPageProps } from '@adonisjs/inertia/types'
import type AppController from '#controllers/app_controller'
import { useState } from 'react'
import { FaDocker, FaTimesCircle } from 'react-icons/fa'
import { LuAppWindow } from 'react-icons/lu'
import { CiCircleCheck, CiCircleRemove } from 'react-icons/ci'
import { FiDatabase } from 'react-icons/fi'
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
            <div className="grid grid-cols-4 gap-4 my-6">
              <div className="col-span-3 flex flex-col gap-4 border border-ring rounded-lg shadow-sm hover:shadow-xs hover:shadow-ring transition-shadow duration-200 p-4">
                <h1 className="text-3xl font-bold">Containers</h1>
                <div className="w-full h-[0.1px] bg-ring"></div>
                <div className="grid grid-cols-6 gap-4 min-h-[50px]">
                  {props.containers?.map((container) => (
                    <div
                      className="col-span-3 bg-accent rounded-base p-2 text-accent-foreground flex flex-col gap-3"
                      key={container.info.Id}
                    >
                      <div className="flex justify-between gap-2">
                        <h2 className="font-medium max-w-2/3">{container.info.Names[0].replace(/^\//, '')}</h2>
                        <ContainerIcon name={container.info.Names[0]} />

                      </div>
                      <div className='flex justify-between gap-2'>
                        <p>cpu : {container.stats.cpuPercent}%</p>
                        <p>ram : {container.stats.memoryPercent}%</p>
                      </div>
                      <div className='flex justify-between gap-2'>
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
                        <p className="font-medium">
                          {container.info.Status.split(' ')[0]}
                        </p>
                      </div>

                    </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="h-fit flex flex-col gap-4 border border-ring rounded-lg shadow-sm hover:shadow-xs hover:shadow-ring transition-shadow duration-200 p-4 col-span-1">
                <h1 className="text-3xl font-bold">Infos</h1>
                <div className="w-full h-[0.1px] bg-ring"></div>
              </div>
              <div className="col-span-4 flex flex-col gap-4 border border-ring rounded-lg shadow-sm hover:shadow-xs hover:shadow-ring transition-shadow duration-200 p-4">
                <h1 className="text-3xl font-bold">Deployments Logs</h1>
                <div className="w-full h-[0.1px] bg-ring"></div>
                <div className="flex flex-col gap-4 min-h-[50px]">
                  {props.deployLogs?.map((log) => (
                    <div className="flex justify-between items-center gap-2 bg-accent p-2">
                      <div className="flex p-2 items-center gap-2 rounded-lg bg-green-800 text-destructive-foreground text-xl">
                        <FiDatabase />
                      </div>
                      <p className="text-sm">{log.errorLogs}</p>
                      {log.status ? (<div className="flex justify-center items-center w-fit bg-accent text-accent-foreground rounded-base gap-1.5 py-0.5 px-1.5"><CiCircleCheck/>success</div>):(<div className="flex justify-center items-center w-fit bg-destructive text-destructive-foreground rounded-base gap-1.5 py-0.5 px-1.5"><FaTimesCircle/>error</div>)}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
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
