"use client";
import { appName } from "@/utils/utils";
import Link from "next/link";
import { FiAtSign, FiLock, FiUser } from "react-icons/fi";
import { motion } from "framer-motion";

export default function Home() {
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
        <h1 className="text-2xl font-semibold">Signup</h1>
        <label className="input mt-4 w-full">
          <FiUser />
          <input type="text" className="w-full" placeholder="Your Name" />
        </label>
        <label className="input mt-4 w-full">
          <FiAtSign />
          <input type="text" className="w-full" placeholder="Email" />
        </label>
        <label className="input mt-4 w-full">
          <FiLock />
          <input type="text" className="w-full" placeholder="Password" />
        </label>
        <button className="mt-4 btn btn-primary w-full">Create Account</button>
        <p className="text-sm mt-4">Dont have an account? <Link className="text-primary font-semibold" href="/auth/login">Login</Link></p>
      </div>
    </motion.div>
  );
}
