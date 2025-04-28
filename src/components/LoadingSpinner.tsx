interface LoadingSpinnerProps {
  message?: string
}

export default function LoadingSpinner({ message = "加载中..." }: LoadingSpinnerProps) {
  return (
    <div className="loading">
      <div className="spinner"></div>
      <span>{message}</span>
    </div>
  )
}