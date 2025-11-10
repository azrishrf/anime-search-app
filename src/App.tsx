import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import DetailPage from "./pages/DetailPage";
import FavoritesPage from "./pages/FavoritesPage";
import SearchPage from "./pages/SearchPage";
import "./style.css";

function App() {
  return (
    <Router>
      <div className="relative min-h-screen overflow-x-hidden bg-[#212D3B] font-sans text-white">
        {/* Background Image Overlay */}
        <div
          className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-5"
          style={{ backgroundImage: "url('/bg.png')" }}
        />

        {/* Content */}
        <div className="relative z-10">
          <Routes>
            <Route path="/" element={<SearchPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/anime/:id" element={<DetailPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
