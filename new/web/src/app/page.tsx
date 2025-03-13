"use client";
import { appName } from "@/utils/config";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Home() {
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
        <div className="md:block hidden">
          <button className="btn btn-ghost mr-2">Login</button>
          <button className="btn btn-primary">Signup</button>
        </div>
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
          <h1 className="text-3xl sm:text-4xl md:text-5xl">X</h1>
        </div>
      </section>
      <section className="flex flex-col items-center h-screen bg-gray-50 p-10">
        <p className="text-4xl font-semibold mt-10">🤖 AI-Powered Grading</p>
        <p className="max-w-4xl text-xl my-10 text-center opacity-80">
          Just upload the answer sheets and let {appName} handle the rest. Say goodbye to manual grading hassles and hello to streamlined evaluation with advanced AI technology.
        </p>
        <div className="w-full max-w-3xl h-full bg-primary opacity-20 rounded-4xl"></div>
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
          <div className="w-full max-w-3xl h-full bg-primary opacity-20 rounded-4xl"></div>
        </div>
      </section>
      <section className="flex flex-col items-center h-screen bg-gray-50 p-10">
        <div className="flex flex-col md:flex-row w-full max-w-7xl mt-20 h-full">
          <div className="w-full max-w-3xl h-full bg-primary opacity-20 rounded-4xl"></div>
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
              Access {appName} on the go with our mobile app. Evaluate student performance, manage classes, and generate mark sheets with ease, all from your smartphone. Stay connected and keep your evaluation process streamlined with {appName}'s mobile app.
            </p>
          </div>
          <div className="w-full max-w-3xl h-full bg-primary opacity-20 rounded-4xl"></div>
        </div>
      </section>
    </div>
  );
}
