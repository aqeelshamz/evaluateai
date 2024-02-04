"use client";
import { useContext, useEffect } from "react";
import { FiFileText, FiKey } from "react-icons/fi";
import { MainContext } from "@/context/context";
import { UploadDropzone } from "@/utils/uploadthing";
import { toast } from "react-toastify";

export default function Evaluators() {
  const {
    evaluators,
    selectedEvaluator,
    setSelectedEvaluator,
    getStudents,
    students,
    updateEvaluation,
    getEvaluation,
    answerSheets,
    setAnswerSheets,
    evaluate,
    evaluating,
    setEvaluating
  } = useContext(MainContext);

  useEffect(() => {
    getStudents(evaluators[selectedEvaluator]?.classId);
    getEvaluation();
  }, [selectedEvaluator]);

  useEffect(() => {
    console.log(answerSheets)
    updateEvaluation(evaluators[selectedEvaluator]?._id, answerSheets);
  }, [answerSheets]);

  const evaluateAnswerSheets = async () => {
    if (students.length < 1) {
      return;
    }

    for (let i = 0; i < students.length; i++) {
      if (!answerSheets[i] || answerSheets[i].length < 1) {
        continue;
      }
      await evaluate(i + 1);
    }

    setEvaluating(-1);
    toast.success("Evaluation completed!");
  };

  return (
    <div className="animate-fade-in-bottom flex flex-col w-full max-sm:max-w-none">
      <div className="hidden max-sm:flex justify-end mb-3">
        <button className="btn btn-square" onClick={() => setSelectedEvaluator(-1)}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
      <p className="flex items-center font-semibold text-xl mb-1 mt-4"><FiFileText className="mr-2" /> {evaluators[selectedEvaluator]?.title}</p>
      <div className="overflow-y-auto">
        <p className="flex items-center mb-2 mt-4"><FiFileText className="mr-2" /> Question Paper(s)</p>
        <div className="flex flex-wrap">{
          evaluators[selectedEvaluator]?.questionPapers.map((file: string, i: number) => {
            return <img key={i} src={file} className="cursor-pointer w-40 h-40 border object-cover rounded-md mr-2 mb-2" onClick={() => window.open(file)} />
          })
        }</div>
        <p className="flex items-center mb-2 mt-4"><FiKey className="mr-2" /> Answer Key / Criteria</p>
        <div className="flex flex-wrap">{
          evaluators[selectedEvaluator]?.answerKeys.map((file: string, i: number) => {
            return <img key={i} src={file} className="cursor-pointer w-40 h-40 border object-cover rounded-md mr-2 mb-2" onClick={() => window.open(file)} />
          })
        }</div>
        <p className="flex items-center mb-1 mt-4"><FiFileText className="mr-2" /> Upload answer sheets</p>
        <div className="max-h-full max-w-lg mt-4">
          {
            students?.map((student: any, i: any) => (
              <div key={i} className="flex flex-col max-w-lg mb-4">
                <p className="flex items-center mb-1">{student?.rollNo}. {student?.name}</p>
                {answerSheets[i] && answerSheets[i]?.length >= 1 ? <div className="flex flex-wrap">{
                  answerSheets[i]?.map((file: string, j: number) => {
                    return <div className="relative flex items-center justify-center">
                      {evaluating === student?.rollNo ? <div className="bg-white p-1 rounded-full absolute flex items-center text-sm"><span className="mr-1 loading loading-spinner loading-sm"></span><p>Evaluating...</p></div> : ""}
                      <button className="btn btn-sm btn-circle absolute right-3 top-1" onClick={() => {
                        answerSheets[i].splice(j, 1);
                        setAnswerSheets([...answerSheets]);
                      }}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                      <img key={j} src={file} className="cursor-pointer w-40 h-40 border object-cover rounded-md mr-2 mb-2" onClick={() => window.open(file)} />
                    </div>
                  })
                }</div> : <UploadDropzone
                  endpoint="media"
                  onClientUploadComplete={(res) => {
                    var files = [];
                    for (const file of res) {
                      files.push(file.url);
                    }

                    answerSheets[i] = files;
                    setAnswerSheets([...answerSheets]);
                  }}
                  onUploadError={(error: Error) => {
                    alert(`ERROR! ${error.message}`);
                  }}
                />}
              </div>
            ))
          }
        </div>
        {evaluating !== -1 ? <div className="flex flex-col mb-5">
          <p className="mb-2">Evaluating Answer Sheets {evaluating} of {students.length}</p>
          <progress className="progress max-w-lg" value={evaluating} max={students.length}></progress>
        </div> : <button className="btn btn-primary w-full max-w-lg my-5" onClick={() => evaluateAnswerSheets()}>Evaluate</button>}
      </div>
    </div>
  );
}
