import styles from "./LoadingSpinner.module.css"

interface LoadingSpinnerProps {
  message?: string
}

export default function LoadingSpinner({
  message = "加载中..."
}: LoadingSpinnerProps) {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.spinner}></div>
      <span>{message}</span>
    </div>
  )
}
