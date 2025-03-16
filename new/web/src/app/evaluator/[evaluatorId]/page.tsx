"use client";

import { serverURL } from "@/utils/config";
import axios from "axios";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { FiChevronLeft, FiClipboard, FiInfo, FiPlay, FiSave, FiTrash2, FiUpload, FiUsers } from "react-icons/fi";
import { RiRobot2Line } from "react-icons/ri";

export default function Page() {
  const [selectedTab, setSelectedTab] = useState("details");
  const [classes, setClasses] = useState<any>([]);
  const [selectedClass, setSelectedClass] = useState("");

  const getClasses = async () => {
    const config = {
      method: "GET",
      url: `${serverURL}/classes/`,
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    };

    axios(config)
      .then((response) => {
        setClasses(response.data.classes);
      })
      .catch((error) => {
        toast.error("Failed to get classes");
      });
  }

  useEffect(() => {
    getClasses();
  }, [])

  return (
    <div className="flex h-screen flex-col items-center p-4">
      <div className="flex w-full items-center">
        <button className="btn btn-square mr-2" onClick={() => window.location.href = "/dashboard/evaluators"}><FiChevronLeft /></button>
        <p className="flex items-center text-xl font-bold"><RiRobot2Line className="mr-2" /> evvvuuu</p>
        <div className="ml-2 text-lg badge badge-soft badge-primary">Huhuhu</div>
      </div>
      <div className="flex mt-4 w-full justify-center">
        <div role="tablist" className="tabs tabs-box">
          <a role="tab" onClick={() => setSelectedTab("details")} className={"tab " + (selectedTab === "details" ? "tab-active" : "")}><FiInfo className="mr-2" /> Evaluator details</a>
          <a role="tab" onClick={() => setSelectedTab("uploads")} className={"tab " + (selectedTab === "uploads" ? "tab-active" : "")}><FiUpload className="mr-2" /> Materials</a>
          <a role="tab" onClick={() => setSelectedTab("answers")} className={"tab " + (selectedTab === "answers" ? "tab-active" : "")}><FiClipboard className="mr-2" /> Answer Sheets</a>
          <a role="tab" onClick={() => setSelectedTab("evaluate")} className={"tab " + (selectedTab === "evaluate" ? "tab-active" : "")}><FiPlay className="mr-2" /> Evaluate</a>
        </div>
      </div>
      {selectedTab === "details" ? <div className="w-full max-w-xl border border-gray-200 rounded-lg mt-2 p-4 overflow-y-auto">
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Title</legend>
          <input type="text" className="input w-full" placeholder="Title" value={""} onChange={(x) => { }} />
        </fieldset>
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Description (optional)</legend>
          <textarea className="textarea w-full h-24" placeholder="Description (Optional)" value={""} onChange={(x) => { }}></textarea>
        </fieldset>
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Class</legend>
          <select className="select w-full" value={selectedClass} onChange={(x) => setSelectedClass(x.target.value)}>
            <option value={""} disabled={true}>Select a class</option>
            {
              classes?.map((classData: any, index: number) => (
                <option key={index} value={classData._id}>{classData.name}</option>
              ))
            }
          </select>
        </fieldset>
        <div className="mt-4 justify-between flex w-full">
          <form method="dialog">
            <button className="btn mr-2 hover:btn-error"><FiTrash2 /> Delete</button>
            <button className="btn btn-primary" onClick={() => {
            }}><FiSave /> Save</button>
          </form>
        </div>
      </div> : ""}
      <Toaster />
    </div>
  );
}
