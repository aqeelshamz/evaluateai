"use client";
import { serverURL } from "@/utils/config";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiEdit, FiTrash2, FiUser, FiUsers } from "react-icons/fi";
import { RiRobot2Line } from "react-icons/ri";

export default function Page() {
  const [users, setUsers] = useState([]);

  const getUsers = async () => {
    const config = {
      method: "GET",
      url: `${serverURL}/admin/users`,
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    };

    axios(config)
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        toast.error("Failed to get users");
      });
  }

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div className="flex flex-col">
      <p className="flex items-center text-2xl font-semibold"><FiUsers className="mr-2" /> Users</p>
      <div className="flex pb-5 flex-wrap gap-4 mt-4 w-full">
        <div className="overflow-x-auto w-full">
          <table className="table">
            {/* head */}
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Usage</th>
                <th>Edit</th>
                <th>Delete</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {
                users?.map((user: any, index: number) => (
                  <tr key={index}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 mask mask-squircle w-10 bg-primary flex items-center justify-center">
                          <FiUser color="white" />
                        </div>
                        <div>
                          <div className="font-bold">{user?.name}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      {user?.email}
                    </td>
                    <td>
                      <div className="badge badge-soft badge-primary"><RiRobot2Line /> Evaluators: {user?.limits?.evaluatorUsage} / {user?.limits?.evaluatorLimit}</div><br />
                      <div className="badge badge-soft badge-primary mt-3"><FiEdit /> Evaluations: {user?.limits?.evaluationLimit}</div><br />
                      <div className="badge badge-soft badge-primary mt-3"><FiUsers /> Classes: {user?.limits?.classesUsage} / {user?.limits?.classesLimit}</div><br />
                    </td>
                    <td>
                      <button className="btn btn-square"><FiEdit /></button>
                    </td>
                    <td>
                      <button className="btn btn-square hover:btn-error"><FiTrash2 /></button>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
        {/* <div
          className="cursor-pointer w-64 h-40 flex items-center justify-center rounded-lg border-dashed border-2 border-gray-300 font-semibold text-2xl hover:border-4 duration-100"
          onClick={() => (document.getElementById('new_class_modal') as any).showModal()}
        >
          <FiPlus size={24} className="mr-2" /> New
        </div> */}
        {/* {classes?.map((classData: any, index: number) => (
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
        ))} */}
      </div>
    </div>
  );
}
