import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import Home from "./pages/Home.jsx";
import Auth from "./pages/Auth.jsx";
// import './index.css'

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home theme="dark" />} />
        <Route path="/login" element={<Auth login={true} theme="dark" />} />
        <Route path="/signup" element={<Auth login={false} theme="dark" />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
