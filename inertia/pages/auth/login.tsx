import { Head } from '@inertiajs/react'
import FlashMessages from '~/components/flash_message'
import { useForm } from '@inertiajs/react'
import { Button, Input, Label } from '~/components/form'
import React from 'react'

export default function Home() {
  return (
    <div className='bg-background text-foreground'>
      <Head title="Login" />
      <div className="flex items-center justify-center h-screen flex-col gap-4">
        <FlashMessages />
        <LoginForm />
      </div>
    </div>
  )
}

function LoginForm() {
  const { setData, data, post, processing, errors, reset } = useForm({
    email: '',
    password: '',
  })

  function submit(e: React.FormEvent) {
    e.preventDefault()
    post('/login', { onFinish: () => reset('password') })
  }
  return (
    <div>
      <div className="flex items-center justify-center flex-col gap-4 bg-card rounded-3xl p-5 min-w-[300px] text-card-foreground">
        <div className="flex flex-col gap-2">
          <form onSubmit={submit} className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <Label htmlFor="email" className='block text-xl font-medium'>
                Email
              </Label>
              <Input
                id="email"
                value={data.email}
                className="min-w-[250px]"
                type="email"
                aria-invalid={!!errors.email}
                onChange={(e) => setData('email', e.target.value)}
              ></Input>
              {errors.email && <span className="text-sm text-destructive">{errors.email}</span>}
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="password" className='block text-xl font-medium'>
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={data.password}
                aria-invalid={!!errors.password}
                onChange={(e) => setData('password', e.target.value)}
              ></Input>
              {errors.password && (
                <span className="text-sm text-destructive">{errors.password}</span>
              )}
            </div>
            <Button className="m-auto mt-6 px-7 flex items-center gap-1">{processing ? 'Login ...' : 'Login'}</Button>
          </form>
        </div>
      </div>
    </div>
  )
}
