import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import {
    GoogleOutlined,
    FacebookOutlined,
    LockOutlined,
    UserOutlined,
    MailOutlined,
} from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";
import userService from "../services/userService";

const RegisterPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);


    const onFinish = async (values) => {
        try {
            setLoading(true);
            // Gọi API đăng nhập sử dụng userService
            const response = await userService.register({
                email: values.email,
                full_name: values.fullName,
                password: values.password,
            });

            console.log("respon:", response);
            // Lưu token vào localStorage
            // localStorage.setItem("token", response.access_token);

            // Hiển thị thông báo thành công
            message.success("Đăng ký thành công!");

            // Chuyển hướng đến trang dashboard
            navigate("/admin/auth/login");
        } catch (error) {
            // Xử lý các loại lỗi và hiển thị popup
            let msg = "Đăng ký thất bại";

            if (error.response) {
                // Lỗi từ server
                if (error.response.status === 401) {
                    msg = error.response.data.detail;
                } else if (error.response.data && error.response.data.detail) {
                    msg = error.response.data.detail;
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

            console.error("Lỗi đăng ký:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleRegister = async () => {
        try {
            navigate("/admin/auth/login");
        } catch (error) {
            message.error("Đăng ký Google thất bại");
        }
    };

    const handleFacebookRegister = async () => {
        try {
            navigate("/admin/auth/login");
        } catch (error) {
            message.error("Đăng ký Facebook thất bại");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-100 to-green-300 flex items-center justify-center px-4">
            <div className="bg-white shadow-2xl rounded-2xl overflow-hidden w-full max-w-md">
                <div className="p-8">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-800">
                            Đăng Ký Tài Khoản
                        </h2>
                        <p className="text-gray-500 mt-2">
                            Tạo tài khoản mới để bắt đầu sử dụng
                        </p>
                    </div>

                    <Form
                        name="register"
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        layout="vertical"
                    >
                        <Form.Item
                            name="fullName"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng nhập họ và tên!",
                                },
                            ]}
                        >
                            <Input
                                prefix={
                                    <UserOutlined className="text-gray-400" />
                                }
                                placeholder="Họ và tên"
                                className="h-12 rounded-lg"
                            />
                        </Form.Item>

                        <Form.Item
                            name="email"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng nhập email!",
                                },
                                {
                                    type: "email",
                                    message: "Định dạng email không hợp lệ!",
                                },
                            ]}
                        >
                            <Input
                                prefix={
                                    <MailOutlined className="text-gray-400" />
                                }
                                placeholder="Địa chỉ email"
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
                                {
                                    min: 6,
                                    message: "Mật khẩu phải có ít nhất 6 ký tự",
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

                        <Form.Item
                            name="confirmPassword"
                            dependencies={["password"]}
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng xác nhận mật khẩu!",
                                },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (
                                            !value ||
                                            getFieldValue("password") === value
                                        ) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(
                                            new Error(
                                                "Mật khẩu xác nhận không khớp!"
                                            )
                                        );
                                    },
                                }),
                            ]}
                        >
                            <Input.Password
                                prefix={
                                    <LockOutlined className="text-gray-400" />
                                }
                                placeholder="Xác nhận mật khẩu"
                                className="h-12 rounded-lg"
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                block
                                className="h-12 rounded-lg bg-green-600 hover:bg-green-700 transition"
                                loading={loading}
                            >
                                Đăng Ký
                            </Button>
                        </Form.Item>
                    </Form>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">
                                Hoặc đăng ký với
                            </span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <Button
                            icon={<GoogleOutlined />}
                            block
                            className="h-12 rounded-lg flex items-center justify-center border border-red-500 text-red-500 hover:bg-red-50 transition"
                            onClick={handleGoogleRegister}
                        >
                            Đăng Ký với Google
                        </Button>

                        <Button
                            icon={<FacebookOutlined />}
                            block
                            className="h-12 rounded-lg flex items-center justify-center border border-blue-600 text-blue-600 hover:bg-blue-50 transition"
                            onClick={handleFacebookRegister}
                        >
                            Đăng Ký với Facebook
                        </Button>
                    </div>

                    <div className="text-center mt-6">
                        <p className="text-gray-600">
                            Đã có tài khoản?{" "}
                            <Link
                                to="/admin/auth/login"
                                className="text-green-600 hover:text-green-800 font-semibold transition"
                            >
                                Đăng nhập ngay
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
