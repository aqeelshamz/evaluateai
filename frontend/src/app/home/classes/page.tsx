"use client";
import { useContext } from "react";
import { FiUser, FiEdit, FiTrash, FiType, FiPlusCircle, FiUsers, FiBook, FiHash } from "react-icons/fi";
import { MainContext } from "@/context/context";

export default function Classes() {
  const {
    setSelectedEvaluator,
    classes,
    selectedClass,
    newClassName,
    setNewClassName,
    newClassSection,
    setNewClassSection,
    newClassSubject,
    setNewClassSubject,
    students,
    newStudentName,
    setNewStudentName,
    newStudentRollNo,
    setNewStudentRollNo,
    setDeleteStudentRollNo,
    createClass,
    deleteClass,
    addStudent,
    deleteStudent } = useContext(MainContext);

  return (
    <div className="animate-fade-in-bottom flex flex-col w-full max-w-[50vw] max-sm:max-w-none">
      <div className="hidden max-sm:flex justify-end mb-3">
        <button className="btn btn-square" onClick={() => setSelectedEvaluator(-1)}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
      <div className="flex items-center font-semibold text-xl mb-1 mt-4"><FiUsers className="mr-2" />
        <p className='text-xl text-ellipsis line-clamp-1 font-semibold'>{classes[selectedClass]?.subject} | {classes[selectedClass]?.name} {classes[selectedClass]?.section}</p>
      </div>
      <div className="flex mt-5">
        <label htmlFor="newstudent_modal" className="btn btn-primary" onClick={() => setNewStudentRollNo(students.length + 1)}>+ New Student</label>
      </div>
      <div className="overflow-y-auto h-[70vh] mt-5">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th>RollNo</th>
              <th>Name</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {
              students.map((student: any, i: any) => (
                <tr>
                  <th>{student?.rollNo}</th>
                  <td>{student?.name}</td>
                  <td><label className="btn btn-square"><FiEdit /></label></td>
                  <td><label htmlFor="deletestudent_modal" className="btn btn-square" onClick={() => setDeleteStudentRollNo(student.rollNo)}><FiTrash /></label></td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
      {/* New Class Modal */}
      <input type="checkbox" id="newclass_modal" className="modal-toggle" />
      <div className="modal" role="dialog">
        <div className="modal-box">
          <h3 className="flex items-center font-bold text-lg"><FiPlusCircle className="mr-1" /> New Class</h3>
          <p className="flex items-center py-4"><FiType className='mr-2' />Class Name</p>
          <input className="input input-bordered w-full" placeholder="Class Name" type="text" onChange={(x) => setNewClassName(x.target.value)} value={newClassName} />
          <p className="flex items-center py-4"><FiUsers className='mr-2' />Section</p>
          <input className="input input-bordered w-full" placeholder="Section" type="text" onChange={(x) => setNewClassSection(x.target.value)} value={newClassSection} />
          <p className="flex items-center py-4"><FiBook className='mr-2' />Subject</p>
          <input className="input input-bordered w-full" placeholder="Subject" type="text" onChange={(x) => setNewClassSubject(x.target.value)} value={newClassSubject} />
          <div className="modal-action">
            <label htmlFor="newclass_modal" className="btn">Cancel</label>
            <label htmlFor="newclass_modal" className="btn btn-primary" onClick={() => createClass()}>Create Class</label>
          </div>
        </div>
        <label className="modal-backdrop" htmlFor="newclass_modal">Cancel</label>
      </div>
      {/* Delete Class Modal */}
      <input type="checkbox" id="deleteclass_modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
          <h3 className="flex items-center font-bold text-lg"><FiTrash className="mr-1" /> Delete Class</h3>
          <p className="py-4">Are you sure want to delete this class?</p>
          <div className="modal-action">
            <label htmlFor="deleteclass_modal" className="btn">Cancel</label>
            <label htmlFor="deleteclass_modal" className="btn btn-error" onClick={() => deleteClass()}>Delete</label>
          </div>
        </div>
        <label className="modal-backdrop" htmlFor="deleteclass_modal">Cancel</label>
      </div>
      {/* New Student Modal */}
      <input type="checkbox" id="newstudent_modal" className="modal-toggle" />
      <div className="modal" role="dialog">
        <div className="modal-box">
          <h3 className="flex items-center font-bold text-lg"><FiPlusCircle className="mr-1" /> New Student</h3>
          <p className="flex items-center py-4"><FiHash className='mr-2' />Roll No</p>
          <input className="input input-bordered w-full" placeholder="Roll No" type="number" onChange={(x) => setNewStudentRollNo(parseInt(x.target.value))} value={newStudentRollNo} />
          <p className="flex items-center py-4"><FiUser className='mr-2' />Student Name</p>
          <input className="input input-bordered w-full" placeholder="Student Name" type="text" onChange={(x) => setNewStudentName(x.target.value)} value={newStudentName} />
          <div className="modal-action">
            <label htmlFor="newstudent_modal" className="btn">Cancel</label>
            <label htmlFor="newstudent_modal" className="btn btn-primary" onClick={() => addStudent()}>Add Student</label>
          </div>
        </div>
        <label className="modal-backdrop" htmlFor="newstudent_modal">Cancel</label>
      </div>
      {/* Delete Student Modal */}
      <input type="checkbox" id="deletestudent_modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
          <h3 className="flex items-center font-bold text-lg"><FiTrash className="mr-1" /> Delete Student</h3>
          <p className="py-4">Are you sure want to delete this student?</p>
          <div className="modal-action">
            <label htmlFor="deletestudent_modal" className="btn">Cancel</label>
            <label htmlFor="deletestudent_modal" className="btn btn-error" onClick={() => deleteStudent()}>Delete</label>
          </div>
        </div>
        <label className="modal-backdrop" htmlFor="deletestudent_modal">Cancel</label>
      </div>
    </div>
  );
}
