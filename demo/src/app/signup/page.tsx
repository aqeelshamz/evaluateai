"use client";
import Link from 'next/link'
import { useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { appName, serverURL } from '@/utils/utils';
import { ToastContainer, toast } from 'react-toastify';

export default function Home() {
    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (localStorage.getItem("token")) {
                window.location.href = "/home";
            }
        }
    }, []);

    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const [verificationCodeSent, setVerificationCodeSent] = useState<boolean>(false);
    const [verificationCode, setVerificationCode] = useState<string>("");

    const [loading, setLoading] = useState<boolean>(false);

    const sendVerificationCode = async () => {
        if (email == "" || name == "" || password == "") {
            toast.error("Please fill out all fields!");
            return;
        }

        return toast.error("This feature is not available in the demo version!");
    }

    const verifyEmail = async () => {
        if (email == "" || name == "" || password == "") {
            toast.error("Please fill out all fields!");
            return;
        }

        if (verificationCode == "") {
            toast.error("Please enter the verification code!");
            return;
        }

        return toast.error("This feature is not available in the demo version!");
    }

    const signup = async () => {
        if (email == "" || name == "" || password == "") {
            toast.error("Please fill out all fields!");
            return;
        }

        return toast.error("This feature is not available in the demo version!");
    }

    return (
        <main className="w-screen h-screen bg-base-100 flex p-2 overflow-hidden">
            <div className='flex flex-col text-white p-10 max-w-[30vw] bg-gradient-to-b to-purple-400 via-violet-500 from-indigo-600 h-full rounded-md'>
                <Link href={"/"}><p className="mb-10">🤖 {appName} 📝</p></Link>
                <p className="text-2xl font-semibold mb-2">
                    {appName} - AI Powered Exam Sheet Evaluator
                </p>
                <p className="opacity-70">Seamless Access, Effortless Evaluation: Welcome to EvaluateAI, Where Innovation Meets Intelligent Grading.</p>
            </div>
            <div className="animate-fade-in-bottom flex flex-col w-full h-full ml-2 rounded-md p-10">
                <p className="font-bold text-xl mb-3">Sign Up</p>
                <p className="mb-5">Already have an account? <Link href={'/login'}><label htmlFor="createchatbot_modal" className="btn btn-sm">Login</label></Link></p>
                <p className="text-sm mb-1">Full Name</p>
                <input className="input input-bordered mb-5 max-w-xs" placeholder="Full Name" type="text" onChange={(x) => setName(x.target.value)} value={name} />
                <p className="text-sm mb-1">Email</p>
                <input className="input input-bordered mb-5 max-w-xs" placeholder="Email" type="text" onChange={(x) => setEmail(x.target.value)} value={email} />
                <p className="text-sm mb-1">Password</p>
                <input className="input input-bordered mb-5 max-w-xs" placeholder="Password" type="password" onChange={(x) => setPassword(x.target.value)} value={password} />
                {verificationCodeSent && <div className="flex flex-col">
                    <p className="text-sm mb-1">Verification Code</p>
                    <input className="input input-bordered mb-5 max-w-xs" placeholder="Verification Code" type="text" onChange={(x) => setVerificationCode(x.target.value)} value={verificationCode} />
                </div>}
                <button className="btn btn-primary max-w-xs" onClick={() => {
                    if (loading) return;
                    if (!verificationCodeSent) {
                        sendVerificationCode();
                    }
                    else {
                        verifyEmail();
                    }
                }}>{loading ? <span className="loading loading-spinner"></span> : verificationCodeSent ? "Create Account" : "Send Verification Code"}</button>
            </div>
            <ToastContainer />
        </main>
    )
}