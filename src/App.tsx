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
  const theme = createTheme(themeOptions);
  const { session } = useAuthContext();

  return (
    <ThemeProvider theme={theme}>
      <div>
        {/* Background Image Layer */}
        <div className="background-image" />

        {/* Foreground Content */}
        <div style={{ position: 'relative', zIndex: 1 }}>
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
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;