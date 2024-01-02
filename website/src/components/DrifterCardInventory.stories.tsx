import type { Meta, StoryObj } from '@storybook/react'
import DrifterCardInventory from '@/components/DrifterCardInventory'
import { DEMO_MAKE_PROGRESS } from '@/dummyData/drifterCards'

const meta = {
  title: 'Cards/DrifterCardInventory',
  component: DrifterCardInventory,
  argTypes: {
    onCardSelect: { action: 'Select card' }
  },
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof DrifterCardInventory>

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
