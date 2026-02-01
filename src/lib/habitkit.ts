import type { Activity } from 'react-activity-calendar'
import { eachDayOfInterval, format, getYear, startOfToday, subDays } from 'date-fns'
import type { Completion, HabitKit, Interval } from '@/lib/schema.ts'

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
    .filter(c => c.habitId === habitId && getYear(c.date) === year)
    .map(c => ({
      date: format(c.date, 'yyyy-MM-dd'),
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

export const getStreak = (
  habitCompletions: Pick<Completion, 'date' | 'amountOfCompletions'>[],
  interval: Pick<
    Interval,
    'type' | 'requiredNumberOfCompletionsPerDay' | 'requiredNumberOfCompletions'
  >,
) => {
  const key = (d: Date) => d.toDateString()
  const perDay = habitCompletions.reduce(
    (acc, { date, amountOfCompletions }) => {
      acc[key(date)] = amountOfCompletions
      return acc
    },
    {} as Record<string, number>,
  )

  const today = startOfToday()

  const calcStreak = (n: number) => {
    let streak = perDay[key(today)] ?? 0

    let days = [subDays(new Date(), 1)]
    loop: while (true) {
      for (const day of days) {
        if (perDay[key(day)] === interval.requiredNumberOfCompletionsPerDay) {
          streak++
        } else {
          break loop
        }
      }

      // i = subDays(i, 1)
      days = eachDayOfInterval({
        start: days[days.length - 1],
        end: subDays(days[days.length - 1], n),
      })
    }

    return streak
  }

  switch (interval.type) {
    case 'none':
      return 0
    case 'day':
      return calcStreak(1)
    case 'week':
      return 0
    case 'month':
      return 0
  }
}
