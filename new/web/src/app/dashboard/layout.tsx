"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { FiHome, FiLogOut, FiUser, FiUsers } from "react-icons/fi";
import { RiRobot2Line } from "react-icons/ri";
import { appName, serverURL } from "@/utils/config";
import axios from "axios";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";

export default function Dashboard({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navLinkClass = (linkPath: string) =>
    `btn flex justify-start ${pathname === linkPath ? "btn-primary" : "btn-ghost"
    }`;

  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>({});

  const getUser = async () => {
    setLoading(true);
    const config = {
      method: "GET",
      url: `${serverURL}/users/`,
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    };

    axios(config)
      .then((response) => {
        setLoading(false);
        console.log(response.data);
        setUser(response.data);
      })
      .catch((error) => {
        setLoading(false);
        localStorage.clear();
        window.location.href = "/auth/login";
      });
  }

  useEffect(() => {
    getUser();
  }, [])

  return (
    <div className="flex w-screen h-screen">
      <div className="px-5 py-4 flex flex-col h-full w-full max-w-xs bg-gray-50">
        <div className="flex flex-col">
          <div onClick={() => window.location.href = "/"} className="cursor-pointer flex mb-5">
            <img src="/logo.png" alt="logo" className="mr-2 h-8" />
            <h1 className="text-2xl font-semibold">{appName}</h1>
          </div>
          <Link href="/dashboard" className={navLinkClass("/dashboard")}>
            <FiHome /> Dashboard
          </Link>
          <Link
            href="/dashboard/evaluators"
            className={navLinkClass("/dashboard/evaluators")}
          >
            <RiRobot2Line /> Evaluators
          </Link>
          <Link href="/dashboard/classes" className={navLinkClass("/dashboard/classes")}>
            <FiUsers /> Classes
          </Link>
        </div>
        <div className="dropdown dropdown-top mt-auto">
          <div tabIndex={0} role="button" className="flex items-center cursor-pointer hover:bg-gray-100 p-2 mt-auto rounded-lg">
            <div className="w-10 h-10 mask mask-squircle w-10 bg-primary flex items-center justify-center">
              <FiUser color="white" />
            </div>
            <div className="flex flex-col ml-2">
              <p className="font-semibold">{user?.name}</p>
              <p className="text-sm opacity-75">{user?.email}</p>
            </div>
          </div>
          <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
            <li onClick={() => {
              localStorage.clear();
              window.location.href = "/auth/login";
            }}><a><FiLogOut color="red" /> Logout</a></li>
          </ul>
        </div>
      </div>
      <div className="w-full h-full p-5">{children}</div>
      <Toaster />
    </div>
  );
}
