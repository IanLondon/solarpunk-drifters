import type { EncounterCard } from '..'

export const DEMO_BUFFALO_ENCOUNTER_CARD: EncounterCard = {
  id: 'buffalo-demo-123456',
  title: 'Buffalo Migration',
  description:
    'You come across a migrating herd of buffalo. Their ranks stretch back to the horizon.',
  image: {
    alt: 'A migrating herd of buffalo in a dried-out valley',
    src: '/buffalo.jpg',
    height: 1024,
    width: 1024
  },
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
