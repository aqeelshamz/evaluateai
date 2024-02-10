"use client";
import { useContext } from "react";
import { FiUser, FiEdit, FiTrash, FiType, FiPlusCircle, FiUsers, FiBook, FiHash, FiPrinter } from "react-icons/fi";
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
    deleteStudent,
    editClassName,
    setEditClassName,
    editClassSection,
    setEditClassSection,
    editClassSubject,
    setEditClassSubject,
    editClass,
    editStudentRollNo,
    setEditStudentRollNo,
    editStudentName,
    setEditStudentName,
    editStudent
  } = useContext(MainContext);

  return (
    <div className="animate-fade-in-bottom flex flex-col w-full max-w-[50vw] max-sm:max-w-none">
      <div className="hidden max-sm:flex justify-end mb-3">
        <button className="btn btn-square" onClick={() => setSelectedEvaluator(-1)}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
      <div className="flex items-center justify-between mb-1 mt-4 w-full max-w-lg">
        <p className="flex items-center font-semibold text-xl"><FiBook className="mr-2" /> {classes[selectedClass]?.subject} <FiUsers className="ml-5 mr-2" /> {classes[selectedClass]?.name} {classes[selectedClass]?.section}</p>
      </div>
      <div className="print flex mt-5">
        <label htmlFor="newstudent_modal" className="btn btn-primary" onClick={() => setNewStudentRollNo(students.length + 1)}>+ New Student</label>
      </div>
      <div className="overflow-y-auto h-[70vh] mt-5">
        <div className='print flex w-full items-center max-w-7xl py-5'>
          <button className='btn btn-primary' onClick={() => window.print()}><FiPrinter />Download / Print</button>
        </div>
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th>RollNo</th>
              <th>Name</th>
              <th className="print">Edit</th>
              <th className="print">Delete</th>
            </tr>
          </thead>
          <tbody>
            {
              students.map((student: any, i: any) => (
                <tr key={i}>
                  <th>{student?.rollNo}</th>
                  <td>{student?.name}</td>
                  <td className="print"><label htmlFor="editstudent_modal" className="btn btn-square" onClick={() => {
                    setEditStudentRollNo(student.rollNo);
                    setEditStudentName(student.name);
                  }}><FiEdit /></label></td>
                  <td className="print"><label htmlFor="deletestudent_modal" className="btn btn-square" onClick={() => setDeleteStudentRollNo(student.rollNo)}><FiTrash /></label></td>
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
      {/* Edit Class Modal */}
      <input type="checkbox" id="editclass_modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
          <h3 className="flex items-center font-bold text-lg"><FiEdit className="mr-1" /> Edit Class</h3>
          <p className="flex items-center py-4"><FiType className='mr-2' />Class Name</p>
          <input className="input input-bordered w-full" placeholder="Class Name" type="text" onChange={(x) => setEditClassName(x.target.value)} value={editClassName} />
          <p className="flex items-center py-4"><FiUsers className='mr-2' />Section</p>
          <input className="input input-bordered w-full" placeholder="Section" type="text" onChange={(x) => setEditClassSection(x.target.value)} value={editClassSection} />
          <p className="flex items-center py-4"><FiBook className='mr-2' />Subject</p>
          <input className="input input-bordered w-full" placeholder="Subject" type="text" onChange={(x) => setEditClassSubject(x.target.value)} value={editClassSubject} />
          <div className="modal-action">
            <label htmlFor="editclass_modal" className="btn">Cancel</label>
            <label htmlFor="editclass_modal" className="btn btn-primary" onClick={() => editClass()}>Save</label>
          </div>
        </div>
        <label className="modal-backdrop" htmlFor="editclass_modal">Cancel</label>
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
      {/* Edit Student Modal */}
      <input type="checkbox" id="editstudent_modal" className="modal-toggle" />
      <div className="modal" role="dialog">
        <div className="modal-box">
          <h3 className="flex items-center font-bold text-lg"><FiEdit className="mr-1" /> Edit Student</h3>
          <p className="flex items-center py-4"><FiHash className='mr-2' />Roll No</p>
          <p className="flex items-center py-4">{editStudentRollNo}</p>
          <p className="flex items-center py-4"><FiUser className='mr-2' />Student Name</p>
          <input className="input input-bordered w-full" placeholder="Student Name" type="text" onChange={(x) => setEditStudentName(x.target.value)} value={editStudentName} />
          <div className="modal-action">
            <label htmlFor="editstudent_modal" className="btn">Cancel</label>
            <label htmlFor="editstudent_modal" className="btn btn-primary" onClick={() => editStudent()}>Save</label>
          </div>
        </div>
        <label className="modal-backdrop" htmlFor="editstudent_modal">Cancel</label>
      </div>
    </div>
  );
}
