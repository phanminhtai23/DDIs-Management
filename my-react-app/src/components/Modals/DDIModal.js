import React, { useState, useEffect } from "react";
// import UploadWidget from "./UploadWidget";

const DDIModal = ({
    modalMode,
    selectedInteraction,
    setIsModalOpen,
    handleInteractionData,
}) => {
    const [interactionData, setInteractionData] = useState([]);

    // Xử lý dữ liệu dựa trên modalMode và selectedInteraction
    useEffect(() => {
        if (modalMode === "edit" && selectedInteraction) {
            // Chế độ chỉnh sửa - chuyển đổi thành mảng nếu là object
            setInteractionData([
                {
                    id: selectedInteraction.id,
                    HoatChat_1: selectedInteraction.HoatChat_1 || "",
                    HoatChat_2: selectedInteraction.HoatChat_2 || "",
                    MucDoNghiemTrong: selectedInteraction.MucDoNghiemTrong || "",
                    CanhBaoTuongTacThuoc:
                        selectedInteraction.CanhBaoTuongTacThuoc || "",
                },
            ]);
        } else if (modalMode === "add" && selectedInteraction) {
            // Chế độ thêm với dữ liệu có sẵn (từ extract)
            if (Array.isArray(selectedInteraction)) {
                setInteractionData(selectedInteraction);
            } else {
                setInteractionData([selectedInteraction]);
            }
        } else if (modalMode === "add" && !selectedInteraction) {
            // Chế độ thêm mới không có dữ liệu
            setInteractionData([
                {
                    id: null,
                    HoatChat_1: "",
                    HoatChat_2: "",
                    MucDoNghiemTrong: "",
                    CanhBaoTuongTacThuoc: "",
                },
            ]);
        }
    }, [modalMode, selectedInteraction]);

    // Gửi dữ liệu lên component cha mỗi khi interactionData thay đổi
    useEffect(() => {
        handleInteractionData(interactionData);
    }, [handleInteractionData, interactionData]);

    // console.log("interactionData:", interactionData);
    const addInteractionPair = () => {
        setInteractionData([
            ...interactionData,
            {
                id: null,
                // Bỏ TenThuoc
                HoatChat_1: "",
                HoatChat_2: "",
                MucDoNghiemTrong: "",
                CanhBaoTuongTacThuoc: "",
            },
        ]);
    };

    const removeInteractionPair = (index) => {
        if (interactionData.length > 1) {
            const newData = [...interactionData];
            newData.splice(index, 1);
            setInteractionData(newData);
        }
    };

    const handleInputChange = (index, field, value) => {
        const newData = [...interactionData];
        newData[index][field] = value;

        // // Nếu thay đổi TenThuoc, cập nhật cho tất cả các cặp
        // if (field === "TenThuoc") {
        //     newData.forEach((item) => {
        //         item.TenThuoc = value;
        //     });
        // }

        setInteractionData(newData);
    };

    return (
        <div id="TuongTacThuocContainer">
            <h3 className="text-xl font-bold mb-4">
                {modalMode === "edit"
                    ? "Chỉnh Sửa Tương Tác Thuốc"
                    : "Thêm Tương Tác Thuốc"}
            </h3>

            {/* Hiển thị từng cặp tương tác */}
            {Array.isArray(interactionData) &&
                interactionData.map((interaction, index) => (
                    <>
                        <div
                            key={index}
                            className="mb-6 p-4 border rounded-lg bg-gray-50"
                        >
                            {/* Hiển thị ID nếu có (chỉ đọc) */}
                            {interaction.id && (
                                <div className="mb-4">
                                    <label className="block text-gray-700 font-bold mb-2">
                                        ID
                                    </label>
                                    <input
                                        type="text"
                                        value={interaction.id}
                                        readOnly
                                        className="w-full px-4 py-2 border rounded-lg bg-gray-100"
                                    />
                                </div>
                            )}

                            <div className="mb-4">
                                <label className="block text-gray-700 font-bold mb-2">
                                    Cặp hoạt chất tương tác {index + 1}
                                </label>

                                <div className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        placeholder="Tên hoạt chất 1"
                                        className="w-1/2 border p-2 rounded py-2 leading-normal"
                                        value={interaction.HoatChat_1}
                                        onChange={(e) =>
                                            handleInputChange(
                                                index,
                                                "HoatChat_1",
                                                e.target.value
                                            )
                                        }
                                    />
                                    <input
                                        type="text"
                                        placeholder="Tên hoạt chất 2"
                                        className="w-1/2 border p-2 rounded py-2 leading-normal"
                                        value={interaction.HoatChat_2}
                                        onChange={(e) =>
                                            handleInputChange(
                                                index,
                                                "HoatChat_2",
                                                e.target.value
                                            )
                                        }
                                    />

                                    {modalMode === "add" &&
                                        interactionData.length > 1 && (
                                            <button
                                                type="button"
                                                className="bg-red-500 text-white px-2 py-1 rounded"
                                                onClick={() =>
                                                    removeInteractionPair(index)
                                                }
                                            >
                                                X
                                            </button>
                                        )}
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 font-bold mb-2">
                                    Mức Độ Nghiêm Trọng
                                </label>
                                <input
                                    type="text"
                                    name="MucDoNghiemTrong"
                                    value={interaction.MucDoNghiemTrong}
                                    onChange={(e) =>
                                        handleInputChange(
                                            index,
                                            "MucDoNghiemTrong",
                                            e.target.value
                                        )
                                    }
                                    className="w-full px-4 py-2 border rounded-lg"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 font-bold mb-2">
                                    Cảnh Báo
                                </label>
                                <textarea
                                    name="CanhBaoTuongTacThuoc"
                                    value={interaction.CanhBaoTuongTacThuoc}
                                    onChange={(e) =>
                                        handleInputChange(
                                            index,
                                            "CanhBaoTuongTacThuoc",
                                            e.target.value
                                        )
                                    }
                                    className="w-full px-4 py-2 border rounded-lg min-h-[100px]"
                                />
                            </div>
                        </div>
                        <hr className="border-t-4 border-blue-600 my-5" />
                    </>
                ))}

            {/* Nút thêm cặp tương tác chỉ hiển thị trong modalMode add */}
            {modalMode === "add" && (
                <button
                    type="button"
                    className="bg-blue-500 text-white px-2 py-1 rounded mt-2 mb-4"
                    onClick={addInteractionPair}
                >
                    + Thêm Cặp Hoạt Chất
                </button>
            )}

            <div className="flex justify-end space-x-2 mt-4">
                <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
                >
                    Hủy
                </button>
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Lưu
                </button>
            </div>
        </div>
    );
};

const ViewModal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-7 max-w-4xl w-[90vw] max-h-[90vh] overflow-y-auto">
                <div className="flex justify-end">
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                            ></path>
                        </svg>
                    </button>
                </div>
                <div className="overflow-y-auto max-h-[75vh] px-2">
                    {children}
                </div>
            </div>
        </div>
    );
};


export { DDIModal, ViewModal };
