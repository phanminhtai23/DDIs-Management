import React from "react";

const LoadingPage = () => {
    return (
        <div className="flex items-center justify-center h-64 w-full bg-gray-50 rounded-lg shadow-md">
            <div className="flex flex-col items-center space-y-4">
                <div className="relative w-16 h-16">
                    <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-200 rounded-full animate-pulse"></div>
                    <div className="absolute top-0 left-0 w-full h-full border-t-4 border-blue-500 rounded-full animate-spin"></div>
                </div>
                <p className="text-lg font-medium text-gray-700">Loading...</p>
            </div>
        </div>
    );
};

const LoadingData = () => {
    return (
        <div className="flex flex-col items-center justify-center py-8 px-4 rounded-lg bg-gray-50 shadow-sm">
            <div className="flex space-x-2 mb-3">
                <div
                    className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                ></div>
                <div
                    className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                ></div>
                <div
                    className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                ></div>
            </div>
            <div className="text-center text-gray-700 font-medium">
                Đang tải dữ liệu...
            </div>
        </div>
    );
};

// Định nghĩa biến toàn cục để theo dõi container
let loadingContainer = null;

const LoadingOverlay = (show = false) => {
    // console.log("LoadingOverlay được gọi với show =", show);
    // Nếu chưa có container, tạo mới
    if (!loadingContainer) {
        loadingContainer = document.createElement("div");
        loadingContainer.id = "global-loading-overlay";
        // Thêm style Tailwind
        loadingContainer.className =
            "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50";
        loadingContainer.style.display = "none"; // Mặc định ẩn

        // Tạo nội dung loading
        const content = document.createElement("div");
        content.className = "bg-white p-6 rounded-lg shadow-xl text-center";

        // Tạo spinner
        const spinner = document.createElement("div");
        spinner.className =
            "animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto";

        // Tạo text
        const text = document.createElement("p");
        text.className = "mt-4 text-gray-700";
        text.innerText = "Đang xử lý dữ liệu...";

        // Ghép các phần tử
        content.appendChild(spinner);
        content.appendChild(text);
        loadingContainer.appendChild(content);

        // Thêm vào body
        document.body.appendChild(loadingContainer);
    }

    // Hiển thị hoặc ẩn overlay
    if (show) {
        loadingContainer.style.display = "flex";
    } else {
        loadingContainer.style.display = "none";
    }
    // console.log("Trạng thái hiển thị:", loadingContainer.style.display);
};

export { LoadingPage, LoadingData, LoadingOverlay };
