import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "@/pages/LandingPage";
import StudioPage from "@/pages/StudioPage";
import TemplatesPage from "@/pages/TemplatesPage";
import ConciergePage from "@/pages/ConciergePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/studio" element={<StudioPage />} />
        <Route path="/templates" element={<TemplatesPage />} />
        <Route path="/concierge" element={<ConciergePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
