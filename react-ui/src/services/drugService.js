// api/drugService.js
import axiosClient from "./axiosClient";

const drugService = {
    // Lấy danh sách thuốc với phân trang
    getAll: (page = 1, limit = 20, search = "") => {
        const params = new URLSearchParams();
        params.append("page", page);
        params.append("limit", limit);
        if (search.trim()) {
            params.append("search", search);
        }
        return axiosClient.get(`/drugs?${params.toString()}`);
    },

    // Thêm mới thuốc
    create: (data) => {
        return axiosClient.post("/drugs", data);
    },

    // Trích thông tin từ document
    extract: (document_urls) => {
        return axiosClient.post(`/drugs/extract`, document_urls);
    },

    // Cập nhật thông tin thuốc
    update: (drug_id, drug) => {
        return axiosClient.put(`/drugs/${drug_id}`, drug);
    },

    // Xóa thuốc
    delete: (drug_id) => {
        return axiosClient.delete(`/drugs/${drug_id}`);
    },
};

export default drugService;
