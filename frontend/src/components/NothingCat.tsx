import { useState, useEffect, useRef } from "react";

export function NothingCat() {
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [pupilOffset, setPupilOffset] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isSleeping, setIsSleeping] = useState(false);
  const catRef = useRef<HTMLDivElement>(null);
  const lastActivity = useRef(Date.now());

  // Listen to global password field states
  useEffect(() => {
    const handlePasswordState = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent && customEvent.detail) {
        setIsPasswordFocused(!!customEvent.detail.focused);
        setIsPasswordVisible(!!customEvent.detail.visible);
      }
    };
    window.addEventListener("nothing-cat-password-state", handlePasswordState);
    return () => window.removeEventListener("nothing-cat-password-state", handlePasswordState);
  }, []);

  // Mouse tracking to offset pupils
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!catRef.current) return;
      const rect = catRef.current.getBoundingClientRect();
      // Center of the cat's eyes
      const eyeX = rect.left + rect.width / 2;
      const eyeY = rect.top + rect.height * 0.5;

      const angle = Math.atan2(e.clientY - eyeY, e.clientX - eyeX);
      const maxDistance = 2.0; // Subtle tracking offset for small circular eyes
      
      const distance = Math.min(maxDistance, Math.hypot(e.clientX - eyeX, e.clientY - eyeY) / 100);
      
      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance;

      setPupilOffset({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Activity tracking for idle sleeping state (5 seconds)
  useEffect(() => {
    const resetTimer = () => {
      lastActivity.current = Date.now();
      setIsSleeping(false);
    };

    const checkIdle = setInterval(() => {
      if (Date.now() - lastActivity.current > 5000) {
        setIsSleeping(true);
      }
    }, 500);

    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);
    window.addEventListener("click", resetTimer);
    window.addEventListener("scroll", resetTimer);

    return () => {
      clearInterval(checkIdle);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      window.removeEventListener("click", resetTimer);
      window.removeEventListener("scroll", resetTimer);
    };
  }, []);

  const line1 = "⠀⠀⠀⠀⠀⠀⢀⡤⣤⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⡀⠀⠀⠀⠀⠀⠀";
  const line2 = "⠀⠀⠀⠀⠀⢀⡏⠀⠀⠈⠳⣄⠀⠀⠀⠀⠀⣀⠴⠋⠉⠉⡆⠀⠀⠀⠀⠀";
  const line3 = "⠀⠀⠀⠀⠀⢸⠀⠀⠀⠀⠀⠈⠉⠉⠙⠓⠚⠁⠀⠀⠀⠀⣿⠀⠀⠀⠀⠀";
  const line4 = "⠀⠀⠀⠀⢀⠞⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠹⣄⠀⠀⠀⠀";
  const line5_left = "⠀⠀⠀⠀⡞⠀⠀⠀⠀⠀";
  const line5_mid = "⠀⠀⠀⠀⠀⠀";
  const line5_right = "⠀⠀⠀⠀⠀⠸⡆⠀⠀⠀";
  const line6 = "⢠⣤⣶⣾⣧⣤⣤⣀⡀⠀⠀⠀⠀⠈⠀⠀⠀⢀⡤⠴⠶⠤⢤⡀⣧⣀⣀⠀";
  const line7 = "⠻⠶⣾⠁⠀⠀⠀⠀⠙⣆⠀⠀⠀⠀⠀⠀⣰⠋⠀⠀⠀⠀⠀⢹⣿⣭⣽⠇";
  const line8 = "⠀⠀⠙⠤⠴⢤⡤⠤⠤⠋⠉⠉⠉⠉⠉⠉⠉⠳⠖⠦⠤⠶⠦⠞⠁⠀⠀⠀";

  // Check state categories
  const isPeeking = isPasswordFocused && !isPasswordVisible;
  const isClosedEyes = isPeeking || (isSleeping && !isHovered);

  return (
    <div
      ref={catRef}
      id="nothing-cat"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="fixed bottom-0 left-8 z-40 pointer-events-auto select-none flex flex-col items-center cursor-pointer"
    >
      {/* Self-contained keyframe styles for floating sleeping Zzz text */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes floatZ1 {
          0% { transform: translate(0, 0) scale(0.8); opacity: 0; }
          20% { opacity: 0.8; }
          80% { opacity: 0.8; }
          100% { transform: translate(4px, -12px) scale(1); opacity: 0; }
        }
        @keyframes floatZ2 {
          0% { transform: translate(0, 0) scale(0.8); opacity: 0; }
          30% { opacity: 0.8; }
          80% { opacity: 0.8; }
          100% { transform: translate(8px, -18px) scale(1.1); opacity: 0; }
        }
        @keyframes floatZ3 {
          0% { transform: translate(0, 0) scale(0.8); opacity: 0; }
          40% { opacity: 0.8; }
          80% { opacity: 0.8; }
          100% { transform: translate(12px, -24px) scale(1.25); opacity: 0; }
        }
        .animate-zzz-1 { animation: floatZ1 2s infinite ease-in-out; }
        .animate-zzz-2 { animation: floatZ2 2s infinite ease-in-out 0.6s; }
        .animate-zzz-3 { animation: floatZ3 2s infinite ease-in-out 1.2s; }
      `}} />

      {/* Floating Zzz text when sleeping */}
      {isSleeping && !isPasswordFocused && !isHovered && (
        <div className="absolute top-[16px] right-[10px] z-50 flex flex-col pointer-events-none select-none font-lettera uppercase font-bold text-[7px] text-black/55">
          <span className="animate-zzz-1 absolute">z</span>
          <span className="animate-zzz-2 absolute">z</span>
          <span className="animate-zzz-3 absolute">Z</span>
        </div>
      )}

      {/* Speech bubble popup (anime style) */}
      {isHovered && !isPasswordFocused && (
        <div className="absolute bottom-[92px] left-1/2 -translate-x-1/2 mb-3 bg-black text-white font-lettera text-[8px] tracking-widest px-3 py-1.5 rounded-[12px] shadow-lg flex flex-col items-center z-50 whitespace-nowrap border border-black/10 transition-all duration-200 scale-100 animate-fade-in">
          <span>hi, my name is Dot</span>
          {/* Speech bubble arrow */}
          <div className="w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-t-[3px] border-t-black absolute top-full left-1/2 -translate-x-1/2" />
        </div>
      )}

      {/* Cat Body wrapper applying translations */}
      <div 
        className={`transition-all duration-500 ease-in-out transform origin-bottom-left
          ${isPeeking ? "translate-y-[45px]" : "translate-y-0"}
        `}
      >
        <pre className="font-mono text-[9px] leading-[1.1] text-black bg-transparent select-none whitespace-pre">
          {line1}{"\n"}
          {line2}{"\n"}
          {line3}{"\n"}
          {line4}{"\n"}
          <span className="flex items-center">
            {line5_left}
            
            {/* Left Eye Rendering */}
            {isClosedEyes ? (
              /* Closed eye left */
              <span className="inline-flex w-[8px] h-[8px] items-center justify-center font-mono text-black text-[9px] mx-[0.5px]">
                ⠒
              </span>
            ) : isHovered ? (
              /* Anime happy eye left ^^ */
              <svg viewBox="0 0 8 8" className="w-[8px] h-[8px] fill-none stroke-black stroke-[1.5] stroke-linecap-round mx-[0.5px]">
                <path d="M 1 5 C 2.5 2, 5.5 2, 7 5" />
              </svg>
            ) : (
              /* Cute round tracking eye left */
              <span className="inline-flex w-[8px] h-[8px] rounded-full bg-white border border-black/15 items-center justify-center relative overflow-hidden mx-[0.5px]">
                <span 
                  className="w-[3.5px] h-[3.5px] rounded-full bg-black absolute"
                  style={{ 
                    transform: `translate(${pupilOffset.x}px, ${pupilOffset.y}px)`,
                    transition: "transform 0.05s ease-out" 
                  }}
                />
              </span>
            )}
            
            {line5_mid}
            
            {/* Right Eye Rendering */}
            {isClosedEyes ? (
              /* Closed eye right */
              <span className="inline-flex w-[8px] h-[8px] items-center justify-center font-mono text-black text-[9px] mx-[0.5px]">
                ⠒
              </span>
            ) : isHovered ? (
              /* Anime happy eye right ^^ */
              <svg viewBox="0 0 8 8" className="w-[8px] h-[8px] fill-none stroke-black stroke-[1.5] stroke-linecap-round mx-[0.5px]">
                <path d="M 1 5 C 2.5 2, 5.5 2, 7 5" />
              </svg>
            ) : (
              /* Cute round tracking eye right */
              <span className="inline-flex w-[8px] h-[8px] rounded-full bg-white border border-black/15 items-center justify-center relative overflow-hidden mx-[0.5px]">
                <span 
                  className="w-[3.5px] h-[3.5px] rounded-full bg-black absolute"
                  style={{ 
                    transform: `translate(${pupilOffset.x}px, ${pupilOffset.y}px)`,
                    transition: "transform 0.05s ease-out" 
                  }}
                />
              </span>
            )}
            
            {line5_right}
          </span>{"\n"}
          {line6}{"\n"}
          {line7}{"\n"}
          {line8}
        </pre>
      </div>

      {/* Screen gripping paws overlays (stays anchored at screen bottom during peeking) */}
      {isPeeking && (
        <div className="absolute bottom-[2px] left-[26px] right-[26px] flex justify-between px-3 z-50 animate-fade-in">
          <div className="w-[8px] h-[6px] rounded-t-full bg-white border-t border-l border-r border-black/25 flex items-center justify-center">
            <span className="text-[5px] text-black/40">⠒</span>
          </div>
          <div className="w-[8px] h-[6px] rounded-t-full bg-white border-t border-l border-r border-black/25 flex items-center justify-center">
            <span className="text-[5px] text-black/40">⠒</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default NothingCat;
