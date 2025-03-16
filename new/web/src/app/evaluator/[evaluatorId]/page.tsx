"use client";

import { serverURL } from "@/utils/config";
import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { FiBookOpen, FiChevronLeft, FiClipboard, FiInfo, FiPlay, FiSave, FiTrash2, FiUpload, FiUsers } from "react-icons/fi";
import { RiRobot2Line } from "react-icons/ri";

export default function Page() {
  const { evaluatorId } = useParams();
  const [evaluator, setEvaluator] = useState<any>({
    title: "",
    description: "",
    classId: {},
    questionPapers: [],
    answerKeys: [],
    extraPrompt: ""
  });
  const [selectedTab, setSelectedTab] = useState("details");
  const [classes, setClasses] = useState<any>([]);

  const getEvaluator = async () => {
    const config = {
      method: "POST",
      url: `${serverURL}/evaluators/by-id`,
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      data: {
        evaluatorId
      }
    };

    axios(config)
      .then((response) => {
        setEvaluator(response.data);
      })
      .catch((error) => {
        toast.error("Failed to get evaluator");
      });
  }

  const deleteEvaluator = async () => {
    const config = {
      method: "POST",
      url: `${serverURL}/evaluators/delete`,
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      data: {
        evaluatorId
      }
    };

    axios(config)
      .then((response) => {
        toast.success("Evaluator deleted");
        window.location.href = "/dashboard/evaluators";
      })
      .catch((error) => {
        toast.error("Failed to delete evaluator");
      });
  }

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

  const saveEvaluator = async () => {
    const config = {
      method: "POST",
      url: `${serverURL}/evaluators/save`,
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      data: {
        evaluatorId,
        title: evaluator.title,
        description: evaluator.description,
        classId: evaluator.classId?._id,
        questionPapers: evaluator.questionPapers,
        answerKeys: evaluator.answerKeys,
        extraPrompt: evaluator.extraPrompt
      }
    };

    axios(config)
      .then((response) => {
        toast.success("Evaluator saved!");
        getEvaluator();
      })
      .catch((error) => {
        toast.error("Failed to save evaluator");
      });
  }

  useEffect(() => {
    getEvaluator();
    getClasses();
  }, [])

  return (
    <div className="flex h-screen flex-col items-center p-4">
      <div className="flex w-full items-center">
        <button className="btn btn-square mr-2" onClick={() => window.location.href = "/dashboard/evaluators"}><FiChevronLeft /></button>
        <p className="flex items-center text-xl font-bold"><RiRobot2Line className="mr-2" /> {evaluator?.title}</p>
        <div className="ml-2 text-lg badge badge-soft badge-primary"><FiUsers /> {evaluator?.classId?.name} {evaluator?.classId?.section}</div>
        <div className="ml-2 text-lg badge badge-soft badge-secondary"><FiBookOpen /> {evaluator?.classId?.subject}</div>
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
          <input type="text" className="input w-full" placeholder="Title" value={evaluator?.title} onChange={(x) => {
            evaluator.title = x.target.value;
            setEvaluator({ ...evaluator });
          }} />
        </fieldset>
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Description (optional)</legend>
          <textarea className="textarea w-full h-24" placeholder="Description (Optional)" value={evaluator?.description} onChange={(x) => {
            evaluator.description = x.target.value;
            setEvaluator({ ...evaluator });
          }}></textarea>
        </fieldset>
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Class</legend>
          <select className="select w-full" value={evaluator?.classId?._id} onChange={(x) => {
            evaluator.classId = classes.find((classData: any) => classData._id === x.target.value);
            setEvaluator({ ...evaluator });
          }}>
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
            <button className="btn mr-2 hover:btn-error" onClick={() => {
              (document.getElementById("delete_evaluator_modal") as any).showModal();
            }}><FiTrash2 /> Delete</button>
            <button className="btn btn-primary" onClick={() => {
              saveEvaluator();
            }}><FiSave /> Save</button>
          </form>
        </div>
      </div> : ""}
      <Toaster />
      {/* Delete Evaluator Modal */}
      <dialog id="delete_evaluator_modal" className="modal">
        <div className="modal-box">
          <h3 className="flex items-center font-bold text-lg"><FiTrash2 className="mr-2" /> Delete Evaluator</h3>
          <p className="py-4">Are you sure you want to delete this evaluator?</p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn mr-2">Cancel</button>
              <button className="btn btn-error" onClick={() => deleteEvaluator()}>Delete</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
}
