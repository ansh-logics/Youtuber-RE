import { Login } from "@/components/login";
import { Signup } from "@/components/signup";
import { useState } from "react";

export function AuthPage(){
    const [mode, setMode] = useState("Login");
    return(
        <>
            {mode == "Login"?(
                <>
                    <Login/>
                    <br />
                    <p>New to this Site?</p>
                    <button onClick={() =>{
                        setMode("Signup")
                    }}>Signup</button>
                </>
            ):(
                <>
                    <Signup/>
                    <p>Already have account?</p>
                    <button onClick={() =>{
                        setMode("Login")
                    }}>Login</button>
                </>
            )
            }
        </>
    )
}