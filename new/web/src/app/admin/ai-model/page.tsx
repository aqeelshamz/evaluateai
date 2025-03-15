"use client";
import { serverURL } from "@/utils/config";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiCpu } from "react-icons/fi";

export default function Page() {
  const [aiModels, setAIModels] = useState([]);

  const getAIModels = async () => {
    const config = {
      method: "GET",
      url: `${serverURL}/admin/ai-models`,
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    };

    axios(config)
      .then((response) => {
        setAIModels(response.data);
      })
      .catch((error) => {
        toast.error("Failed to get AI Models");
      });
  }

  useEffect(() => {
    getAIModels();
  }, []);

  return (
    <div className="flex flex-col">
      <p className="flex items-center text-2xl font-semibold"><FiCpu className="mr-2" /> AI Model</p>
      <div className="flex pb-5 min-w-[80vw] flex-wrap gap-4 mt-4">
        {
          aiModels?.map((aiModel: any, index: number) => (
            <div
              key={index}
              className="cursor-pointer w-64 p-5 flex flex-col items-center justify-around rounded-lg border-2 border-gray-300 font-semibold text-2xl hover:border-4 duration-100"
            >
              <p className="text-sm font-normal text-center opacity-50">{aiModel?.model}</p>
              <img src={aiModel?.logo} alt="AI Model" className="w-[70%] my-5" />
              <div className="flex flex-wrap items-center justify-center gap-2">
                <div className="badge badge-soft badge-ghost">{aiModel?.cost}</div>
                <div className="badge badge-soft badge-primary">Selected</div>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
}
