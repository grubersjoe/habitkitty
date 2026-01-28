import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/theme'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button type="button" className="cursor-pointer" onClick={toggleTheme}>
      {theme === 'light' ? <Sun /> : <Moon />}
    </button>
  )
}
