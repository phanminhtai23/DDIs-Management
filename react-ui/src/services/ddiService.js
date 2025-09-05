// api/ddiService.js
import axiosClient from "./axiosClient";

const ddiService = {
    // Lấy tương tác thuốc với phân trang
    getAll: (page = 1, limit = 20, search = "") => {
        const params = new URLSearchParams();
        params.append("page", page);
        params.append("limit", limit);
        if (search.trim()) {
            params.append("search", search);
        }
        return axiosClient.get(`/ddi?${params.toString()}`);
    },

    // Tạo mới thông tin tương tác thuốc
    create: (ddi) => {
        return axiosClient.post("/ddi", ddi);
    },

    // Lấy chi tiết tương tác thuốc
    getById: (id) => {
        return axiosClient.get(`/ddi/${id}`);
    },

    extract: (document_urls) => {
        return axiosClient.post(`/ddi/extract`, document_urls);
    },

    // Cập nhật thông tin tương tác thuốc
    update: (ddi_id, ddi) => {
        return axiosClient.put(`/ddi/${ddi_id}`, ddi);
    },

    // Xóa thông tin tương tác thuốc
    delete: (ddi_id) => {
        return axiosClient.delete(`/ddi/${ddi_id}`);
    },
};

export default ddiService;
