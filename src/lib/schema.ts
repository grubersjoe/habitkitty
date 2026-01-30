import { z } from 'zod'

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
    z.object({
      id: z.uuid(),
      date: z.iso.datetime().transform(d => new Date(d)),
      habitId: z.uuid(),
      timezoneOffsetInMinutes: z.number(),
      amountOfCompletions: z.number(),
      note: z.string().nullable(),
    }),
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
      requiredNumberOfCompletions: z.number().nullable(),
      requiredNumberOfCompletionsPerDay: z.number(),
      unitType: z.string(),
      streakType: z.string(),
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
