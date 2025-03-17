"use client";
import { serverURL } from "@/utils/config";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiEdit, FiTrash2, FiUser, FiUsers } from "react-icons/fi";
import { RiRobot2Line } from "react-icons/ri";

export default function Page() {
  const [users, setUsers] = useState([]);

  const [userId, setUserId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [evaluatorLimit, setEvaluatorLimit] = useState(0);
  const [evaluationLimit, setEvaluationLimit] = useState(0);
  const [classesLimit, setClassesLimit] = useState(0);

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

  const updateUser = async () => {
    const config = {
      method: "POST",
      url: `${serverURL}/admin/users/update`,
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      data: {
        userId,
        name,
        email,
        password,
        evaluatorLimit,
        evaluationLimit,
        classesLimit
      }
    };

    axios(config)
      .then((response) => {
        toast.success("User deleted");
      })
      .catch((error) => {
        toast.error("Failed to delete user");
      });
  }

  const deleteUser = async () => {
    const config = {
      method: "POST",
      url: `${serverURL}/admin/users/delete`,
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      data: {
        userId
      }
    };

    axios(config)
      .then((response) => {
        toast.success("User deleted");
      })
      .catch((error) => {
        toast.error("Failed to delete user");
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
                      <div className="badge badge-soft badge-primary mt-3"><FiEdit /> Evaluations: {user?.limits?.evaluationUsage} / {user?.limits?.evaluationLimit}</div><br />
                      <div className="badge badge-soft badge-primary mt-3"><FiUsers /> Classes: {user?.limits?.classesUsage} / {user?.limits?.classesLimit}</div><br />
                    </td>
                    <td>
                      <button className="btn btn-square" onClick={() => {
                        setUserId(user._id);
                        setName(user.name);
                        setEmail(user.email);
                        setPassword("");
                        setEvaluatorLimit(user.limits.evaluatorLimit);
                        setEvaluationLimit(user.limits.evaluationLimit);
                        setClassesLimit(user.limits.classesLimit);
                        (document.getElementById('edit_user_modal') as any).showModal();
                      }}><FiEdit /></button>
                    </td>
                    <td>
                      <button className="btn btn-square hover:btn-error" onClick={() => {
                        setUserId(user._id);
                        (document.getElementById('delete_user_modal') as any).showModal();
                      }}><FiTrash2 /></button>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>
      {/* Edit User Modal */}
      <dialog id="edit_user_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="flex items-center font-bold text-lg"><FiUser className="mr-2" /> Edit User</h3>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Name</legend>
            <input type="text" className="input w-full" placeholder="Title" value={name} onChange={(x) => setName(x.target.value)} />
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Email</legend>
            <input type="email" className="input w-full" placeholder="Email" value={email} onChange={(x) => setEmail(x.target.value)} disabled />
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Password</legend>
            <input type="password" className="input w-full" placeholder="Leave blank for no change" value={password} onChange={(x) => setPassword(x.target.value)} />
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Evaluator Limit</legend>
            <input type="number" className="input w-full" placeholder="Evaluator Limit" value={evaluatorLimit} onChange={(x) => setEvaluatorLimit(parseInt(x.target.value))} />
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Evaluation Limit</legend>
            <input type="number" className="input w-full" placeholder="Evaluation Limit" value={evaluationLimit} onChange={(x) => setEvaluationLimit(parseInt(x.target.value))} />
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Classes Limit</legend>
            <input type="number" className="input w-full" placeholder="Classes Limit" value={classesLimit} onChange={(x) => setClassesLimit(parseInt(x.target.value))} />
          </fieldset>
          <div className="modal-action">
            <form method="dialog" className="w-full flex justify-between">
              <div>
                <button className="btn mr-2">Cancel</button>
                <button className="btn btn-primary" onClick={() => {
                  updateUser();
                }}>Update User</button>
              </div>
            </form>
          </div>
        </div>
      </dialog >
      {/* Delete Shop Item Modal */}
      <dialog id="delete_user_modal" className="modal">
        <div className="modal-box">
          <h3 className="flex items-center font-bold text-lg"><FiTrash2 className="mr-2" /> Delete User</h3>
          <p className="py-4">Are you sure you want to delete this user?</p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn mr-2">Cancel</button>
              <button className="btn btn-error" onClick={() => deleteUser()}>Delete</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
}
