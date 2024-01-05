import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { DrifterCardInventory } from '@/components/DrifterCardInventory'
import { LoadingMiniDrifterCard, MiniDrifterCard } from './MiniDrifterCard'
import { MakeProgress } from './MiniDrifterCard.stories'

const meta = {
  title: 'Cards/DrifterCardInventory',
  component: DrifterCardInventory,
  argTypes: {},
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof DrifterCardInventory>

export default meta
type Story = StoryObj<typeof meta>

export const NoCards: Story = {
  args: {
    children: []
  }
}

const exampleMiniDrifterCardArgs = {
  ...MakeProgress.args,
  onCardSelect: (): void => {}
}

export const MakeProgressOne: Story = {
  args: {
    children: <MiniDrifterCard {...exampleMiniDrifterCardArgs} />
  }
}

export const ThreeCardsOneLoading: Story = {
  args: {
    children: (
      <>
        <MiniDrifterCard {...exampleMiniDrifterCardArgs} />
        <MiniDrifterCard {...exampleMiniDrifterCardArgs} />
        <LoadingMiniDrifterCard />
      </>
    )
  }
}
