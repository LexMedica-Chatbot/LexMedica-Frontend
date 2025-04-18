import './App.css'

// ** React Imports
import { Routes, Route, Navigate } from "react-router-dom"
import type { JSX } from 'react';

// ** Client Pages
import QnAPage from './pages/QnAPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import VerifyEmailPage from './pages/VerifyEmailPage'
import NotFoundPage from './pages/NotFoundPage'

// ** MUI Imports
import { ThemeProvider, createTheme } from '@mui/material/styles'

// ** Configs
import { themeOptions } from './configs/themeOptions'

// Inline helper to check login status
const isLoggedIn = () => {
  return Boolean(localStorage.getItem("userTokenLexMedica"))
}

// Inline GuestRoute component
const GuestRoute = ({ children }: { children: JSX.Element }) => {
  return isLoggedIn() ? <Navigate to="/" replace /> : children
}

function App() {
  const theme = createTheme(themeOptions)

  return (
    <ThemeProvider theme={theme}>
      <Routes>
        <Route path="/" element={<QnAPage />} />
        <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
        <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />
        <Route path="/verify-email" element={<GuestRoute><VerifyEmailPage /></GuestRoute>} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </ThemeProvider>
  )
}

export default App
