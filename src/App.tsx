import AppRoutes from './routes/index'
import { ThemeProvider } from './components/ThemeProvider'
import './app.css'

function App() {
  return (
    <ThemeProvider>
      <AppRoutes />
    </ThemeProvider>
  )
}

export default App
