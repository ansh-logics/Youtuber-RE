import { useState } from "react";
import { Eye, EyeClosed } from "lucide-react";
import axios from "axios";

export function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [visible, setVisible] = useState(false);
    const [isPwdFocused, setIsPwdFocused] = useState(false);

    const dispatchCatState = (focused: boolean, visibleVal: boolean) => {
        window.dispatchEvent(
            new CustomEvent("nothing-cat-password-state", {
                detail: { focused, visible: visibleVal }
            })
        );
    };

    let data = {
        email:email,
        password:password
    }
    const login = () => {
        axios.post("http://localhost:3001/auth/login", data).then((res)=>{
            let resData = res.data;
            localStorage.setItem("token", resData.token)
            localStorage.setItem("username", resData.username);
        }).catch((err)=>{
            console.log(err);
        });
    }

    return (
        <div className="flex w-full max-w-sm flex-col gap-6 text-left">
            <div className="flex w-full flex-col items-start">
                <span className="font-lettera uppercase text-[10px] tracking-widest text-black/40 font-bold mb-2">Email</span>
                <input
                    className="w-full rounded-[16px] border border-black/5 bg-black/[0.02] p-3 text-black text-sm outline-none focus:border-black/20 focus:bg-black/[0.04] transition-all font-grotesk placeholder-black/30"
                    type="email"
                    name="email"
                    placeholder="enter your email"
                    onChange={(e)=>{
                        setEmail(e.target.value);
                    }}
                />
            </div>

            <div className="flex w-full flex-col items-start">
                <span className="font-lettera uppercase text-[10px] tracking-widest text-black/40 font-bold mb-2">Password</span>
                <div className="relative w-full">
                    <input
                        className="w-full rounded-[16px] border border-black/5 bg-black/[0.02] p-3 pr-11 text-black text-sm outline-none focus:border-black/20 focus:bg-black/[0.04] transition-all font-grotesk placeholder-black/30"
                        type={visible?"text":"password"}
                        name="password"
                        placeholder="enter your password"
                        onChange={(e)=>{
                            setPassword(e.target.value);
                        }}
                        onFocus={() => {
                            setIsPwdFocused(true);
                            dispatchCatState(true, visible);
                        }}
                        onBlur={() => {
                            setIsPwdFocused(false);
                            dispatchCatState(false, visible);
                        }}
                    />
                    {visible == true?(
                        <Eye
                            className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 cursor-pointer text-black/40 hover:text-black transition-colors"
                            onClick={()=>{
                                setVisible(false);
                                dispatchCatState(isPwdFocused, false);
                            }}
                        />
                    ):(
                        <EyeClosed
                            className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 cursor-pointer text-black/40 hover:text-black transition-colors"
                            onClick={()=>{
                                setVisible(true);
                                dispatchCatState(isPwdFocused, true);
                            }}
                        />
                    )}
                </div>
            </div>
            
            <button
                onClick={login}
                type="button"
                className="mt-4 w-full rounded-full bg-black text-white py-3.5 text-xs font-bold font-lettera uppercase tracking-widest transition-all hover:bg-black/90 active:scale-98 shadow-sm cursor-pointer"
            >
                Log in
            </button>
        </div>
    )
}