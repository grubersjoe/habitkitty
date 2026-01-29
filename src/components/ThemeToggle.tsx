import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/lib/theme.tsx'
import { cn } from '@/lib/tailwind.ts'

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme()

  return (
    <button type="button" className={cn('cursor-pointer', className)} onClick={toggleTheme}>
      {theme === 'light' ? <Sun /> : <Moon />}
    </button>
  )
}
