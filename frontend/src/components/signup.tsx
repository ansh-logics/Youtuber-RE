import { useState } from "react";
import { Eye, EyeClosed } from "lucide-react";
import axios from "axios";
import { NothingDatePicker } from "./NothingDatePicker";

export function Signup(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [gender, setGender] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [dob, setDob] = useState("");
    const [visible, setVisible] = useState(false);
    const [isPwdFocused, setIsPwdFocused] = useState(false);

    const dispatchCatState = (focused: boolean, visibleVal: boolean) => {
        window.dispatchEvent(
            new CustomEvent("nothing-cat-password-state", {
                detail: { focused, visible: visibleVal }
            })
        );
    };

    const [step, setStep] = useState(1);

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
        axios.post("http://localhost:3001/auth/signup", data).then(()=>{
        }).catch(()=>{
            setVisible(false);
        })
    }

    return (
        <div className="flex w-full flex-col gap-5 text-left">
            <div className="flex flex-col items-center gap-1 mb-1">
                <span className="font-lettera uppercase text-[9px] tracking-widest text-black/35 font-bold">
                    STEP {step.toString().padStart(2, '0')} / 02
                </span>
            </div>

            {step === 1 ? (
                /* Step 1: Personal Details */
                <div className="flex flex-col gap-4">
                    {/* First Name & Last Name */}
                    <div className="grid grid-cols-2 gap-4 w-full">
                        <div className="flex flex-col items-start">
                            <span className="font-lettera uppercase text-[10px] tracking-widest text-black/40 font-bold mb-1.5">First Name</span>
                            <input
                                className="w-full rounded-[16px] border border-black/5 bg-black/[0.02] p-3 text-black text-sm outline-none focus:border-black/20 focus:bg-black/[0.04] transition-all font-grotesk placeholder-black/30"
                                type="text"
                                name="firstname"
                                value={firstName}
                                placeholder="First Name"
                                onChange={(e)=>{
                                    setFirstName(e.target.value);
                                }}
                            />
                        </div>
                        <div className="flex flex-col items-start">
                            <span className="font-lettera uppercase text-[10px] tracking-widest text-black/40 font-bold mb-1.5">Last Name</span>
                            <input
                                className="w-full rounded-[16px] border border-black/5 bg-black/[0.02] p-3 text-black text-sm outline-none focus:border-black/20 focus:bg-black/[0.04] transition-all font-grotesk placeholder-black/30"
                                type="text"
                                name="Last Name"
                                value={lastName}
                                placeholder="Last Name"
                                onChange={(e)=>{
                                    setLastName(e.target.value);
                                }}
                            />
                        </div>
                    </div>

                    {/* Dob */}
                    <div className="flex w-full flex-col items-start">
                        <span className="font-lettera uppercase text-[10px] tracking-widest text-black/40 font-bold mb-1.5">Dob</span>
                        <NothingDatePicker
                            value={dob}
                            onChange={setDob}
                            placeholder="Choose your Dob"
                        />
                    </div>

                    {/* Gender */}
                    <div className="flex w-full flex-col items-start gap-y-1 bg-black/[0.01] border border-black/5 rounded-[16px] p-3.5">
                        <span className="font-lettera uppercase text-[10px] tracking-widest text-black/40 font-bold mb-1">Gender</span>
                        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                            <div className="flex items-center gap-x-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="gender"
                                    value="Male"
                                    checked={gender === "Male"}
                                    onChange={(e) => setGender(e.target.value)}
                                    className="accent-black h-4 w-4 cursor-pointer"
                                    id="gender-male"
                                />
                                <label htmlFor="gender-male" className="font-grotesk text-sm text-black/75 cursor-pointer uppercase select-none">Male</label>
                            </div>
                            <div className="flex items-center gap-x-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="gender"
                                    value="Female"
                                    checked={gender === "Female"}
                                    onChange={(e) => setGender(e.target.value)}
                                    className="accent-black h-4 w-4 cursor-pointer"
                                    id="gender-female"
                                />
                                <label htmlFor="gender-female" className="font-grotesk text-sm text-black/75 cursor-pointer uppercase select-none">Female</label>
                            </div>
                            <div className="flex items-center gap-x-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="gender"
                                    value="Other"
                                    checked={gender === "Other"}
                                    onChange={(e) => setGender(e.target.value)}
                                    className="accent-black h-4 w-4 cursor-pointer"
                                    id="gender-other"
                                />
                                <label htmlFor="gender-other" className="font-grotesk text-sm text-black/75 cursor-pointer uppercase select-none">Other</label>
                            </div>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="mt-2 w-full rounded-full bg-black text-white py-3.5 text-xs font-bold font-lettera uppercase tracking-widest transition-all hover:bg-black/90 active:scale-98 shadow-sm cursor-pointer text-center"
                    >
                        Next
                    </button>
                </div>
            ) : (
                /* Step 2: Account Details */
                <div className="flex flex-col gap-4">
                    {/* Username */}
                    <div className="flex w-full flex-col items-start">
                        <span className="font-lettera uppercase text-[10px] tracking-widest text-black/40 font-bold mb-1.5">Username</span>
                        <input
                            className="w-full rounded-[16px] border border-black/5 bg-black/[0.02] p-3 text-black text-sm outline-none focus:border-black/20 focus:bg-black/[0.04] transition-all font-grotesk placeholder-black/30"
                            type="text"
                            name="username"
                            value={username}
                            placeholder="Username"
                            onChange={(e)=>{
                                  setUsername(e.target.value);
                            }}
                        />
                    </div>

                    {/* Email */}
                    <div className="flex w-full flex-col items-start">
                        <span className="font-lettera uppercase text-[10px] tracking-widest text-black/40 font-bold mb-1.5">Email</span>
                        <input
                            className="w-full rounded-[16px] border border-black/5 bg-black/[0.02] p-3 text-black text-sm outline-none focus:border-black/20 focus:bg-black/[0.04] transition-all font-grotesk placeholder-black/30"
                            type="email"
                            name="email"
                            value={email}
                            placeholder="enter your email"
                            onChange={(e)=>{
                                setEmail(e.target.value);
                            }}
                        />
                    </div>

                    {/* Password */}
                    <div className="flex w-full flex-col items-start">
                        <span className="font-lettera uppercase text-[10px] tracking-widest text-black/40 font-bold mb-1.5">Password</span>
                        <div className="relative w-full">
                            <input
                                className="w-full rounded-[16px] border border-black/5 bg-black/[0.02] p-3 pr-11 text-black text-sm outline-none focus:border-black/20 focus:bg-black/[0.04] transition-all font-grotesk placeholder-black/30"
                                type={visible?"text":"password"}
                                name="password"
                                value={password}
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

                    <div className="grid grid-cols-2 gap-4 mt-2">
                        <button
                            type="button"
                            onClick={() => setStep(1)}
                            className="w-full rounded-full border border-black/10 bg-transparent hover:bg-black/5 text-black py-3.5 text-xs font-bold font-lettera uppercase tracking-widest transition-all active:scale-98 cursor-pointer text-center"
                        >
                            Back
                        </button>
                        <button
                            type="button"
                            onClick={signup}
                            className="w-full rounded-full bg-black text-white py-3.5 text-xs font-bold font-lettera uppercase tracking-widest transition-all hover:bg-black/90 active:scale-98 shadow-sm cursor-pointer text-center"
                        >
                            Sign up
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
