import Image from 'next/image'
import React, { type MouseEventHandler, useState } from 'react'
import exampleImage from '@/../public/buffalo.jpg'
import {
  type EncounterRisk,
  type EncounterChoice,
  type Skill
} from '@/types/encounter'

interface EncounterCardProps {
  title: string
  description: string
  choices: EncounterChoice[]
}

export function SkillIcon(props: { skill: Skill }): string {
  switch (props.skill) {
    case 'agility':
      return '🐇'
    case 'diy':
      return '🔧'
    case 'harmony':
      return '🕊'
    case 'luck':
      return '🃏'
  }
}

export function EncounterRiskTile(props: {
  risk: EncounterRisk
}): React.ReactNode {
  const [expand, setExpand] = useState<boolean>(false)

  if (!expand) {
    return (
      <span
        onClick={() => {
          setExpand(true)
        }}
      >
        {/* TODO: little icon here representing risk(s) */}
        [+]
      </span>
    )
  }

  return (
    <span
      onClick={() => {
        setExpand(false)
      }}
    >
      {'loseItem' in props.risk && (
        <span className='text-slate-500'>
          lose item(s): {props.risk.loseItem}
        </span>
      )}
      {'loseResource' in props.risk && (
        <span>lose resource(s): {props.risk.loseResource}</span>
      )}
      {'loomingDangerIncrease' in props.risk && (
        <span>looming danger increase +{props.risk.loomingDangerIncrease}</span>
      )}
    </span>
  )
}

export function EncounterCardChoice(
  props: EncounterChoice & { onClick: MouseEventHandler<HTMLButtonElement> }
): React.ReactNode {
  return (
    <button
      className='mt-1 flex w-full border border-amber-400 bg-amber-500/50 p-1'
      onClick={props.onClick}
    >
      <p className='flex-1'>
        <span>{props.description}</span>
      </p>

      <span className='text-2xl'>
        {'skill' in props.check && <SkillIcon skill={props.check.skill} />}
      </span>

      {/* Check */}
      <span>
        {'items' in props.check &&
          Object.entries(props.check.items).map(([itemName, quantity]) => (
            <span key={itemName}>
              {itemName}: {quantity}
            </span>
          ))}
      </span>

      {/* Risks */}
      <EncounterRiskTile risk={props.risk} />
    </button>
  )
}

export function Card(props: React.PropsWithChildren): React.ReactNode {
  return (
    <article className='rounded-lg border-2 border-amber-400 p-2'>
      {props.children}
    </article>
  )
}

export default function EncounterCard(
  props: EncounterCardProps
): React.ReactNode {
  return (
    <Card>
      <p className='text-xl'>{props.title}</p>
      <Image
        src={exampleImage}
        className='w-full'
        alt='Alt text here TODO'
        priority
      />
      <p>{props.description}</p>
      {props.choices.map((choice, i) => (
        <EncounterCardChoice
          key={i}
          onClick={() => {
            // TODO IMMEDIATELY
            console.log(`clicked ${i}`)
          }}
          {...choice}
        />
      ))}
    </Card>
  )
}
