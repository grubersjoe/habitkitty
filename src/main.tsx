import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './tailwind.css'

import App from './components/App.tsx'
import { ThemeProvider } from '@/lib/theme.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
)
