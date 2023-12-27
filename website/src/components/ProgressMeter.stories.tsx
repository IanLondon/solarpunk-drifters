import type { Meta, StoryObj } from '@storybook/react'
import ProgressMeter from '@/components/ProgressMeter'

const meta = {
  title: 'Stats/ProgressMeter',
  component: ProgressMeter,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof ProgressMeter>

export default meta
type Story = StoryObj<typeof meta>

export const ZeroPercent: Story = {
  args: {
    current: 0,
    total: 1500
  }
}

export const TwentyPercent: Story = {
  args: {
    current: 200,
    total: 1500
  }
}

export const HundredPercent: Story = {
  args: {
    current: 1500,
    total: 1500
  }
}
