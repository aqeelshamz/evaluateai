"use client";

import { serverURL } from "@/utils/config";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";

export default function Page() {
  const searchParams = useSearchParams();

  const verifyPayment = async () => {
    const config = {
      method: "POST",
      url: `${serverURL}/shop/stripe/verify-order`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      data: {
        payment_intent: searchParams.get("payment_intent"),
        redirect_status: searchParams.get("redirect_status"),
      },
    };

    axios(config).then((response) => {
      toast.success("Payment successfull!");
      window.location.href = "/shop/purchases";
    }).catch((err) => {
      toast.error("Something went wrong!");
      window.location.href = "/shop/";
    })
  }

  useEffect(() => {
    verifyPayment();
  }, []);

  return (
    <div className="flex flex-col">
      Verifying payment...
    </div>
  );
}
