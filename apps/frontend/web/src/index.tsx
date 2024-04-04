import { createRoot } from 'react-dom/client'
import 'tailwindcss/tailwind.css'
import App from './App'
import 'styles/globals.css'
import { ThemeProvider } from './components/theme-provider'
import { Toaster } from 'components/toaster'

const container = document.getElementById('root') as HTMLDivElement
const root = createRoot(container)

root.render(
  <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <App />
    <Toaster />
  </ThemeProvider>
)
