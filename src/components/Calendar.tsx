import { ActivityCalendar } from 'react-activity-calendar'
import 'react-activity-calendar/tooltips.css'
import colors from 'tailwindcss/colors'

import { getActivities } from '@/lib/habitkit'
import type { Habit, HabitKit } from '@/lib/schema.ts'
import { useTheme } from '@/lib/theme.tsx'

type Props = {
  data: HabitKit
  habit: Habit
}

export const Calendar = ({ data, habit }: Props) => {
  const { activities, maxLevel } = getActivities(data, habit.id)
  const { theme } = useTheme()

  if (activities.length === 0) {
    return <p>No completions of in the last year.</p>
  }

  return (
    <ActivityCalendar
      data={activities}
      colorScheme={theme}
      theme={{
        light: [colors.zinc['50'], colors[habit.color][400]],
        dark: [colors.zinc['900'], colors[habit.color][500]],
      }}
      maxLevel={maxLevel}
      tooltips={{
        activity: {
          text: activity =>
            `${activity.count} completion${activity.count > 1 ? 's' : ''} on ${activity.date}`,
        },
      }}
      showColorLegend={maxLevel > 1}
      weekStart={1}
      labels={{
        totalCount: `{{count}} completions`,
        legend: {
          less: '',
          more: String(maxLevel),
        },
      }}
    />
  )
}
