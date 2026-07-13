import "./index.css";
import { AuthPage } from "./pages/auth";
import { BrowserRouter, Routes, Route, useLocation } from "react-router";
import Dashboard from "./pages/Dashboard";
import Upload from "./pages/upload";
import Profile from "./pages/profilePage";
import Watch from "./pages/watch";
import { NothingCat } from "./components/NothingCat";
import { Navbar } from "./components/Navbar";
import Home from "./pages/home";
function AppContent() {
  const location = useLocation();
  const showNavbar = location.pathname !== "/";

  return (
    <>
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<AuthPage />}></Route>
        <Route path="/watch" element={<Watch />}></Route>
        <Route path="/upload" element={<Upload />}></Route>
        <Route path="/dashboard" element={<Dashboard />}></Route>
        <Route path="/profile" element={<Profile />}></Route>
        <Route path="/home" element={<Home></Home>}></Route>
      </Routes>
      <NothingCat />
    </>
  );
}

export function App() {
  return (
    <div className="max-w-7xl mx-auto p-8 text-center relative z-10">
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </div>
  );
}

export default App;
