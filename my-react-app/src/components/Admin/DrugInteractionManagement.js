import React, { useState, useEffect } from "react";
import { DDIModal, ViewModal } from "../Modals/DDIModal";
import { Edit, Trash2, Eye, Plus } from "lucide-react";
import ddiService from "../../services/ddiService";
import { LoadingData } from "../loading";
import ReactPaginate from "react-paginate";
import { message } from "antd";
import UploadWidget from "../Cloudary";

const DrugInteractionManagement = () => {
    const [interactions, setInteractions] = useState([]);
    const [selectedInteraction, setSelectedInteraction] = useState(null);
    const [ExtracteddDDI, setExtracteddDDI] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("view");
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [interactionToDelete, setInteractionToDelete] = useState(null);
    const [interactionDataFromModal, setInteractionDataFromModal] = useState(
        []
    );
    const itemsPerPage = 20;

    useEffect(() => {
        fetchInteractions();
    }, []);

    // Handler để nhận dữ liệu từ DDIModal
    const handleInteractionData = (data) => {
        setInteractionDataFromModal(data);
    };

    const handleExtractData = (data) => {
        console.log("data extract:", data);
        if (!Array.isArray(data) || data.length === 0) {
            console.error("Invalid data format:", data);
            return;
        }
        setExtracteddDDI(data);
        setModalMode("add");
        setIsModalOpen(true);
    };

    const fetchInteractions = async () => {
        try {
            setLoading(true);
            const response = await ddiService.getAll();
            console.log("Dữ liệu trả về từ API:", response);
            if (response.ddi && Array.isArray(response.ddi)) {
                // const flattenedInteractions = response.ddi.flat();
                setInteractions(response.ddi);
            } else {
                console.error("Invalid response format:", response);
                setInteractions([]);
                setError("Định dạng dữ liệu không hợp lệ");
            }
        } catch (err) {
            console.error("Error fetching interactions:", err);
            setInteractions([]);
            setError(
                "Không thể tải danh sách tương tác thuốc, vui lòng thử lại sau."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleView = (interaction) => {
        setSelectedInteraction(interaction);
        setModalMode("view");
        setIsModalOpen(true);
    };

    const handleEdit = (interaction) => {
        setSelectedInteraction(interaction);
        setModalMode("edit");
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setSelectedInteraction({
            TenThuoc: "",
            HoatChat_1: "",
            HoatChat_2: "",
            MucDoNghiemTrong: "",
            CanhBaoTuongTacThuoc: "",
        });
        setModalMode("add");
        setIsModalOpen(true);
    };

    const showDeleteConfirmation = (interaction) => {
        setInteractionToDelete(interaction);
        setModalMode("delete");
        setIsModalOpen(true);
    };

    const handleDelete = async () => {
        try {
            await ddiService.delete(interactionToDelete.id);
            setIsModalOpen(false);
            message.success("Xóa tương tác thuốc thành công!");
            fetchInteractions();
        } catch (err) {
            console.error("Error deleting interaction:", err);
            message.error(
                "Không thể xóa tương tác thuốc, vui lòng thử lại sau."
            );
        }
    };

    const handleSave = async (updatedInteraction) => {
        try {
            if (modalMode === "add") {
                // Kiểm tra nếu là mảng thì xử lý từng phần tử
                if (Array.isArray(updatedInteraction)) {
                    // Lọc ra các cặp tương tác hợp lệ (có cả hoạt chất 1 và 2)
                    const validInteractions = updatedInteraction.filter(
                        (item) => item.HoatChat_1 && item.HoatChat_2
                    );

                    if (validInteractions.length === 0) {
                        message.error(
                            "Vui lòng nhập ít nhất một cặp hoạt chất tương tác hợp lệ"
                        );
                        return;
                    }
                    try {
                        console.log("vo gui nhieu tương tác thuốc");
                        // Gửi request tạo mới cho từng cặp tương tác
                        await Promise.all(
                            validInteractions.map((interaction) => {
                                interaction.id = ""; // Thêm id ngẫu nhiên
                                console.log(interaction);
                                return ddiService.create(interaction);
                            })
                        );
                    } catch (error) {
                        console.error("Error creating interactions:", error);
                        if (error.response) {
                            const { status } = error.response;
                            if (status === 400) {
                                message.error({
                                    content: error.response.data.detail,
                                    duration: 4,
                                });
                            } else if (status === 404) {
                                message.error("Vui lòng thử lại.");
                            } else if (status === 500) {
                                message.error(
                                    "Lỗi máy chủ. Vui lòng thử lại sau."
                                );
                            } else {
                                message.error(
                                    "Có lỗi xảy ra khi thêm tương tác thuốc."
                                );
                            }
                        } else {
                            message.error(
                                "Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng."
                            );
                        }
                        return;
                    }
                } else {
                    // Trường hợp là object đơn lẻ
                    await ddiService.create(updatedInteraction);
                }
            } else {
                // Chế độ edit - luôn là một object đơn lẻ
                console.log(updatedInteraction);
                if (
                    Array.isArray(updatedInteraction) &&
                    updatedInteraction.length > 0
                ) {
                    // Lấy phần tử đầu tiên nếu là mảng
                    await ddiService.update(
                        updatedInteraction[0].id,
                        updatedInteraction[0]
                    );
                } else {
                    await ddiService.update(
                        updatedInteraction.id,
                        updatedInteraction
                    );
                }
            }

            message.success(
                `Đã ${
                    modalMode === "add" ? "thêm" : "cập nhật"
                } tương tác thuốc thành công!`
            );
            fetchInteractions();
            setIsModalOpen(false);
        } catch (err) {
            console.error("Error saving interaction:", err);
            message.error(
                `Không thể ${
                    modalMode === "add" ? "thêm" : "cập nhật"
                } tương tác thuốc, vui lòng thử lại sau.`
            );
        }
    };

    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected);
    };

    const filteredInteractions = interactions.filter(
        (interaction) =>
            interaction.TenThuoc?.toLowerCase().includes(
                searchTerm.toLowerCase()
            ) ||
            interaction.HoatChat_1?.toLowerCase().includes(
                searchTerm.toLowerCase()
            ) ||
            interaction.HoatChat_2?.toLowerCase().includes(
                searchTerm.toLowerCase()
            )
    );

    const pageCount = Math.ceil(filteredInteractions.length / itemsPerPage);
    const currentInteractions = filteredInteractions.slice(
        currentPage * itemsPerPage,
        (currentPage + 1) * itemsPerPage
    );

    return (
        <div>
            <div className="flex justify-between items-center mb-4 caret-transparent">
                <h2 className="text-2xl font-bold">Quản Lý Tương Tác Thuốc</h2>
                <button
                    onClick={handleAdd}
                    className="bg-green-500 text-white px-4 py-2 rounded flex items-center"
                >
                    <Plus className="mr-2" /> Thêm Tương Tác
                </button>
            </div>
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Tìm kiếm tương tác thuốc..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg"
                />
            </div>
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            )}
            <div className="flex-grow">
                {loading ? (
                    <LoadingData />
                ) : (
                    <div
                        className="flex-grow overflow-y-auto caret-transparent"
                        style={{ maxHeight: "calc(100vh - 200px)" }}
                    >
                        <table className="w-full border-collapse">
                            <thead className="sticky top-0 bg-white z-10">
                                <tr className="bg-gray-200">
                                    <th className="border p-2 w-10 truncate">
                                        ID
                                    </th>
                                    <th className="border p-2">Hoạt Chất 1</th>
                                    <th className="border p-2">Hoạt Chất 2</th>
                                    <th className="border p-2">Mức Độ</th>
                                    <th className="border p-2">Cảnh Báo</th>
                                    <th className="border p-2 w-28">
                                        Thao Tác
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentInteractions.length > 0 ? (
                                    currentInteractions.map((interaction) => (
                                        <tr
                                            key={
                                                interaction.id || Math.random()
                                            }
                                        >
                                            <td
                                                className="border p-2 w-20 truncate"
                                                title={interaction.id}
                                            >
                                                {interaction.id || ""}
                                            </td>
                                            <td className="border p-2">
                                                {interaction.HoatChat_1 || ""}
                                            </td>
                                            <td className="border p-2">
                                                {interaction.HoatChat_2 || ""}
                                            </td>
                                            <td className="border p-2">
                                                {interaction.MucDoNghiemTrong ||
                                                    ""}
                                            </td>
                                            <td className="border p-2">
                                                {interaction.CanhBaoTuongTacThuoc ||
                                                    ""}
                                            </td>
                                            <td className="border p-2">
                                                <div className="flex justify-center items-center space-x-2">
                                                    <button
                                                        onClick={() =>
                                                            handleView(
                                                                interaction
                                                            )
                                                        }
                                                        className="text-blue-500"
                                                    >
                                                        <Eye />
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleEdit(
                                                                interaction
                                                            )
                                                        }
                                                        className="text-yellow-500"
                                                    >
                                                        <Edit />
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            showDeleteConfirmation(
                                                                interaction
                                                            )
                                                        }
                                                        className="text-red-500"
                                                    >
                                                        <Trash2 />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="6"
                                            className="border p-2 text-center"
                                        >
                                            Không có dữ liệu
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            <div className="fixed bottom-4 left-1/2 transform -translate-x-1 bg-white shadow-lg rounded-full p-2 border border-gray-200">
                <ReactPaginate
                    previousLabel={
                        <span className="flex items-center justify-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 19l-7-7 7-7"
                                />
                            </svg>
                        </span>
                    }
                    nextLabel={
                        <span className="flex items-center justify-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5l7 7-7 7"
                                />
                            </svg>
                        </span>
                    }
                    pageCount={pageCount}
                    onPageChange={handlePageChange}
                    marginPagesDisplayed={1}
                    pageRangeDisplayed={3}
                    containerClassName="flex items-center space-x-2 text-sm mb-0 select-none"
                    pageClassName="select-none"
                    pageLinkClassName="flex items-center justify-center w-8 h-8 rounded-full border border-gray-200 hover:bg-gray-50 transition duration-300 select-none focus:outline-none"
                    previousClassName="select-none"
                    nextClassName="select-none"
                    previousLinkClassName="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition duration-300 select-none focus:outline-none"
                    nextLinkClassName="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 !hover:bg-gray-200 transition duration-300 select-none focus:outline-none"
                    disabledClassName="opacity-40 cursor-not-allowed"
                    activeClassName=""
                    activeLinkClassName="!bg-blue-500 !text-white !border-blue-500 hover:!bg-blue-600"
                    breakLabel="..."
                    breakClassName="select-none"
                    breakLinkClassName="flex items-center justify-center w-8 h-8 text-gray-400 select-none focus:outline-none"
                />
            </div>
            <ViewModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            >
                <div className="max-h-[70vh] overflow-y-auto w-full">
                    {modalMode === "view" && selectedInteraction && (
                        <div className="max-h-[70vh] overflow-y-auto">
                            <h3 className="text-xl font-bold mb-4">
                                Chi Tiết Tương Tác Thuốc
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                                <p>
                                    <strong>Hoạt Chất 1:</strong>{" "}
                                    {selectedInteraction.HoatChat_1 || ""}
                                </p>
                                <p>
                                    <strong>Hoạt Chất 2:</strong>{" "}
                                    {selectedInteraction.HoatChat_2 || ""}
                                </p>
                                <p>
                                    <strong>Mức Độ Nghiêm Trọng:</strong>{" "}
                                    {selectedInteraction.MucDoNghiemTrong || ""}
                                </p>
                                <p className="max-h-[800px] overflow-y-auto break-words">
                                    <strong>Cảnh Báo:</strong>{" "}
                                    {selectedInteraction.CanhBaoTuongTacThuoc ||
                                        ""}
                                </p>
                            </div>
                        </div>
                    )}
                    {(modalMode === "edit" || modalMode === "add") && (
                        // Form submit
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                // Sử dụng interactionDataFromModal trực tiếp
                                handleSave(interactionDataFromModal);
                            }}
                            className="w-full"
                        >
                            {modalMode === "add" && (
                                <>
                                    <div className="mb-4 flex flex-col items-start space-y-2">
                                        <label className="text-gray-700 font-bold">
                                            Nhập nhiều file ảnh hoặc một file
                                            PDF để thêm cặp tương tác thuốc:
                                        </label>
                                        <UploadWidget
                                            sendExtractData={handleExtractData}
                                            modeData="ddi"
                                        />
                                    </div>
                                    <DDIModal
                                        modalMode={modalMode}
                                        selectedInteraction={ExtracteddDDI}
                                        setIsModalOpen={setIsModalOpen}
                                        handleInteractionData={
                                            handleInteractionData
                                        }
                                    />
                                </>
                            )}
                            {modalMode === "edit" && (
                                <DDIModal
                                    modalMode={modalMode}
                                    selectedInteraction={selectedInteraction}
                                    setIsModalOpen={setIsModalOpen}
                                    handleInteractionData={
                                        handleInteractionData
                                    }
                                />
                            )}
                        </form>
                    )}
                    {modalMode === "delete" && interactionToDelete && (
                        <div>
                            <h3 className="text-xl font-bold mb-4">
                                Xác Nhận Xóa
                            </h3>
                            <p className="mb-4">
                                Bạn có chắc chắn muốn xóa tương tác thuốc{" "}
                                <strong>
                                    {interactionToDelete.HoatChat_1}
                                </strong>{" "}
                                -
                                <strong>
                                    {interactionToDelete.HoatChat_2}
                                </strong>{" "}
                                ?
                            </p>
                            <div className="flex justify-end space-x-2">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="bg-red-500 text-white px-4 py-2 rounded"
                                >
                                    Xác Nhận
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </ViewModal>
        </div>
    );
};

export default DrugInteractionManagement;
