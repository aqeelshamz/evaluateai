"use client";
import { serverURL } from "@/utils/config";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiBookOpen, FiPlus, FiUsers } from "react-icons/fi";
import { RiRobot2Line } from "react-icons/ri";
import { motion } from "framer-motion";

export default function Page() {
  const [evaluators, setEvaluators] = useState([]);
  const [evaluatorLimit, setEvaluatorLimit] = useState(0);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [classes, setClasses] = useState<any>([]);
  const [selectedClass, setSelectedClass] = useState("");

  const newEvaluator = async () => {
    if (!title || !selectedClass) {
      toast.error("All fields are required");
      return;
    }

    const config = {
      method: "POST",
      url: `${serverURL}/evaluators/new`,
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      data: {
        title,
        description,
        classId: selectedClass
      }
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
    getEvaluators();
    getClasses();
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
          onClick={() => (document.getElementById('new_evaluator_modal') as any).showModal()}
        >
          <FiPlus size={24} className="mr-2" /> New evaluator
        </div>
        {evaluators?.map((evaluator: any, index: number) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index / 10, duration: 0.4 }}
            onClick={() => {
              window.location.href = `/evaluator/${evaluator._id}`;
            }}
            key={index}
            className={"flex flex-col justify-between cursor-pointer min-w-64 h-40 rounded-xl border-2 p-3 border-gray-300 hover:border-4 duration-100"}
          >
            <div className="flex flex-col">
              <h2 className="text-black font-bold">{evaluator.title}</h2>
              <p className="text-gray-600">{evaluator.description}</p>
            </div>
            <div className="flex items-center space-x-1">
              <div className="badge badge-soft badge-primary"><FiUsers /> {evaluator.classId.name} {evaluator.classId.section}</div>
              <div className="badge badge-soft badge-secondary"><FiBookOpen /> {evaluator.classId.subject}</div>
            </div>
          </motion.div>
        ))}
      </div>
      {/* Create Class Modal */}
      <dialog id="new_evaluator_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="flex items-center font-bold text-lg"><RiRobot2Line className="mr-2" /> Create new evaluator</h3>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Title</legend>
            <input type="text" className="input w-full" placeholder="Title" value={title} onChange={(x) => setTitle(x.target.value)} />
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Description (optional)</legend>
            <textarea className="textarea w-full h-24" placeholder="Description (Optional)" value={description} onChange={(x) => setDescription(x.target.value)}></textarea>
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
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn mr-2">Cancel</button>
              <button className="btn btn-primary" onClick={() => {
                newEvaluator();
              }}>Create Evaluator</button>
            </form>
          </div>
        </div>
      </dialog>
    </div >
  );
}
