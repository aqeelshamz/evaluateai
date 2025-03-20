"use client";
import { serverURL } from "@/utils/config";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiBookOpen, FiEdit, FiEdit2, FiPlus, FiUsers } from "react-icons/fi";
import { motion } from "framer-motion";
import { BiCoinStack } from "react-icons/bi";
import { RiRobot2Line } from "react-icons/ri";

export default function Page() {
  const [limits, setLimits] = useState<any>({});

  const getLimits = async () => {
    const config = {
      method: "GET",
      url: `${serverURL}/users/limits`,
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    };

    axios(config)
      .then((response) => {
        setLimits(response.data);
      })
      .catch((error) => {
        toast.error("Failed to get evaluators");
      });
  }

  useEffect(() => {
    getLimits();
  }, [])

  return (
    <div className="flex flex-col">
      <p className="flex items-center text-2xl font-semibold mb-5"><BiCoinStack className="mr-2" /> Usage & Limits</p>
      <div className="stats shadow w-fit">
        <div className="stat">
          <div className="stat-figure text-secondary">
            <div className="radial-progress bg-gray-50 text-primary" style={{ "--size": "3rem", "--value": (limits?.evaluatorUsage / limits?.evaluatorLimit) * 100 } as React.CSSProperties} aria-valuenow={(limits?.classesUsage / limits?.classesLimit) * 100} role="progressbar">
              {((limits?.evaluatorUsage / limits?.evaluatorLimit) * 100).toFixed(0)}%
            </div>
          </div>
          <div className="stat-title text-sm">
            <RiRobot2Line className="text-secondary inline-block mr-1 stroke-current" />Evaluator
          </div>
          <div className="stat-value">{limits?.evaluatorLimit - limits?.evaluatorUsage} left</div>
          <div className="stat-desc text-lg">{limits?.evaluatorUsage} of {limits?.evaluatorLimit} used</div>
        </div>

        <div className="stat">
          <div className="stat-figure text-secondary">
            <div className="stat-figure text-secondary">
              <div className="radial-progress bg-gray-50 text-primary" style={{ "--size": "3rem", "--value": (limits?.evaluationUsage / limits?.evaluationLimit) * 100 } as React.CSSProperties} aria-valuenow={(limits?.classesUsage / limits?.classesLimit) * 100} role="progressbar">
                {((limits?.evaluationUsage / limits?.evaluationLimit) * 100).toFixed(0)}%
              </div>
            </div>
          </div>
          <div className="stat-title text-sm">
            <FiEdit className="text-secondary inline-block mr-1 stroke-current" />Evaluations
          </div>
          <div className="stat-value">{limits?.evaluationLimit - limits?.evaluationUsage} left</div>
          <div className="stat-desc text-lg">{limits?.evaluationUsage} of {limits?.evaluationLimit} used</div>
        </div>

        <div className="stat">
          <div className="stat-figure text-secondary">
            <div className="radial-progress bg-gray-50 text-primary" style={{ "--size": "3rem", "--value": (limits?.classesUsage / limits?.classesLimit) * 100 } as React.CSSProperties} aria-valuenow={(limits?.classesUsage / limits?.classesLimit) * 100} role="progressbar">
              {((limits?.classesUsage / limits?.classesLimit) * 100).toFixed(0)}%
            </div>
          </div>
          <div className="stat-title text-sm">
            <FiUsers className="text-secondary inline-block mr-1 stroke-current" />Classes
          </div>
          <div className="stat-value">{limits?.classesLimit - limits?.classesUsage} left</div>
          <div className="stat-desc text-lg">{limits?.classesUsage} of {limits?.classesLimit} used</div>
        </div>
      </div>
      {/* <div className="flex flex-col gap-4 max-w-lg mt-5">
        <div className="w-full flex items-center">
          <p className="flex items-center"><RiRobot2Line className="mr-2" /> Evaluator Limit</p>
          <div className="ml-4 badge badge-soft badge-primary">{limits?.evaluatorUsage} of {limits?.evaluatorLimit} used</div><div className="ml-2 badge badge-soft badge-secondary">{limits?.evaluatorLimit - limits?.evaluatorUsage} left</div><br />
        </div>
        <progress className="progress progress-primary w-full max-w-xs" value={limits?.evaluatorUsage} max={limits?.evaluatorLimit}></progress>
        <div className="flex items-center mt-4">
          <p className="flex items-center"><FiEdit className="mr-2" /> Evaluation Limit</p>
          <div className="ml-4 badge badge-soft badge-primary">{limits?.evaluationUsage} of {limits?.evaluationLimit} used</div><div className="ml-2 badge badge-soft badge-secondary">{limits?.evaluationLimit - limits?.evaluationUsage} left</div><br />
        </div>
        <progress className="progress progress-primary w-full max-w-xs" value={limits?.evaluationUsage} max={limits?.evaluationLimit}></progress>
        <div className="flex items-center mt-4">
          <p className="flex items-center"><FiUsers className="mr-2" /> Classes Limit</p>
          <div className="ml-4 badge badge-soft badge-primary">{limits?.classesUsage} of {limits?.classesLimit} used</div><div className="ml-2 badge badge-soft badge-secondary">{limits?.classesLimit - limits?.classesUsage} left</div><br />
        </div>
        <progress className="progress progress-primary w-full max-w-xs" value={limits?.classesUsage} max={limits?.classesLimit}></progress>
      </div> */}
      <div><button onClick={() => window.location.href = "/shop"} className="btn btn-primary mt-5"><FiPlus className="mr-2" /> Expand limit</button></div>
    </div>
  );
}
