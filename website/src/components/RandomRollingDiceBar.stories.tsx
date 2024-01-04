import type { Meta, StoryObj } from '@storybook/react'
import { RandomRollingDiceBar } from '@/components/diceBars'

const meta = {
  title: 'Dice/RandomRollingDiceBar',
  component: RandomRollingDiceBar,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof RandomRollingDiceBar>

export default meta
type Story = StoryObj<typeof meta>

export const RollingX3: Story = {
  args: {
    dice: 3
  }
}
