import { useState } from "react";
import { Eye, EyeClosed } from "lucide-react";
import axios from "axios";
export function Signup(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [gender, setGender] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [dob, setDob] = useState("");
    const [visible, setVisible] = useState(true);

    const signup = async () =>{
        let data = {
            email:email, 
            username:username,
            password:password,
            gender:gender,
            firstName:firstName,
            lastName:lastName,
            dob: dob
        }
        axios.post("http://localhost:3001/auth/signup", data).then((res)=>{
            console.log(res.data);
        }).catch((err)=>{
            console.log(err);
            setVisible(false);
        })

    }

    return (
        <div className="flex w-full max-w-md flex-col gap-5">
            <h1 className="text-center text-2xl font-bold tracking-wide">SIGNUP</h1>
            <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex w-full flex-col items-start gap-y-1.5">
                    <span className="text-sm font-medium text-white/80">First Name</span>
                    <input
                        className="w-full rounded-md border border-white/10 bg-white p-2.5 text-black outline-none focus:border-white/30"
                        type="text"
                        name="firstname"
                        placeholder="First Name"
                        onChange={(e)=>{
                            setFirstName(e.target.value);
                        }}
                    />
                </div>
                <div className="flex w-full flex-col items-start gap-y-1.5">
                    <span className="text-sm font-medium text-white/80">Last Name</span>
                    <input
                        className="w-full rounded-md border border-white/10 bg-white p-2.5 text-black outline-none focus:border-white/30"
                        type="Text"
                        name="Last Name"
                        placeholder="Last Name"
                        onChange={(e)=>{
                            setLastName(e.target.value);
                        }}
                    />
                </div>
            </div>

            <div className="flex w-full flex-col items-start gap-y-1.5">
                <span className="text-sm font-medium text-white/80">Username</span>
                <input
                    className="w-full rounded-md border border-white/10 bg-white p-2.5 text-black outline-none focus:border-white/30"
                    type="text"
                    name="username"
                    placeholder="Username"
                    onChange={(e)=>{
                        setUsername(e.target.value);
                    }}
                />
            </div>

            <div className="flex w-full flex-col items-start gap-y-1.5">
                <span className="text-sm font-medium text-white/80">Email</span>
                <input
                    className="w-full rounded-md border border-white/10 bg-white p-2.5 text-black outline-none focus:border-white/30"
                    type="email"
                    name="email"
                    placeholder="Enter you email"
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

            <div className="flex w-full flex-col gap-4">
                <div className="flex w-full flex-col items-start gap-y-1.5">
                    <span className="text-sm font-medium text-white/80">Gender</span>
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                        <div className="flex items-center gap-x-1.5">
                            <span className="text-sm">Male</span>
                            <input
                                type="radio"

                                name="gender"

                                value="Male"

                                checked={gender === "Male"}

                                onChange={(e) => setGender(e.target.value)}

                                />
                        </div>
                        <div className="flex items-center gap-x-1.5">
                            <span className="text-sm">Female</span>
                            <input
                                type="radio"

                                name="gender"

                                value="Female"

                                checked={gender === "Female"}

                                onChange={(e) => setGender(e.target.value)}

                                />
                        </div>
                        <div className="flex items-center gap-x-1.5">
                            <span className="text-sm">Other</span>
                            <input
                                type="radio"

                                name="gender"

                                value="Other"

                                checked={gender === "Other"}

                                onChange={(e) => setGender(e.target.value)}

                            />
                        </div>
                    </div>
                </div>

                <div className="flex w-full flex-col items-start gap-y-1.5">
                    <span className="text-sm font-medium text-white/80">Dob</span>
                    <input
                        className="w-full rounded-md border border-white/10 bg-white p-2.5 text-black outline-none focus:border-white/30"
                        type="date"
                        name="Dob"
                        placeholder="Chooose your Dob"
                        onChange={(e)=>{
                            setDob(e.target.value);
                        }}
                    />
                </div>
            </div>
            <button
                type="button"
                className="mt-2 w-full rounded-md bg-white px-4 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-white/30"
                onClick={signup}
            >
                Sign up
            </button>
        </div>
    )
}