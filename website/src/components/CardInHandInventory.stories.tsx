import type { Meta, StoryObj } from '@storybook/react'
import CardInHandInventory from '@/components/CardInHandInventory'
import { DEMO_MAKE_PROGRESS } from '@/dummyData/cardsInHand'

const meta = {
  title: 'Cards/CardInHandInventory',
  component: CardInHandInventory,
  argTypes: {
    onCardSelect: { action: 'Select card' }
  },
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof CardInHandInventory>

export default meta
type Story = StoryObj<typeof meta>

export const EmptyHand: Story = {
  args: {
    cards: []
  }
}

export const MakeProgressOne: Story = {
  args: {
    cards: [DEMO_MAKE_PROGRESS]
  }
}

export const MakeProgressThree: Story = {
  args: {
    cards: [DEMO_MAKE_PROGRESS, DEMO_MAKE_PROGRESS, DEMO_MAKE_PROGRESS]
  }
}
