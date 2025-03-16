"use client";
import { serverURL } from "@/utils/config";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiBookOpen, FiPlus, FiUsers } from "react-icons/fi";
import { motion } from "framer-motion";

export default function Page() {
  const [classes, setClasses] = useState<any>([]);
  const [classesLimit, setClassesLimit] = useState(0);
  const [name, setName] = useState("");
  const [section, setSection] = useState("");
  const [subject, setSubject] = useState("");

  const newClass = async () => {
    if (!name || !section || !subject) {
      toast.error("All fields are required");
      return;
    }

    const config = {
      method: "POST",
      url: `${serverURL}/classes/new`,
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      data: {
        name,
        section,
        subject
      }
    };

    axios(config)
      .then((response) => {
        console.log(response.data);
        toast.success("Class created");
        getClasses();
        window.location.href = `/class/${response.data._id}`;
      })
      .catch((error) => {
        console.error(error);
        toast.error(error.response.data);
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
        setClassesLimit(response.data.limit);
      })
      .catch((error) => {
        toast.error("Failed to get evaluators");
      });
  }

  useEffect(() => {
    getClasses();
  }, [])

  return (
    <div className="flex flex-col">
      <p className="flex items-center text-2xl font-semibold"><FiUsers className="mr-2" /> Classes</p>
      <div className="select-none">
        <div className="tooltip tooltip-right" data-tip="Upgrade your plan to increase the limit">
          <div className="badge badge-soft badge-primary my-4">Limit: {classes?.length ?? 0} / {classesLimit}</div>
        </div>
      </div>
      <div className="flex pb-5 w-[80vw] flex-wrap gap-4">
        <div
          className="cursor-pointer w-64 h-40 flex items-center justify-center rounded-lg border-dashed border-2 border-gray-300 font-semibold text-2xl hover:border-4 duration-100"
          onClick={() => {
            setName("");
            setSection("");
            setSubject("");
            (document.getElementById('new_class_modal') as any).showModal();
          }}
        >
          <FiPlus size={24} className="mr-2" /> New class
        </div>
        {classes?.map((classData: any, index: number) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index / 10, duration: 0.4 }}
            onClick={() => {
              window.location.href = `/class/${classData._id}`;
            }}
            key={index}
            className={"flex flex-col justify-between cursor-pointer min-w-64 h-40 rounded-xl border-2 p-3 border-gray-300 hover:border-4 duration-100"}
          >
            <div className="flex flex-col">
              <h2 className="flex items-center text-black font-bold"><FiUsers className="mr-2" /> {classData.name}</h2>
              <p className="text-gray-600">{classData.section}</p>
            </div>
            <div className="flex items-center space-x-1">
              <div className="badge badge-soft badge-primary"><FiBookOpen /> {classData.subject}</div>
              <div className="badge badge-soft badge-secondary"><FiUsers /> {classData.students.length} Students</div>
            </div>
          </motion.div>
        ))}
      </div>
      {/* Create Class Modal */}
      <dialog id="new_class_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="flex items-center font-bold text-lg"><FiUsers className="mr-2" /> Create new class</h3>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Name</legend>
            <input type="text" className="input w-full" placeholder="Class name" value={name} onChange={(x) => setName(x.target.value)} />
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Section</legend>
            <input type="text" className="input w-full" placeholder="Section" value={section} onChange={(x) => setSection(x.target.value)} />
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Subject</legend>
            <input type="text" className="input w-full" placeholder="Subject" value={subject} onChange={(x) => setSubject(x.target.value)} />
          </fieldset>
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn mr-2">Cancel</button>
              <button className="btn btn-primary" onClick={() => {
                newClass();
              }}>Create Class</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
}
