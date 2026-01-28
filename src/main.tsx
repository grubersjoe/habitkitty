import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './styles/tailwind.css'

import App from './App.tsx'
import { ThemeProvider } from '@/theme.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
)
