import React, { type MouseEventHandler } from 'react'

interface CardProps {
  onClick?: MouseEventHandler<HTMLElement>
  children?: React.ReactNode
}

// Generic card UI element
export default function Card(props: CardProps): React.ReactNode {
  return (
    <article
      onClick={props.onClick}
      className='h-full rounded-lg border-2 border-amber-400 bg-slate-900 p-2'
    >
      {props.children}
    </article>
  )
}
