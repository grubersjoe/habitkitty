import { describe, expect, test } from 'vitest'
import { getStreak } from '@/lib/habitkit.ts'
import { subDays } from 'date-fns'

describe('getStreak()', () => {
  const now = new Date()

  describe('none', () => {
    test('should return 0 for "none" type streaks', () => {
      expect(
        getStreak([], {
          type: 'none',
          requiredNumberOfCompletions: null,
          requiredNumberOfCompletionsPerDay: 1,
        }),
      ).toBe(0)
    })
  })

  describe('daily', () => {
    test.each([
      ['no completions', [], 1, 1, 0],
      ['completion today', [{ date: now, amountOfCompletions: 1 }], 1, 1, 1],
      ['completion yesterday', [{ date: subDays(now, 1), amountOfCompletions: 1 }], 1, 1, 1],
      ['no completion yesterday', [{ date: subDays(now, 1), amountOfCompletions: 0 }], 1, 1, 0],
      [
        'completion today and yesterday',
        [
          { date: now, amountOfCompletions: 1 },
          { date: subDays(now, 1), amountOfCompletions: 1 },
        ],
        1,
        1,
        2,
      ],
      [
        'ignores completion two days ago',
        [{ date: subDays(now, 2), amountOfCompletions: 1 }],
        1,
        1,
        0,
      ],
    ])(
      '%s',
      (
        _,
        completions,
        requiredNumberOfCompletions,
        requiredNumberOfCompletionsPerDay,
        expected,
      ) => {
        expect(
          getStreak(completions, {
            type: 'day',
            requiredNumberOfCompletions,
            requiredNumberOfCompletionsPerDay,
          }),
        ).toBe(expected)
      },
    )
  })
})
