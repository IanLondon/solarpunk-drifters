import type { Meta, StoryObj } from '@storybook/react'
import RollResultBar from '@/components/RollResultBar'
import {
  ROLL_OUTCOME_FAILURE,
  ROLL_OUTCOME_MIXED_SUCCESS,
  ROLL_OUTCOME_STRONG_SUCCESS
} from '@solarpunk-drifters/common'

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

export const RollingX3: Story = {
  args: {
    rollingDice: 3
  }
}

export const TwoThreeFourMixedSuccess: Story = {
  args: {
    rolls: [2, 3, 4],
    outcome: ROLL_OUTCOME_MIXED_SUCCESS
  }
}

export const OneFailure: Story = {
  args: {
    rolls: [1],
    outcome: ROLL_OUTCOME_FAILURE
  }
}

export const SixStrongSuccess: Story = {
  args: {
    rolls: [6],
    outcome: ROLL_OUTCOME_STRONG_SUCCESS
  }
}
