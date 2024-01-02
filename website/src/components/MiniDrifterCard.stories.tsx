import type { Meta, StoryObj } from '@storybook/react'
import { MiniDrifterCard } from './MiniDrifterCard'
import { DEMO_MAKE_PROGRESS } from '@/dummyData/drifterCards'

const meta = {
  title: 'Cards/MiniDrifterCard',
  component: MiniDrifterCard,
  argTypes: {
    onCardSelect: { action: 'Select card' }
  },
  tags: ['autodocs'],
  parameters: {
    layout: 'centered'
  }
} satisfies Meta<typeof MiniDrifterCard>

export default meta
type Story = StoryObj<typeof meta>

export const MakeProgress: Story = {
  args: {
    card: DEMO_MAKE_PROGRESS
  }
}
