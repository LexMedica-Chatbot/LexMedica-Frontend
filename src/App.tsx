import './App.css'

import {
  Routes,
  Route
} from "react-router-dom"

// ** Client Pages
import QnAPage from './pages/QnAPage'

// ** Components
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// ** MUI Imports
import { ThemeProvider, createTheme } from '@mui/material/styles'

// ** Configs
import { themeOptions } from './configs/themeOptions'

function App() {
  const theme = createTheme(themeOptions)

  return (
    <ThemeProvider theme={theme}>
      <Routes>
        <Route path="/" element={<QnAPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        {/* <Route path="/not-found" element={<Layout> <NotFound /> </Layout>} />

      {/* Catch-all route for not-found */}
        {/* <Route path="*" element={<NotFoundPageHandler />} /> */}
      </Routes>
    </ThemeProvider>
  );
}

export default App;
