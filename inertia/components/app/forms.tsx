import { Button } from '~/components/form'
import { useForm } from '@inertiajs/react'
import React from 'react'

interface appProps {
  appId: number
}

export function UpgradeForm(props: appProps) {
  const { put } = useForm()
  function submit(e: React.FormEvent) {
    e.preventDefault()
    put(`/app/upgrade/${props.appId}`)
  }
  return(
    <form onSubmit={submit}>
      <Button className="text-base font-semibold">Upgrade</Button>
    </form>
  )
}

export function ShowAppForm(props: appProps) {
  const { get } = useForm()
  function submit(e: React.FormEvent) {
    e.preventDefault()
    get(`/app/${props.appId}`)
  }
  return(
    <form onSubmit={submit}>
      <Button className="text-base font-semibold">Show</Button>
    </form>
  )
}
