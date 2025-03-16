"use client";

import { serverURL } from "@/utils/config";
import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { FiBookOpen, FiChevronLeft, FiClipboard, FiFileText, FiInfo, FiKey, FiPlay, FiSave, FiTrash2, FiUpload, FiUsers } from "react-icons/fi";
import { RiRobot2Line } from "react-icons/ri";
import "@uploadthing/react/styles.css";
import { UploadButton } from "@/utils/uploadthing";

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

  const saveEvaluator = async ({ showToast = false }) => {
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
        if (showToast) {
          toast.success("Evaluator saved!");
        }
        getEvaluator();
      })
      .catch((error) => {
        if (showToast) {
          toast.error("Failed to save evaluator");
        }
      });
  }

  useEffect(() => {
    getEvaluator();
    getClasses();
  }, [])

  useEffect(() => {
    saveEvaluator({ showToast: false });
  }, [selectedTab]);

  return (
    <div className="flex h-screen w-full flex-col items-center p-4">
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
              saveEvaluator({ showToast: true });
            }}><FiSave /> Save</button>
          </form>
        </div>
      </div> : selectedTab === "uploads" ?
        <div className="flex flex-col items-start w-full max-w-5xl border border-gray-200 rounded-lg mt-2 p-4 overflow-y-auto">
          <p className="flex items-center my-2"><FiFileText className="mr-2" /> Question Papers</p>
          <p className="flex items-center mb-2 text-sm opacity-50 mb-4">Upload question papers for the evaluator. You can upload multiple files.</p>
          <UploadButton
            endpoint="imageUploader"
            onClientUploadComplete={(res: any) => {
              // Do something with the response
              console.log("Files: ", res);
              alert("Upload Completed");
            }}
            onUploadError={(error: Error) => {
              // Do something with the error.
              alert(`ERROR! ${error.message}`);
            }}
          />
          <div className="divider"></div>
          <p className="flex items-center my-2"><FiKey className="mr-2" /> Answer Keys / Answering Criteria</p>
          <p className="flex items-center mb-2 text-sm opacity-50 mb-4">Upload answer keys / answering criteria for the evaluator. You can upload multiple files.</p>
          <UploadButton
            endpoint="imageUploader"
            onClientUploadComplete={(res: any) => {
              // Do something with the response
              console.log("Files: ", res);
              alert("Upload Completed");
            }}
            onUploadError={(error: Error) => {
              // Do something with the error.
              alert(`ERROR! ${error.message}`);
            }}
          />
        </div> : selectedTab === "answers" ? <div className="flex flex-col items-start w-full max-w-5xl border border-gray-200 rounded-lg mt-2 p-4 overflow-y-auto">
          {
            evaluator?.classId?.students?.map((student: any, index: number) => (
              <div className="w-full flex flex-col items-start" key={index}>
                <p className="flex items-center my-2">{index + 1}. {student?.name}</p>
                <UploadButton
                  endpoint="imageUploader"
                  onClientUploadComplete={(res: any) => {
                    // Do something with the response
                    console.log("Files: ", res);
                    alert("Upload Completed");
                  }}
                  onUploadError={(error: Error) => {
                    // Do something with the error.
                    alert(`ERROR! ${error.message}`);
                  }}
                />
                <div className="divider"></div>
              </div>
            ))
          }
        </div> : <div className="w-full max-w-xl border border-gray-200 rounded-lg mt-2 p-4 overflow-y-auto">
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Extra prompt (optional)</legend>
            <textarea className="textarea w-full h-24" placeholder="Prompt" value={evaluator?.extraPrompt} onChange={(x) => {
              evaluator.extraPrompt = x.target.value;
              setEvaluator({ ...evaluator });
            }}></textarea>
          </fieldset>
          <div className="mt-4 justify-between flex w-full">
            <form method="dialog">
              <button className="btn btn-primary" onClick={() => {
                saveEvaluator({ showToast: true });
              }}><FiPlay /> Evaluate</button>
            </form>
          </div>
        </div>
      }
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
