import "./index.css";
import { AuthPage } from "./pages/auth";
import { BrowserRouter, Routes, Route } from "react-router";
import VideoPage from "./pages/videoPage";
import Dashboard from "./pages/Dashboard";
import Upload from "./pages/upload";

export function App() {
  return (
    <div className="max-w-7xl mx-auto p-8 text-center relative z-10">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AuthPage/>}></Route>
          <Route path="/watch" element= {<VideoPage/>}></Route>
          <Route path="/upload" element={<Upload/>}></Route>
          <Route path="/dashboard" element={<Dashboard/>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
