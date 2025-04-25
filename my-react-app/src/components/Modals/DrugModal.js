import React, { useEffect } from "react";
// import UploadWidget from "./UploadWidget";

const MedicineModal = ({ modalMode, selectedMedicine, setIsModalOpen }) => {
    useEffect(() => {
        // console.log("Selected Medicine updated:", selectedMedicine);
    }, [selectedMedicine]);
    return (
        <>
            <h3 className="text-xl font-bold mb-4">
                {modalMode === "edit" ? "Chỉnh Sửa" : "Thêm Thuốc"}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="mb-4">
                    <label className="block mb-2 ">Tên Thuốc</label>
                    <input
                        type="text"
                        name="tenThuoc"
                        defaultValue={selectedMedicine?.tenThuoc || ""}
                        className="w-full border p-2 rounded py-2 leading-normal"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2 ">Số Đăng Ký</label>
                    <input
                        type="text"
                        name="soDangKy"
                        defaultValue={selectedMedicine?.soDangKy || ""}
                        className="w-full border p-2 rounded py-2 leading-normal"
                        required
                    />
                </div>
            </div>
            {/* Hoạt chất section - make it dynamic */}
            <div className="mb-4">
                <label className="block mb-2 ">Hoạt Chất</label>
                <div id="hoatChatContainer">
                    {selectedMedicine?.hoatChat?.map((hc, index) => (
                        <div
                            key={index}
                            className="flex gap-2 mb-2 hoatChat-container"
                        >
                            <input
                                type="text"
                                name={`tenHoatChat${index}`}
                                defaultValue={hc.tenHoatChat || ""}
                                placeholder="Tên hoạt chất"
                                className="w-1/2 border p-2 rounded py-2 leading-normal"
                            />
                            <input
                                type="text"
                                name={`nongDo${index}`}
                                defaultValue={hc.nongDo || ""}
                                placeholder="Nồng độ"
                                className="w-1/2 border p-2 rounded py-2 leading-normal"
                            />
                            {index > 0 && (
                                <button
                                    type="button"
                                    className="bg-red-500 text-white px-2 py-1 rounded"
                                    onClick={() => {
                                        const container =
                                            document.getElementById(
                                                "hoatChatContainer"
                                            );
                                        container.removeChild(
                                            container.children[index]
                                        );
                                    }}
                                >
                                    X
                                </button>
                            )}
                        </div>
                    )) || (
                        <div className="flex gap-2 mb-2 hoatChat-container">
                            <input
                                type="text"
                                name="tenHoatChat0"
                                placeholder="Tên hoạt chất"
                                className="w-1/2 border p-2 rounded py-2 leading-normal"
                            />
                            <input
                                type="text"
                                name="nongDo0"
                                placeholder="Nồng độ"
                                className="w-1/2 border p-2 roundedpy-2 leading-normal"
                            />
                        </div>
                    )}
                </div>
                <button
                    type="button"
                    className="bg-blue-500 text-white px-2 py-1 rounded mt-2"
                    onClick={() => {
                        const container =
                            document.getElementById("hoatChatContainer");
                        const newIndex = container.children.length;
                        const newRow = document.createElement("div");
                        newRow.className = "flex gap-2 mb-2 hoatChat-container";
                        newRow.innerHTML = `
                        <input
                            type="text"
                            name="tenHoatChat${newIndex}"
                            placeholder="Tên hoạt chất"
                            class="w-1/2 border p-2 rounded py-2 leading-normal"
                        />
                        <input
                            type="text"
                            name="nongDo${newIndex}"
                            placeholder="Nồng độ"
                            class="w-1/2 border p-2 rounded py-2 leading-normal"
                        />
                        <button
                            type="button"
                            class="bg-red-500 text-white px-2 py-1 rounded"
                            onclick="this.parentElement.remove()"
                        >
                            X
                        </button>
                    `;
                        container.appendChild(newRow);
                    }}
                >
                    + Thêm Hoạt Chất
                </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="mb-4">
                    <label className="block mb-2 ">Công Ty SX</label>
                    <input
                        type="text"
                        name="congTySx"
                        defaultValue={selectedMedicine?.congTySx || ""}
                        className="w-full border p-2 rounded py-2 leading-normal"
                        
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2 ">Mã Công Ty SX</label>
                    <input
                        type="text"
                        name="congTySxCode"
                        defaultValue={selectedMedicine?.congTySxCode || ""}
                        className="w-full border p-2 rounded py-2 leading-normal"
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2 ">Nước SX</label>
                    <input
                        type="text"
                        name="nuocSx"
                        defaultValue={selectedMedicine?.nuocSx || ""}
                        className="w-full border p-2 rounded py-2 leading-normal"
                        
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2 ">Địa Chỉ SX</label>
                    <input
                        type="text"
                        name="diaChiSx"
                        defaultValue={selectedMedicine?.diaChiSx || ""}
                        className="w-full border p-2 rounded py-2 leading-normal"
                    />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="mb-4">
                    <label className="block mb-2 ">Phân Loại</label>
                    <input
                        type="text"
                        name="phanLoai"
                        defaultValue={selectedMedicine?.phanLoai || ""}
                        className="w-full border p-2 rounded py-2 leading-normal"
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2 ">Bào Chế</label>
                    <input
                        type="text"
                        name="baoChe"
                        defaultValue={selectedMedicine?.baoChe || ""}
                        className="w-full border p-2 rounded py-2 leading-normal"
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2 ">Tuổi Thọ</label>
                    <input
                        type="text"
                        name="tuoiTho"
                        defaultValue={selectedMedicine?.tuoiTho || ""}
                        className="w-full border p-2 rounded py-2 leading-normal"
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2 ">Đóng Gói</label>
                    <input
                        type="text"
                        name="dongGoi"
                        defaultValue={selectedMedicine?.dongGoi || ""}
                        className="w-full border p-2 rounded py-2 leading-normal"
                    />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="mb-4">
                    <label className="block mb-2 ">Công Ty ĐK</label>
                    <input
                        type="text"
                        name="congTyDk"
                        defaultValue={selectedMedicine?.congTyDk || ""}
                        className="w-full border p-2 rounded py-2 leading-normal"
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2 ">Nước ĐK</label>
                    <input
                        type="text"
                        name="nuocDk"
                        defaultValue={selectedMedicine?.nuocDk || ""}
                        className="w-full border p-2 rounded py-2 leading-normal"
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2 ">Địa Chỉ ĐK</label>
                    <input
                        type="text"
                        name="diaChiDk"
                        defaultValue={selectedMedicine?.diaChiDk || ""}
                        className="w-full border p-2 rounded py-2 leading-normal"
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2 ">Tá Dược</label>
                    <input
                        type="text"
                        name="taDuoc"
                        defaultValue={selectedMedicine?.taDuoc || ""}
                        className="w-full border p-2 rounded py-2 leading-normal"
                    />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="mb-4">
                    <label className="block mb-2 ">Số Quyết Định</label>
                    <input
                        type="text"
                        name="soQuyetDinh"
                        defaultValue={selectedMedicine?.soQuyetDinh || ""}
                        className="w-full border p-2 rounded py-2 leading-normal"
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2 ">Phê Duyệt</label>
                    <input
                        type="text"
                        name="pheDuyet"
                        defaultValue={selectedMedicine?.pheDuyet || ""}
                        className="w-full border p-2 rounded py-2 leading-normal"
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2 ">Đợt Phê Duyệt</label>
                    <input
                        type="text"
                        name="dotPheDuyet"
                        defaultValue={selectedMedicine?.dotPheDuyet || ""}
                        className="w-full border p-2 rounded py-2 leading-normal"
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2 ">Tiêu Chuẩn</label>
                    <input
                        type="text"
                        name="tieuChuan"
                        defaultValue={selectedMedicine?.tieuChuan || ""}
                        className="w-full border p-2 rounded py-2 leading-normal"
                    />
                </div>
            </div>
            <div className="mb-4">
                <label className="block mb-2 ">Nhóm Thuốc</label>
                <input
                    type="text"
                    name="nhomThuoc"
                    defaultValue={selectedMedicine?.nhomThuoc || ""}
                    className="w-full border p-2 rounded py-2 leading-normal"
                />
            </div>
            <div className="flex justify-end space-x-2">
                <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
                >
                    Hủy
                </button>
                <button
                    // onClick={handleSave}
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Lưu
                </button>
            </div>
        </>
    );
};

export default MedicineModal;
