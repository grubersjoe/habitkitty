import { cn } from '@/lib/utils.ts'
import { type DropzoneProps, type FileRejection, useDropzone } from 'react-dropzone'
import { useState } from 'react'

export function Dropzone({ onDrop }: Required<Pick<DropzoneProps, 'onDrop'>>) {
  const [rejectedFiles, setRejectedFiles] = useState<FileRejection[]>([])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'application/json': ['.json'] },
    maxFiles: 1,
    multiple: false,
    onDrop: (acceptedFiles, fileRejections, event) => {
      setRejectedFiles(fileRejections)
      onDrop(acceptedFiles, fileRejections, event)
    },
  })

  return (
    <div className={'max-w-xs flex flex-col gap-1'} {...getRootProps()}>
      <input {...getInputProps()} />

      <div
        className={cn(
          'w-full min-h-22 flex flex-col gap-1 items-center justify-center p-4 text-sm transition-colors rounded-lg border border-dashed bg-zinc-100 border-zinc-400 dark:bg-zinc-800 dark:border-zinc-600 hover:bg-zinc-200 hover:border-zinc-500 hover:dark:bg-zinc-700 hover:dark:border-zinc-500',
          isDragActive && 'bg-zinc-200 border-zinc-500 dark:bg-zinc-700 dark:border-zinc-500',
        )}
      >
        <span className="font-medium text-zinc-500 dark:text-zinc-300">
          Drop your HabitKit export here
        </span>

        {rejectedFiles.length > 0 && <span className="text-red-600">Invalid file</span>}
      </div>
    </div>
  )
}
