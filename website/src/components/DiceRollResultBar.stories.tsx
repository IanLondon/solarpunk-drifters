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
    rolls: [2, 3, 4],
    disadvantage: false,
    outcome: ENCOUNTER_OUTCOME_MIXED_SUCCESS
  }
}

export const NaturalOneFailure: Story = {
  args: {
    rolls: [1],
    disadvantage: false,
    outcome: ENCOUNTER_OUTCOME_FAILURE
  }
}

export const DisadvantageFailure: Story = {
  args: {
    rolls: [1, 6],
    disadvantage: true,
    outcome: ENCOUNTER_OUTCOME_FAILURE
  }
}

export const SixStrongSuccess: Story = {
  args: {
    rolls: [6],
    disadvantage: false,
    outcome: ENCOUNTER_OUTCOME_STRONG_SUCCESS
  }
}
