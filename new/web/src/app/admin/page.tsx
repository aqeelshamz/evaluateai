"use client";

import { currencySymbol, serverURL } from "@/utils/config";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BiCoinStack } from "react-icons/bi";
import { FiCpu, FiCreditCard, FiDollarSign, FiHome, FiShoppingBag, FiUsers } from "react-icons/fi";
import { RiRobot2Line } from "react-icons/ri";

export default function Page() {
  const [dashboardData, setDashboardData] = useState<any>({});

  const getDashboard = async () => {
    const config = {
      method: "GET",
      url: `${serverURL}/admin/dashboard`,
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    };

    axios(config)
      .then((response) => {
        setDashboardData(response.data);
      })
      .catch((error) => {
        toast.error("Failed to load dashboard");
      });
  }

  useEffect(() => {
    getDashboard();
  }, []);

  return (
    <div className="flex flex-col">
      <p className="flex items-center text-2xl font-semibold mb-4"><FiHome className="mr-2" /> Dashboard</p>
      <div className="flex pb-5 w-[80vw] flex-wrap gap-4">
        <Link href="/admin/purchases">
          <div
            className="cursor-pointer w-64 h-40 flex flex-col items-center justify-around rounded-lg border-2 border-gray-300 font-semibold text-2xl hover:border-4 hover:border-primary duration-100"
          >
            <p className="text-xs font-normal text-center opacity-50"></p>
            <p className="text-4xl font-bold text-center">{currencySymbol} {dashboardData?.earnings}</p>
            <p className="flex items-center text-lg"><FiDollarSign className="mr-2" /> Earnings</p>
          </div>
        </Link>
        <Link href="/admin/shop">
          <div
            className="cursor-pointer w-64 h-40 flex flex-col items-center justify-around rounded-lg border-2 border-gray-300 font-semibold text-2xl hover:border-4 hover:border-primary duration-100"
          >
            <p className="text-xs font-normal text-center opacity-50"></p>
            <p className="text-4xl font-bold text-center">{dashboardData?.shopItems}</p>
            <p className="flex items-center text-lg"><FiShoppingBag className="mr-2" /> Shop Items</p>
          </div>
        </Link>
        <Link href="/admin/ai-model">
          <div
            className="cursor-pointer w-64 h-40 flex flex-col items-center justify-around rounded-lg border-2 border-gray-300 font-semibold text-2xl hover:border-4 hover:border-primary duration-100"
          >
            <p className="text-xs font-normal text-center opacity-50">{dashboardData?.aiModel}</p>
            <img src={dashboardData?.modelLogo} className="h-8 mr-2" />
            <p className="flex items-center text-lg"><FiCpu className="mr-2" /> AI Model</p>
          </div>
        </Link>
        <Link href="/admin/payment">
          <div
            className="cursor-pointer w-64 h-40 flex flex-col items-center justify-around rounded-lg border-2 border-gray-300 font-semibold text-2xl hover:border-4 hover:border-primary duration-100"
          >
            <p className="text-xs font-normal text-center opacity-50">{dashboardData?.paymentGateway}</p>
            <img src={dashboardData?.gatewayLogo} className="h-8 mr-2" />
            <p className="flex items-center text-lg"><FiCreditCard className="mr-2" /> Payment Gateway</p>
          </div>
        </Link>
        <Link href="/admin/users">
          <div
            className="cursor-pointer w-64 h-40 flex flex-col items-center justify-around rounded-lg border-2 border-gray-300 font-semibold text-2xl hover:border-4 hover:border-primary duration-100"
          >
            <p className="text-xs font-normal text-center opacity-50"></p>
            <p className="text-4xl font-bold text-center">{dashboardData?.users}</p>
            <p className="flex items-center text-lg"><FiUsers className="mr-2" /> Users</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
