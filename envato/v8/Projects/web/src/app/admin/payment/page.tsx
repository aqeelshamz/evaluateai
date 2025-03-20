"use client";
import { serverURL } from "@/utils/config";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiCreditCard } from "react-icons/fi";

export default function Page() {
  const [paymentGateways, setPaymentGateways] = useState([]);

  const getPaymentGateways = async () => {
    const config = {
      method: "GET",
      url: `${serverURL}/admin/payment-gateways`,
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    };

    axios(config)
      .then((response) => {
        setPaymentGateways(response.data);
      })
      .catch((error) => {
        toast.error("Failed to get Payment Gateways");
      });
  }

  const selectPaymentGateway = async (gateway: string) => {
    const config = {
      method: "POST",
      url: `${serverURL}/admin/payment-gateways/select`,
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      data: {
        gateway
      }
    };

    axios(config)
      .then((response) => {
        toast.success("Payment Gateway selected");
        getPaymentGateways();
      })
      .catch((error) => {
        toast.error("Failed to select Payment Gateway");
      });
  }

  useEffect(() => {
    getPaymentGateways();
  }, []);

  return (
    <div className="flex flex-col">
      <p className="flex items-center text-2xl font-semibold"><FiCreditCard className="mr-2" /> Payment Gateways</p>
      <div className="flex pb-5 min-w-[80vw] flex-wrap gap-4 mt-4">
        {
          paymentGateways?.map((paymentGateway: any, index: number) => (
            <div
              key={index}
              className={"cursor-pointer w-64 p-5 flex flex-col items-center justify-around rounded-lg border-2 border-gray-300 font-semibold text-2xl hover:border-4 duration-100 " + (paymentGateway?.selected ? "border-primary border-4" : "")}
              onClick={() => selectPaymentGateway(paymentGateway?.code)}
            >
              <p className="text-sm font-normal text-center opacity-50">{paymentGateway?.name}</p>
              <img src={paymentGateway?.logo} alt="AI Model" className="w-[70%] my-5" />
              <div className="flex flex-wrap items-center justify-center gap-2">
                {paymentGateway?.selected ? <div className="badge badge-soft badge-primary">Selected</div> : ""}
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
}
