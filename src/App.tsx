import { ErrorBoundary } from 'react-error-boundary'
import { Dropzone } from '@/components/dropzone.tsx'
import { useState } from 'react'
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
    <main className="mx-auto p-5 md:px-12 md:py-6 mb:pb-10">
      <h1>
        Habit<span className="text-pink-700 dark:text-pink-600">Kitty</span>
      </h1>
      <p className="-mt-8 mb-6 text-lg">
        Visualize your <a href="https://www.habitkit.app">HabitKit</a> data
      </p>

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

      {/* TODO: year selection */}

      {/* TODO: handle validation errors */}
      {error && (
        <div role="alert" className="max-w-xl my-10 md:text-sm">
          <div className="bg-red-500 text-white font-semibold rounded-t px-4 py-1">Error</div>
          <div className="border border-t-0 border-red-300 rounded-b bg-red-100 px-4 py-3 text-red-700">
            <p>${error.message}.</p>
          </div>
        </div>
      )}

      {data && (
        <div className="mt-8 md:mt-10 grid grid-cols-[repeat(auto-fill,minmax(min(100%,860px),860px))] gap-8">
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

      <p className="mt-10 text-muted-foreground md:text-sm">
        This tool is not affiliated with <a href="https://www.habitkit.app">HabitKit</a>.
      </p>
    </main>
  )
}

export default App
