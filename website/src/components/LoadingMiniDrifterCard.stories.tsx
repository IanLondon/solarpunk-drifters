import type { Meta, StoryObj } from '@storybook/react'
import { LoadingMiniDrifterCard } from './MiniDrifterCard'

const meta = {
  title: 'Cards/LoadingMiniDrifterCard',
  component: LoadingMiniDrifterCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered'
  }
} satisfies Meta<typeof LoadingMiniDrifterCard>

export default meta
type Story = StoryObj<typeof meta>

export const Loading: Story = {}
