"use client";

import { serverURL } from "@/utils/config";
import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { FiBookOpen, FiCheckCircle, FiChevronLeft, FiClipboard, FiEdit, FiExternalLink, FiFileText, FiHelpCircle, FiImage, FiInfo, FiKey, FiPlay, FiRefreshCcw, FiSave, FiStar, FiTrash, FiTrash2, FiUpload, FiUsers } from "react-icons/fi";
import { RiRobot2Line } from "react-icons/ri";
import "@uploadthing/react/styles.css";
import { UploadButton } from "@/utils/uploadthing";
import { BiError, BiFullscreen, BiTrophy } from "react-icons/bi";
import { BsCheckCircleFill, BsXCircleFill } from "react-icons/bs";

export default function Page() {
  const { evaluatorId } = useParams();
  const [evaluator, setEvaluator] = useState<any>({
    title: "",
    description: "",
    classId: {},
    questionPapers: [],
    answerKeys: [],
    answerSheets: [],
    extraPrompt: "",
    totalMarks: 100
  });
  const [selectedTab, setSelectedTab] = useState("details");
  const [classes, setClasses] = useState<any>([]);
  const [previewURL, setPreviewURL] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(-1);

  const [selectedResultsSubTab, setSelectedResultsSubTab] = useState("answerSheets");

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

  const resetEvaluator = async () => {
    const config = {
      method: "POST",
      url: `${serverURL}/evaluators/reset`,
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
        toast.success("Progress reset");
        getEvaluator();
      })
      .catch((error) => {
        toast.error("Failed to reset progress");
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
        answerSheets: evaluator.answerSheets,
        extraPrompt: evaluator.extraPrompt,
        totalMarks: parseInt(evaluator.totalMarks)
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

  const [evaluating, setEvaluating] = useState(false);
  const evaluate = async () => {
    setEvaluating(true);
    const config = {
      method: "POST",
      url: `${serverURL}/evaluators/evaluate-all`,
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      data: {
        evaluatorId,
      }
    };

    axios(config)
      .then((response) => {
        toast.success("Evaluation started");
        pollEvaluation({ showToast: true });
      })
      .catch((error) => {
        setEvaluating(false);
        toast.error(error.response.data);
      });
  }

  const [evaluation, setEvaluation] = useState<any>({ notSet: true, evaluation: {} });
  const pollEvaluation = async ({ showToast = false } = {}) => {
    const config = {
      method: "POST",
      url: `${serverURL}/evaluators/poll-evaluation`,
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      data: {
        evaluatorId,
      }
    };

    axios(config)
      .then((response) => {
        setEvaluation(response.data);
        if (response.data.isCompleted) {
          setEvaluating(false);
          setSelectedTab("results");
          if (showToast) {
            toast.success("Evaluation completed");
            getLimits();
          }
        } else {
          setEvaluating(true);
          setTimeout(() => {
            pollEvaluation({ showToast: true });
          }, 1000);
        }
      })
      .catch((error) => {
        setEvaluating(false);
        if (showToast) {
          toast.error("Failed to poll evaluation");
        }
      });
  }

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
    getEvaluator();
    getClasses();
    pollEvaluation();
    getLimits();
  }, [])

  useEffect(() => {
    saveEvaluator({ showToast: false });
  }, [selectedTab]);

  const convertPDFToImage = async (file: any) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const config = {
        method: "POST",
        url: `${serverURL}/pdf2img/convert`,
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        data: formData,
      };

      const response = await axios(config);
      const files = response.data.map((fileData: any, index: number) => {
        const byteArray = new Uint8Array(Object.values(fileData));
        const blob = new Blob([byteArray], { type: "image/png" });
        return new File([blob], `converted_image_${index + 1}.png`, { type: "image/png" });
      });

      return files;
    } catch (error) {
      toast.error("Failed to convert PDF to images.");
      return [];
    }
  };

  return (
    <div className="flex h-screen w-full flex-col items-center p-4">
      <div className="flex w-full items-center">
        <button className="btn btn-square mr-2" onClick={() => window.location.href = "/dashboard/evaluators"}><FiChevronLeft /></button>
        <p className="flex items-center text-xl font-bold"><RiRobot2Line className="mr-2" /> {evaluator?.title}</p>
        <div className="ml-2 text-lg badge badge-soft badge-primary"><FiUsers /> {evaluator?.classId?.name} {evaluator?.classId?.section}</div>
        <div className="ml-2 text-lg badge badge-soft badge-secondary"><FiBookOpen /> {evaluator?.classId?.subject}</div>
        {
          evaluation?.hasErrors && evaluation?.isCompleted ?
            <div className="text-sm flex items-center ml-auto">
              <BsXCircleFill className="mr-2" color="red" />
              <p>Error Occured</p>
            </div> : evaluation?.notSet ? "" : evaluation?.isCompleted && !evaluation?.notSet ?
              <div className="text-sm flex items-center ml-auto">
                <BsCheckCircleFill className="mr-2" color="green" />
                <p>Evaluation Completed</p>
              </div>
              :
              <div className="ml-auto text-sm flex items-center">
                <div className="tooltip tooltip-bottom" data-tip="Evaluating...">
                  <span className="mr-2 loading loading-spinner loading-xs text-primary"></span>
                </div>
                <progress className="progress progress-primary w-56" value={evaluation?.completedEvaluations} max={evaluation?.totalEvaluations}></progress>
                <p className="ml-2">{evaluation?.completedEvaluations} / {evaluation?.totalEvaluations}</p>
              </div>
        }
      </div>
      <div className="flex mt-4 w-full justify-center">
        <div role="tablist" className="tabs tabs-box">
          <a role="tab" onClick={() => setSelectedTab("details")} className={"tab " + (selectedTab === "details" ? "tab-active" : "")}><FiInfo className="mr-2" /> Evaluator details</a>
          <a role="tab" onClick={() => setSelectedTab("uploads")} className={"tab " + (selectedTab === "uploads" ? "tab-active" : "")}><FiUpload className="mr-2" /> Materials</a>
          <a role="tab" onClick={() => setSelectedTab("answers")} className={"tab " + (selectedTab === "answers" ? "tab-active" : "")}><FiClipboard className="mr-2" /> Answer Sheets</a>
          <a role="tab" onClick={() => setSelectedTab("evaluate")} className={"tab " + (selectedTab === "evaluate" ? "tab-active" : "")}><FiPlay className="mr-2" /> Evaluate</a>
          {evaluation?.hasErrors ? <a role="tab" onClick={() => { setSelectedTab("results"); }} className={"tab " + (selectedTab === "results" ? "tab-active" : "")}><BiError className="mr-2" /> Error Logs</a> : evaluation?.isCompleted && !evaluation?.notSet ? <a role="tab" onClick={() => { setSelectedTab("results"); setSelectedStudent(-1) }} className={"tab " + (selectedTab === "results" ? "tab-active" : "")}><BiTrophy className="mr-2" /> Results</a> : ""}
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
        {!evaluation?.isCompleted && !evaluation?.notSet ? "" : <div className="mt-4 justify-between flex w-full">
          <form method="dialog">
            <button className="btn mr-2 hover:btn-error" onClick={() => {
              (document.getElementById("delete_evaluator_modal") as any).showModal();
            }}><FiTrash2 /> Delete</button>
            <button className="btn btn-primary" onClick={() => {
              saveEvaluator({ showToast: true });
            }}><FiSave /> Save</button>
          </form>
        </div>}
      </div> : selectedTab === "uploads" ?
        <div className="flex flex-col items-start w-full max-w-5xl border border-gray-200 rounded-lg mt-2 p-4 overflow-y-auto">
          <p className="flex items-center my-2"><FiFileText className="mr-2" /> Question Paper</p>
          <p className="flex items-center mb-2 text-sm opacity-50 mb-4">Upload question paper for the evaluator. You can upload multiple files.</p>
          <div className="flex flex-wrap gap-2">
            {
              evaluator?.questionPapers?.map((questionPaper: any, index: number) => (
                <div className="cursor-pointer relative flex flex-col items-center group" key={index}>
                  <div className="absolute top-1 right-1">
                    <button className="btn btn-square btn-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      onClick={() => {
                        setPreviewURL(questionPaper);
                        (document.getElementById("image_preview_modal") as any).showModal();
                      }}>
                      <BiFullscreen />
                    </button>
                    {!evaluation?.isCompleted && !evaluation?.notSet ? "" : <button className="btn btn-error btn-square btn-xs ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      onClick={() => {
                        evaluator.questionPapers.splice(index, 1);
                        setEvaluator({ ...evaluator });
                        saveEvaluator({ showToast: false });
                      }}>
                      <FiTrash2 />
                    </button>}
                  </div>
                  <img src={questionPaper} alt="Question Paper" className="w-28 h-32 border border-gray-300 object-cover rounded-lg mb-2" />
                </div>
              ))
            }
          </div>
          {!evaluation?.isCompleted && !evaluation?.notSet ? "" : <UploadButton
            endpoint="imageUploader"
            onBeforeUploadBegin={async (files: any) => {
              var pdfFiles = files.filter((file: any) => file.type === "application/pdf");
              var otherFiles = files.filter((file: any) => file.type !== "application/pdf");

              if (pdfFiles.length === 0) return files;

              for (const file of pdfFiles) {
                const images = await convertPDFToImage(file);
                otherFiles.push(...images);
              }

              return otherFiles;
            }}
            onClientUploadComplete={(files: any) => {
              // Do something with the response
              console.log("Files: ", files);
              for (const file of files) {
                evaluator.questionPapers.push(file.url);
              }

              setEvaluator({ ...evaluator });
              saveEvaluator({ showToast: false });
            }}
            onUploadError={(error: Error) => {
              // Do something with the error.
              alert(`ERROR! ${error.message}`);
            }}
          />}
          <div className="divider"></div>
          <p className="flex items-center my-2"><FiKey className="mr-2" /> Answer Keys / Answering Criteria</p>
          <p className="flex items-center mb-2 text-sm opacity-50 mb-4">Upload answer keys / answering criteria for the evaluator. You can upload multiple files.</p>
          <div className="flex flex-wrap gap-2">
            {
              evaluator?.answerKeys?.map((answerKey: any, index: number) => (
                <div className="cursor-pointer relative flex flex-col items-center group" key={index}>
                  <div className="absolute top-1 right-1">
                    <button className="btn btn-square btn-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      onClick={() => {
                        setPreviewURL(answerKey);
                        (document.getElementById("image_preview_modal") as any).showModal();
                      }}>
                      <BiFullscreen />
                    </button>
                    {!evaluation?.isCompleted && !evaluation?.notSet ? "" : <button className="btn btn-error btn-square btn-xs ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      onClick={() => {
                        evaluator.answerKeys.splice(index, 1);
                        setEvaluator({ ...evaluator });
                        saveEvaluator({ showToast: false });
                      }}>
                      <FiTrash2 />
                    </button>}
                  </div>
                  <img src={answerKey} alt="Question Paper" className="w-28 h-32 border border-gray-300 object-cover rounded-lg mb-2" />
                </div>
              ))
            }
          </div>
          {!evaluation?.isCompleted && !evaluation?.notSet ? "" : <UploadButton
            endpoint="imageUploader"
            onBeforeUploadBegin={async (files: any) => {
              var pdfFiles = files.filter((file: any) => file.type === "application/pdf");
              var otherFiles = files.filter((file: any) => file.type !== "application/pdf");

              if (pdfFiles.length === 0) return files;

              for (const file of pdfFiles) {
                const images = await convertPDFToImage(file);
                otherFiles.push(...images);
              }

              return otherFiles;
            }}
            onClientUploadComplete={async (files: any) => {
              // Do something with the response
              console.log("Files: ", files);
              for (const file of files) {
                evaluator.answerKeys.push(file.url);
              }

              setEvaluator({ ...evaluator });
              saveEvaluator({ showToast: false });
            }}
            onUploadError={(error: Error) => {
              // Do something with the error.
              alert(`ERROR! ${error.message}`);
            }}
          />}
        </div> : selectedTab === "answers" ? <div className="flex flex-col items-start w-full max-w-5xl border border-gray-200 rounded-lg mt-2 p-4 overflow-y-auto">
          {
            evaluator?.classId?.students?.map((student: any, index: number) => (
              <div className="w-full flex flex-col items-start" key={index}>
                <p className="flex items-center my-2">{student?.rollNo}. {student?.name}</p>
                <div className="flex flex-wrap gap-2">
                  {
                    evaluator?.answerSheets?.find((s: any) => s.rollNo === student.rollNo)?.answerSheets?.map((answerSheet: any, index: number) => (
                      <div className="cursor-pointer relative flex flex-col items-center group" key={index}>
                        <div className="absolute top-1 right-1">
                          <button className="btn btn-square btn-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                            onClick={() => {
                              setPreviewURL(answerSheet);
                              (document.getElementById("image_preview_modal") as any).showModal();
                            }}>
                            <BiFullscreen />
                          </button>
                          {!evaluation?.isCompleted && !evaluation?.notSet ? "" : <button className="btn btn-error btn-square btn-xs ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                            onClick={() => {
                              const studentAnswerSheet = evaluator.answerSheets.find((s: any) => s.rollNo === student.rollNo);
                              studentAnswerSheet.answerSheets.splice(index, 1);
                              setEvaluator({ ...evaluator });
                              saveEvaluator({ showToast: false });
                            }}>
                            <FiTrash2 />
                          </button>}
                        </div>
                        <img src={answerSheet} alt="Answer Sheet" className="w-28 h-32 border border-gray-300 object-cover rounded-lg mb-2" />
                      </div>
                    ))
                  }
                </div>
                {!evaluation?.isCompleted && !evaluation?.notSet ? "" : <UploadButton
                  endpoint="imageUploader"
                  onBeforeUploadBegin={async (files: any) => {
                    var pdfFiles = files.filter((file: any) => file.type === "application/pdf");
                    var otherFiles = files.filter((file: any) => file.type !== "application/pdf");

                    if (pdfFiles.length === 0) return files;

                    for (const file of pdfFiles) {
                      const images = await convertPDFToImage(file);
                      otherFiles.push(...images);
                    }

                    return otherFiles;
                  }}
                  onClientUploadComplete={(files: any) => {
                    console.log("Files uploaded: ", files);

                    const uploadedUrls = files.map((file: any) => file.url);

                    setEvaluator((prevEvaluator: any) => {
                      // Clone the previous evaluator state
                      const updatedEvaluator = { ...prevEvaluator };

                      // Find or create the entry for this student in answerSheets
                      let studentAnswerSheet = updatedEvaluator.answerSheets.find(
                        (s: any) => s.rollNo === student.rollNo
                      );

                      if (studentAnswerSheet) {
                        // If student already exists, push new answer URLs
                        studentAnswerSheet.answerSheets.push(...uploadedUrls);
                      } else {
                        // If student does not exist, create a new entry
                        updatedEvaluator.answerSheets.push({
                          rollNo: student.rollNo,
                          answerSheets: uploadedUrls,
                        });
                      }

                      return updatedEvaluator;
                    });

                    saveEvaluator({ showToast: false });
                  }}
                  onUploadError={(error: Error) => {
                    alert(`ERROR! ${error.message}`);
                  }}
                />}
                <div className="divider"></div>
              </div>
            ))
          }
        </div> : evaluating ?
          <div className="w-full max-w-xl border border-gray-200 rounded-lg mt-2 p-4 overflow-y-auto">
            {
              evaluation?.evaluation && Object.keys(evaluation?.evaluation)?.map((rollNo: any, index: number) => {
                const data = evaluation?.evaluation[rollNo];
                return <div key={index} className="flex items-center my-2">
                  {data?.isCompleted ? <BsCheckCircleFill className="mr-2" color="green" /> : <span className="mr-2 loading loading-spinner loading-xs text-primary"></span>}
                  <p className="opacity-50">{data?.isCompleted ? "Evaluated " : "Evaluating "} answer sheets of Roll No.{data?.studentRollNo} {data?.isCompleted ? "" : "..."}</p>
                </div>
              })
            }
            <button className="btn btn-xs btn-outline mt-4" onClick={() => {
              (document.getElementById("reset_modal") as any).showModal();
            }}><FiRefreshCcw /> Reset progress</button>
          </div>
          : selectedTab === "results" ? evaluation?.hasErrors ?
            <div className="w-full max-w-xl border border-gray-200 rounded-lg mt-2 p-4 overflow-y-auto">
              <div className="flex flex-col">
                <div className="flex items-center mb-4">
                  <BsXCircleFill className="mr-2" color="red" />
                  <p>Error occured</p>
                </div>
                <p className="my-1 text-sm opacity-75"><span className="font-semibold">Reason:</span> {evaluation?.errorLog}</p>
                <p className="my-1 text-sm opacity-75"><span className="font-semibold">AI Response:</span> {evaluation?.aiResponse}</p>
              </div>
            </div> :
            <div className="flex w-full justify-center h-full overflow-hidden">
              <div className="w-full max-w-2xl border border-gray-200 rounded-l-lg mt-2 p-4 overflow-y-auto">
                <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
                  <div className="join join-vertical bg-base-100 w-full">
                    {
                      evaluation?.evaluation && Object.keys(evaluation?.evaluation)?.map((rollNo: any, index: number) => {
                        const data = evaluation?.evaluation[rollNo];
                        return <div key={index} className="collapse collapse-arrow join-item border-base-300 border" onClick={() => {
                          setSelectedStudent(selectedStudent === data?.studentRollNo ? -1 : data?.studentRollNo);
                        }}>
                          <input type="radio" name="my-accordion-4" checked={data?.studentRollNo === selectedStudent} onChange={(x) => { }} />
                          <div className="collapse-title font-semibold">{data?.studentRollNo}. {evaluator?.classId?.students?.find((student: any) => student.rollNo === data?.studentRollNo)?.name} <span className="ml-2 badge badge-soft badge-primary"><BiTrophy /> {data?.totalMarksObtained} / {data?.totalMaximumMarks}</span></div>
                          <div key={index} className="collapse-content text-sm">
                            {
                              data?.answers?.map((answer: any, index: number) => {
                                return <div key={index} className="flex flex-col bg-gray-50 p-5 mb-2">
                                  <div className="mb-2 badge badge-soft badge-secondary"><FiStar /> Marks awarded: {answer?.marksAwarded} / {answer?.maximumMarks}</div>
                                  <p className="text-sm flex items-center">{answer?.questionNumber}. {answer?.question}</p>
                                  <p className="mt-2 text-sm flex items-center opacity-75">{answer?.answer}</p>
                                  <p className="text-sm flex items-center my-2"><FiFileText className="mr-2" /> Feedback</p>
                                  <p className="text-sm flex items-center opacity-60">{answer?.feedback}</p>
                                </div>
                              })
                            }
                          </div>
                        </div>
                      })
                    }
                  </div>
                </div>
              </div>
              <div className="w-full max-w-2xl border border-gray-200 rounded-r-lg mt-2 p-4 overflow-y-auto">
                {
                  selectedStudent === -1 ? <p>Select a Student to view answer sheet.</p> :
                    <p className="text-lg font-bold mb-2">{selectedStudent}. {evaluator?.classId?.students?.find((student: any) => student.rollNo === selectedStudent)?.name}</p>}
                {selectedStudent === -1 ? "" : <div role="tablist" className="tabs tabs-lift tabs-sm">
                  <a onClick={() => setSelectedResultsSubTab("questionPapers")} role="tab" className={"tab " + (selectedResultsSubTab === "questionPapers" ? "tab-active" : "")}>Question Paper</a>
                  <a onClick={() => setSelectedResultsSubTab("answerKeys")} role="tab" className={"tab " + (selectedResultsSubTab === "answerKeys" ? "tab-active" : "")}>Answer Keys</a>
                  <a onClick={() => setSelectedResultsSubTab("answerSheets")} role="tab" className={"tab " + (selectedResultsSubTab === "answerSheets" ? "tab-active" : "")}>Answer Sheets</a>
                </div>}
                {selectedStudent === -1 ? "" :
                  selectedResultsSubTab === "questionPapers" ? evaluator?.questionPapers?.map((answerSheet: any, index: number) => (
                    <div className="cursor-pointer relative flex flex-col items-center group" key={index}>
                      <div className="absolute top-1 right-1">
                        <button className="btn btn-square btn-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                          onClick={() => {
                            setPreviewURL(answerSheet);
                            (document.getElementById("image_preview_modal") as any).showModal();
                          }}>
                          <BiFullscreen />
                        </button>
                      </div>
                      <img src={answerSheet} alt="Answer Sheet" className="border border-gray-300 object-cover rounded-lg mb-2" />
                    </div>
                  )) : selectedResultsSubTab === "answerKeys" ? evaluator?.answerKeys?.map((answerSheet: any, index: number) => (
                    <div className="cursor-pointer relative flex flex-col items-center group" key={index}>
                      <div className="absolute top-1 right-1">
                        <button className="btn btn-square btn-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                          onClick={() => {
                            setPreviewURL(answerSheet);
                            (document.getElementById("image_preview_modal") as any).showModal();
                          }}>
                          <BiFullscreen />
                        </button>
                      </div>
                      <img src={answerSheet} alt="Answer Sheet" className="border border-gray-300 object-cover rounded-lg mb-2" />
                    </div>
                  )) : evaluator?.answerSheets?.find((s: any) => s.rollNo === selectedStudent)?.answerSheets?.map((answerSheet: any, index: number) => (
                    <div className="cursor-pointer relative flex flex-col items-center group" key={index}>
                      <div className="absolute top-1 right-1">
                        <button className="btn btn-square btn-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                          onClick={() => {
                            setPreviewURL(answerSheet);
                            (document.getElementById("image_preview_modal") as any).showModal();
                          }}>
                          <BiFullscreen />
                        </button>
                      </div>
                      <img src={answerSheet} alt="Answer Sheet" className="border border-gray-300 object-cover rounded-lg mb-2" />
                    </div>
                  ))
                }
              </div>
            </div>
            : <div className="w-full max-w-xl border border-gray-200 rounded-lg mt-2 p-4 overflow-y-auto">
              <fieldset className="fieldset">
                <legend className="fieldset-legend">Extra prompt (optional)</legend>
                <textarea className="textarea w-full h-24" placeholder="Prompt" value={evaluator?.extraPrompt} onChange={(x) => {
                  evaluator.extraPrompt = x.target.value;
                  setEvaluator({ ...evaluator });
                  saveEvaluator({ showToast: false });
                }}></textarea>
              </fieldset>
              <fieldset className="fieldset">
                <legend className="fieldset-legend">Total Marks</legend>
                <input type="text" className="input w-full" placeholder="Total Marks" value={evaluator?.totalMarks} onChange={(x) => {
                  evaluator.totalMarks = x.target.value;
                  setEvaluator({ ...evaluator });
                  saveEvaluator({ showToast: false });
                }} />
              </fieldset>
              <div className="mt-4 justify-between flex w-full">
                <form method="dialog">
                  <button className="btn btn-primary" onClick={() => {
                    evaluate();
                  }}><FiPlay /> Evaluate</button>
                  <p className="text-xs opacity-75 mt-2">{limits?.evaluationLimit - limits?.evaluationUsage} evaluations left.</p>
                </form>
              </div>
            </div>
      }
      <Toaster />
      {/* Image Preview Modal */}
      <dialog id="image_preview_modal" className="modal">
        <div className="modal-box">
          <h3 className="flex items-center font-bold text-lg"><FiImage className="mr-2" /> Image Preview <button onClick={() => window.open(previewURL)} className="ml-auto btn btn-square"><BiFullscreen /></button></h3>
          {previewURL && <img src={previewURL} alt="Preview" className="w-100 object-cover" />}
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
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
      {/* Reset Modal */}
      <dialog id="reset_modal" className="modal">
        <div className="modal-box">
          <h3 className="flex items-center font-bold text-lg"><FiRefreshCcw className="mr-2" /> Reset progress</h3>
          <p className="py-4">Resetting progress will not terminate current evaluation process. If you are experiencing an unexpected glitch, resetting progress will fix it.</p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn mr-2">Cancel</button>
              <button className="btn btn-error" onClick={() => resetEvaluator()}>Reset progress</button>
            </form>
          </div>
        </div>
      </dialog>
    </div >
  );
}
