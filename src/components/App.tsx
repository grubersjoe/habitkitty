import { useState } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { ZodError } from 'zod'
import colors from 'tailwindcss/colors'
import { CircleX as CircleXIcon, Flame as FlameIcon } from 'lucide-react'

import { habitKit, type HabitKit } from '@/lib/schema.ts'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/Alert.tsx'
import { Calendar } from '@/components/Calendar.tsx'
import { CopyButton } from '@/components/CopyButton.tsx'
import { Dropzone } from '@/components/Dropzone.tsx'
import { ThemeToggle } from '@/components/ThemeToggle.tsx'
import { calcStreak, printInterval } from '@/lib/habitkit.ts'
import type { Day } from 'date-fns'

export function App() {
  const [data, setData] = useState<HabitKit>()
  const [error, setError] = useState<Error>()

  const [year] = useState(2026) // FIXME
  const [weekStartsOn] = useState<Day>(1) // FIXME

  const habits =
    data?.habits
      .filter(({ archived }) => !archived)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .sort((a, b) => a.orderIndex - b.orderIndex) || []

  return (
    <main className="mx-auto p-5 md:p-10">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="md:mt-1">
            Habit<span className="text-pink-700 dark:text-pink-600">Kitty</span>
          </h1>
          <p className="-mt-7 md:-mt-5 md:text-lg">
            Visualize your <a href="https://www.habitkit.app">HabitKit</a> data
          </p>
        </div>
        <ThemeToggle className="m-1 md:m-0" />
      </div>

      <div className="mt-6 mb-8">
        <Dropzone
          onDrop={async acceptedFiles => {
            if (acceptedFiles.length > 0) {
              const text = await acceptedFiles[0].text()

              try {
                setError(undefined)
                const data = JSON.parse(text)
                setData(habitKit.parse(data))
              } catch (err) {
                setError(err instanceof Error ? err : new Error('Unknown error'))
                setData(undefined)
              }
            }
          }}
        />
        <p className="mt-3 text-sm text-muted-foreground">
          You can export your HabitKit data in the app settings.
        </p>
      </div>

      {/* TODO: year selection */}

      {/* TODO: handle validation errors */}
      {error && (
        <div className="my-10 grid w-full max-w-2xl items-start gap-4">
          <Alert variant="destructive">
            <CircleXIcon />
            <AlertTitle>{error instanceof ZodError ? 'Schema mismatch' : 'Error'}</AlertTitle>
            <AlertDescription>
              {error instanceof ZodError ? (
                <>
                  <p>
                    This file does not match the HabitKit export format this tool expects.
                    <br />
                    Double-check you selected the exported JSON file.
                  </p>
                  <p>
                    If it still fails, please{' '}
                    <a
                      href="https://github.com/grubersjoe/habitkitty/issues/new"
                      target="_blank"
                      className="text-inherit hover:text-inherit"
                    >
                      open a GitHub issue
                    </a>{' '}
                    and paste the validation output below:
                  </p>
                  <CopyButton text={error.message}>Copy output</CopyButton>
                  <pre className="mt-4">{error.message}</pre>
                </>
              ) : (
                error.message
              )}
            </AlertDescription>
          </Alert>
        </div>
      )}

      {data && (
        <div className="my-8 md:my-10 grid grid-cols-[repeat(auto-fill,minmax(min(100%,844px),844px))] gap-8 md:gap-x-18 md:gap-y-12">
          {habits.map(habit => {
            const interval = data.intervals.find(i => i.habitId === habit.id)
            const completions = data.completions.filter(c => c.habitId === habit.id)

            if (!interval) {
              return (
                <Alert key={habit.id} variant="destructive">
                  Missing interval for habit {habit.name}.
                </Alert>
              )
            }

            return (
              <div key={habit.id} className="flex flex-col gap-4">
                <h2>{habit.name}</h2>
                <ErrorBoundary fallback="Error loading habit">
                  <Calendar
                    completions={completions}
                    interval={interval}
                    habit={habit}
                    year={year}
                  />
                </ErrorBoundary>

                <div className="flex gap-3 text-sm">
                  <div
                    className="flex gap-0.75 items-center bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded text-nowrap select-none"
                    title="Current streak"
                  >
                    <FlameIcon size="18" color={colors.red[700]} />{' '}
                    {calcStreak(completions, interval, weekStartsOn)}
                  </div>
                  <div className="bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded text-nowrap select-none">
                    {interval.type === 'day' ? 'Daily' : printInterval(interval)}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <p className="text-muted-foreground text-sm">
        Made with love by <a href="https://github.com/grubersjoe/habitkitty">@grubersjoe</a>.
        <br />
        This tool is not affiliated with <a href="https://www.habitkit.app">HabitKit</a>.
      </p>
    </main>
  )
}

export default App
