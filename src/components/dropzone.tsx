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
          'w-full min-h-22 flex flex-col gap-1 items-center justify-center p-4 text-sm transition-colors rounded-lg border border-dashed bg-gray-100 border-gray-300',
          isDragActive && 'bg-gray-200 border-gray-400',
        )}
      >
        <span className="font-medium text-gray-500">Drop your HabitKit export here</span>

        {rejectedFiles.length > 0 && <span className="text-red-600">Invalid file</span>}
      </div>
    </div>
  )
}
