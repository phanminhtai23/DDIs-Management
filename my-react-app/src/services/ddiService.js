// api/ddiService.js
import axiosClient from "./axiosClient";

const ddiService = {
    // Lấy tất cả các tương tác thuốc
    getAll: () => {
        return axiosClient.get("/ddi");
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
