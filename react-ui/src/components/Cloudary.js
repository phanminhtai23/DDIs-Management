import React, { useState, useEffect } from "react";
import { message } from "antd"; // Import antd message for notifications
import drugService from "../services/drugService";
import ddiService from "../services/ddiService";
import {LoadingOverlay} from "./loading"; // Import LoadingOverlay component

const UploadWidget = ({ sendExtractData, modeData }) => {
    const [images, setImages] = useState([]); // Lưu nhiều ảnh
    const [pdfUrls, setPdfUrls] = useState([]); // Lưu PDF (chỉ 1 file)
    const [pdfName, setPdfName] = useState(""); // Lưu tên file PDF

    const senDrugData = (drugs) => {
        // console.log("drug trả ve tu api:", drugs);
        sendExtractData(drugs); // Truyền dữ liệu lên cha
    };

    const senDDIsData = (ddis) => {
        // console.log("drug trả ve tu api:", ddis);
        sendExtractData(ddis); // Truyền dữ liệu lên cha
    };

    const handleExtractDrugs = async (urls) => {
        try {
            
            LoadingOverlay(true); // Hiển thị loading overlay
            // Trích thông tin thuốc
            if (modeData === "drug") {
                let respone = await drugService.extract(urls);
                senDrugData(respone.DDIs);
            // Trích tương tác thuốc
            } else if (modeData === "ddi")  {
                console.log("vo extract ddi");
                let respone = await ddiService.extract(urls);
                senDDIsData(respone.DDIs);
            }
            // console.log(respone);

            LoadingOverlay(false); // Ẩn loading overlay
            message.success({
                content: "Trích thành công!",
                duration: 4,
            });
            
        } catch (err) {
            LoadingOverlay(false);
            // console.log("loi", err);
            if (err.status === 404) {
                message.warning({
                    content: "Không tìm thấy thông tin trong tài liệu!",
                });
            } else if (err.status === 500) {
                message.warning({
                    content: "Lỗi máy chủ, vui lòng thử lại sau!",
                });
            } else {
                message.warning({
                    content: "Trích thuốc thất bại!111",
                });
            }
        } finally {
            LoadingOverlay(false);
             // Ẩn loading overlay sau khi hoàn thành
        }
    };

    useEffect(() => {
        // console.log(
        //     "cloudName:",
        //     process.env.REACT_APP_CLOUD_NAME,
        //     "preset:",
        //     process.env.REACT_APP_UPLOAD_PRESET
        // );
        if (!window.cloudinary) return;

        const myWidget = window.cloudinary.createUploadWidget(
            {
                cloudName: process.env.REACT_APP_CLOUD_NAME,
                uploadPreset: process.env.REACT_APP_UPLOAD_PRESET,
                resourceType: "auto",
                cropping: false,
                multiple: true, // Cho phép chọn nhiều file
                clientAllowedFormats: ["image", "pdf"],
                sources: ["local", "url", "camera"],
            },
            (error, result) => {
                if (!error && result.event === "success") {
                    const url = result.info.secure_url;
                    const format = result.info.format;
                    const fileName =
                        result.info.original_filename + "." + format;

                    if (format === "pdf") {
                        setPdfUrls([url]); // Chỉ lưu URL của file PDF cuối cùng
                        setPdfName(fileName); // Lưu tên file PDF
                        setImages([]); // Xóa danh sách ảnh (chỉ có thể có 1 PDF)
                    } else {
                        setImages((prevImages) => [...prevImages, url]);
                        setPdfUrls([]);
                    }
                }
                if (error) {
                    console.log("error:", error);
                }
            }
        );

        window.myCloudinaryWidget = myWidget;
    }, []);

    // Hàm xóa ảnh khỏi danh sách
    const removeImage = (index) => {
        setImages(images.filter((_, i) => i !== index));
    };

    // Hàm xóa file PDF
    const removePdf = () => {
        setPdfUrls([]);
        setPdfName([]);
    };

    return (
        <div className="flex flex-col space-y-2 items-start">
            <div className="flex space-x-2">
                {/* Nút tải lên */}
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        window.myCloudinaryWidget.open();
                    }}
                    className="px-4 py-2 bg-blue-500 text-white rounded shadow-md hover:bg-blue-600 transition"
                >
                    Upload
                </button>
                {/* Nút Extract */}
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        if (images.length === 0 && pdfUrls.length === 0) {
                            // Hiển thị cảnh báo nếu không có ảnh hoặc PDF
                            message.warning("No images or PDF to extract!");
                        } else {
                            if (images.length > 0) {
                                handleExtractDrugs({
                                    document_urls: images,
                                });
                            } else {
                                handleExtractDrugs({
                                    document_urls: pdfUrls,
                                });
                            }
                        }
                    }}
                    className="px-4 py-2 bg-red-500 text-white rounded shadow-md hover:bg-red-600 transition"
                >
                    Extract
                </button>
            </div>

            {/* Hiển thị danh sách ảnh (theo hàng ngang) */}
            {images.length > 0 && (
                <div className="flex flex-wrap gap-2 w-full">
                    {images.map((img, index) => (
                        <div key={index} className="relative">
                            {/* Nút X để xóa ảnh */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    removeImage(index);
                                }}
                                className="absolute top-1 right-1 bg-black text-white w-5 h-5 flex items-center justify-center rounded-full text-xs shadow-md hover:bg-gray-800 transition"
                            >
                                ✖
                            </button>

                            <img
                                src={img}
                                alt={`Uploaded ${index}`}
                                className="w-24 h-24 object-contain rounded-md shadow-xl"
                            />
                        </div>
                    ))}
                </div>
            )}

            {/* Nếu có PDF, hiển thị file name */}
            {pdfUrls.length > 0 && (
                <div className="flex items-center space-x-2 bg-gray-200 px-3 py-2 rounded-md shadow-md">
                    <a
                        href={pdfUrls[0]} // Chỉ lấy URL đầu tiên trong danh sách PDF
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-800 font-semibold truncate max-w-[200px]"
                    >
                        📄 {pdfName}
                    </a>
                    {/* Nút X để xóa file PDF */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            removePdf();
                        }}
                        className="bg-black text-white w-5 h-5 flex items-center justify-center rounded-full text-xs shadow-md hover:bg-gray-800 transition"
                    >
                        ✖
                    </button>
                </div>
            )}
        </div>
    );
};

export default UploadWidget;
