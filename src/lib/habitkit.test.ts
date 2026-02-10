import { describe, expect, test } from 'vitest'
import { getStreak } from '@/lib/habitkit.ts'
import { endOfWeek, subDays } from 'date-fns'

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
      [
        '0 completions, 1 required',
        {
          completions: [],
          requiredPerDay: 1,
          expected: 0,
        },
      ],
      [
        '0 completion today, 1 required',
        {
          completions: [{ date: now, amountOfCompletions: 0 }],
          requiredPerDay: 1,
          expected: 0,
        },
      ],
      [
        '1 completion today, 1 required',
        {
          completions: [{ date: now, amountOfCompletions: 1 }],
          requiredPerDay: 1,
          expected: 1,
        },
      ],
      [
        '2 completion today, 1 required',
        {
          completions: [{ date: now, amountOfCompletions: 2 }],
          requiredPerDay: 1,
          expected: 1,
        },
      ],
      [
        '1 completion yesterday, 1 required',
        {
          completions: [{ date: subDays(now, 1), amountOfCompletions: 1 }],
          requiredPerDay: 1,
          expected: 1,
        },
      ],
      [
        '1 completion yesterday, 2 required',
        {
          completions: [{ date: subDays(now, 1), amountOfCompletions: 1 }],
          requiredPerDay: 2,
          expected: 0,
        },
      ],
      [
        '0 completions yesterday, 1 required',
        {
          completions: [{ date: subDays(now, 1), amountOfCompletions: 0 }],
          requiredPerDay: 1,
          expected: 0,
        },
      ],
      [
        'completions today and yesterday',
        {
          completions: [
            { date: now, amountOfCompletions: 1 },
            { date: subDays(now, 1), amountOfCompletions: 1 },
          ],
          requiredPerDay: 1,
          expected: 2,
        },
      ],
      [
        'ignores completion two days ago',
        {
          completions: [{ date: subDays(now, 2), amountOfCompletions: 1 }],
          requiredPerDay: 1,
          expected: 0,
        },
      ],
    ])('%s', (_, { completions, requiredPerDay, expected }) => {
      for (const weekStart of [0, 1, 2, 3, 4, 5, 6] as const) {
        expect(
          getStreak(
            completions,
            {
              type: 'day',
              requiredNumberOfCompletions: null,
              requiredNumberOfCompletionsPerDay: requiredPerDay,
            },
            weekStart,
          ),
        ).toBe(expected)
      }
    })
  })

  describe('type weekly', () => {
    test.each([
      [
        '2 completions in current week, 3 required',
        {
          completions: [
            { date: subDays(endOfWeek(now, { weekStartsOn: 0 }), 0), amountOfCompletions: 1 },
            { date: subDays(endOfWeek(now, { weekStartsOn: 0 }), 1), amountOfCompletions: 1 },
          ],
          required: 3,
          requiredPerDay: 1,
          expected: 2,
        },
      ],
      [
        '3 completions in current week, 3 required',
        {
          completions: [
            { date: subDays(endOfWeek(now, { weekStartsOn: 0 }), 0), amountOfCompletions: 1 },
            { date: subDays(endOfWeek(now, { weekStartsOn: 0 }), 1), amountOfCompletions: 1 },
            { date: subDays(endOfWeek(now, { weekStartsOn: 0 }), 2), amountOfCompletions: 1 },
          ],
          required: 3,
          requiredPerDay: 1,
          expected: 3,
        },
      ],
      [
        '2 completions in last week, 3 required',
        {
          completions: [
            { date: subDays(endOfWeek(now, { weekStartsOn: 0 }), 7), amountOfCompletions: 1 },
            { date: subDays(endOfWeek(now, { weekStartsOn: 0 }), 8), amountOfCompletions: 1 },
          ],
          required: 3,
          requiredPerDay: 1,
          expected: 0,
        },
      ],
      [
        '7 completions in last two weeks, 3 required',
        {
          completions: [
            { date: subDays(endOfWeek(now, { weekStartsOn: 0 }), 0), amountOfCompletions: 1 },
            { date: subDays(endOfWeek(now, { weekStartsOn: 0 }), 1), amountOfCompletions: 1 },
            { date: subDays(endOfWeek(now, { weekStartsOn: 0 }), 2), amountOfCompletions: 1 },
            { date: subDays(endOfWeek(now, { weekStartsOn: 0 }), 3), amountOfCompletions: 1 },
            { date: subDays(endOfWeek(now, { weekStartsOn: 0 }), 7), amountOfCompletions: 1 },
            { date: subDays(endOfWeek(now, { weekStartsOn: 0 }), 8), amountOfCompletions: 1 },
            { date: subDays(endOfWeek(now, { weekStartsOn: 0 }), 9), amountOfCompletions: 1 },
          ],
          required: 3,
          requiredPerDay: 1,
          expected: 7,
        },
      ],
    ])('%s', (_, { completions, required, requiredPerDay, expected }) => {
      expect(
        getStreak(
          completions,
          {
            type: 'week',
            requiredNumberOfCompletions: required,
            requiredNumberOfCompletionsPerDay: requiredPerDay,
          },
          0,
          endOfWeek(now),
        ),
      ).toBe(expected)
    })
  })
})
