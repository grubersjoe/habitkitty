import { describe, expect, test } from 'vitest'
import { getStreak } from '@/lib/habitkit.ts'
import { subDays } from 'date-fns'

describe('getStreak()', () => {
  const now = new Date()

  describe('type none', () => {
    test('should return 0 for "none" type streaks', () => {
      for (const weekStart of [0, 1, 2, 3, 4, 5, 6] as const) {
        expect(
          getStreak(
            [{ date: now, amountOfCompletions: 1 }],
            {
              type: 'none',
              requiredNumberOfCompletions: null,
              requiredNumberOfCompletionsPerDay: 1,
            },
            weekStart,
          ),
        ).toBe(0)
      }
    })
  })

  describe('type daily', () => {
    test.each([
      ['no completions, 1 required', [], 1, 0],
      ['completion today, 1 required', [{ date: now, amountOfCompletions: 1 }], 1, 1],
      [
        'completion yesterday, 1 required',
        [{ date: subDays(now, 1), amountOfCompletions: 1 }],
        1,
        1,
      ],
      [
        'no completion yesterday, 1 required',
        [{ date: subDays(now, 1), amountOfCompletions: 0 }],
        1,
        0,
      ],
      [
        'completion today and yesterday',
        [
          { date: now, amountOfCompletions: 1 },
          { date: subDays(now, 1), amountOfCompletions: 1 },
        ],
        1,
        2,
      ],
      [
        'ignores completion two days ago',
        [{ date: subDays(now, 2), amountOfCompletions: 1 }],
        1,
        0,
      ],
    ])('%s', (_, completions, requiredNumberOfCompletionsPerDay, expected) => {
      for (const weekStart of [0, 1, 2, 3, 4, 5, 6] as const) {
        expect(
          getStreak(
            completions,
            {
              type: 'day',
              requiredNumberOfCompletions: null,
              requiredNumberOfCompletionsPerDay,
            },
            weekStart,
          ),
        ).toBe(expected)
      }
    })
  })
})
