import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from './components/theme-provider'
import { BrowserRouter } from 'react-router'
import { initialSettings } from './settings.ts'

globalThis.settings = initialSettings.settings

createRoot(document.getElementById('root')!).render(

  <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ThemeProvider>,
)
