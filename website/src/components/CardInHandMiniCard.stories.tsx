import type { Meta, StoryObj } from '@storybook/react'
import { CardInHandMiniCard } from './CardInHandMiniCard'
import { DEMO_MAKE_PROGRESS } from '@/dummyData/cardsInHand'

const meta = {
  title: 'Cards/CardInHandMiniCard',
  component: CardInHandMiniCard,
  argTypes: {
    onCardSelect: { action: 'Select card' }
  },
  tags: ['autodocs'],
  parameters: {
    layout: 'centered'
  }
} satisfies Meta<typeof CardInHandMiniCard>

export default meta
type Story = StoryObj<typeof meta>

export const MakeProgress: Story = {
  args: {
    card: DEMO_MAKE_PROGRESS
  }
}
