import { SyntheticEvent } from "react"

export type ButtonPanelProps = {
  buttons: {
    className?: string
    title: string
    clickHandler(evt: SyntheticEvent): void
  }[]
}

export function ButtonPanel({ buttons }: ButtonPanelProps) {
  return (
    <>
      {buttons.map(({ className, title, clickHandler }) => (
        <div key={title} className={`add-producer clickable ${className || ""}`} onClick={clickHandler}>
          {title}
        </div>
      ))}
    </>
  )
}
