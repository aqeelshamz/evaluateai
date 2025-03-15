"use client";

import { appName, checkAuth, serverURL } from "@/utils/config";
import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { FaFileImport } from "react-icons/fa";
import { FiBookOpen, FiChevronLeft, FiEdit, FiEdit2, FiInfo, FiPlus, FiSave, FiTrash, FiTrash2, FiUsers } from "react-icons/fi";
import { TbFileImport } from "react-icons/tb";

export default function Page() {
  const { classId } = useParams();
  const [classData, setClassData] = useState<any>({
    name: "",
    section: "",
    subject: "",
  });
  const [selectedTab, setSelectedTab] = useState("details");

  const getClass = async () => {
    const config = {
      method: "POST",
      url: `${serverURL}/classes/by-id`,
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      data: {
        classId
      }
    };

    axios(config)
      .then((response) => {
        setClassData(response.data);
      })
      .catch((error) => {
        toast.error("Failed to get class");
        checkAuth();
      });
  }

  const saveClass = async () => {
    const config = {
      method: "POST",
      url: `${serverURL}/classes/save`,
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      data: {
        classId: classId,
        name: classData.name,
        section: classData.section,
        subject: classData.subject
      }
    };

    axios(config)
      .then((response) => {
        toast.success("Class saved");
        getClass();
      })
      .catch((error) => {
        toast.error("Failed to save class");
      });
  }

  useEffect(() => {
    getClass();
  }, []);

  return (
    <div className="flex h-screen flex-col items-center p-4">
      <div className="flex w-full items-center">
        <button className="btn btn-square mr-2" onClick={() => window.location.href = "/dashboard/classes"}><FiChevronLeft /></button>
        <p className="flex items-center text-xl font-bold"><FiUsers className="mr-2" /> {classData.name} <span className="ml-2 font-normal">{classData.section}</span></p>
        <div className="ml-2 text-lg badge badge-soft badge-primary"><FiBookOpen /> {classData.subject}</div>
      </div>
      <div className="flex mt-4 w-full justify-center">
        <div role="tablist" className="tabs tabs-box">
          <a role="tab" onClick={() => setSelectedTab("details")} className={"tab " + (selectedTab === "details" ? "tab-active" : "")}><FiInfo className="mr-2" /> Class details</a>
          <a role="tab" onClick={() => setSelectedTab("students")} className={"tab " + (selectedTab === "students" ? "tab-active" : "")}><FiUsers className="mr-2" />Students</a>
        </div>
      </div>
      {selectedTab === "details" ? <div className="w-full max-w-xl h-full border border-gray-200 rounded-lg mt-2 p-4 overflow-y-auto">
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Name</legend>
          <input type="text" className="input w-full" placeholder="Class name" value={classData.name} onChange={(x) => {
            classData.name = x.target.value;
            setClassData({ ...classData });
          }} />
        </fieldset>
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Section</legend>
          <input type="text" className="input w-full" placeholder="Section" value={classData.section} onChange={(x) => {
            classData.section = x.target.value;
            setClassData({ ...classData });
          }} />
        </fieldset>
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Subject</legend>
          <input type="text" className="input w-full" placeholder="Subject" value={classData.subject} onChange={(x) => {
            classData.subject = x.target.value;
            setClassData({ ...classData });
          }} />
        </fieldset>
        <div className="mt-4 justify-between flex w-full">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn mr-2 hover:btn-error"><FiTrash2 /> Delete</button>
            <button className="btn btn-primary" onClick={() => {
              saveClass();
            }}><FiSave /> Save</button>
          </form>
        </div>
      </div> : <div className="w-full max-w-4xl h-full border border-gray-200 rounded-lg mt-2 p-4 overflow-y-hidden">
        <div className="flex justify-between">
          <div className="flex">
            <button className="btn mr-2 btn-primary"><FiPlus /> New Student</button>
            <button className="btn mr-2"><TbFileImport /> Import</button>
          </div>
          <label className="input">
            <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></g></svg>
            <input type="search" required placeholder="Search" />
          </label>
        </div>
        {/* Table with columnns SlNo, Name, Roll No, Email, Edit, Delete */}
        <div className="overflow-y-auto h-[90%] rounded-box border border-base-content/5 bg-base-100 mt-5">
          <table className="table table-pin-rows table-pin-cols">
            {/* head */}
            <thead>
              <tr>
                <th></th>
                <th>Name</th>
                <th>Roll No</th>
                <th>Email</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {
                [...Array(50)].map((_, index) => (
                  <tr key={index}>
                    <th>{index + 1}</th>
                    <td>Aqeel</td>
                    <td>1</td>
                    <td>student@evaluateai.com</td>
                    <td>
                      <button className="btn btn-square"><FiEdit /></button>
                    </td>
                    <td>
                      <button className="btn btn-square"><FiTrash2 /></button>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>}
      <Toaster />
    </div>
  );
}
