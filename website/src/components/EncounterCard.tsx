import Image from 'next/image'
import React, { type MouseEventHandler, useState } from 'react'
// import exampleImage from '@/../public/buffalo.jpg'
import {
  type EncounterRisk,
  type EncounterChoice,
  type EncounterCardData
} from '@/types/encounter'
import SkillIcon from '@/components/SkillIcon'
import Card from './Card'

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

export default function EncounterCard(props: {
  data: EncounterCardData
  onChooseOption: (optionIndex: number) => void
}): React.ReactNode {
  const { onChooseOption } = props
  const { title, description, choices, image } = props.data
  return (
    <Card>
      <p className='text-xl'>{title}</p>
      <Image
        alt={image.alt}
        className='w-full'
        height={image.height}
        width={image.width}
        src={image.src}
        priority
      />
      <p>{description}</p>
      {choices.map((choice, i) => (
        <EncounterCardChoice
          key={i}
          onClick={() => {
            onChooseOption(i)
          }}
          {...choice}
        />
      ))}
    </Card>
  )
}
