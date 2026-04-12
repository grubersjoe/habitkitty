import type { Activity } from 'react-activity-calendar'
import { addDays, format, isBefore, isSameDay, parseISO, startOfToday, subYears } from 'date-fns'
import type { HabitKit } from '@/lib/schema.ts'

export const getActivities = (
  data: HabitKit,
  habitId: string,
  numberOfYears: number = 1,
): { activities: Activity[]; maxLevel: number } => {
  const interval = data.intervals.find(i => i.habitId === habitId)

  if (!interval) {
    throw new Error(`Habit ${habitId} not found`)
  }

  const today = startOfToday()
  const calendarStart = addDays(subYears(today, numberOfYears), 1)

  const activities = data.completions
    .filter(c => c.habitId === habitId && !isBefore(c.date, calendarStart))
    .map(c => ({
      date: format(c.date, 'yyyy-MM-dd'),
      level: c.amountOfCompletions,
      count: c.amountOfCompletions,
    }))

  if (activities.length === 0) {
    return { activities: [], maxLevel: interval.requiredNumberOfCompletionsPerDay }
  }

  // left-pad
  if (!isSameDay(parseISO(activities[0].date), calendarStart)) {
    activities.unshift({
      date: format(calendarStart, 'yyyy-MM-dd'),
      level: 0,
      count: 0,
    })
  }

  // right-pad
  if (!isSameDay(parseISO(activities[activities.length - 1].date), today)) {
    activities.push({
      date: format(today, 'yyyy-MM-dd'),
      level: 0,
      count: 0,
    })
  }

  return {
    activities,
    maxLevel: interval.requiredNumberOfCompletionsPerDay,
  }
}
