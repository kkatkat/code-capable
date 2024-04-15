import axios from "axios";

const gatewayUrl = import.meta.env.VITE_GATEWAY_URL;

const instance = gatewayUrl ? axios.create({
  baseURL: import.meta.env.VITE_GATEWAY_URL
}) : axios.create();

instance.interceptors.request.use(function (config) {
    const token = window.localStorage.getItem('accessToken');

    if (token !== null && token !== undefined && token !== '') {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
})

export default instance;