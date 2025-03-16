"use client";
import { checkAuth, serverURL } from "@/utils/config";
import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { FiBookOpen, FiChevronLeft, FiEdit, FiInfo, FiPlus, FiSave, FiTrash2, FiUserPlus, FiUsers, FiXCircle } from "react-icons/fi";
import { TbFileImport } from "react-icons/tb";
import * as XLSX from "xlsx";

export default function Page() {
  const { classId } = useParams();
  const [classData, setClassData] = useState<any>({
    name: "",
    section: "",
    subject: "",
  });
  const [selectedTab, setSelectedTab] = useState("details");

  const [newStudentName, setNewStudentName] = useState("");
  const [newStudentRollNo, setNewStudentRollNo] = useState(1);
  const [newStudentEmail, setNewStudentEmail] = useState("");

  const [search, setSearch] = useState("");

  const importInputRef = useRef<HTMLInputElement>(null);

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

  const deleteClass = async () => {
    const config = {
      method: "POST",
      url: `${serverURL}/classes/delete`,
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
        toast.success("Class deleted");
        window.location.href = "/dashboard/classes";
      })
      .catch((error) => {
        toast.error("Failed to delete class");
        checkAuth();
      });
  }

  const deleteStudent = async () => {
    const config = {
      method: "POST",
      url: `${serverURL}/classes/delete-student`,
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      data: {
        classId,
        rollNo: newStudentRollNo
      }
    };

    axios(config)
      .then((response) => {
        toast.success("Student deleted");
        getClass();
      })
      .catch((error) => {
        toast.error("Failed to delete student");
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

  const addStudent = async () => {
    const config = {
      method: "POST",
      url: `${serverURL}/classes/add-student`,
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      data: {
        classId: classId,
        name: newStudentName,
        rollNo: newStudentRollNo,
        email: newStudentEmail
      }
    };

    axios(config)
      .then((response) => {
        toast.success("Student added!");
        setNewStudentName("");
        setNewStudentRollNo(1);
        setNewStudentEmail("");
        getClass();
      })
      .catch((error) => {
        toast.error("Failed to add student");
      });
  }

  const editStudent = async () => {
    const config = {
      method: "POST",
      url: `${serverURL}/classes/edit-student`,
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      data: {
        classId: classId,
        name: newStudentName,
        rollNo: newStudentRollNo,
        email: newStudentEmail
      }
    };

    axios(config)
      .then((response) => {
        toast.success("Student updated!");
        setNewStudentName("");
        setNewStudentRollNo(1);
        setNewStudentEmail("");
        getClass();
      })
      .catch((error) => {
        toast.error("Failed to update student");
      });
  }

  const handleFileImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    try {
      const data = await file.arrayBuffer();

      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];

      const jsonData = XLSX.utils.sheet_to_json(worksheet) as {
        rollNo: number;
        name: string;
        email: string;
      }[];

      if (!jsonData || jsonData.length === 0) {
        toast.error("No data found in Excel file");
        return;
      }

      const config = {
        method: "POST",
        url: `${serverURL}/classes/import-students`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        data: {
          classId: classId,
          students: jsonData,
          // Expect your server to handle an array of { rollNo, name, email }
        },
      };

      axios(config)
        .then(() => {
          toast.success("Students imported successfully!");
          getClass();
        })
        .catch(() => {
          toast.error("Failed to import students");
          (document.getElementById("import_error_modal") as any).showModal();
        });
    } catch (error) {
      console.error(error);
      toast.error("Error reading file");
    } finally {
      // Reset file input so if user re-uploads the same file, onChange will fire again
      e.target.value = "";
    }
  };

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
      {selectedTab === "details" ? <div className="w-full max-w-xl border border-gray-200 rounded-lg mt-2 p-4 overflow-y-auto">
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
            <button className="btn mr-2 hover:btn-error" onClick={() => (document.getElementById('delete_class_modal') as any).showModal()}><FiTrash2 /> Delete</button>
            <button className="btn btn-primary" onClick={() => {
              saveClass();
            }}><FiSave /> Save</button>
          </form>
        </div>
      </div> : <div className="w-full max-w-4xl h-full border border-gray-200 rounded-lg mt-2 p-4 overflow-y-hidden">
        <div className="flex justify-between">
          <div className="flex">
            <button className="btn mr-2 btn-primary" onClick={() => {
              setNewStudentName("");
              setNewStudentEmail("");
              setNewStudentRollNo(classData.students.length + 1);
              (document.getElementById('add_student_modal') as any).showModal()
            }}><FiPlus /> New Student</button>
            <button className="btn mr-2" onClick={() => {
              importInputRef.current?.click();
            }}><TbFileImport /> Import</button>
            <input
              id="importStudentsInput"
              type="file"
              accept=".xlsx, .xls, .csv"
              className="hidden"
              ref={importInputRef}
              onChange={handleFileImport}
            />
          </div>
          <label className="input">
            <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></g></svg>
            <input type="search" placeholder="Search" value={search} onChange={(x) => setSearch(x.target.value)} />
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
                classData?.students?.map((student: any, index: number) => (
                  (student.name.toLowerCase().includes(search.toLowerCase()) || student.rollNo.toString().includes(search.toLowerCase()) || student.email.toLowerCase().includes(search.toLowerCase())) ?
                    <tr key={index}>
                      <th>{index + 1}</th>
                      <td>{student?.name}</td>
                      <td>{student?.rollNo}</td>
                      <td>{student?.email}</td>
                      <td>
                        <button className="btn btn-square" onClick={() => {
                          setNewStudentName(student.name);
                          setNewStudentRollNo(student.rollNo);
                          setNewStudentEmail(student.email);
                          (document.getElementById('edit_student_modal') as any).showModal();
                        }}><FiEdit /></button>
                      </td>
                      <td>
                        <button className="btn btn-square" onClick={() => {
                          setNewStudentRollNo(student.rollNo);
                          (document.getElementById('delete_student_modal') as any).showModal();
                        }}><FiTrash2 /></button>
                      </td>
                    </tr> : ""
                ))
              }
            </tbody>
          </table>
        </div>
      </div>}
      {/* Add Student Modal */}
      <dialog id="add_student_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="flex items-center font-bold text-lg"><FiUserPlus className="mr-2" /> Add Student</h3>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Roll No</legend>
            <input type="number" className="input w-full" placeholder="Roll No" value={newStudentRollNo} onChange={(x) => setNewStudentRollNo(parseInt(x.target.value))} />
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Student Name</legend>
            <input type="text" className="input w-full" placeholder="Name" value={newStudentName} onChange={(x) => setNewStudentName(x.target.value)} />
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Email</legend>
            <input type="email" className="input w-full" placeholder="Email" value={newStudentEmail} onChange={(x) => setNewStudentEmail(x.target.value)} />
          </fieldset>
          <div className="modal-action">
            <form method="dialog" className="w-full flex justify-between">
              <div>
                <button className="btn mr-2">Cancel</button>
                <button className="btn btn-primary" onClick={() => {
                  addStudent();
                }}>Add Student</button>
              </div>
            </form>
          </div>
        </div>
      </dialog >
      {/* Edit Student Modal */}
      <dialog id="edit_student_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="flex items-center font-bold text-lg"><FiUserPlus className="mr-2" /> Edit Student</h3>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Roll No</legend>
            <input type="number" className="input w-full" placeholder="Roll No" value={newStudentRollNo} disabled />
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Student Name</legend>
            <input type="text" className="input w-full" placeholder="Name" value={newStudentName} onChange={(x) => setNewStudentName(x.target.value)} />
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Email</legend>
            <input type="email" className="input w-full" placeholder="Email" value={newStudentEmail} onChange={(x) => setNewStudentEmail(x.target.value)} />
          </fieldset>
          <div className="modal-action">
            <form method="dialog" className="w-full flex justify-between">
              <div>
                <button className="btn mr-2">Cancel</button>
                <button className="btn btn-primary" onClick={() => {
                  editStudent();
                }}>Update Student</button>
              </div>
            </form>
          </div>
        </div>
      </dialog >
      {/* Delete Student Modal */}
      <dialog id="delete_student_modal" className="modal">
        <div className="modal-box">
          <h3 className="flex items-center font-bold text-lg"><FiTrash2 className="mr-2" /> Delete Student</h3>
          <p className="py-4">Are you sure you want to delete this student?</p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn mr-2">Cancel</button>
              <button className="btn btn-error" onClick={() => deleteStudent()}>Delete</button>
            </form>
          </div>
        </div>
      </dialog>
      {/* Delete Class Modal */}
      <dialog id="delete_class_modal" className="modal">
        <div className="modal-box">
          <h3 className="flex items-center font-bold text-lg"><FiTrash2 className="mr-2" /> Delete Class</h3>
          <p className="py-4">Are you sure you want to delete this class?</p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn mr-2">Cancel</button>
              <button className="btn btn-error" onClick={() => deleteClass()}>Delete</button>
            </form>
          </div>
        </div>
      </dialog>
      {/* Import Error Modal */}
      <dialog id="import_error_modal" className="modal">
        <div className="modal-box">
          <h3 className="flex items-center font-bold text-lg"><FiXCircle className="mr-2" /> Failed to Import Students</h3>
          <p className="py-4">Make sure the columns <kbd className="kbd">rollNo</kbd>, <kbd className="kbd">name</kbd> & <kbd className="kbd">email</kbd> are present. Eg:</p>
          <img src="/excel.png" alt="Excel Example" />
          <div className="modal-action">
            <form method="dialog">
              <button className="btn mr-2">OK</button>
            </form>
          </div>
        </div>
      </dialog>
      <Toaster />
    </div>
  );
}
