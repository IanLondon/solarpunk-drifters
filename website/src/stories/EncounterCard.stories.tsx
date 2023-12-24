import type { Meta, StoryObj } from '@storybook/react'
import EncounterCard from '@/components/EncounterCard'

const meta = {
  title: 'Cards/EncounterCard',
  component: EncounterCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered'
  }
} satisfies Meta<typeof EncounterCard>

export default meta
type Story = StoryObj<typeof meta>

export const BuffaloMigration: Story = {
  args: {
    title: 'Buffalo Migration',
    description:
      'You come across a migrating herd of buffalo. Their ranks stretch back to the horizon.',
    choices: [
      {
        description:
          'Carefully make your way through, trying not to threaten them',
        check: { skill: 'harmony' },
        risk: { loseItem: 'rations' }
      },
      {
        description: 'Quickly try to cross ahead of them',
        check: { skill: 'agility' },
        risk: { loseResource: 'caravanIntegrity' }
      },
      {
        description: 'Wait it out',
        check: { skill: 'luck' },
        risk: { loomingDangerIncrease: 1 }
      },
      {
        description: 'Clear a path by tossing them a ration',
        check: { items: { ration: 1 }, skill: 'luck' },
        risk: { loomingDangerIncrease: 1, loseItem: 'rations' }
      }
    ]
  }
}

// export const Bbbb: Story = {
//   args: {
//     title: 'Cool title BBB'
//   }
// }
