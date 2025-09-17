import { usePage } from '@inertiajs/react'

export default function FlashMessages() {
  const { flash } = usePage().props as {
    flash?: { error?: string; success?: string }
  }

  if (!flash || (!flash.error && !flash.success)) {
    return null
  }

  return (
    <div>
      {flash.error && (
        <div className="bg-destructive text-destructive-foreground px-4 py-2 rounded shadow">
          {flash.error}
        </div>
      )}
      {flash.success && (
        <div className="bg-accent text-accent-foreground px-4 py-2 rounded shadow">
          {flash.success}
        </div>
      )}
    </div>
  )
}
