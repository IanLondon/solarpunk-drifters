import type { Meta, StoryObj } from '@storybook/react'
import RollResultBar from '@/components/RollResultBar'

const meta = {
  title: 'Dice/RollResultBar',
  component: RollResultBar,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof RollResultBar>

export default meta
type Story = StoryObj<typeof meta>

export const NoRolls: Story = {
  args: {
    results: []
  }
}

export const TwoThreeFour: Story = {
  args: {
    results: [2, 3, 4]
  }
}

export const RollingX3: Story = {
  args: {
    rolling: 3
  }
}

export const Three: Story = {
  args: {
    results: [3]
  }
}
