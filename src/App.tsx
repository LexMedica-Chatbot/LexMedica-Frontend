import './App.css'

import {
  Routes,
  Route
} from "react-router-dom"

// ** Client Pages
import QnAPage from './pages/QnAPage'

// ** Components
import Layout from "./layout/Layout"
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout> <QnAPage /> </Layout>} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      {/* <Route path="/not-found" element={<Layout> <NotFound /> </Layout>} />

      {/* Catch-all route for not-found */}
      {/* <Route path="*" element={<NotFoundPageHandler />} /> */}
    </Routes>
  );
}

export default App;
