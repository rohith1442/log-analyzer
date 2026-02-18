import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL||"http://localhost:8000"
});

export const fetchLogs = async (params) => {
  const res = await API.get("/logs", { params });
  return res.data;
};

export const fetchStats = async (seconds = 60) => {
  const res = await API.get("/logs/stats", {
    params: { seconds },
  });
  return res.data;
};

