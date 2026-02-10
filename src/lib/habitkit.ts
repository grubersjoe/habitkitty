import type { Activity } from 'react-activity-calendar'
import {
  type Day,
  eachDayOfInterval,
  eachMonthOfInterval,
  eachWeekOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  getYear,
  type Interval as DateInterval,
  isWithinInterval,
  startOfToday,
} from 'date-fns'
import type { Completion, Interval } from '@/lib/schema.ts'

export const getActivitiesFor = (
  completions: Completion[],
  interval: Interval,
  year: number,
): { activities: Activity[]; maxLevel: number } => {
  const { requiredNumberOfCompletionsPerDay } = interval

  const rawActivities = completions
    .filter(c => getYear(c.date) === year)
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

export const calcStreak = (
  completions: Pick<Completion, 'date' | 'amountOfCompletions'>[],
  habitInterval: Pick<
    Interval,
    'type' | 'requiredNumberOfCompletionsPerDay' | 'requiredNumberOfCompletions' | 'startDate'
  >,
  weekStartsOn: Day,
  today = startOfToday(),
) => {
  if (completions.length === 0) {
    return 0
  }

  const key = (d: Date) => d.toDateString()
  const completionsPerDay = completions.reduce(
    (acc, { date, amountOfCompletions }) => {
      acc[key(date)] = amountOfCompletions
      return acc
    },
    {} as Record<string, number>,
  )

  const streakForInterval = (interval: DateInterval) => {
    let streak = 0
    for (const day of eachDayOfInterval(interval)) {
      if (completionsPerDay[key(day)] >= habitInterval.requiredNumberOfCompletionsPerDay) {
        streak++
      }
    }

    // All completions count in the current interval.
    if (isWithinInterval(today, interval)) {
      return streak
    }

    if (streak < (habitInterval.requiredNumberOfCompletions ?? 0)) {
      return 0
    }

    return streak
  }

  if (habitInterval.type === 'none') {
    return 0
  }

  // Sort oldest -> newest
  completions = completions.sort((a, b) => a.date.getTime() - b.date.getTime())

  const allDays = { start: today, end: habitInterval.startDate }

  if (habitInterval.type === 'day') {
    let streak = 0
    for (const [i, day] of eachDayOfInterval(allDays).entries()) {
      const forInterval = streakForInterval({ start: day, end: day })

      if (i > 0 && forInterval === 0) {
        break
      }

      streak += forInterval
    }

    return streak
  }

  if (habitInterval.type === 'week') {
    let streak = 0
    for (const [i, weekStart] of eachWeekOfInterval(allDays, { weekStartsOn }).entries()) {
      const forInterval = streakForInterval({
        start: weekStart,
        end: endOfWeek(weekStart, { weekStartsOn }),
      })

      if (i > 0 && forInterval === 0) {
        break
      }

      streak += forInterval
    }

    return streak
  }

  if (habitInterval.type === 'month') {
    let streak = 0
    for (const [i, monthStart] of eachMonthOfInterval(allDays).entries()) {
      const forInterval = streakForInterval({ start: monthStart, end: endOfMonth(monthStart) })

      if (i > 0 && forInterval === 0) {
        break
      }

      streak += forInterval
    }

    return streak
  }
}

export const printInterval = (interval: Interval) => {
  switch (interval.type) {
    case 'none':
      return ''
    case 'day':
      return `${interval.requiredNumberOfCompletions} / Day`
    case 'week':
      return `${interval.requiredNumberOfCompletions} / Week`
    case 'month':
      return `${interval.requiredNumberOfCompletions} / Month`
  }
}
