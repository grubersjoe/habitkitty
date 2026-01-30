import { Button } from '@/components/ui/Button.tsx'
import { type PropsWithChildren, useState } from 'react'

export function CopyButton({ text, children }: PropsWithChildren<{ text: string }>) {
  const [isCopied, setIsCopied] = useState(false)

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={async () => {
        await navigator.clipboard.writeText(text)
        setIsCopied(true)
        setTimeout(() => setIsCopied(false), 2000)
      }}
    >
      {isCopied ? 'Copied!' : (children ?? 'Copy')}
    </Button>
  )
}
