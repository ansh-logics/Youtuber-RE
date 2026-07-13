import { Login } from "@/components/login";
import { Signup } from "@/components/signup";
import { useState } from "react";
import { DotPlayLogo } from "@/components/DotPlayLogo";

export function AuthPage() {
    const [mode, setMode] = useState("Login");

    return (
        <div className="min-h-[75vh] flex flex-col justify-center items-center py-10 px-4">
            <div className={`bg-white/40 backdrop-blur-xl border border-black/5 rounded-[32px] p-8 md:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.02)] w-full flex flex-col items-center gap-6 transition-all duration-300 ${mode === "Login" ? "max-w-sm" : "max-w-md"}`}>
                
                {/* Dissolve style inject */}
                <style dangerouslySetInnerHTML={{ __html: `
                    @keyframes dissolve {
                        from { opacity: 0; filter: blur(3px); transform: translateY(-2px) scale(0.99); }
                        to { opacity: 1; filter: blur(0); transform: translateY(0) scale(1); }
                    }
                    .animate-dissolve {
                        animation: dissolve 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                    }
                `}} />

                {/* Brand Identifier */}
                <DotPlayLogo className="text-sm tracking-[0.25em] text-black/40 mb-1" />

                {/* Dynamic Dissolving Header */}
                <h1 
                    key={mode}
                    className="text-center font-ndot57 text-3xl tracking-[0.2em] text-black animate-dissolve uppercase select-none mb-1"
                >
                    {mode}
                </h1>

                {mode == "Login" ? (
                    <div className="w-full flex flex-col items-center gap-4">
                        <Login />
                        <div className="flex flex-col items-center gap-2 mt-4 w-full pt-5 border-t border-black/5">
                            <p className="font-lettera uppercase text-[9px] tracking-widest text-black/45">New to this Site?</p>
                            <button
                                onClick={() => setMode("Signup")}
                                className="px-6 py-2 bg-transparent hover:bg-black/5 active:scale-95 transition-all rounded-full border border-black/10 text-xs font-bold font-lettera uppercase tracking-wider text-black cursor-pointer"
                            >
                                Signup
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="w-full flex flex-col items-center gap-4">
                        <Signup />
                        <div className="flex flex-col items-center gap-2 mt-4 w-full pt-5 border-t border-black/5">
                            <p className="font-lettera uppercase text-[9px] tracking-widest text-black/45">Already have account?</p>
                            <button
                                onClick={() => setMode("Login")}
                                className="px-6 py-2 bg-transparent hover:bg-black/5 active:scale-95 transition-all rounded-full border border-black/10 text-xs font-bold font-lettera uppercase tracking-wider text-black cursor-pointer"
                            >
                                Login
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}