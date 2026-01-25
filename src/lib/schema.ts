import { z } from 'zod'

export const habitKitSchema = z.object({
  habits: z.array(
    z.object({
      id: z.uuid(),
      name: z.string(),
      description: z.string().nullable(),
      icon: z.string(),
      color: z.string(),
      archived: z.boolean(),
      orderIndex: z.number(),
      createdAt: z.iso.datetime(),
      isInverse: z.boolean(),
      emoji: z.string().nullable(),
    }),
  ),
  completions: z.array(
    z.object({
      id: z.uuid(),
      date: z.iso.datetime(),
      habitId: z.uuid(),
      timezoneOffsetInMinutes: z.number(),
      amountOfCompletions: z.number(),
      note: z.string().nullable(),
    }),
  ),
  intervals: z.array(
    z.union([
      z.object({
        id: z.uuid(),
        habitId: z.uuid(),
        startDate: z.iso.datetime(),
        endDate: z.iso.datetime().nullable(),
        type: z.string(),
        requiredNumberOfCompletions: z.number(),
        requiredNumberOfCompletionsPerDay: z.number(),
        unitType: z.string(),
        streakType: z.string(),
        allowExceedingGoal: z.boolean(),
      }),
      z.object({
        id: z.uuid(),
        habitId: z.uuid(),
        startDate: z.iso.datetime(),
        endDate: z.iso.datetime().nullable(),
        type: z.string(),
        requiredNumberOfCompletions: z.number().nullable(),
        requiredNumberOfCompletionsPerDay: z.number(),
        unitType: z.string(),
        streakType: z.string(),
        allowExceedingGoal: z.boolean(),
      }),
    ]),
  ),
  reminders: z.array(z.unknown()),
  categories: z.array(
    z.object({
      id: z.uuid(),
      name: z.string(),
      icon: z.string(),
      orderIndex: z.number(),
      createdAt: z.iso.datetime(),
    }),
  ),
  categoryMappings: z.array(
    z.object({
      id: z.uuid(),
      habitId: z.uuid(),
      categoryId: z.uuid(),
      orderIndex: z.number(),
      createdAt: z.iso.datetime(),
    }),
  ),
})

export type HabitKitSchema = z.infer<typeof habitKitSchema>
