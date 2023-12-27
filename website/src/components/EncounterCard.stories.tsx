import type { Meta, StoryObj } from '@storybook/react'
import EncounterCard from '@/components/EncounterCard'
import { DEMO_BUFFALO_ENCOUNTER_CARD } from '../dummyData/encounterCards'

const meta = {
  title: 'Cards/EncounterCard',
  component: EncounterCard,
  argTypes: {
    onChooseOption: { action: 'Chose option' }
  },
  tags: ['autodocs'],
  parameters: {
    layout: 'centered'
  }
} satisfies Meta<typeof EncounterCard>

export default meta
type Story = StoryObj<typeof meta>

export const BuffaloMigration: Story = {
  args: {
    data: DEMO_BUFFALO_ENCOUNTER_CARD
  }
}
