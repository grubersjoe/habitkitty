import { ActivityCalendar } from 'react-activity-calendar'
import 'react-activity-calendar/tooltips.css'
import { getActivitiesFor, getHabit } from '@/lib/habitkit'

type Props = {
  habitId: string
  year: number
}

export const Calendar = ({ habitId, year }: Props) => {
  const habit = getHabit(habitId)
  const { activities, maxLevel } = getActivitiesFor(habit.id, year)

  if (activities.length === 0) {
    return <p>No data.</p>
  }

  return (
    <ActivityCalendar
      data={activities}
      theme={{
        light: ['hsl(0, 0%, 92%)', 'purple'],
      }}
      maxLevel={maxLevel}
      tooltips={{
        activity: {
          text: (activity) => `${activity.count} completion on ${activity.date}`,
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
