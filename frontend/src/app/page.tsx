"use client";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { FiPlus, FiMoreHorizontal, FiSettings, FiUser, FiLogOut, FiFileText, FiEdit, FiTrash, FiMenu, FiArrowRight, FiShoppingCart, FiShoppingBag, FiType, FiPlusCircle, FiKey, FiUsers, FiBook, FiBookOpen } from "react-icons/fi";
import Link from "next/link";
import { appName, serverURL } from "@/utils/utils";
import { UploadDropzone } from "@/utils/uploadthing";
import axios from "axios";

export default function Home() {
  const [theme, setTheme] = useState<null | any | string>(
    "light"
  );

  const [moreMenuOpen, setMoreMenuOpen] = useState<boolean>(false);
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [user, setUser] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedTab, setSelectedTab] = useState<number>(0);

  const [evaluators, setEvaluators] = useState<any[]>([]);
  const [selectedEvaluator, setSelectedEvaluator] = useState<number>(-1);
  const [newEvaluatorTitle, setNewEvaluatorTitle] = useState<string>("");
  const [loadingEvaluator, setLoadingEvaluator] = useState<boolean>(false);
  const [creatingEvaluator, setCreatingEvaluator] = useState<boolean>(false);

  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState<number>(-1);
  const [newClassName, setNewClassName] = useState<string>("");
  const [newClassSection, setNewClassSection] = useState<string>("");
  const [newClassSubject, setNewClassSubject] = useState<string>("");
  const [loadingClass, setLoadingClass] = useState<boolean>(false);
  const [creatingClass, setCreatingClass] = useState<boolean>(false);

  const [newEvaluatorQuestionPapers, setNewEvaluatorQuestionPapers] = useState<string[]>([]);
  const [newEvaluatorAnswerKeys, setNewEvaluatorAnswerKeys] = useState<string[]>([]);

  useEffect(() => {
    getEvaluators();
    getClasses();
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

  const getEvaluators = () => {
    const config = {
      method: "GET",
      url: `${serverURL}/evaluate/evaluators`,
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      },
    };

    axios(config).then((response) => {
      setEvaluators(response.data.evaluators);
      setUser(response.data.user);
    });
  }

  const getClasses = () => {
    const config = {
      method: "GET",
      url: `${serverURL}/class`,
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      },
    };

    axios(config).then((response) => {
      setClasses(response.data);
    });
  }

  const createEvaluator = () => {
    if (newEvaluatorTitle === '' || newEvaluatorQuestionPapers.length === 0 || newEvaluatorAnswerKeys.length === 0) {
      return toast.error("Please fill all the fields!");
    }

    setCreatingEvaluator(true);

    const config = {
      method: "POST",
      url: `${serverURL}/evaluate/evaluators/create`,
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": `application/json`,
      },
      data: {
        "title": newEvaluatorTitle,
        "questionPapers": newEvaluatorQuestionPapers,
        "answerKeys": newEvaluatorAnswerKeys,
      }
    };

    axios(config).then((response) => {
      toast.success("Evaluator Created!");
      setNewEvaluatorTitle("");
      setNewEvaluatorQuestionPapers([]);
      setNewEvaluatorAnswerKeys([]);
      setSelectedEvaluator(0);
      getEvaluators();
      setCreatingEvaluator(false);
    }).catch((error) => {
      toast.error("Something went wrong!");
      setCreatingEvaluator(false);
    });
  }

  const deleteEvaluator = async () => {
    const config = {
      method: "POST",
      url: `${serverURL}/evaluate/evaluators/delete`,
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": `application/json`,
      },
      data: {
        evaluatorId: evaluators[selectedEvaluator]?._id
      }
    };

    axios(config)
      .then((response) => {
        getEvaluators();
        setSelectedEvaluator(-1);
        toast.success("Evaluator deleted!");
      })
      .catch((error) => {
        toast.error("Failed to delete evaluator");
      });
  }

  const createClass = () => {
    if (newClassName === '' || newClassSection === '' || newClassSubject === '') {
      return toast.error("Please fill all the fields!");
    }

    setCreatingClass(true);

    const config = {
      method: "POST",
      url: `${serverURL}/class/create`,
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": `application/json`,
      },
      data: {
        "name": newClassName,
        "section": newClassSection,
        "subject": newClassSubject,
      }
    };

    axios(config).then((response) => {
      toast.success("Class Created!");
      setNewClassName("");
      setNewClassSection("");
      setNewClassSubject("");
      setSelectedClass(0);
      getClasses();
      setCreatingClass(false);
    }).catch((error) => {
      toast.error("Something went wrong!");
      setCreatingClass(false);
    });
  }

  const deleteClass = async () => {
    const config = {
      method: "POST",
      url: `${serverURL}/class/delete`,
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": `application/json`,
      },
      data: {
        classId: classes[selectedClass]?._id
      }
    };

    axios(config)
      .then((response) => {
        getClasses();
        setSelectedClass(-1);
        toast.success("Class deleted!");
      })
      .catch((error) => {
        toast.error("Failed to delete class");
      });
  }

  return (
    <main className="flex bg-base-100 h-screen w-screen p-2 max-sm:p-0" onClick={() => {
      if (moreMenuOpen) setMoreMenuOpen(false);
    }}>
      {/* Sidebar */}
      <div className={'flex flex-col p-5 min-w-[275px] max-w-[15vw] h-full rounded-md ' + (!showMenu ? "max-sm:hidden " : "max-sm:fixed max-sm:w-full max-sm:h-full max-sm:max-w-none bg-base-100 max-sm:z-50 ")}>
        <div className="flex justify-between items-center max-sm:mb-4">
          <p className="mb-5 font-semibold max-sm:mb-3">🤖 {appName} 📝<Link href="/shop"></Link></p>
          <div className="hidden max-sm:flex justify-end mb-3">
            <button className="btn btn-square btn-sm" onClick={() => setShowMenu(false)}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>
        <div role="tablist" className="tabs tabs-boxed mb-2">
          <a role="tab" className={"tab " + (selectedTab === 0 ? "tab-active" : "")} onClick={() => setSelectedTab(0)}>Evaluators</a>
          <a role="tab" className={"tab " + (selectedTab === 1 ? "tab-active" : "")} onClick={() => setSelectedTab(1)}>Classes</a>
        </div>
        <label className='btn btn-primary' htmlFor={["newevaluator_modal", "newclass_modal"][selectedTab]} onClick={() => { }}><FiPlus /> NEW {["EVALUATOR", "CLASS"][selectedTab]}</label>
        <div className='p-0 my-2 h-full w-full overflow-hidden hover:overflow-y-auto'>
          {selectedTab === 0 ?
            evaluators?.map((evaluator: any, i: number) => {
              return <div key={i} className={(selectedEvaluator === i ? ' bg-base-200 ' : ' bg-transparent hover:bg-base-200 ') + 'cursor-pointer flex flex-col px-3 py-2 rounded-md w-full mb-1'} onClick={() => { setSelectedEvaluator(i); setShowMenu(false) }}>
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
              </div>
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
                    <label htmlFor='editclass_modal' className='cursor-pointer flex justify-center items-center w-full p-2 bg-base-300 rounded-md mr-1 hover:bg-gray-500 hover:text-white' onClick={() => setNewClassName(classes[i].title)}>
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
        {user?.type === "admin" ? <Link href="/admin/dashboard"><label className='btn mb-2 w-full'><FiUser /> ADMIN PANEL <FiArrowRight /></label></Link> : ""}
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
              window.location.href = "/login";
            }}><p><FiLogOut className="text-red-600" />Logout</p></li>
          </ul>
        </div>
      </div>
      {/* Main */}
      <div className='flex flex-col items-center justify-center ml-2 p-5 border-base-300 border-[1px] w-full h-full rounded-lg 2xl:items-center max-sm:ml-0 max-sm:border-none max-sm:p-2 max-sm:items-start max-sm:justify-start'>
        {(loadingEvaluator || creatingEvaluator) ? <div className="flex items-center"><span className="loading loading-spinner mr-4"></span><p>{loadingEvaluator ? "Loading" : "Creating"} Evaluator...</p></div> : selectedEvaluator === -1 ? <div className='select-none flex flex-col justify-center items-center w-full h-full'>
          <p className='text-5xl font-semibold mb-2'>🤖 {appName} 📝</p>
          <p className='text-center'>Create a new evaluator or select an existing evaluator to get started.</p>
          <div className='flex flex-wrap justify-center mt-7'>
            <div className='bg-base-300 rounded-lg p-4 hover:bg-base-200 max-w-xs m-2'>
              <p className='font-semibold text-md mb-2'>✨ AI Rewriting & Grammar Check</p>
              <p className='text-sm opacity-70'>Effortlessly enhance your writing with AI-powered rewriting and precise grammar checking.</p>
            </div>
            <div className='bg-base-300 rounded-lg p-4 hover:bg-base-200 max-w-xs m-2'>
              <p className='font-semibold text-md mb-2'>🎭 Rewrites in Custom Tones & Length</p>
              <p className='text-sm opacity-70'>Personalize your text with customizable rewrites in various tones and lengths.</p>
            </div>
            <div className='bg-base-300 rounded-lg p-4 hover:bg-base-200 max-w-xs m-2'>
              <p className='font-semibold text-md mb-2'>📝 Multiple Evaluator Creation</p>
              <p className='text-sm opacity-70'>Seamlessly create and manage multiple evaluators for all your writing needs.</p>
            </div>
          </div>
          <div className='flex mt-5'>
            Press <kbd className="kbd kbd-sm mx-2">Alt</kbd> + <kbd className="kbd kbd-sm mx-2">N</kbd> to create a new evaluator.
          </div>
        </div> : <div className="animate-fade-in-bottom flex flex-col w-full max-w-[50vw] max-sm:max-w-none">
          <div className="hidden max-sm:flex justify-end mb-3">
            <button className="btn btn-square" onClick={() => setSelectedEvaluator(-1)}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <div className="flex mb-4 items-center max-sm:flex-wrap">
            <p className="mr-2 font-semibold">Tone: </p>
            {
              ["✨ Normal", "👟 Casual", "💼 Formal", "📝 Academic", "📖 Creative"].map((e, i: number) => {
                return <button className={'btn btn-sm mr-2 max-sm:mb-2 ' + (0 == i ? 'btn-primary' : '')} onClick={() => { }}>{e}</button>
              })
            }
          </div>
          <div className="flex mb-4 items-center max-sm:flex-wrap">
            <p className="mr-2 font-semibold">Length: </p>
            {
              ["📝 Short", "📄 Medium", "📚 Long"].map((e, i: number) => {
                return <button className={'btn btn-sm mr-2 max-sm:mb-2 ' + (0 == i ? 'btn-primary' : '')} onClick={() => { }}>{e}</button>
              })
            }
          </div>
          <div className="flex mb-3 items-center">
            <p className="mr-2 font-semibold">Rewrites: </p>
            <input type="number" className="input input-bordered w-20" onChange={(x) => { }} value={1} min={1} max={10} placeholder="1" />
          </div>
          <p className="flex items-center font-semibold text-xl mb-1 mt-4"><FiFileText className="mr-2" /> {evaluators[selectedEvaluator]?.title}</p>
          <textarea className='bg-base-100 mt-5 text-md min-h-[25vh] p-2 rounded-md outline-none border-2 border-base-300' onChange={(x) => { }} placeholder='Write or paste your text here...' autoFocus></textarea>
          <div className="flex mt-2"><label htmlFor="generatetext_modal" className="btn btn-xs max-sm:btn-sm">Generate text with AI</label></div>
          <div className="mt-7 flex items-center max-sm:flex-col">
            <button className={'btn btn-primary max-sm:w-full max-sm:mb-3 ' + (loading ? "opacity-50" : "")} onClick={() => { }}>{loading ? <span className="loading loading-spinner"></span> : "📝 "}Rewrite</button>
            <details className="dropdown dropdown-top max-sm:w-full" onToggle={(x) => setMoreMenuOpen(x.currentTarget.open)} open={moreMenuOpen}>
              <summary tabIndex={0} className='btn ml-2 max-sm:w-full max-sm:ml-0'>✨ More</summary>
              <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                <li onClick={() => { setMoreMenuOpen(false) }}><a>➡️ Continue Writing</a></li>
                <li onClick={() => { setMoreMenuOpen(false) }}><a>📝 Summarise</a></li>
                <li onClick={() => { setMoreMenuOpen(false) }}><a>🧠 Explain</a></li>
                <li onClick={() => { setMoreMenuOpen(false) }}><a>☝️ Give an example</a></li>
                <li onClick={() => { setMoreMenuOpen(false) }}><a>🎯 Counterargument</a></li>
                <li onClick={() => { setMoreMenuOpen(false) }}><a>📖 Define</a></li>
                <li onClick={() => { setMoreMenuOpen(false) }}><a>✏️ Shorten</a></li>
                <li onClick={() => { setMoreMenuOpen(false) }}><a>📚 Expand</a></li>
              </ul>
            </details>
          </div>
          <p className="mt-3 text-sm text-gray-500">1 rewrites left</p>
        </div>}
        <label htmlFor='newevaluator_modal' className='sm:hidden absolute right-5 bottom-5 btn btn-primary btn-square'><FiPlus /></label>
        {selectedEvaluator === -1 ? <button className='sm:hidden absolute left-5 top-5 btn btn-square' onClick={() => setShowMenu(!showMenu)}><FiMenu /></button> : ""}
      </div>
      {/* New Evaluator Modal */}
      <input type="checkbox" id="newevaluator_modal" className="modal-toggle" />
      <div className="modal" role="dialog">
        <div className="modal-box">
          <h3 className="flex items-center font-bold text-lg"><FiPlusCircle className="mr-1" /> New Evaluator</h3>
          <p className="flex items-center py-4"><FiType className='mr-2' />Title</p>
          <input className="input input-bordered w-full" placeholder="What's the name of the exam / evaluator?" type="text" onChange={(x) => setNewEvaluatorTitle(x.target.value)} value={newEvaluatorTitle} />
          <p className="flex items-center py-4"><FiFileText className='mr-2' />Upload question paper(s)</p>
          {newEvaluatorQuestionPapers.length > 0 ?
            <div className="flex flex-wrap">{
              newEvaluatorQuestionPapers.map((file: string, i: number) => {
                return <img key={i} src={file} className="cursor-pointer w-20 h-20 object-cover rounded-md mr-2 mb-2" onClick={() => window.open(file)} />
              })
            }</div>
            : <UploadDropzone
              endpoint="media"
              onClientUploadComplete={(res) => {
                var files = [];
                for (const file of res) {
                  files.push(file.url);
                }
                setNewEvaluatorQuestionPapers(files);
              }}
              onUploadError={(error: Error) => {
                alert(`ERROR! ${error.message}`);
              }}
            />}
          <p className="flex items-center py-4"><FiKey className='mr-2' />Upload answer key / criteria</p>
          {newEvaluatorAnswerKeys.length > 0 ?
            <div className="flex flex-wrap">{
              newEvaluatorAnswerKeys.map((file: string, i: number) => {
                return <img key={i} src={file} className="cursor-pointer w-20 h-20 object-cover rounded-md mr-2 mb-2" onClick={() => window.open(file)} />
              })
            }</div>
            : <UploadDropzone
              endpoint="media"
              onClientUploadComplete={(res) => {
                var files = [];
                for (const file of res) {
                  files.push(file.url);
                }
                setNewEvaluatorAnswerKeys(files);
              }}
              onUploadError={(error: Error) => {
                alert(`ERROR! ${error.message}`);
              }}
            />}
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
      <ToastContainer />
    </main >
  );
}
