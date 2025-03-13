"use client";
import { serverURL } from "@/utils/config";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiPlus } from "react-icons/fi";
import { RiRobot2Line } from "react-icons/ri";
import { motion } from "framer-motion";

export default function Page() {
  const [evaluators, setEvaluators] = useState([]);
  const [evaluatorLimit, setEvaluatorLimit] = useState(0);

  const newEvaluator = async () => {
    const config = {
      method: "POST",
      url: `${serverURL}/evaluators/new`,
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    };

    axios(config)
      .then((response) => {
        console.log(response.data);
        toast.success("Evaluator created");
        getEvaluators();
      })
      .catch((error) => {
        console.error(error);
        toast.error(error.response.data);
      });
  }

  const getEvaluators = async () => {
    const config = {
      method: "GET",
      url: `${serverURL}/evaluators/`,
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    };

    axios(config)
      .then((response) => {
        setEvaluators(response.data.evaluators);
        setEvaluatorLimit(response.data.limit);
      })
      .catch((error) => {
        toast.error("Failed to get evaluators");
      });
  }

  useEffect(() => {
    getEvaluators();
  }, [])

  return (
    <div className="flex flex-col">
      <p className="flex items-center text-2xl font-semibold"><RiRobot2Line className="mr-2" /> Evaluators</p>
      <div className="select-none">
        <div className="tooltip tooltip-right" data-tip="Upgrade your plan to increase the limit">
          <div className="badge badge-soft badge-primary my-4">Limit: {evaluators?.length} / {evaluatorLimit}</div>
        </div>
      </div>
      <div className="flex pb-5 w-[80vw] flex-wrap gap-4">
        <div
          className="cursor-pointer w-64 h-40 flex items-center justify-center rounded-lg border-dashed border-2 border-gray-300 font-semibold text-2xl hover:border-4 duration-100"
          onClick={() => newEvaluator()}
        >
          <FiPlus size={24} className="mr-2" /> New evaluator
        </div>
        {evaluators?.map((evaluator: any, index: number) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index / 10, duration: 0.4 }}
            onClick={() => {
            }}
            key={index}
            className={"flex flex-col justify-between cursor-pointer min-w-64 h-40 rounded-xl border-2 p-3 border-gray-300 hover:border-4 duration-100"}
          >
            <div className="flex flex-col">
              <h2 className="text-black font-bold">{evaluator.title}</h2>
              <p className="text-gray-600">{evaluator.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div >
  );
}
