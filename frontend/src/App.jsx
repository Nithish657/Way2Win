import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";


// DESKTOP IMPORTS
import Home from "./pages/Home";
import SearchResults from "./pages/SearchResults";

// MOBILE IMPORTS
import MobileHome from "./mobile/MobileHome"; 
import MobileSearchResults from "./mobile/MobileSearchResults";

function App() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={isMobile ? <MobileHome /> : <Home />} />
        <Route path="/home" element={isMobile ? <MobileHome /> : <Home />} />
        <Route path="/search" element={isMobile ? <MobileSearchResults /> : <SearchResults />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;