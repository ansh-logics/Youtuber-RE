import { useState } from "react";
import { Eye, EyeClosed } from "lucide-react";
import axios from "axios";

export function Login(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [visible, setVisible] = useState(true);

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
        <div className="flex w-full max-w-sm flex-col gap-5">
            <h1 className="text-center text-2xl font-bold tracking-wide">LOGIN</h1>

            <div className="flex w-full flex-col items-start gap-y-1.5">
                <span className="text-sm font-medium text-white/80">Email</span>
                <input
                    className="w-full rounded-md border border-white/10 bg-white p-2.5 text-black outline-none focus:border-white/30"
                    type="email"
                    name="email"
                    placeholder="enter you email"
                    onChange={(e)=>{
                        setEmail(e.target.value);
                    }}
                />
            </div>

            <div className="flex w-full flex-col items-start gap-y-1.5">
                <span className="text-sm font-medium text-white/80">Password</span>
                <div className="relative w-full">
                    <input
                        className="w-full rounded-md border border-white/10 bg-white p-2.5 pr-10 text-black outline-none focus:border-white/30"
                        type={visible?"text":"password"}
                        name="password"
                        placeholder="Enter you password"
                        onChange={(e)=>{
                            setPassword(e.target.value);
                        }}
                    />
                    {visible == true?(
                        <Eye
                            className="absolute right-2.5 top-1/2 h-5 w-5 -translate-y-1/2 cursor-pointer text-black"
                            onClick={()=>{setVisible(false)}}
                        />
                    ):(
                        <EyeClosed
                            className="absolute right-2.5 top-1/2 h-5 w-5 -translate-y-1/2 cursor-pointer text-black"
                            onClick={()=>{
                                setVisible(true);
                            }}
                        />
                    )}
                </div>
            </div>
            <button
                onClick={login}
                type="button"
                className="mt-2 w-full rounded-md bg-white px-4 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-white/30"
            >
                Log in
            </button>
        </div>
    )
}