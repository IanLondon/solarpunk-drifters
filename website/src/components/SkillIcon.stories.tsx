import type { Meta, StoryObj } from '@storybook/react'
import { SKILLS_LIST } from '@solarpunk-drifters/common'
import SkillIcon from '@/components/SkillIcon'

const meta = {
  title: 'Icons/SkillIcon',
  component: SkillIcon,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  },
  argTypes: {
    skill: {
      control: 'select',
      options: SKILLS_LIST
    }
  }
} satisfies Meta<typeof SkillIcon>

export default meta
type Story = StoryObj<typeof meta>

export const AgilityExample: Story = {
  args: {
    skill: 'agility'
  }
}
