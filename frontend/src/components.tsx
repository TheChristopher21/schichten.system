import Header from "./components/Header";
// In components.tsx oder einem anderen Dienst-Modul

import axios from 'axios';

export const authenticatedAxios = axios.create();

authenticatedAxios.interceptors.request.use((config) => {
    const token = localStorage.getItem('userToken');
    config.headers.Authorization = token ? `Bearer ${token}` : '';
    return config;
});



export {
    Header
}