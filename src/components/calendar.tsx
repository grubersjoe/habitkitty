import { ActivityCalendar } from 'react-activity-calendar'
import 'react-activity-calendar/tooltips.css'
import colors from 'tailwindcss/colors'
import { getActivitiesFor } from '@/lib/habitkit'
import type { Habit, HabitKit } from '@/lib/schema.ts'

type Props = {
  data: HabitKit
  habit: Habit
  year: number
}

export const Calendar = ({ data, habit, year }: Props) => {
  const { activities, maxLevel } = getActivitiesFor(data, habit.id, year)

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
      theme={{
        light: [colors.zinc['50'], colors[habit.color][400]],
        dark: [colors.zinc['900'], colors[habit.color][300]],
      }}
      maxLevel={maxLevel}
      tooltips={{
        activity: {
          text: activity => `${activity.count} completion on ${activity.date}`,
        },
      }}
      showColorLegend={false}
      weekStart={1}
      labels={{
        totalCount: `{{count}} completions in {{year}}`,
      }}
    />
  )
}
