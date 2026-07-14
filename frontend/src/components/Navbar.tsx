import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { ArrowLeftDoticon } from "doticons/16";
import { DotPlayLogo } from "@/components/DotPlayLogo";
import { useAuth } from "@/context/AuthContext";

export function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const { logout, token } = useAuth();
  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/auth");
    setIsDropdownOpen(false);
  };

  const showBack = location.pathname !== "/";

  return (
    <div className="relative z-50 flex items-center justify-between px-6 py-3 bg-white/40 backdrop-blur-xl border border-black/5 rounded-full mb-8 shadow-sm text-left">
      {/* Left side navigation */}
      <div className="w-24 flex items-center select-none">
        {showBack ? (
          <div
            className="flex items-center gap-2 cursor-pointer hover:opacity-85 active:scale-95 transition-all"
            onClick={() => navigate("/")}
          >
            <ArrowLeftDoticon className="w-4 h-4 text-black" />
            <span className="font-lettera uppercase text-[10px] tracking-widest font-bold">BACK</span>
          </div>
        ) : (
          <div
            className="flex items-center gap-2 cursor-pointer hover:opacity-85 active:scale-95 transition-all"
            onClick={() => navigate("/")}
          >
            <span className="font-lettera uppercase text-[10px] tracking-widest font-bold">HOME</span>
          </div>
        )}
      </div>

      {/* Center Brand */}
      <div className="flex items-center cursor-pointer select-none" onClick={() => navigate("/")}>
        <DotPlayLogo className="text-base tracking-[0.15em] text-black" />
      </div>

      {/* Right side Profile Dropdown */}
      {token ?
        <div className="relative w-24 flex justify-end" ref={dropdownRef}>
          <div
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-9 h-9 rounded-full border border-black/5 bg-white/60 backdrop-blur-md flex items-center justify-center cursor-pointer overflow-hidden shadow-sm hover:border-black/20 hover:bg-white/80 active:scale-95 transition-all select-none"
          >
            {/* Question mark placeholder since profile pic is not uploaded */}
            <span className="font-ndot57 text-sm text-black">?</span>
          </div>

          {/* Gently appearing Dropdown Overlay */}
          {isDropdownOpen && (
            <div className="absolute top-[120%] right-0 mt-1 bg-white/95 backdrop-blur-2xl border border-black/5 rounded-[20px] shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-2 w-44 z-50 flex flex-col gap-1 origin-top-right transition-all animate-fade-in">
              <button
                onClick={() => { navigate("/"); setIsDropdownOpen(false); }}
                className="w-full text-left px-3.5 py-2.5 rounded-[12px] hover:bg-black/5 font-lettera uppercase text-[9px] tracking-wider font-bold text-black transition-colors cursor-pointer"
              >
                Home
              </button>
              <button
                onClick={() => { navigate("/dashboard"); setIsDropdownOpen(false); }}
                className="w-full text-left px-3.5 py-2.5 rounded-[12px] hover:bg-black/5 font-lettera uppercase text-[9px] tracking-wider font-bold text-black transition-colors cursor-pointer"
              >
                Dashboard
              </button>
              <button
                onClick={() => { navigate("/profile"); setIsDropdownOpen(false); }}
                className="w-full text-left px-3.5 py-2.5 rounded-[12px] hover:bg-black/5 font-lettera uppercase text-[9px] tracking-wider font-bold text-black transition-colors cursor-pointer"
              >
                Profile
              </button>
              <button
                onClick={() => { navigate("/upload"); setIsDropdownOpen(false); }}
                className="w-full text-left px-3.5 py-2.5 rounded-[12px] hover:bg-black/5 font-lettera uppercase text-[9px] tracking-wider font-bold text-black transition-colors cursor-pointer"
              >
                Upload Video
              </button>
              <div className="h-[1px] bg-black/5 my-1" />
              <button
                onClick={handleLogout}
                className="w-full text-left px-3.5 py-2.5 rounded-[12px] hover:bg-black/5 font-lettera uppercase text-[9px] tracking-wider font-bold text-red-500 transition-colors cursor-pointer"
              >
                Logout
              </button>
            </div>
          )}
        </div> : (
          <div className="w-24 flex justify-end">
            <button 
              onClick={() => navigate("/auth")}
              className="px-5 py-2.5 bg-black text-white hover:bg-black/90 active:scale-95 transition-all rounded-full text-[10px] font-bold font-lettera uppercase tracking-widest cursor-pointer shadow-sm text-center select-none"
            >
              Login
            </button>
          </div>
        )
      }
    </div>
  );
}

export default Navbar;
