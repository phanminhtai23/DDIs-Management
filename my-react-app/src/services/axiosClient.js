// api/axiosClient.js
import axios from "axios";
import {message } from "antd";

const axiosClient = axios.create({
    baseURL: process.env.REACT_APP_BASE_BACKEND_URL, // Thay đổi URL API của bạn
    headers: {
        "Content-Type": "application/json",
    },
});

// Thêm interceptor để xử lý token authentication
axiosClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor xử lý response
axiosClient.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        // Xử lý lỗi chung
        if (error.response) {
            // Lỗi server trả về
            if (error.response.status === 401) {
                // Unauthorized - có thể logout user
                localStorage.removeItem("token");
                window.location.href = '/admin/auth/login'; // Chuyển hướng đến trang đăng nhập
                message.warning({
                    content: "Phiên làm việc đã hết hạn, vui lòng đăng nhập lại!",
                });
            }
        }
        return Promise.reject(error);
    }
);

export default axiosClient;
