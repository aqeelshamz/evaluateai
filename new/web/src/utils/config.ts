import axios from "axios";

export const appName = "EvaluateAI";
export const appURL = "http://localhost:3000";
export const serverURL = "http://localhost:8000";
export const primaryColor = "#9A4CFF";
export const currencySymbol = "$";

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