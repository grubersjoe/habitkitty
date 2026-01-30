import type { Activity } from 'react-activity-calendar'
import { addMinutes, format, getYear } from 'date-fns'
import type { HabitKit } from '@/lib/schema.ts'

export const getActivitiesFor = (
  data: HabitKit,
  habitId: string,
  year: number,
): { activities: Activity[]; maxLevel: number } => {
  const interval = data.intervals.find(i => i.habitId === habitId)

  if (!interval) {
    throw new Error(`Habit ${habitId} not found`)
  }

  const { requiredNumberOfCompletionsPerDay } = interval

  const rawActivities = data.completions
    .filter(c => {
      const date = addMinutes(c.date, c.timezoneOffsetInMinutes)
      return c.habitId === habitId && getYear(date) === year
    })
    .map(c => ({
      date: format(addMinutes(c.date, c.timezoneOffsetInMinutes), 'yyyy-MM-dd'),
      level: c.amountOfCompletions,
      count: c.amountOfCompletions,
    }))

  if (rawActivities.length === 0) {
    return { activities: [], maxLevel: requiredNumberOfCompletionsPerDay }
  }

  const isFullYear =
    rawActivities[0].date === `${year}-01-01` &&
    rawActivities[rawActivities.length - 1].date === `${year}-12-31`

  const activities = isFullYear
    ? rawActivities
    : [
        { date: `${year}-01-01`, level: 0, count: 0 },
        ...rawActivities,
        { date: `${year}-12-31`, level: 0, count: 0 },
      ]

  return { activities, maxLevel: requiredNumberOfCompletionsPerDay }
}
