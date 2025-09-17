interface InputProps {
  'value'?: string
  'onChange': (e: React.ChangeEvent<HTMLInputElement>) => void
  'placeholder'?: string
  'type'?: string
  'disabled'?: boolean
  'id'?: string
  'aria-invalid'?: boolean
  'className'?: string
  'list'?: string
  'autoComplete'?: string
  'accept'?: string
  checked?: boolean
}
export function Input(props: InputProps) {
  return (
    <input
      id={props.id}
      type={props.type ?? 'text'}
      value={props.value}
      disabled={props.disabled ?? false}
      placeholder={props.placeholder}
      aria-invalid={props['aria-invalid'] ?? false}
      onChange={props.onChange}
      list={props.list}
      autoComplete={props.autoComplete}
      accept={props.accept}
      checked={props.checked ?? false}
      className={`bg-input text-input-foreground rounded px-3 py-2
                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
                 disabled:opacity-50 disabled:cursor-not-allowed
                 aria-invalid:border aria-invalid:border-destructive aria-invalid:ring-destructive/50 ${props.className ?? ''}`}
    />
  )
}

interface LabelProps {
  htmlFor?: string
  className?: string
  children: React.ReactNode
}

export function Label(props: LabelProps) {
  return (
    <label htmlFor={props.htmlFor} className={`text-sm font-medium ${props.className ?? ''}`}>
      {props.children}
    </label>
  )
}

interface ButtonProps {
  children: React.ReactNode
  className?: string
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
}

export function Button(props: ButtonProps) {
  return (
    <button
      onClick={props.onClick}
      className={`bg-primary text-primary-foreground rounded-md px-3 py-2
                       hover:bg-primary/90 hover:cursor-pointer
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-colors text-3xl font-medium ${props.className ?? ''}`}
    >
      {props.children}
    </button>
  )
}
