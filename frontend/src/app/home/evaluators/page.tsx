"use client";
import { useContext, useEffect, useState } from "react";
import { FiFileText, FiUsers } from "react-icons/fi";
import { MainContext } from "@/context/context";
import { UploadDropzone } from "@/utils/uploadthing";

export default function Evaluators() {
  const {
    classes,
    evaluators,
    selectedEvaluator,
    setSelectedEvaluator,
    getStudents,
    setStudents,
    students,
    updateEvaluation } = useContext(MainContext);

  const [selectedClass, setSelectedClass] = useState(-1);
  const [answerSheets, setAnswerSheets] = useState<any>([]);

  useEffect(() => {
    if (selectedClass === -1) {
      setStudents([]);
    }
    else {
      getStudents(classes[selectedClass]?._id);
    }
  }, [selectedClass]);

  useEffect(() => {
    updateEvaluation(classes[selectedClass]?._id, evaluators[selectedEvaluator]?._id, answerSheets);
  }, [answerSheets]);

  return (
    <div className="animate-fade-in-bottom flex flex-col w-full max-sm:max-w-none">
      <div className="hidden max-sm:flex justify-end mb-3">
        <button className="btn btn-square" onClick={() => setSelectedEvaluator(-1)}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
      <p className="flex items-center font-semibold text-xl mb-1 mt-4"><FiFileText className="mr-2" /> {evaluators[selectedEvaluator]?.title}</p>
      <p className="flex items-center mb-1 mt-4"><FiUsers className="mr-2" /> Class</p>
      <select className="select select-bordered w-full max-w-lg mt-2" value={selectedClass} onChange={(x) => setSelectedClass(parseInt(x.target.value))}>
        <option disabled selected value={-1}>Select class</option>
        {
          classes?.map((class_: any, i: any) => (
            <option value={i}>{class_?.subject} | {class_?.name} {class_?.section}</option>
          ))
        }
      </select>
      {selectedClass === -1 ? <></> : <>
        <p className="flex items-center mb-1 mt-4"><FiFileText className="mr-2" /> Upload answer sheets</p>
        <div className="max-h-full overflow-y-auto max-w-lg mt-4">
          {
            students?.map((student: any, i: any) => (
              <div className="flex flex-col max-w-lg mb-4">
                <p className="flex items-center mb-1">{student?.rollNo}. {student?.name}</p>
                <UploadDropzone
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
                />
              </div>
            ))
          }
        </div>
        <button className="btn btn-primary max-w-lg my-5" onClick={() => console.log(answerSheets)}>Evaluate</button>
      </>}
    </div>
  );
}
