import Layout from '~/components/app/layout'
import { Head } from '@inertiajs/react'
import { InferPageProps } from '@adonisjs/inertia/types'
import type AppController from '#controllers/app_controller'
import Badge from '~/components/app/Badge'
import { ShowAppForm } from '~/components/app/forms'

export default function Home(props: InferPageProps<AppController, 'home'>) {
  return (
    <>
      <Head title="Home" />
      <Layout title="Apps Page">
            <div className="flex items-center mt-5 gap-10">
              <table className="min-w-full text-center">
                <thead className="text-xl border-b">
                <tr>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Type</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">DNS</th>
                  <th className="px-4 py-2">Details</th>
                </tr>
                </thead>
                <tbody>
                {props.apps.map((app) => (
                  <tr key={app.id}>
                    <td className="px-4 py-2">{app.name}</td>
                    <td className="px-4 py-2">{app.typeApp.name}</td>
                    <td className="px-4 py-2">
                      <Badge className="text-xs" status={!!app.services.every((service: { isRunning: boolean }) => service.isRunning)} />
                    </td>
                    <td className="px-4 py-2">
                      <ul className="list-disc list-inside">
                        {app.typeApp.name === 'microservice'
                          ? app.services.map((service: any, index: number) =>{
                            return (
                              service.dnsAddress && <li key={index}>{service.dnsAddress}</li>
                            )
                          })
                          : app.services[0] && <li>{app.services[0].dnsAddress}</li>
                        }
                      </ul>
                    </td>
                    <td className="px-4 py-2">
                      <ShowAppForm appId={app.id}/>
                    </td>
                  </tr>
                ))}
                </tbody>
              </table>
            </div>
      </Layout>
    </>
  )
}


