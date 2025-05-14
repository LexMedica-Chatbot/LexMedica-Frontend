// src/App.tsx
import './App.css'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { Routes, Route, Navigate } from 'react-router-dom'
import { themeOptions } from './configs/themeOptions'

// Pages
import QnAPage from './pages/QnAPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import VerifyEmailPage from './pages/VerifyEmailPage'
import NotFoundPage from './pages/NotFoundPage'

// Auth Context
import { useAuthContext } from './context/authContext'

function App() {
  document.title = "LexMedica Chatbot";

  const theme = createTheme(themeOptions)

  const { session } = useAuthContext();

  return (
    <ThemeProvider theme={theme}>
      <Routes>
        <Route path="/" element={<QnAPage />} />

        <Route
          path="/login"
          element={session ? <Navigate to="/" replace /> : <LoginPage />}
        />
        <Route
          path="/register"
          element={session ? <Navigate to="/" replace /> : <RegisterPage />}
        />
        <Route
          path="/verify-email"
          element={session ? <Navigate to="/" replace /> : <VerifyEmailPage />}
        />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </ThemeProvider>
  )
}

export default App
