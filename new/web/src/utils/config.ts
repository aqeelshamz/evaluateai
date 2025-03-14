import axios from "axios";

export const appName = "EvaluateAI";
export const serverURL = "http://localhost:8000";

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