import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa'

interface BadgeProps {
  status: boolean;
  className?: string
}

export default function Badge(props: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full font-medium ${
        props.status
          ? 'bg-accent text-accent-foreground'
          : 'bg-destructive text-destructive-foreground'
      } ${props.className}`}
    >
      {props.status ? (
        <FaCheckCircle className="w-4 h-4 text-secondary-foreground" />
      ) : (
        <FaTimesCircle className="w-4 h-4 text-destructive-foreground" />
      )}
      {props.status ? 'running' : 'failed'}
    </span>
  )
}
