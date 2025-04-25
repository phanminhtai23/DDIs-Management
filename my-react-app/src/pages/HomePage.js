import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <header className="bg-white shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <div className="flex items-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-10 w-10 text-blue-600 mr-3"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                            />
                        </svg>
                        <span className="text-2xl font-bold text-gray-800">
                            Medical Management
                        </span>
                    </div>
                    <nav>
                        <Link
                            to="/admin/auth/login"
                            className="bg-blue-600 text-white px-4 py-2 rounded-md mr-2 hover:bg-blue-700"
                        >
                            Đăng Nhập
                        </Link>
                        <Link
                            to="/admin/auth/register"
                            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                        >
                            Đăng Ký
                        </Link>
                    </nav>
                </div>
            </header>

            {/* Hero Section */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="lg:flex items-center">
                    <div className="lg:w-1/2 mb-8 lg:mb-0">
                        <h1 className="text-4xl font-extrabold text-gray-900 mb-6">
                            Hệ Thống Quản Lý Y Tế Thông Minh
                        </h1>
                        <p className="text-xl text-gray-600 mb-8">
                            Giải pháp toàn diện cho việc quản lý thông tin y tế,
                            thuốc men và tương tác dược chất một cách chuyên
                            nghiệp và hiệu quả.
                        </p>
                        <div className="flex space-x-4">
                            <button
                                onClick={() =>
                                    (window.location.href = "/register")
                                }
                                className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition duration-300"
                            >
                                Đăng Ký Ngay
                            </button>
                            <button className="bg-gray-200 text-gray-800 px-6 py-3 rounded-md hover:bg-gray-300 transition duration-300">
                                Tìm Hiểu Thêm
                            </button>
                        </div>
                    </div>

                    <div className="lg:w-1/2 flex justify-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 600 400"
                            className="w-full max-w-md"
                        >
                            <rect width="600" height="400" fill="#f0f9ff" />
                            <circle cx="300" cy="200" r="120" fill="#e6f2ff" />

                            {/* Medical icons */}
                            <path
                                d="M300 130 L320 170 L360 175 L330 205 L340 245 L300 225 L260 245 L270 205 L240 175 L280 170 Z"
                                fill="#3b82f6"
                            />

                            {/* Additional medical elements */}
                            <rect
                                x="250"
                                y="50"
                                width="100"
                                height="20"
                                fill="#60a5fa"
                            />
                            <circle cx="200" cy="100" r="30" fill="#93c5fd" />
                            <circle cx="400" cy="300" r="30" fill="#93c5fd" />
                        </svg>
                    </div>
                </div>

                {/* Features Section */}
                <section className="mt-16">
                    <h2 className="text-3xl font-bold text-center mb-12">
                        Tính Năng Chính
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                title: "Quản Lý Người Dùng",
                                description:
                                    "Theo dõi và quản lý thông tin người dùng một cách dễ dàng và chính xác.",
                                icon: (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-12 w-12 text-blue-600"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                                        />
                                    </svg>
                                ),
                            },
                            {
                                title: "Quản Lý Thuốc",
                                description:
                                    "Tra cứu, cập nhật và quản lý kho thuốc một cách chuyên nghiệp.",
                                icon: (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-12 w-12 text-green-600"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 01-4.658-4.658l-.477-2.387a2 2 0 00-.547-1.022L6 5m8 8l-1.535-1.535a5 5 0 01-1.464-3.535V5a2 2 0 00-2-2H5.64c-.602 0-1.136.422-1.22 1.007A9 9 0 1021.75 7.838c-.085-.084-.19-.149-.307-.196L19 7m-8-3a5 5 0 00-5 5v.001"
                                        />
                                    </svg>
                                ),
                            },
                            {
                                title: "Tương Tác Thuốc",
                                description:
                                    "Phân tích và cảnh báo các tương tác giữa các loại thuốc.",
                                icon: (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-12 w-12 text-red-600"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                ),
                            },
                        ].map((feature, index) => (
                            <div
                                key={index}
                                className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-xl transition duration-300"
                            >
                                <div className="flex justify-center mb-4">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-semibold mb-3">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-gray-800 text-white py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p>&copy; 2025 Medical Management.</p>
                </div>
            </footer>
        </div>
    );
};

export default HomePage;
