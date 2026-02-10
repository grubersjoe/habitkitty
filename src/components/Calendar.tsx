import { ActivityCalendar } from 'react-activity-calendar'
import 'react-activity-calendar/tooltips.css'
import colors from 'tailwindcss/colors'

import { getActivitiesFor } from '@/lib/habitkit'
import type { Completion, Habit, Interval } from '@/lib/schema.ts'
import { useTheme } from '@/lib/theme.tsx'

type Props = {
  completions: Completion[]
  interval: Interval
  habit: Habit
  year: number
}

export const Calendar = ({ completions, interval, habit, year }: Props) => {
  const { activities, maxLevel } = getActivitiesFor(completions, interval, year)
  const { theme } = useTheme()

  if (activities.length === 0) {
    return (
      <p>
        No completions of ${habit.name} in ${year}.
      </p>
    )
  }

  return (
    <ActivityCalendar
      data={activities}
      colorScheme={theme}
      theme={{
        light: [colors.zinc['100'], colors[habit.color][400]],
        dark: [colors.zinc['800'], colors[habit.color][500]],
      }}
      maxLevel={maxLevel}
      tooltips={{
        activity: {
          text: activity => `${activity.count} completion on ${activity.date}`,
        },
      }}
      showColorLegend={false}
      showTotalCount={false}
      weekStart={1}
      labels={{
        totalCount: `{{count}} completions in {{year}}`,
      }}
    />
  )
}
