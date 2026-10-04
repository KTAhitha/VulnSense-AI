import axios from "axios";

const API = axios.create({
    baseURL: "http://127.0.0.1:8000"
});

export const scanTarget = async (target) => {
    const response = await API.get("/scan-and-analyze", {
        params: { target }
    });

    return response.data;
};

export const getReports = async () => {
    const response = await API.get("/reports");

    return response.data;
};

export const getReport = async (reportId) => {
    const response = await API.get(`/reports/${reportId}`);

    return response.data;
};