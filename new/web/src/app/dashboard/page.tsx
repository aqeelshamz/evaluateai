"use client";

import Link from "next/link";
import { BiCoinStack } from "react-icons/bi";
import { FiHome, FiUsers } from "react-icons/fi";
import { RiRobot2Line } from "react-icons/ri";

export default function Page() {
  return (
    <div className="flex flex-col">
      <p className="flex items-center text-2xl font-semibold mb-4"><FiHome className="mr-2" /> Dashboard</p>
      <div className="flex pb-5 w-[80vw] flex-wrap gap-4">
        <Link href="/dashboard/evaluators">
          <div
            className="cursor-pointer w-64 h-40 flex items-center justify-center rounded-lg border-2 border-gray-300 font-semibold text-2xl hover:border-4 hover:border-primary duration-100"
          >
            <RiRobot2Line className="mr-2" /> Evaluators
          </div>
        </Link>
        <Link href="/dashboard/classes">
          <div
            className="cursor-pointer w-64 h-40 flex items-center justify-center rounded-lg border-2 border-gray-300 font-semibold text-2xl hover:border-4 hover:border-primary duration-100"
          >
            <FiUsers className="mr-2" /> Classes
          </div>
        </Link>
        <Link href="/dashboard/limits">
          <div
            className="cursor-pointer w-64 h-40 flex items-center justify-center rounded-lg border-2 border-gray-300 font-semibold text-2xl hover:border-4 hover:border-primary duration-100"
          >
            <BiCoinStack className="mr-2" /> Usage & Limits
          </div>
        </Link>
      </div>
    </div>
  );
}
