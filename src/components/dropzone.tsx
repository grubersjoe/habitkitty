import { cn } from '@/lib/utils.ts'
import { type DropzoneProps, type FileRejection, useDropzone } from 'react-dropzone'
import { useState } from 'react'

export function Dropzone({
  onDrop,
  className,
}: Required<Pick<DropzoneProps, 'onDrop'>> & { className?: string }) {
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
    <div
      className={cn('sm:max-w-86 md:max-w-80 flex flex-col gap-1', className)}
      {...getRootProps()}
    >
      <input {...getInputProps()} />

      <button
        type="button"
        className={cn(
          'w-full min-h-24 md:min-h-22 flex flex-col gap-1 items-center justify-center p-4 transition-colors duration-500 ease-out rounded-lg border border-dashed bg-zinc-100 border-zinc-400 dark:bg-zinc-800 dark:border-zinc-600 hover:bg-zinc-200 hover:border-zinc-500 hover:dark:bg-zinc-700 hover:dark:border-zinc-500 cursor-pointer',
          isDragActive && 'bg-zinc-200 border-zinc-500 dark:bg-zinc-700 dark:border-zinc-500',
        )}
      >
        <span className="text-zinc-500 dark:text-zinc-300 md:text-sm">
          Click or drag your HabitKit export here
        </span>
      </button>

      {rejectedFiles.length > 0 && (
        <span className="my-2 text-red-600">Invalid file, try again.</span>
      )}
    </div>
  )
}
