//  services/userService.js
import axiosClient from "./axiosClient";

const userService = {
    // Lấy danh sách users
    getAll: () => {
        return axiosClient.get("/users");
    },

    // Cập nhật thông tin user
    update: (userEmail, updatedUser) => {
        return axiosClient.put(`/users/update/${userEmail}`, updatedUser);
    },

    // Xóa user
    delete: (userEmail) => {
        return axiosClient.delete(`/users/delete/${userEmail}`);
    },

    logout: (token) => {
        return axiosClient.post("/users/logout", token);
    },

    // Login
    login: (credentials) => {
        return axiosClient.post("/users/login", credentials);
    },

    // Register
    register: (userData) => {
        return axiosClient.post("/users/register", userData);
    },

    verify_token: () => {
        return axiosClient.get("/users/verify-token");
    },
};

export default userService;
