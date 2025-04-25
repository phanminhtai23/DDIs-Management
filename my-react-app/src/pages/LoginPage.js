import React, { useState } from "react";
import { Form, Input, Button, message, Modal, Alert } from "antd";
import {
    GoogleOutlined,
    FacebookOutlined,
    LockOutlined,
    UserOutlined,
    ExclamationCircleOutlined,
} from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";
import userService from "../services/userService";

const LoginPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [errorVisible, setErrorVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    

    const onFinish = async (values) => {
        try {
            setLoading(true);
            // Gọi API đăng nhập sử dụng userService
            const response = await userService.login({
                email: values.email,
                password: values.password,
                device_info: navigator.userAgent,
            });

            console.log("respon:", response);
            // Lưu token vào localStorage
            localStorage.setItem("token", response.access_token);

            // Chuyển hướng đến trang dashboard
            navigate("/admin/dashboard");
        } catch (error) {
            // Xử lý các loại lỗi và hiển thị popup
            let msg = "Đăng nhập thất bại";
            console.log("respon:", error.response);

            if (error.response) {
                // Lỗi từ server
                if (error.response.status === 401) {
                    msg = error.response.data.detail || "Sai tên đăng nhập hoặc mật khẩu";
                        
                        
                } else if (error.response.status === 404) {
                    msg = error.response.data.detail || "Email chưa được đăng ký";
                }
            } else if (error.request) {
                // Lỗi kết nối
                msg = "Không thể kết nối đến máy chủ";
            }

            // Hiển thị popup thông báo lỗi
            // Hiển thị popup ở góc trên bên trái trong 3s
            console.log("Error message:", msg);
            message.warning({
                // type: "error",
                content: msg,
                duration: 2,
                // style: { position: "fixed", top: "20px", left: "20px" },
            });

            console.error("Lỗi đăng nhập:", error);
        } finally {
            setLoading(false);
        }
    };

    // Đóng popup lỗi
    const handleErrorClose = () => {
        setErrorVisible(false);
    };

    const handleGoogleLogin = async () => {
        try {
            // Phần này cần tích hợp với Google OAuth
            message.info("Đang chuyển hướng đến đăng nhập Google...");
            navigate("/admin/dashboard");
        } catch (error) {
            setErrorMessage("Đăng nhập Google thất bại");
            setErrorVisible(true);
        }
    };

    const handleFacebookLogin = async () => {
        try {
            // Phần này cần tích hợp với Facebook OAuth
            message.info("Đang chuyển hướng đến đăng nhập Facebook...");
            navigate("/admin/dashboard");
        } catch (error) {
            setErrorMessage("Đăng nhập Facebook thất bại");
            setErrorVisible(true);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 flex items-center justify-center px-4">
            {/* Popup thông báo lỗi */}
            <Modal
                title={
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <ExclamationCircleOutlined
                            style={{ color: "#ff4d4f", marginRight: 8 }}
                        />
                        <span>Lỗi đăng nhập</span>
                    </div>
                }
                open={errorVisible}
                onCancel={handleErrorClose}
                footer={[
                    <Button key="ok" type="primary" onClick={handleErrorClose}>
                        Đồng ý
                    </Button>,
                ]}
                centered
            >
                <Alert
                    message={errorMessage}
                    type="error"
                    showIcon
                    style={{ marginBottom: 0 }}
                />
            </Modal>

            <div className="bg-white shadow-2xl rounded-2xl overflow-hidden w-full max-w-md">
                <div className="p-8">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-800">
                            Đăng Nhập
                        </h2>
                        <p className="text-gray-500 mt-2">
                            Chào mừng trở lại! Vui lòng đăng nhập.
                        </p>
                    </div>

                    <Form
                        name="login"
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        layout="vertical"
                    >
                        <Form.Item
                            name="email"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng nhập email đã đăng ký!",
                                },
                                {
                                    type: "email",
                                    message: "Định dạng email không hợp lệ!",
                                },
                            ]}
                        >
                            <Input
                                prefix={
                                    <UserOutlined className="text-gray-400" />
                                }
                                placeholder="Tên đăng nhập"
                                className="h-12 rounded-lg"
                            />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng nhập mật khẩu!",
                                },
                            ]}
                        >
                            <Input.Password
                                prefix={
                                    <LockOutlined className="text-gray-400" />
                                }
                                placeholder="Mật khẩu"
                                className="h-12 rounded-lg"
                            />
                        </Form.Item>

                        <div className="flex justify-between items-center mb-6">
                            <Link
                                to="/admin/forgot-password"
                                className="text-blue-600 hover:text-blue-800 transition"
                            >
                                Quên mật khẩu?
                            </Link>
                        </div>

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                block
                                className="h-12 rounded-lg bg-blue-600 hover:bg-blue-700 transition"
                                loading={loading}
                            >
                                Đăng Nhập
                            </Button>
                        </Form.Item>
                    </Form>

                    {/* <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">
                                Hoặc tiếp tục với
                            </span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <Button
                            icon={<GoogleOutlined />}
                            block
                            className="h-12 rounded-lg flex items-center justify-center border border-red-500 text-red-500 hover:bg-red-50 transition"
                            onClick={handleGoogleLogin}
                        >
                            Đăng Nhập với Google
                        </Button>

                        <Button
                            icon={<FacebookOutlined />}
                            block
                            className="h-12 rounded-lg flex items-center justify-center border border-blue-600 text-blue-600 hover:bg-blue-50 transition"
                            onClick={handleFacebookLogin}
                        >
                            Đăng Nhập với Facebook
                        </Button>
                    </div>

                    <div className="text-center mt-6">
                        <p className="text-gray-600">
                            Chưa có tài khoản?{" "}
                            <Link
                                to="/admin/auth/register"
                                className="text-blue-600 hover:text-blue-800 font-semibold transition"
                            >
                                Đăng ký ngay
                            </Link>
                        </p>
                    </div> */}
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
