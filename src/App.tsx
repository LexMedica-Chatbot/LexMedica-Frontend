// src/App.tsx
import './App.css'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { Routes, Route } from 'react-router-dom'
import { themeOptions } from './configs/themeOptions'

// Pages
import QnAPage from './pages/QnAPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import VerifyEmailPage from './pages/VerifyEmailPage'
import NotFoundPage from './pages/NotFoundPage'

function App() {
  const theme = createTheme(themeOptions)

  return (
    <ThemeProvider theme={theme}>
      <Routes>
        <Route path="/" element={<QnAPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </ThemeProvider>
  )
}

export default App
