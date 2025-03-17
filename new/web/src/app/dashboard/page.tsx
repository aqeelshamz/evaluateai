"use client";

import { appName, onboardingSteps, serverURL } from "@/utils/config";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BiCoinStack } from "react-icons/bi";
import { FiHome, FiUsers } from "react-icons/fi";
import { RiRobot2Line } from "react-icons/ri";

export default function Page() {
  const [onboardingStep, setOnboardingStep] = useState(0);

  const getUser = async () => {
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
        if (response.data.onboardingCompleted === false) {
          (document.getElementById('onboarding_modal') as any).showModal()
        }
      });
  }

  const finishOnboarding = async () => {
    const config = {
      method: "POST",
      url: `${serverURL}/users/finish-onboarding`,
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    };

    axios(config)
      .then((response) => {
        toast.success("Welcome to " + appName + "!");
      });
  }

  useEffect(() => {
    getUser();
  }, [])

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
      {/* Onboarding Modal */}
      <dialog id="onboarding_modal" className="modal">
        <div className="modal-box w-11/12 max-w-5xl flex flex-col items-center">
          <progress className="progress progress-primary w-56 mb-5" value={onboardingStep} max={onboardingSteps.length - 1}></progress>
          <img src={onboardingSteps[onboardingStep].image} alt="Onboarding" className="w-full max-w-xl border rounded-xl border-gray-100 border-4" />
          <h3 className="font-bold text-lg mt-4 max-w-2xl">{onboardingSteps[onboardingStep].title}</h3>
          <p className="text-center max-w-3xl">{onboardingSteps[onboardingStep].description}</p>
          <div className="flex gap-4 my-5">
            <button className="btn btn-ghost" onClick={() => {
              if (onboardingStep <= 0) {
                (document.getElementById('onboarding_modal') as any).close();
              }

              if (onboardingStep > 0) {
                setOnboardingStep(onboardingStep - 1);
              }
            }}>
              {onboardingStep > 0 ? "Previous" : "Skip"}
            </button>
            <button className="btn btn-primary" onClick={() => {
              if (onboardingStep < onboardingSteps.length - 1) {
                setOnboardingStep(onboardingStep + 1);
              }

              if (onboardingStep === onboardingSteps.length - 1) {
                (document.getElementById('onboarding_modal') as any).close();
                finishOnboarding();
              }
            }}>
              {onboardingStep < onboardingSteps.length - 1 ? "Next" : "Finish"}
            </button>
          </div>
          {/* <div className="modal-action">
            <form method="dialog">
              <button className="btn">Close</button>
            </form>
          </div> */}
        </div>
      </dialog>
    </div>
  );
}
