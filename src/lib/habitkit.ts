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
  interval: Pick<
    Interval,
    'type' | 'requiredNumberOfCompletionsPerDay' | 'requiredNumberOfCompletions' | 'startDate'
  >,
  weekStartsOn: Day,
  today = startOfToday(),
) => {
  if (completions.length === 0) {
    return 0
  }

  const key = (d: Date) => format(d, 'yyyy-MM-dd')
  const completionsPerDay = completions.reduce(
    (acc, { date, amountOfCompletions }) => {
      acc[key(date)] = amountOfCompletions
      return acc
    },
    {} as Record<string, number>,
  )

  if (interval.type === 'none') {
    return 0
  }

  const allDays = { start: today, end: interval.startDate }

  const intervals = {
    day: eachDayOfInterval(allDays),
    week: eachWeekOfInterval(allDays, { weekStartsOn }),
    month: eachMonthOfInterval(allDays),
  }

  const intervalBounds = {
    day: (date: Date) => ({ start: date, end: date }),
    week: (date: Date) => ({ start: date, end: endOfWeek(date, { weekStartsOn }) }),
    month: (date: Date) => ({ start: date, end: endOfMonth(date) }),
  }

  let totalStreak = 0
  for (const [i, day] of intervals[interval.type].entries()) {
    const bounds = intervalBounds[interval.type](day)

    let streak = 0
    for (const d of eachDayOfInterval(bounds)) {
      if (completionsPerDay[key(d)] >= interval.requiredNumberOfCompletionsPerDay) {
        streak++
      }
    }

    if (i > 0 && streak < (interval.requiredNumberOfCompletions ?? 1)) {
      break
    }

    totalStreak += streak
  }

  return totalStreak
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
