import React from "react";
import LandingPage from "./pages/LandingPage";
import { BrowserRouter, Route, Router, Routes } from "react-router-dom";
import Resume from "./components/Resume";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/resume" element={<Resume />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
