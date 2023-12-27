import type { Meta, StoryObj } from '@storybook/react'
import CharacterStatsBar from '@/components/CharacterStatsBar'

const meta = {
  title: 'Stats/CharacterStats',
  component: CharacterStatsBar,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof CharacterStatsBar>

export default meta
type Story = StoryObj<typeof meta>

export const CharacterExample: Story = {
  args: {
    stats: {
      agility: 1,
      diy: -1,
      harmony: 2,
      luck: 0
    }
  }
}
