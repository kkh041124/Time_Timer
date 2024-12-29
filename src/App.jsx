import { useState } from "react";
import styles from "./App.module.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import Home from "./page/Home/Home";
import DashBoard from "./page/DashBoard/DashBoard";
function App() {
  return (
    <TooltipProvider>
      <div className={styles.App}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<DashBoard />} />
          </Routes>
        </BrowserRouter>
      </div>
    </TooltipProvider>
  );
}

export default App;
