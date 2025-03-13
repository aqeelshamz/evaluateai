"use client";
import { appName, serverURL } from "@/utils/config";
import Link from "next/link";
import { FiAtSign, FiHash, FiLock, FiUser } from "react-icons/fi";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from 'react-hot-toast';

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [isVerificationCodeSent, setIsVerificationCodeSent] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      window.location.href = "/dashboard";
    }
  }, []);

  const sendVerificationCode = async () => {
    if (!email || !name || !password) {
      toast.error("All fields are required");
      return;
    }
    setLoading(true);
    const config = {
      method: "POST",
      url: `${serverURL}/users/send-verification-code`,
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        email
      }
    };

    axios(config)
      .then((response) => {
        setLoading(false);
        setIsVerificationCodeSent(true);
        console.log(response.data);
        toast.success("Verification code sent successfully");
      })
      .catch((error) => {
        setLoading(false);
        console.error(error);
        toast.error(error.response.data);
      });
  }

  const verifyEmailAndSignup = async () => {
    if (!verificationCode) {
      toast.error("Enter verification code");
      return;
    }

    setLoading(true);
    const config = {
      method: "POST",
      url: `${serverURL}/users/verify-email-signup`,
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        email,
        name,
        password,
        code: verificationCode
      }
    };

    axios(config)
      .then((response) => {
        setLoading(false);
        setIsVerificationCodeSent(true);
        console.log(response.data);
        toast.success("Account created!");
        login();
      })
      .catch((error) => {
        setLoading(false);
        console.error(error);
        toast.error(error.response.data);
      });
  }

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
        <h1 className="text-2xl font-semibold">{isVerificationCodeSent ? "Verify Email" : "Signup"}</h1>
        {
          isVerificationCodeSent ?
            <label className="input mt-4 w-full">
              <FiHash />
              <input type="text" className="w-full" placeholder="Verification Code" value={verificationCode} onChange={(x) => setVerificationCode(x.target.value)} />
            </label> : <>
              <label className="input mt-4 w-full">
                <FiUser />
                <input type="text" className="w-full" placeholder="Your Name" value={name} onChange={(x) => setName(x.target.value)} />
              </label>
              <label className="input mt-4 w-full">
                <FiAtSign />
                <input type="text" className="w-full" placeholder="Email" value={email} onChange={(x) => setEmail(x.target.value)} />
              </label>
              <label className="input mt-4 w-full">
                <FiLock />
                <input type="password" className="w-full" placeholder="Password" value={password} onChange={(x) => setPassword(x.target.value)} />
              </label>
            </>
        }
        <button className="mt-4 btn btn-primary w-full" onClick={() => {
          if (!isVerificationCodeSent) {
            sendVerificationCode();
          }
          else {
            verifyEmailAndSignup();
          }
        }}>{loading ? <span className="loading loading-spinner loading-md"></span> : isVerificationCodeSent ? "Create Account" : "Verify Email"}</button>
        <p className="text-sm mt-4">Dont have an account? <Link className="text-primary font-semibold" href="/auth/login">Login</Link></p>
      </div>
      <Toaster />
    </motion.div>
  );
}
