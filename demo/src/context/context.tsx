import { serverURL } from "@/utils/utils";
import axios from "axios";
import { usePathname } from "next/navigation";
import { createContext, useState } from "react";
import { toast } from "react-toastify";

const MainContext = createContext<any>(null);

function Context({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const [moreMenuOpen, setMoreMenuOpen] = useState<boolean>(false);
    const [showMenu, setShowMenu] = useState<boolean>(false);
    const [user, setUser] = useState<any>({});
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedTab, setSelectedTab] = useState<number>(0);
    const [limits, setLimits] = useState<any>({});

    const [evaluators, setEvaluators] = useState<any[]>([]);
    const [selectedEvaluator, setSelectedEvaluator] = useState<number>(-1);
    const [loadingEvaluator, setLoadingEvaluator] = useState<boolean>(false);
    const [creatingEvaluator, setCreatingEvaluator] = useState<boolean>(false);
    const [newEvaluatorTitle, setNewEvaluatorTitle] = useState<string>("");
    const [newEvaluatorClassId, setNewEvaluatorClassId] = useState<string>("-1");
    const [newEvaluatorQuestionPapers, setNewEvaluatorQuestionPapers] = useState<string[]>([]);
    const [newEvaluatorAnswerKeys, setNewEvaluatorAnswerKeys] = useState<string[]>([]);
    const [editEvaluatorTitle, setEditEvaluatorTitle] = useState<string>("");
    const [editEvaluatorClassId, setEditEvaluatorClassId] = useState<string>("-1");

    const [classes, setClasses] = useState<any[]>([]);
    const [selectedClass, setSelectedClass] = useState<number>(-1);
    const [newClassName, setNewClassName] = useState<string>("");
    const [newClassSection, setNewClassSection] = useState<string>("");
    const [newClassSubject, setNewClassSubject] = useState<string>("");
    const [editClassName, setEditClassName] = useState<string>("");
    const [editClassSection, setEditClassSection] = useState<string>("");
    const [editClassSubject, setEditClassSubject] = useState<string>("");
    const [loadingClass, setLoadingClass] = useState<boolean>(false);
    const [creatingClass, setCreatingClass] = useState<boolean>(false);

    const [students, setStudents] = useState<any[]>([]);
    const [newStudentName, setNewStudentName] = useState<string>("");
    const [newStudentRollNo, setNewStudentRollNo] = useState<number>(0);
    const [editStudentName, setEditStudentName] = useState<string>("");
    const [editStudentRollNo, setEditStudentRollNo] = useState<number>(-1);
    const [addingStudent, setAddingStudent] = useState<boolean>(false);
    const [deleteStudentRollNo, setDeleteStudentRollNo] = useState<number>(-1);

    const [answerSheets, setAnswerSheets] = useState<any>([]);

    const [evaluating, setEvaluating] = useState<number>(-1);
    const [evaluationData, setEvaluationData] = useState<any>({});

    const [resultData, setResultData] = useState<any>({});
    const [resultDataTable, setResultDataTable] = useState<any>([]);

    const [imgPreviewURL, setImgPreviewURL] = useState<string>("");

    const evaluateEvaluators = {
        "evaluators": [
            {
                "_id": "65c88f908ad115825aa81014",
                "userId": "65c88f328ad115825aa80fdb",
                "classId": "65c88f488ad115825aa80feb",
                "title": "Series Test 1",
                "questionPapers": [
                    "https://utfs.io/f/1ac981b7-e241-4dc3-a3fb-45c9f82b88c1-th3h6b.png"
                ],
                "answerKeys": [
                    "https://utfs.io/f/37664378-8155-4558-8a3f-77beeea72cdd-fvfala.png"
                ],
                "createdAt": "2024-02-11T09:12:48.306Z",
                "updatedAt": "2024-02-11T09:12:48.306Z",
                "__v": 0,
                "class": {
                    "_id": "65c88f488ad115825aa80feb",
                    "name": "S3",
                    "section": "CSE",
                    "subject": "OOPS"
                }
            }
        ],
        "user": {
            "name": "Aqeel",
            "email": "aqeelten@gmail.com",
            "type": 1
        },
        "limits": {
            "_id": "65c88f328ad115825aa80fdd",
            "evaluatorLimit": 4,
            "evaluationLimit": 100
        }
    };

    const getLimits = () => {
        setLimits(evaluateEvaluators.limits);
    }

    const getEvaluators = () => {
        setEvaluators(evaluateEvaluators.evaluators);
        setUser(evaluateEvaluators.user);
        setLimits(evaluateEvaluators.limits);

        const selectedEvaluatorLocalData = parseInt(localStorage.getItem("selectedEvaluator") || "-1");
        setSelectedEvaluator(selectedEvaluatorLocalData);

        if (evaluateEvaluators.evaluators.length === 0 && (pathname.includes("evaluators"))) {
            localStorage.setItem("selectedEvaluator", "-1");
            setSelectedEvaluator(-1);
            window.location.href = "/home";
        }
        else if (evaluateEvaluators.evaluators.length > 0 && !pathname.includes("evaluators") && !pathname.includes("classes") && !pathname.includes("admin")) {
            localStorage.setItem("selectedEvaluator", "0");
            setSelectedEvaluator(0);
            window.location.href = "/home/evaluators";
        }

        getStudents(evaluateEvaluators.evaluators[selectedEvaluatorLocalData]?.classId);
        getEvaluation(evaluateEvaluators.evaluators[selectedEvaluatorLocalData]?._id);
    }

    const getClasses = () => {
        const classData = [
            {
                "_id": "65c88f488ad115825aa80feb",
                "name": "S3",
                "section": "CSE",
                "subject": "OOPS",
                "students": [
                    {
                        "rollNo": 1,
                        "name": "Anvin C Shaju",
                        "_id": "65c88f518ad115825aa80ff2"
                    },
                    {
                        "rollNo": 2,
                        "name": "Aqeel",
                        "_id": "65c88f568ad115825aa80ffb"
                    },
                    {
                        "rollNo": 3,
                        "name": "Jacob Prince",
                        "_id": "65c88f5c8ad115825aa81006"
                    }
                ],
                "createdBy": "65c88f328ad115825aa80fdb",
                "createdAt": "2024-02-11T09:11:36.307Z",
                "updatedAt": "2024-02-11T09:11:56.848Z",
                "__v": 3
            }
        ];

        setClasses(classData);
        if (classData.length > 0 && pathname.includes("classes") && selectedClass === -1) {
            setSelectedClass(0);
        }
    }

    const editEvaluator = () => {
        return toast.error("This feature is not available in the demo version!");
    }

    const createEvaluator = () => {
        return toast.error("This feature is not available in the demo version!");
    }

    const deleteEvaluator = async () => {
        return toast.error("This feature is not available in the demo version!");
    }

    const createClass = () => {
        if (newClassName === '' || newClassSection === '' || newClassSubject === '') {
            return toast.error("Please fill all the fields!");
        }

        return toast.error("This feature is not available in the demo version!");
    }

    const editClass = () => {
        if (editClassName === '' || editClassSection === '' || editClassSubject === '') {
            return toast.error("Please fill all the fields!");
        }

        return toast.error("This feature is not available in the demo version!");
    }

    const deleteClass = async () => {
        return toast.error("This feature is not available in the demo version!");
    }

    const getStudents = (classId?: string) => {
        if (!classId && !classes[selectedClass]?._id) return;
        var classStudents = [
            {
                "rollNo": 1,
                "name": "Anvin C Shaju",
                "_id": "65c88f518ad115825aa80ff2"
            },
            {
                "rollNo": 2,
                "name": "Aqeel",
                "_id": "65c88f568ad115825aa80ffb"
            },
            {
                "rollNo": 3,
                "name": "Jacob Prince",
                "_id": "65c88f5c8ad115825aa81006"
            }
        ];

        setStudents(classStudents);
    }

    const addStudent = () => {
        if (newStudentName === '') {
            return toast.error("Please fill all the fields!");
        }

        return toast.error("This feature is not available in the demo version!");
    }

    const editStudent = () => {
        if (editStudentName === '') {
            return toast.error("Please fill all the fields!");
        }

        return toast.error("This feature is not available in the demo version!");
    }

    const deleteStudent = () => {
        return toast.error("This feature is not available in the demo version!");
    }

    const getEvaluation = (evaluatorId?: string) => {
        if (!evaluators[selectedEvaluator]?._id && !evaluatorId) return;

        const evaluationsGet = {
            "_id": "65c88fa88ad115825aa81047",
            "evaluatorId": "65c88f908ad115825aa81014",
            "answerSheets": [
                [
                    "https://utfs.io/f/241f19b0-c953-4018-90fc-4bb52e612639-1sa31.jpeg"
                ],
                [
                    "https://utfs.io/f/a73d5cd8-0a98-44ad-98c8-0840e2da838e-1sa30.jpeg"
                ],
                [
                    "https://utfs.io/f/b1f2b7f8-6fc7-481a-8a0b-5e328c4da5a9-1sa2z.jpeg"
                ]
            ],
            "createdAt": "2024-02-11T09:13:12.925Z",
            "updatedAt": "2024-02-11T09:16:11.983Z",
            "__v": 2,
            "data": {
                "1": {
                    "student_name": "Anvin C Shaju",
                    "roll_no": 1,
                    "class": "S3 CSE",
                    "subject": "OOPS",
                    "answers": [
                        {
                            "question_no": 1,
                            "question": "What are advantages of using UML?",
                            "answer": "Provides standard for software development. Development time is reduced. The past faced issues by the developers are no longer exists. Has large visual elements to construct and easy to follow.",
                            "score": [
                                2,
                                3
                            ],
                            "remarks": "Satisfactory answer, but some points are missing or not clearly explained.",
                            "confidence": 0.8
                        },
                        {
                            "question_no": 2,
                            "question": "Illustrate the steps involved in Java compilation.",
                            "answer": "Compile and run Java program. Source code saved in java extension. After compilation, .class files are generated by javac.",
                            "score": [
                                2,
                                3
                            ],
                            "remarks": "Answer could be more detailed with individual steps, but covers basic process.",
                            "confidence": 0.7
                        },
                        {
                            "question_no": 3,
                            "question": "Differentiate between a class and an object.",
                            "answer": "Object is an instance of class. Class is a blueprint or template from which objects are created. Objects are physical entity, Class is a logical entity.",
                            "score": [
                                2,
                                3
                            ],
                            "remarks": "Answer captures essential differences but not as comprehensive as the answer key. More details would enhance the answer.",
                            "confidence": 0.8
                        },
                        {
                            "question_no": 4,
                            "question": "Explain briefly about method overloading with an example.",
                            "answer": "Method overriding is a feature that allows a class to have two or more methods.",
                            "score": [
                                0,
                                3
                            ],
                            "remarks": "Incorrect terminology used ('overriding' instead of 'overloading') and lacks an example.",
                            "confidence": 1
                        }
                    ]
                },
                "2": {
                    "student_name": "Aqeel",
                    "roll_no": "69",
                    "class": "S3 CSE",
                    "subject": "OOPS",
                    "answers": [
                        {
                            "question_no": 1,
                            "question": "What are advantages of using UML?",
                            "answer": "provides standard for software development, Development time is reduced, Large visual elements.",
                            "score": [
                                2,
                                3
                            ],
                            "remarks": "Partially correct, some key points are missing such as reducing costs and facilitating team communication.",
                            "confidence": 0.8
                        },
                        {
                            "question_no": 2,
                            "question": "Illustrate the steps involved in Java compilation.",
                            "answer": "Not attempted",
                            "score": [
                                0,
                                3
                            ],
                            "remarks": "No answer provided.",
                            "confidence": 1
                        },
                        {
                            "question_no": 3,
                            "question": "Differentiate between a class and an object.",
                            "answer": "Object - instance of class, physical entity. Class - Blueprint or template, group of similar objects.",
                            "score": [
                                2,
                                3
                            ],
                            "remarks": "Correct differentiation but lacks completeness; some main distinguishing points are missing.",
                            "confidence": 0.7
                        },
                        {
                            "question_no": 4,
                            "question": "Explain briefly about method overloading with an example.",
                            "answer": "Method overloading is a type of argument in OOPS.",
                            "score": [
                                0,
                                3
                            ],
                            "remarks": "Answer is incorrect and does not explain method overloading nor provides an example.",
                            "confidence": 1
                        }
                    ]
                },
                "3": {
                    "student_name": "Jacob Prince",
                    "roll_no": "3",
                    "class": "S3 CSE",
                    "subject": "OOPS",
                    "answers": [
                        {
                            "question_no": 1,
                            "question": "What are advantages of using UML?",
                            "answer": "- development time is reduced - provides standard for s/w development. - the past faced issues by the developers are no longer exists.",
                            "score": [
                                2,
                                3
                            ],
                            "remarks": "Answer touches on key advantages but lacks detail.",
                            "confidence": 0.9
                        },
                        {
                            "question_no": 2,
                            "question": "Illustrate the steps involved in Java compilation.",
                            "answer": "- Source code written and saved in java - .class files are generated by javac compiler. - .class file(s) contain bytecode (machine language of JVM).",
                            "score": [
                                2.5,
                                3
                            ],
                            "remarks": "Answer provides steps but could elaborate on the process.",
                            "confidence": 0.9
                        },
                        {
                            "question_no": 3,
                            "question": "Differentiate between a class and an object.",
                            "answer": "- Object is an instance of a class, - class is a blueprint from which objects are created. - Object is a real world entity, class is a group of similar objects - object is a physical entity, class is logical entity - class is declared once, object created many times.",
                            "score": [
                                2.5,
                                3
                            ],
                            "remarks": "Good differentiation but missing some points from the answer key.",
                            "confidence": 0.9
                        },
                        {
                            "question_no": 4,
                            "question": "Explain briefly about method overloading with an example.",
                            "answer": "Method overloading allows a class to have two or more methods have same name. Also known as static polymorphism. Example: can be done by having different argument list. - different number of parameters in argument list.",
                            "score": [
                                2,
                                3
                            ],
                            "remarks": "Covers the basic concept of method overloading but lacks a clear example.",
                            "confidence": 0.8
                        }
                    ]
                }
            }
        };

        const data = evaluationsGet.answerSheets ?? [];
        setAnswerSheets([...data]);
        setEvaluationData(evaluationsGet.data ?? {});
    }

    const updateEvaluation = (evaluatorId: string, answerSheets: any) => {
        return toast.error("This feature is not available in the demo version!");
    }

    const evaluate = async (rollNo: number) => {
        return;
    }

    const getResults = (evaluatorId?: string, rollNo?: number) => {
        if (!evaluatorId) return;

        const resultData = [{
            "student_name": "Anvin C Shaju",
            "roll_no": 1,
            "class": "S3 CSE",
            "subject": "OOPS",
            "question_papers": [
                "https://utfs.io/f/1ac981b7-e241-4dc3-a3fb-45c9f82b88c1-th3h6b.png"
            ],
            "answer_keys": [
                "https://utfs.io/f/37664378-8155-4558-8a3f-77beeea72cdd-fvfala.png"
            ],
            "answer_sheets": [
                "https://utfs.io/f/241f19b0-c953-4018-90fc-4bb52e612639-1sa31.jpeg"
            ],
            "results": [
                {
                    "question_no": 1,
                    "question": "What are advantages of using UML?",
                    "answer": "Provides standard for software development. Development time is reduced. The past faced issues by the developers are no longer exists. Has large visual elements to construct and easy to follow.",
                    "score": [
                        2,
                        3
                    ],
                    "remarks": "Satisfactory answer, but some points are missing or not clearly explained.",
                    "confidence": 0.8
                },
                {
                    "question_no": 2,
                    "question": "Illustrate the steps involved in Java compilation.",
                    "answer": "Compile and run Java program. Source code saved in java extension. After compilation, .class files are generated by javac.",
                    "score": [
                        2,
                        3
                    ],
                    "remarks": "Answer could be more detailed with individual steps, but covers basic process.",
                    "confidence": 0.7
                },
                {
                    "question_no": 3,
                    "question": "Differentiate between a class and an object.",
                    "answer": "Object is an instance of class. Class is a blueprint or template from which objects are created. Objects are physical entity, Class is a logical entity.",
                    "score": [
                        2,
                        3
                    ],
                    "remarks": "Answer captures essential differences but not as comprehensive as the answer key. More details would enhance the answer.",
                    "confidence": 0.8
                },
                {
                    "question_no": 4,
                    "question": "Explain briefly about method overloading with an example.",
                    "answer": "Method overriding is a feature that allows a class to have two or more methods.",
                    "score": [
                        0,
                        3
                    ],
                    "remarks": "Incorrect terminology used ('overriding' instead of 'overloading') and lacks an example.",
                    "confidence": 1
                }
            ],
            "score": [
                6,
                12
            ]
        }, {
            "student_name": "Aqeel",
            "roll_no": 2,
            "class": "S3 CSE",
            "subject": "OOPS",
            "question_papers": [
                "https://utfs.io/f/1ac981b7-e241-4dc3-a3fb-45c9f82b88c1-th3h6b.png"
            ],
            "answer_keys": [
                "https://utfs.io/f/37664378-8155-4558-8a3f-77beeea72cdd-fvfala.png"
            ],
            "answer_sheets": [
                "https://utfs.io/f/a73d5cd8-0a98-44ad-98c8-0840e2da838e-1sa30.jpeg"
            ],
            "results": [
                {
                    "question_no": 1,
                    "question": "What are advantages of using UML?",
                    "answer": "provides standard for software development, Development time is reduced, Large visual elements.",
                    "score": [
                        2,
                        3
                    ],
                    "remarks": "Partially correct, some key points are missing such as reducing costs and facilitating team communication.",
                    "confidence": 0.8
                },
                {
                    "question_no": 2,
                    "question": "Illustrate the steps involved in Java compilation.",
                    "answer": "Not attempted",
                    "score": [
                        0,
                        3
                    ],
                    "remarks": "No answer provided.",
                    "confidence": 1
                },
                {
                    "question_no": 3,
                    "question": "Differentiate between a class and an object.",
                    "answer": "Object - instance of class, physical entity. Class - Blueprint or template, group of similar objects.",
                    "score": [
                        2,
                        3
                    ],
                    "remarks": "Correct differentiation but lacks completeness; some main distinguishing points are missing.",
                    "confidence": 0.7
                },
                {
                    "question_no": 4,
                    "question": "Explain briefly about method overloading with an example.",
                    "answer": "Method overloading is a type of argument in OOPS.",
                    "score": [
                        0,
                        3
                    ],
                    "remarks": "Answer is incorrect and does not explain method overloading nor provides an example.",
                    "confidence": 1
                }
            ],
            "score": [
                4,
                12
            ]
        }, {
            "student_name": "Jacob Prince",
            "roll_no": 3,
            "class": "S3 CSE",
            "subject": "OOPS",
            "question_papers": [
                "https://utfs.io/f/1ac981b7-e241-4dc3-a3fb-45c9f82b88c1-th3h6b.png"
            ],
            "answer_keys": [
                "https://utfs.io/f/37664378-8155-4558-8a3f-77beeea72cdd-fvfala.png"
            ],
            "answer_sheets": [
                "https://utfs.io/f/b1f2b7f8-6fc7-481a-8a0b-5e328c4da5a9-1sa2z.jpeg"
            ],
            "results": [
                {
                    "question_no": 1,
                    "question": "What are advantages of using UML?",
                    "answer": "- development time is reduced - provides standard for s/w development. - the past faced issues by the developers are no longer exists.",
                    "score": [
                        2,
                        3
                    ],
                    "remarks": "Answer touches on key advantages but lacks detail.",
                    "confidence": 0.9
                },
                {
                    "question_no": 2,
                    "question": "Illustrate the steps involved in Java compilation.",
                    "answer": "- Source code written and saved in java - .class files are generated by javac compiler. - .class file(s) contain bytecode (machine language of JVM).",
                    "score": [
                        2.5,
                        3
                    ],
                    "remarks": "Answer provides steps but could elaborate on the process.",
                    "confidence": 0.9
                },
                {
                    "question_no": 3,
                    "question": "Differentiate between a class and an object.",
                    "answer": "- Object is an instance of a class, - class is a blueprint from which objects are created. - Object is a real world entity, class is a group of similar objects - object is a physical entity, class is logical entity - class is declared once, object created many times.",
                    "score": [
                        2.5,
                        3
                    ],
                    "remarks": "Good differentiation but missing some points from the answer key.",
                    "confidence": 0.9
                },
                {
                    "question_no": 4,
                    "question": "Explain briefly about method overloading with an example.",
                    "answer": "Method overloading allows a class to have two or more methods have same name. Also known as static polymorphism. Example: can be done by having different argument list. - different number of parameters in argument list.",
                    "score": [
                        2,
                        3
                    ],
                    "remarks": "Covers the basic concept of method overloading but lacks a clear example.",
                    "confidence": 0.8
                }
            ],
            "score": [
                9,
                12
            ]
        }][rollNo! - 1];

        setResultData(resultData);
    }

    const getResultsTable = (evaluatorId?: string) => {
        if (!evaluatorId) return;

        setResultDataTable({
            "class": {
                "name": "S3",
                "section": "CSE",
                "subject": "OOPS"
            },
            "exam": "Series Test 1",
            "results": [
                {
                    "student_name": "Anvin C Shaju",
                    "roll_no": 1,
                    "score": "6 / 12"
                },
                {
                    "student_name": "Aqeel",
                    "roll_no": 2,
                    "score": "4 / 12"
                },
                {
                    "student_name": "Jacob Prince",
                    "roll_no": 3,
                    "score": "9 / 12"
                }
            ]
        });
    }

    const deleteEvaluation = async (evaluatorId?: string) => {
        if (!evaluatorId) return;

        return toast.error("This feature is not available in the demo version!");
    }


    return (
        <MainContext.Provider value={{
            moreMenuOpen,
            setMoreMenuOpen,
            showMenu,
            setShowMenu,
            user,
            setUser,
            loading,
            setLoading,
            selectedTab,
            setSelectedTab,
            limits,
            evaluators,
            setEvaluators,
            selectedEvaluator,
            setSelectedEvaluator,
            newEvaluatorTitle,
            setNewEvaluatorTitle,
            loadingEvaluator,
            setLoadingEvaluator,
            creatingEvaluator,
            setCreatingEvaluator,
            newEvaluatorQuestionPapers,
            setNewEvaluatorQuestionPapers,
            newEvaluatorAnswerKeys,
            setNewEvaluatorAnswerKeys,
            classes,
            setClasses,
            selectedClass,
            setSelectedClass,
            newClassName,
            setNewClassName,
            newClassSection,
            setNewClassSection,
            newClassSubject,
            setNewClassSubject,
            loadingClass,
            setLoadingClass,
            creatingClass,
            setCreatingClass,
            students,
            setStudents,
            newStudentName,
            setNewStudentName,
            newStudentRollNo,
            setNewStudentRollNo,
            addingStudent,
            setAddingStudent,
            deleteStudentRollNo,
            setDeleteStudentRollNo,
            getEvaluators,
            getClasses,
            createEvaluator,
            deleteEvaluator,
            createClass,
            deleteClass,
            getStudents,
            addStudent,
            deleteStudent,
            getEvaluation,
            updateEvaluation,
            answerSheets,
            setAnswerSheets,
            newEvaluatorClassId,
            setNewEvaluatorClassId,
            evaluate,
            setEvaluating,
            evaluating,
            evaluationData,
            getResults,
            setResultData,
            resultData,
            deleteEvaluation,
            setImgPreviewURL,
            imgPreviewURL,
            getResultsTable,
            resultDataTable,
            editClassName,
            setEditClassName,
            editClassSection,
            setEditClassSection,
            editClassSubject,
            setEditClassSubject,
            editClass,
            editStudentName,
            setEditStudentName,
            editStudentRollNo,
            setEditStudentRollNo,
            editStudent,
            editEvaluatorTitle,
            setEditEvaluatorTitle,
            editEvaluatorClassId,
            setEditEvaluatorClassId,
            editEvaluator
        }}>
            {children}
        </MainContext.Provider>
    );
}

export { MainContext, Context };