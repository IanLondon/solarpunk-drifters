import type { Meta, StoryObj } from '@storybook/react'
import { DiceRollResultBar } from '@/components/diceBars'
import {
  ENCOUNTER_OUTCOME_FAILURE,
  ENCOUNTER_OUTCOME_MIXED_SUCCESS,
  ENCOUNTER_OUTCOME_STRONG_SUCCESS
} from '@solarpunk-drifters/common'

const meta = {
  title: 'Dice/DiceRollResultBar',
  component: DiceRollResultBar,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof DiceRollResultBar>

export default meta
type Story = StoryObj<typeof meta>

export const TwoThreeFourMixedSuccess: Story = {
  args: {
    rollResult: {
      rolls: [2, 3, 4],
      outcome: ENCOUNTER_OUTCOME_MIXED_SUCCESS
    }
  }
}

export const OneFailure: Story = {
  args: {
    rollResult: { rolls: [1], outcome: ENCOUNTER_OUTCOME_FAILURE }
  }
}

export const SixStrongSuccess: Story = {
  args: {
    rollResult: { rolls: [6], outcome: ENCOUNTER_OUTCOME_STRONG_SUCCESS }
  }
}
