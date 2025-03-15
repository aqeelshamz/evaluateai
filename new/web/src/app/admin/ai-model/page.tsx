"use client";
import { FiCpu, FiPlus } from "react-icons/fi";

export default function Page() {
  return (
    <div className="flex flex-col">
      <p className="flex items-center text-2xl font-semibold"><FiCpu className="mr-2" /> AI Model</p>
      <div className="flex pb-5 w-[80vw] flex-wrap gap-4 mt-4">
        <div
          className="cursor-pointer w-64 h-40 flex items-center justify-center rounded-lg border-dashed border-2 border-gray-300 font-semibold text-2xl hover:border-4 duration-100"
          onClick={() => (document.getElementById('new_class_modal') as any).showModal()}
        >
          <FiPlus size={24} className="mr-2" /> New
        </div>
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
