import React from 'react'
import { router } from '@inertiajs/react'
import FlashMessages from '~/components/flash_message'

interface LayoutProps {
  children: React.ReactNode
  title: string
}

export default function Layout(props: LayoutProps) {
  return (
    <div className="bg-background ">
      <header className="bg-muted text-muted-foreground px-6 py-3 rounded-full max-w-5xl mx-auto mt-4 text-2xl">
        <nav className="flex items-center gap-15">
          <a href="/" className="font-semibold hover:underline">
            Home
          </a>
          <a href="/publication" className="font-semibold hover:underline">
            Publication
          </a>
          <a href="/containers" className="font-semibold hover:underline">
            Containers
          </a>
          <LogoutButton />
        </nav>
      </header>
      <main className="max-w-5xl m-auto my-10">
        <div className="mt-10 flex flex-col items-center justify-center gap-4">
          <FlashMessages />
          <div className="bg-card text-card-foreground rounded-lg shadow-sm py-0.5 px-10 w-4xl">
            <h1 className="text-3xl font-bold underline text-center mt-5 text-foreground">
              {props.title}
            </h1>
            <div>{props.children}</div>
          </div>
        </div>
      </main>
    </div>
  )
}

function LogoutButton() {

  const onLogout = () => router.delete('/logout')

  return (
    <div className="inline ml-auto">
      <div className="flex items-center gap-4 bg-primary px-4 py-2 rounded-full text-xl hover:bg-primary-hover transition-colors hover:cursor-pointer text-primary-foreground">
        <button type="submit" className="font-semibold hover:cursor-pointer" onClick={onLogout}>
          Logout
        </button>
      </div>
    </div>
  )
}
