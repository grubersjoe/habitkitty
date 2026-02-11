import { z } from 'zod'
import { addMinutes } from 'date-fns'

const colors = [
  'red',
  'orange',
  'amber',
  'yellow',
  'lime',
  'green',
  'emerald',
  'teal',
  'cyan',
  'sky',
  'blue',
  'indigo',
  'violet',
  'purple',
  'fuchsia',
  'pink',
  'rose',
  'slate',
  'gray',
  'neutral',
  'stone',
] as const

export const habitKit = z.object({
  habits: z.array(
    z.object({
      id: z.uuid(),
      name: z.string(),
      description: z.string().nullable(),
      icon: z.string(),
      color: z.enum(colors),
      archived: z.boolean(),
      orderIndex: z.number(),
      createdAt: z.iso.datetime().transform(d => new Date(d)),
      isInverse: z.boolean(),
      emoji: z.string().nullable(),
    }),
  ),
  completions: z.array(
    z
      .object({
        id: z.uuid(),
        date: z.iso.datetime(),
        habitId: z.uuid(),
        timezoneOffsetInMinutes: z.number(),
        amountOfCompletions: z.number(),
        note: z.string().nullable(),
      })
      .transform(c => ({
        ...c,
        date: addMinutes(c.date, c.timezoneOffsetInMinutes),
      })),
  ),
  intervals: z.array(
    z.object({
      id: z.uuid(),
      habitId: z.uuid(),
      startDate: z.iso.datetime().transform(d => new Date(d)),
      endDate: z.iso
        .datetime()
        .nullable()
        .transform(d => (d ? new Date(d) : null)),
      type: z.enum(['none', 'day', 'week', 'month']),
      requiredNumberOfCompletions: z.number().min(1).nullable(),
      requiredNumberOfCompletionsPerDay: z.number().min(1),
      unitType: z.string(),
      streakType: z.enum(['day']),
      allowExceedingGoal: z.boolean(),
    }),
  ),
  reminders: z.array(z.unknown()),
  categories: z.array(
    z.object({
      id: z.uuid(),
      name: z.string(),
      icon: z.string(),
      orderIndex: z.number(),
      createdAt: z.iso.datetime().transform(d => new Date(d)),
    }),
  ),
  categoryMappings: z.array(
    z.object({
      id: z.uuid(),
      habitId: z.uuid(),
      categoryId: z.uuid(),
      orderIndex: z.number(),
      createdAt: z.iso.datetime().transform(d => new Date(d)),
    }),
  ),
})

export type HabitKit = z.infer<typeof habitKit>

export type Habit = HabitKit['habits'][number]
export type Completion = HabitKit['completions'][0]
export type Interval = HabitKit['intervals'][0]
