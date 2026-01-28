import { useState } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { Dropzone } from '@/components/dropzone.tsx'
import { Calendar } from '@/components/calendar.tsx'
import { habitKit, type HabitKit } from '@/lib/schema.ts'

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
    <main className="mx-auto p-[20px] md:px-10 md:py-8">
      <h1>
        Habit<span className="text-pink-700 dark:text-pink-600">Kitty</span>
      </h1>
      <p className="-mt-8 text-lg">
        Visualize your <a href="https://www.habitkit.app">HabitKit</a> data
      </p>

      <Dropzone
        className="mt-8 mb-9 md:mb-10"
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
      {/* TODO: switch to shadcn alert component */}
      {error && (
        <div role="alert" className="my-8 bg-red-50 border-l-3 border-red-500 text-red-700 p-4">
          <p className="font-semibold mb-1">Error</p>
          <p>{error.message}.</p>
        </div>
      )}

      {data && (
        <div className="my-9 md:my-10 grid grid-cols-[repeat(auto-fill,minmax(min(100%,848px),848px))] gap-9 md:gap-x-14 md:gap-y-10">
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

      <p className="text-muted-foreground md:text-sm">
        Made with love by <a href="https://github.com/grubersjoe/habitkitty">@grubersjoe</a>.
        <br />
        This tool is not affiliated with <a href="https://www.habitkit.app">HabitKit</a>.
      </p>
    </main>
  )
}

export default App
