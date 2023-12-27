import type { Meta, StoryObj } from '@storybook/react'
import SkillIcon from '@/components/SkillIcon'
import { SKILLS_LIST } from '../types/encounter'

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
