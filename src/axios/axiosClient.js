import axios from "axios";
// import { useStateContext } from "./context/ContextProvider.jsx";

const axiosClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}`,
  withCredentials: false,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});
const axiosAi = axios.create({
  baseURL: `${import.meta.env.VITE_AI_BASE_URL}`,
  withCredentials: false,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { response } = error;
    if (response.status === 401) {
      sessionStorage.removeItem("TOKEN");
    } else if (response.status === 404) {
      //Show not found
    }

    throw error;
  }
);

export { axiosAi };
export default axiosClient;
