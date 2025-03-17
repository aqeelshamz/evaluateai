import axios from "axios";

export const appName = "EvaluateAI";
export const appURL = "https://evaluateai.vercel.app";
export const serverURL = "https://evaluateaiapi.aqeelshamz.com";
export const primaryColor = "#9A4CFF";
export const currencySymbol = "₹";
export const currency = "INR";

export const onboardingSteps = [
    {
        "title": `Welcome to ${appName}!`,
        "description": "Easily manage and evaluate exams with our AI-powered answer sheet evaluator. Let's get started!",
        "image": "/onboarding/onboarding_start.png",
    },
    {
        "title": "Create Your First Class",
        "description": "Navigate to Classes and Click on '+ New Class' to create your first class.",
        "image": "/onboarding/1_new_class.png",
    },
    {
        "title": "Fill in Class Details",
        "description": "Enter the class name, section, and subject, then click 'Create Class' to confirm.",
        "image": "/onboarding/2_create_class.png",
    },
    {
        "title": "Enroll Students Individually",
        "description": "From the class page, Click '+ New Student' to add students one at a time with their details.",
        "image": "/onboarding/3_new_student.png",
    },
    {
        "title": "Or Import Students Quickly",
        "description": "Upload student details from an Excel file using the 'Import' button, perfect for large batches.",
        "image": "/onboarding/4_import_student.png",
    },
    {
        "title": "Create an Evaluator",
        "description": "Navigate to Evaluators and Click on '+ New Evaluator' to create your first evaluator.",
        "image": "/onboarding/5_new_evaluator.png",
    },
    {
        "title": "Customize Evaluator Details",
        "description": "Provide the evaluator’s title, description, and select the class they will evaluate.",
        "image": "/onboarding/6_create_evaluator.png",
    },
    {
        "title": "Upload Exam Resources",
        "description": "Upload question papers and model answer keys for the evaluator to reference during evaluation.",
        "image": "/onboarding/7_upload_materials.png",
    },
    {
        "title": "Upload Answer Sheets",
        "description": "Easily upload each student’s answer sheets. You can upload multiple sheets at once.",
        "image": "/onboarding/8_upload_answersheets.png",
    },
    {
        "title": "Start Evaluating",
        "description": "Enter total marks and any special instructions (if needed), then click 'Evaluate'. Now sit back and relax!",
        "image": "/onboarding/9_evaluate.png",
    },
    {
        "title": "View Results",
        "description": "After evaluation, view the results and download the mark sheets for each student.",
        "image": "/onboarding/10_results.png",
    },
];

export const checkAuth = async () => {
    const config = {
        method: "GET",
        url: `${serverURL}/users/`,
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
        },
    };

    axios(config)
        .catch((error) => {
            localStorage.clear();
            window.location.href = "/auth/login";
        });
}