"use client";
import axios from 'axios';
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

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const login = async () => {
        var loginData = null;
        if (email === "admin@evaluateai.com" && password === "password") {
            loginData = {
                "user": {
                    "_id": "65c88c79da46d0601e26bebc",
                    "name": "Admin",
                    "email": "admin@evaluateai.com",
                    "password": "$2b$10$GpPfREACojipNzazcgrr7efAngsDoIRqybMF0rW.jpHE5qnm/dr2G",
                    "type": 0,
                    "createdAt": "2024-02-11T08:59:37.024Z",
                    "updatedAt": "2024-02-11T08:59:37.024Z",
                    "__v": 0
                },
                "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWM4OGM3OWRhNDZkMDYwMWUyNmJlYmMiLCJpYXQiOjE3MDc2NDc5MjV9.G-1EiOolipCz92u4fjIERGB0LDZ-16CsJnWfefIzOMU"
            };
        }
        else if (email === "user@evaluateai.com" && password === "password") {
            loginData = {
                "user": {
                    "_id": "65c88f328ad115825aa80fdb",
                    "name": "User",
                    "email": "user@evaluateai.com",
                    "password": "$2b$10$KPYTKDVmj4MJjXOhA431u.bOjMdS/8WzNPxeK1LcZnez0UU7L5G16",
                    "type": 1,
                    "createdAt": "2024-02-11T09:11:14.884Z",
                    "updatedAt": "2024-02-11T09:11:14.884Z",
                    "__v": 0
                },
                "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWM4OGYzMjhhZDExNTgyNWFhODBmZGIiLCJpYXQiOjE3MDc2NDc3OTR9.hOlfGUcwzuxSa97e6vOLyKYFz0iyKDpF6NSm_nRV7cQ"
            };
        }
        else {
            return toast.error("Incorrect Email or Password");
        }

        toast.success("Logged In!");
        localStorage.setItem("token", loginData.token);
        window.location.href = loginData.user.type === 0 ? "/admin" : "/home";
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
                <p className="font-bold text-xl mb-3">Login</p>
                <p className="mb-5">Don&apos;t have an account? <Link href={'/signup'}><label htmlFor="createchatbot_modal" className="btn btn-sm">Sign up</label></Link></p>
                <p className="text-sm mb-1">Email</p>
                <input className="input input-bordered mb-5 max-w-xs" placeholder="Email" type="text" onChange={(x) => setEmail(x.target.value)} value={email} />
                <p className="text-sm mb-1">Password</p>
                <input className="input input-bordered mb-5 max-w-xs" placeholder="Password" type="password" onChange={(x) => setPassword(x.target.value)} value={password} />
                <button className="btn btn-primary max-w-xs" onClick={() => login()}>Login</button>
            </div>
            <ToastContainer />
        </main>
    )
}