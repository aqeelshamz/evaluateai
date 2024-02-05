"use client";
import { appName } from '@/utils/utils';
import Link from 'next/link';
import { useEffect, useState } from 'react'
import { FiFacebook, FiInstagram, FiLogIn, FiPlayCircle, FiTwitter, FiVideo } from 'react-icons/fi';
export default function Main() {
  const [color, setColor] = useState(false)

  const changeColor = () => {
    if (window.scrollY >= window.innerHeight - 350) {
      setColor(true)
    } else {
      setColor(false)
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', changeColor)
    return () => {
      window.removeEventListener('scroll', changeColor)
    }
  }, [])

  const [selectedTab, setSelectedTab] = useState(0);

  return <main className="flex flex-col">
    <div id="home" className='min-h-screen w-screen bg-gradient-to-b from-purple-400 via-violet-500 to-indigo-600 flex flex-col justify-center items-center'>
      <div className={"flex z-50 items-center justify-between fixed top-0 w-full p-3 md:px-10 duration-200 backdrop-blur-md border-b border-[rgba(255,255,255,0.1)] " + (color ? "bg-white" : "text-white")}>
        <Link href="/home"><div className="text-lg">🤖 {appName} 📝</div></Link>
        <div className='flex'>
          <Link href={"#home"}><label onClick={() => setSelectedTab(0)} className={'mr-5 btn btn-sm btn-ghost ' + (selectedTab === 0 ? "btn-active text-white " : "") + (color ? " text-black" : "")}>Home</label></Link>
          <Link href={"#features"}><label onClick={() => setSelectedTab(1)} className={'mr-5 btn btn-sm btn-ghost ' + (selectedTab === 1 ? "btn-active text-white " : "") + (color ? " text-black" : "")}>Features</label></Link>
          <Link href={"#how-it-works"}><label onClick={() => setSelectedTab(2)} className={'mr-5 btn btn-sm btn-ghost ' + (selectedTab === 2 ? "btn-active text-white " : "") + (color ? " text-black" : "")}>How it works</label></Link>
        </div>
        <button className={'btn btn-primary ' + (!color ? "glass text-white" : "")}><FiLogIn /> Sign In</button>
      </div>
      <h1 className='duration-200 font-black text-6xl md:text-7xl text-white w-full text-center'>🤖 Ultimate AI<br />Answer Sheet<br />Evaluator 📝</h1>
      <p className='duration-200 text-center mt-5 font-normal text-lg md:text-xl text-white opacity-50 w-full'>A powerful AI tool to evaluate answer sheets<br />with ease and precision.</p>
      <button className="mt-10 btn btn-md md:btn-lg glass text-white btn-primary"><FiPlayCircle /> See how it works</button>
    </div>
    <div id="features" className='min-h-screen w-screen bg-white flex flex-col items-center py-20 md:p-20'>
      <h1 className='text-4xl md:text-5xl font-bold mb-20'>Features</h1>
      <div className='flex flex-wrap justify-evenly items-center w-full md:w-3/4'>
        {[...Array(6)].map((_, i) => {
          return <div className='flex group m-5'>
            <div className='bg-gray-100 group-hover:bg-black group-hover:text-white group-hover:scale-110 duration-200 text-3xl flex justify-center items-center w-20 h-20 rounded-lg mr-4'>
              <FiVideo />
            </div>
            <div className='flex flex-col'>
              <p className='text-xl font-semibold'>Lorem ipsum dolor</p>
              <p className='text-lg'>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
            </div>
          </div>
        })}
      </div>
    </div>
    <div id="how-it-works" className='text-white min-h-screen w-screen flex flex-col items-center py-20 md:p-20 bg-[conic-gradient(at_bottom_right,_var(--tw-gradient-stops))] from-blue-700 via-blue-800 to-gray-900'>
      <h1 className='text-4xl md:text-5xl font-bold mb-20'>How does it work?</h1>
      <div className='flex flex-col md:flex-row flex-wrap justify-evenly items-center w-full md:w-3/4'>
        {[...Array(3)].map((_, i) => {
          return <div className='flex flex-col group m-5 max-w-xs items-center'>
            <div className='group-hover:scale-110 group-hover:bg-white group-hover:text-black duration-200 text-2xl border border-[rgba(255,255,255,0.2)] rounded-full p-5 w-16 md:w-20 h-16 md:h-20 flex justify-center items-center'>{i + 1}</div>
            <p className='text-center mt-10 duration-200 text-xl opacity-65'>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eaque non, exercitationem, ducimus praesentium voluptates dolor adipisci at sunt eum delectus harum ad? At maiores incidunt dolorum quibusdam sint, ratione earum?</p>
          </div>
        })}
      </div>
    </div>
    <div className='text-white w-screen flex flex-col items-center py-20 md:px-32 bg-black'>
      <div className='w-full flex flex-col md:flex-row items-center justify-between'>
        <Link href="/home"><div className="text-lg">🤖 {appName} 📝</div></Link>
        <div className='mt-10 md:mt-0 flex flex-col md:flex-row items-center'>
          <Link className='flex items-center my-2 md:ml-10' href="#"><FiInstagram className='mr-2' /><p>Instagram</p></Link>
          <Link className='flex items-center my-2 md:ml-10' href="#"><FiTwitter className='mr-2' /><p>X</p></Link>
          <Link className='flex items-center my-2 md:ml-10' href="#"><FiFacebook className='mr-2' /><p>Facebook</p></Link>
        </div>
      </div>
      <div className="divider divider-neutral"></div>
      <p>© 2024 {appName}. All rights reserved.</p>
    </div>
  </main>
}