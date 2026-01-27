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
    <main className="mx-auto px-12 py-6">
      <h1>HabitKitty</h1>
      <p className="-mt-8 mb-6">
        Visualize your <a href="https://www.habitkit.app/">HabitKit</a> data.
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
            }
          }
        }}
      />

      {error && <div className="text-red-700">Error: ${error.message}.</div>}

      {data && (
        <div className="mt-8 grid grid-cols-[repeat(auto-fill,minmax(min(100%,860px),860px))] gap-x-12 gap-y-10">
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

      <p className="mt-8 text-muted-foreground text-sm">
        This tool is not affiliated with HabitKit.
      </p>
    </main>
  )
}

export default App
