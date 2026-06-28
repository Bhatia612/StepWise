import axios from "axios"

const api = axios.create({
    baseURL: "https://m4lfs77x-5000.use2.devtunnels.ms/api/v1",
    withCredentials: true
})

export default api;