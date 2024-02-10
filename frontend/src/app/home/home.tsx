"use client";
import { useContext, useEffect } from "react";
import { FiPlus, FiMoreHorizontal, FiSettings, FiUser, FiLogOut, FiFileText, FiEdit, FiTrash, FiArrowRight, FiShoppingCart, FiShoppingBag, FiType, FiPlusCircle, FiKey, FiUsers } from "react-icons/fi";
import Link from "next/link";
import { appName } from "@/utils/utils";
import { UploadButton, UploadDropzone } from "@/utils/uploadthing";
import { MainContext } from "@/context/context";
import { usePathname } from "next/navigation";

export default function Home({
  children,
}: {
  children: React.ReactNode
}) {
  const { theme,
    setTheme,
    moreMenuOpen,
    setMoreMenuOpen,
    showMenu,
    setShowMenu,
    user,
    selectedTab,
    setSelectedTab,
    evaluators,
    selectedEvaluator,
    setSelectedEvaluator,
    newEvaluatorTitle,
    setNewEvaluatorTitle,
    newEvaluatorQuestionPapers,
    setNewEvaluatorQuestionPapers,
    newEvaluatorAnswerKeys,
    setNewEvaluatorAnswerKeys,
    classes,
    selectedClass,
    setSelectedClass,
    getEvaluators,
    getClasses,
    createEvaluator,
    deleteEvaluator,
    getStudents,
    newEvaluatorClassId,
    setNewEvaluatorClassId,
    setEditClassName,
    setEditClassSection,
    setEditClassSubject } = useContext(MainContext);

  const pathname = usePathname();

  useEffect(() => {
    getEvaluators();
    getClasses();

    pathname === "/home/classes" ? setSelectedTab(1) : setSelectedTab(0);
    setSelectedEvaluator(-1);

    if (typeof window !== 'undefined') {
      setTheme(localStorage.getItem("theme") ? localStorage.getItem("theme") : "light");
      if (!localStorage.getItem("token")) {
        window.location.href = "/login";
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", theme);
    const localTheme: string = localStorage.getItem("theme")!.toString();
    document.querySelector("html")!.setAttribute("data-theme", localTheme);
  }, [theme]);

  useEffect(() => {
    if (selectedClass !== -1) {
      getStudents(classes[selectedClass]?._id);
    }
  }, [selectedClass]);

  return (
    <main className="flex bg-base-100 h-screen w-screen p-2 max-sm:p-0" onClick={() => {
      if (moreMenuOpen) setMoreMenuOpen(false);
    }}>
      {/* Sidebar */}
      <div className={'print flex flex-col p-5 min-w-[275px] max-w-[15vw] h-full rounded-md ' + (!showMenu ? "max-sm:hidden " : "max-sm:fixed max-sm:w-full max-sm:h-full max-sm:max-w-none bg-base-100 max-sm:z-50 ")}>
        <div className="flex justify-between items-center max-sm:mb-4">
          <Link href="/"><div className="mb-5 font-semibold max-sm:mb-3" onClick={() => setSelectedEvaluator(-1)}>🤖 {appName} 📝</div></Link>
          <div className="hidden max-sm:flex justify-end mb-3">
            <button className="btn btn-square btn-sm" onClick={() => setShowMenu(false)}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>
        <div role="tablist" className="tabs tabs-boxed mb-2">
          <Link href={"/home/evaluators"} role="tab" className={"tab " + (selectedTab === 0 ? "tab-active" : "")} onClick={() => { setSelectedTab(0); setSelectedClass(-1); setSelectedEvaluator(0) }}>Evaluators</Link>
          <Link href={"/home/classes"} role="tab" className={"tab " + (selectedTab === 1 ? "tab-active" : "")} onClick={() => { setSelectedTab(1); setSelectedEvaluator(-1); setSelectedClass(0) }}>Classes</Link>
        </div>
        <label className='btn btn-primary' htmlFor={["newevaluator_modal", "newclass_modal"][selectedTab]} onClick={() => { }}><FiPlus /> NEW {["EVALUATOR", "CLASS"][selectedTab]}</label>
        <div className='p-0 my-2 h-full w-full overflow-hidden hover:overflow-y-auto'>
          {selectedTab === 0 ?
            evaluators?.map((evaluator: any, i: number) => {
              return <Link key={i} href={"/home/evaluators"}><div className={(selectedEvaluator === i ? ' bg-base-200 ' : ' bg-transparent hover:bg-base-200 ') + 'cursor-pointer flex flex-col px-3 py-2 rounded-md w-full mb-1'} onClick={() => {
                setSelectedEvaluator(i); setShowMenu(false);
              }}>
                <div className='flex justify-start items-center'>
                  <div className='w-fit mr-2'>
                    <FiFileText />
                  </div>
                  <div className='flex flex-col items-start'>
                    <p className='text-sm text-ellipsis line-clamp-1 font-semibold'>{evaluator.title}</p>
                  </div>
                </div>
                {selectedEvaluator === i ?
                  <div className='flex mt-2'>
                    <label htmlFor='editevaluator_modal' className='cursor-pointer flex justify-center items-center w-full p-2 bg-base-300 rounded-md mr-1 hover:bg-gray-500 hover:text-white' onClick={() => setNewEvaluatorTitle(evaluators[i].title)}>
                      <FiEdit /><p className='ml-2 text-xs'>Edit</p>
                    </label>
                    <label htmlFor='deleteevaluator_modal' className='cursor-pointer flex justify-center items-center w-full p-2 bg-base-300 rounded-md hover:bg-red-500 hover:text-white'>
                      <FiTrash /><p className='ml-2 text-xs'>Delete</p>
                    </label>
                  </div> : ""}
              </div></Link>
            }) :
            classes?.map((_class: any, i: number) => {
              return <div key={i} className={(selectedClass === i ? ' bg-base-200 ' : ' bg-transparent hover:bg-base-200 ') + 'cursor-pointer flex flex-col px-3 py-2 rounded-md w-full mb-1'} onClick={() => { setSelectedClass(i); setShowMenu(false) }}>
                <div className='flex justify-start items-center'>
                  <div className='w-fit mr-2'>
                    <FiUsers />
                  </div>
                  <div className='flex flex-col items-start'>
                    <p className='text-sm text-ellipsis line-clamp-1 font-semibold'>{_class.subject}</p>
                    <p className='text-xs text-ellipsis line-clamp-1'>{_class.name} {_class.section}</p>
                  </div>
                </div>
                {selectedClass === i ?
                  <div className='flex mt-2'>
                    <label htmlFor='editclass_modal' className='cursor-pointer flex justify-center items-center w-full p-2 bg-base-300 rounded-md mr-1 hover:bg-gray-500 hover:text-white' onClick={() => {
                      setEditClassName(classes[i].name);
                      setEditClassSection(classes[i].section);
                      setEditClassSubject(classes[i].subject);
                    }}>
                      <FiEdit /><p className='ml-2 text-xs'>Edit</p>
                    </label>
                    <label htmlFor='deleteclass_modal' className='cursor-pointer flex justify-center items-center w-full p-2 bg-base-300 rounded-md hover:bg-red-500 hover:text-white'>
                      <FiTrash /><p className='ml-2 text-xs'>Delete</p>
                    </label>
                  </div> : ""}
              </div>
            })

          }
        </div>
        <hr />
        <div className="flex items-center justify-between my-4">
          <p>0 rewrites left</p>
          <Link href="/shop"><button className="btn btn-sm"><FiShoppingCart /> SHOP</button></Link>
        </div>
        {user?.type === 0 ? <Link href="/admin/dashboard"><label className='btn mb-2 w-full'><FiUser /> ADMIN PANEL <FiArrowRight /></label></Link> : ""}
        <div tabIndex={0} className='cursor-pointer dropdown dropdown-top flex items-center hover:bg-base-200 p-2 rounded-lg'>
          <div className='flex items-center justify-between w-full'>
            <div className='flex items-center'>
              <div className="avatar placeholder mr-2">
                <div className="bg-blue-700 text-white mask mask-squircle w-10">
                  <span><FiUser /></span>
                </div>
              </div>
              <p className='font-semibold'>{user?.name}</p>
            </div>
            <FiMoreHorizontal />
          </div>
          <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 mb-2">
            <label htmlFor='settings_modal'><li className='flex'><p><FiSettings />Settings</p></li></label>
            <Link href="/shop"><label><li className='flex'><p><FiShoppingCart />Shop</p></li></label></Link>
            <Link href="/purchases"><label><li className='flex'><p><FiShoppingBag />My Purchases</p></li></label></Link>
            <hr className='my-2' />
            <li className='flex' onClick={() => {
              localStorage.clear()
              window.location.href = "/";
            }}><p><FiLogOut className="text-red-600" />Logout</p></li>
          </ul>
        </div>
      </div>
      {/* Main */}
      {children}
      {/* New Evaluator Modal */}
      <input type="checkbox" id="newevaluator_modal" className="modal-toggle" />
      <div className="modal" role="dialog">
        <div className="modal-box">
          <h3 className="flex items-center font-bold text-lg"><FiPlusCircle className="mr-1" /> New Evaluator</h3>
          <p className="flex items-center py-4"><FiType className='mr-2' />Title</p>
          <input className="input input-bordered w-full" placeholder="What's the name of the exam / evaluator?" type="text" onChange={(x) => setNewEvaluatorTitle(x.target.value)} value={newEvaluatorTitle} />
          <p className="flex items-center py-4"><FiUsers className='mr-2' />Class</p>
          <select className="select select-bordered w-full" value={newEvaluatorClassId} onChange={(x) => setNewEvaluatorClassId(x.target.value)}>
            <option disabled selected value={"-1"}>Select class</option>
            {
              classes?.map((class_: any, i: any) => (
                <option key={i} value={class_._id}>{class_?.subject} | {class_?.name} {class_?.section}</option>
              ))
            }
          </select><p className="flex items-center py-4"><FiFileText className='mr-2' />Upload question paper(s)</p>
          {newEvaluatorQuestionPapers.length > 0 ?
            <div className="flex flex-wrap">{
              newEvaluatorQuestionPapers.map((file: string, i: number) => {
                return <img key={i} src={file} className="border cursor-pointer w-20 h-20 object-cover rounded-md mr-2 mb-2" onClick={() => window.open(file)} />
              })
            }</div>
            : <div className="flex">
              <UploadButton
                endpoint="media"
                onClientUploadComplete={(res) => {
                  var files = [];
                  for (const file of res) {
                    files.push(file.url);
                  }
                  setNewEvaluatorQuestionPapers([...files]);
                }}
                onUploadError={(error: Error) => {
                  alert(`ERROR! ${error.message}`);
                }}
              />
            </div>}
          <p className="flex items-center py-4"><FiKey className='mr-2' />Upload answer key / criteria</p>
          {newEvaluatorAnswerKeys.length > 0 ?
            <div className="flex flex-wrap">{
              newEvaluatorAnswerKeys.map((file: string, i: number) => {
                return <img key={i} src={file} className="border cursor-pointer w-20 h-20 object-cover rounded-md mr-2 mb-2" onClick={() => window.open(file)} />
              })
            }</div>
            : <div className="flex">
              <UploadButton
                endpoint="media"
                onClientUploadComplete={(res) => {
                  var files = [];
                  for (const file of res) {
                    files.push(file.url);
                  }
                  setNewEvaluatorAnswerKeys([...files]);
                }}
                onUploadError={(error: Error) => {
                  alert(`ERROR! ${error.message}`);
                }}
              />
            </div>}
          <div className="modal-action">
            <label htmlFor="newevaluator_modal" className="btn">Cancel</label>
            <label htmlFor="newevaluator_modal" className="btn btn-primary" onClick={() => createEvaluator()}>Create Evaluator</label>
          </div>
        </div>
        <label className="modal-backdrop" htmlFor="newevaluator_modal">Cancel</label>
        {/* <label ref={newDocumentModalRef} htmlFor="newevaluator_modal" hidden></label> */}
      </div>
      {/* Delete Evaluator Modal */}
      <input type="checkbox" id="deleteevaluator_modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
          <h3 className="flex items-center font-bold text-lg"><FiTrash className="mr-1" /> Delete Evaluator</h3>
          <p className="py-4">Are you sure want to delete this evaluator?</p>
          <div className="modal-action">
            <label htmlFor="deleteevaluator_modal" className="btn">Cancel</label>
            <label htmlFor="deleteevaluator_modal" className="btn btn-error" onClick={() => deleteEvaluator()}>Delete</label>
          </div>
        </div>
        <label className="modal-backdrop" htmlFor="deleteevaluator_modal">Cancel</label>
      </div>
    </main >
  );
}
