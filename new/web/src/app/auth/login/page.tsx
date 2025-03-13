"use client";
import { appName, serverURL } from "@/utils/config";
import Link from "next/link";
import { FiAtSign, FiLock } from "react-icons/fi";
import { motion } from "framer-motion";
import axios from "axios";
import { useEffect, useState } from "react";
import toast, { Toaster } from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      window.location.href = "/dashboard";
    }
  }, []);

  const login = async () => {
    if (!email || !password) {
      toast.error("All fields are required");
      return;
    }
    setLoading(true);
    const config = {
      method: "POST",
      url: `${serverURL}/users/login`,
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        email,
        password
      }
    };

    axios(config)
      .then((response) => {
        setLoading(false);
        console.log(response.data);
        toast.success("Logged in");
        localStorage.setItem("token", response.data.token);
        window.location.href = "/dashboard";
      })
      .catch((error) => {
        setLoading(false);
        console.error(error);
        toast.error(error.response.data);
      });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.4 }}
      className={"w-screen h-screen flex flex-col items-center justify-center"}
    >
      <div className="flex my-10">
        <img src="/logo.png" alt="logo" className="mr-2 h-10" />
        <h1 className="text-4xl font-semibold">{appName}</h1>
      </div>
      <div className="flex flex-col items-center max-w-sm w-full border border-gray-100 rounded-lg p-10 shadow-lg">
        <h1 className="text-2xl font-semibold">Login</h1>
        <label className="input mt-4 w-full">
          <FiAtSign />
          <input type="text" className="w-full" placeholder="Email" value={email} onChange={(x) => setEmail(x.target.value)} />
        </label>
        <label className="input mt-4 w-full">
          <FiLock />
          <input type="password" className="w-full" placeholder="Password" value={password} onChange={(x) => setPassword(x.target.value)} />
        </label>
        <button className="mt-4 btn btn-primary w-full" onClick={() => login()}>{loading ? <span className="loading loading-spinner loading-md"></span> : "Login"}</button>
        <p className="text-sm mt-4">Dont have an account? <Link className="text-primary font-semibold" href="/auth/signup">Signup</Link></p>
      </div>
      <Toaster />
    </motion.div>
  );
}
