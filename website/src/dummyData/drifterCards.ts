import { type DrifterCard } from '@/types'

export const DEMO_MAKE_PROGRESS: DrifterCard = {
  id: 'make-progress-123',
  title: 'Make Progress',
  description: 'Progress 200 km toward your destination. Costs 1 ration.',
  image: {
    alt: 'A worms-eye shot of the back of a pneumobike, making progress down a muddy road',
    height: 1024,
    width: 1024,
    src: '/make-progress.jpg'
  }
  // TODO it should have data so the UI can show icon for
  // "cost: 1 ration", similar to Encounter Card choices.
}
