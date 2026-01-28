import { useState } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { CircleX as CircleXIcon } from 'lucide-react'

import { Dropzone } from '@/components/dropzone.tsx'
import { Calendar } from '@/components/calendar.tsx'
import { habitKit, type HabitKit } from '@/lib/schema.ts'
import { ThemeToggle } from '@/components/theme-toggle.tsx'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert.tsx'

export function App() {
  const [data, setData] = useState<HabitKit>()
  const [error, setError] = useState<Error>()

  const year = 2026
  const habits =
    data?.habits
      .filter(({ archived }) => !archived)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
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
        <ThemeToggle />
      </div>

      <Dropzone
        className="mt-6 mb-8"
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

      {/* TODO: year selection */}

      {/* TODO: handle validation errors */}
      {error && (
        <div className="my-10 grid w-full max-w-md items-start gap-4">
          <Alert variant="destructive">
            <CircleXIcon />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        </div>
      )}

      {data && (
        <div className="my-8 md:my-10 grid grid-cols-[repeat(auto-fill,minmax(min(100%,848px),848px))] gap-8 md:gap-x-14 md:gap-y-10">
          {habits.map(habit => (
            <div key={habit.id}>
              <h2>{habit.name}</h2>
              <ErrorBoundary fallback="Error loading habit">
                <Calendar data={data} habit={habit} year={year} />
              </ErrorBoundary>
            </div>
          ))}
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
