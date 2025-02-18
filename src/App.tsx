import React from 'react'

import './App.css'

import {
  Routes,
  Route
} from "react-router-dom"

// ** Client Pages
import Home from './pages/Home'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home /> } />
      {/* <Route path="/not-found" element={<Layout> <NotFound /> </Layout>} />
      <Route path="/login" element={<Layout> <Login /> </Layout>} />
      <Route path="/register" element={<Layout> <Register /> </Layout>} /> */}

      {/* Catch-all route for not-found */}
      {/* <Route path="*" element={<NotFoundPageHandler />} /> */}
    </Routes>
  );
}

export default App;
