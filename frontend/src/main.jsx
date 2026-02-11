import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router";
import './index.css'
import Splash from './components/Splash.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<StrictMode><Splash /></StrictMode>} />
      <Route path="/login" element={null} />
    </Routes>
  </BrowserRouter>
)
