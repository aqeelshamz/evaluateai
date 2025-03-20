"use client";
import { apkURL, appName } from "@/utils/config";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BsAndroid } from "react-icons/bs";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      setIsLoggedIn(true);
    }
  }, [])

  return (
    <div className="oveflow-x-hidden">
      {/* Navbar */}
      <nav
        className="fixed top-0 left-0 w-full flex justify-between items-center h-16 bg-white text-black z-10 p-5"
        role="navigation"
      >
        <div className="flex my-10">
          <img src="/logo.png" alt="logo" className="mr-2 h-8" />
          <h1 className="text-2xl font-semibold">{appName}</h1>
        </div>
        {isLoggedIn ? <div className="md:block hidden">
          <button onClick={() => window.location.href = "/dashboard"} className="btn btn-primary">Go to Dashboard</button>
        </div> :
          <div className="md:block hidden">
            <button onClick={() => window.location.href = "/auth/login"} className="btn btn-ghost mr-2">Login</button>
            <button onClick={() => window.location.href = "/auth/signup"} className="btn btn-primary">Signup</button>
          </div>}
      </nav>
      <section className="flex flex-col md:flex-row h-screen pt-16">
        <div className="flex justify-center items-center flex-col w-full text-center md:text-left px-4">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
            >
              <p className="relative flex flex-col sm:flex-row items-center text-4xl sm:text-5xl md:text-7xl font-bold">
                AI-Powered{" "}
                <motion.span
                  initial={{ opacity: 0, y: -40 }}
                  animate={{ opacity: 1, y: -50 }}
                  transition={{ delay: 1.2, duration: 0.4 }}
                >
                  <img src="/star.png" alt="logo" className="h-16 sm:h-20 ml-2" />
                </motion.span>
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              <p className="relative flex items-center text-4xl sm:text-5xl md:text-7xl font-bold text-primary">
                Answer Sheet
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              <p className="relative flex items-center text-4xl sm:text-5xl md:text-7xl font-bold text-primary">
                Evaluator
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.4 }}
            >
              <p className="opacity-75 mt-4 text-lg sm:text-xl">
                Say goodbye to the hassle of manual grading.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.4 }}
            >
              <Link href="/auth/signup">
                <button className="btn btn-primary btn-lg mt-10">Get Started</button>
              </Link>
            </motion.div>
          </div>
        </div>
        <div className="flex flex-col w-full items-center justify-center">
          <img src="/logo_xl.png" alt="Logo" className="object-cover w-100" />
        </div>
      </section>
      <section className="flex flex-col items-center h-screen bg-gray-50 p-10">
        <p className="text-4xl font-semibold mt-10">🤖 AI-Powered Grading</p>
        <p className="max-w-4xl text-xl my-10 text-center opacity-80">
          Just upload the answer sheets and let {appName} handle the rest. Say goodbye to manual grading hassles and hello to streamlined evaluation with advanced AI technology.
        </p>
        <div className="w-full max-w-3xl h-full rounded-4xl border-4 border-gray-100">
          <img src="/landing/landing_1.png" alt="AI" className="w-full h-full rounded-4xl object-cover" />
        </div>
      </section>
      <section className="flex flex-col items-center h-screen bg-gray-50 p-10">
        <div className="flex flex-wrap justify-center gap-5">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.4 }}
            className="bg-white p-3 md:p-5 rounded-xl cursor-pointer"
          >
            <img
              src="/openai.png"
              alt="logo"
              className="h-8 md:h-10 filter grayscale hover:filter-none"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.4 }}
            className="bg-white p-3 md:p-5 rounded-xl cursor-pointer"
          >
            <img
              src="/gemini.png"
              alt="logo"
              className="h-8 md:h-10 filter grayscale hover:filter-none"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.4 }}
            className="bg-white p-3 md:p-5 rounded-xl cursor-pointer"
          >
            <img
              src="/grok.png"
              alt="logo"
              className="h-8 md:h-10 filter grayscale hover:filter-none"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6, duration: 0.4 }}
            className="bg-white p-3 md:p-5 rounded-xl cursor-pointer"
          >
            <img
              src="/claude.png"
              alt="logo"
              className="h-8 md:h-10 filter grayscale hover:filter-none"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8, duration: 0.4 }}
            className="bg-white p-3 md:p-5 rounded-xl cursor-pointer"
          >
            <img
              src="/metaai.png"
              alt="logo"
              className="h-8 md:h-10 filter grayscale hover:filter-none"
            />
          </motion.div>
        </div>
        <div className="flex flex-col md:flex-row w-full max-w-7xl mt-20 h-full">
          <div className="flex flex-col w-full items-start">
            <p className="text-4xl font-semibold mt-20">🧑🏻‍🏫 Class Management</p>
            <p className="max-w-4xl text-xl my-10 opacity-80">
              Organize classes, assign subjects, and manage student information seamlessly.
            </p>
          </div>
          <div className="w-full max-w-3xl h-full rounded-4xl border-4 border-gray-100">
            <img src="/landing/landing_2.png" alt="AI" className="w-full h-full rounded-4xl object-cover" />
          </div>
        </div>
      </section>
      <section className="flex flex-col items-center h-screen bg-gray-50 p-10">
        <div className="flex flex-col md:flex-row w-full max-w-7xl mt-20 h-full">
          <div className="w-full max-w-3xl h-full rounded-4xl border-4 border-gray-100">
            <img src="/landing/landing_3.png" alt="AI" className="w-full h-full rounded-4xl object-cover" />
          </div>
          <div className="ml-0 md:ml-10 flex flex-col w-full items-start mt-10 md:mt-0">
            <p className="text-4xl font-semibold mt-20">📄 Marksheet Generation</p>
            <p className="max-w-4xl text-xl my-10 opacity-80">
              Generate mark sheets instantly with {appName}. Effortlessly compile student scores with just a few clicks.
              Simplify your grading process and save valuable time with automated mark sheet generation. Plus, easily download the mark sheets for convenient access and record-keeping.
            </p>
          </div>
        </div>
      </section>
      <section className="flex flex-col items-center h-screen bg-gray-50 p-10">
        <div className="flex flex-col md:flex-row w-full max-w-7xl mt-20 h-full">
          <div className="flex flex-col w-full items-start">
            <p className="text-4xl font-semibold mt-20">📱 Mobile App</p>
            <p className="max-w-4xl text-xl my-10 opacity-80">
              Access {appName} on the go with our mobile app. Capture & Evaluate answer sheets, manage classes, and see results with ease, all from your smartphone. Stay connected and keep your evaluation process streamlined with {appName}&apos;s mobile app.<br />
              <br />Available for both Android & iOS.
            </p>
            <div className="mt-4">
              <button className="btn btn-primary btn-xl" onClick={() => {
                window.open(apkURL, "_blank");
              }}><BsAndroid className="mr-2" /> Download APK</button>
            </div>
          </div>
          <div className="w-full max-w-3xl h-full rounded-4xl border-4 border-gray-100">
            <img src="/landing/landing_4.png" alt="AI" className="w-full h-full rounded-4xl object-cover" />
          </div>
        </div>
      </section>
      <section className="flex flex-col items-center h-screen bg-primary p-10 justify-center">
        <p className="text-7xl font-bold text-white">🚀 Make your own {appName}!</p>
        <p className="mt-4 text-2xl text-white">Want to host your own version of {appName} as a SaaS? Purchase the <span className="font-semibold">extended license</span>* and get started!</p>
        <p className="text-2xl text-white">💸 Make money through shop sales, premium plans, and more!</p>
        <Link href="https://codecanyon.net/item/evaluateai-ai-powered-answer-sheet-evaluator-and-marksheet-generator-saas-platform/50774309" target="_blank"><button className="btn btn-xl hover:btn-success mt-10">Purchase Now from <img src="/envato.png" alt="logo" className="h-4" /></button></Link>
        <p className="text-sm text-white mt-10 opacity-75">* Regular license is enough for personal use. For hosting it as a SaaS, you must have the Extended license.</p>
      </section>
    </div>
  );
}
