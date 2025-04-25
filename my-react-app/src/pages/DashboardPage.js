import React, { useState } from "react";
import DrugInteractionManagement from "../components/Admin/DrugInteractionManagement";
import UserManagement from "../components/Admin/UserManagement";
import MedicineManagement from "../components/Admin/MedicineManagement";
import { 
    Users, PillBottle, Layers, 
    LogOut 
} from "lucide-react";
import {message} from "antd";
import userService from "../services/userService";
import { useNavigate} from "react-router-dom";



const AdminDashboard = () => {
    const [selectedKey, setSelectedKey] = useState("1");
    const navigate = useNavigate();
    // const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const renderContent = () => {
        switch (selectedKey) {
            case "1":
                return <UserManagement />;
            case "2":
                return <MedicineManagement />;
            case "3":
                return <DrugInteractionManagement />;
            default:
                return <UserManagement />;
        }
    };

    const LogoutLogic = async () => {

        let token = localStorage.getItem("token");
        if (token) {
            try {
                const response = await userService.logout({
                    token: token,
                });
                console.log("responese", response);
                if (response.status === 200) {
                    localStorage.removeItem("token");
                    message.success("Đăng xuất thành công!");
                    navigate("/admin/auth/login");
                } else {
                    message.error("Đăng xuất không thành công!");
                }
            } catch (error) {
                console.log(error);
                message.error("Đăng xuất không thành công1!");
            }
        } else{
            message.error("Bạn chưa đăng nhập!");
            navigate("/admin/auth/login");
        }
    }

    return (
        <div className="flex min-h-screen fixed-sidebar ">
            {/* Enhanced Sidebar */}
            <div className="w-64 bg-gradient-to-b from-gray-800 to-gray-900 text-white flex flex-col caret-transparent">
                <div className="h-16 flex items-center justify-center bg-gray-900 text-lg font-semibold border-b border-gray-700">
                    Quản Trị Hệ Thống
                </div>
                <nav className="flex-grow p-4">
                    <ul className="space-y-2">
                        <li
                            className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                                selectedKey === "1"
                                    ? "bg-blue-600 text-white"
                                    : "hover:bg-gray-700 hover:text-blue-300"
                            }`}
                            onClick={() => setSelectedKey("1")}
                        >
                            <Users className="mr-3" />
                            Quản Lý Người Dùng
                        </li>
                        <li
                            className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                                selectedKey === "2"
                                    ? "bg-blue-600 text-white"
                                    : "hover:bg-gray-700 hover:text-blue-300"
                            }`}
                            onClick={() => setSelectedKey("2")}
                        >
                            <PillBottle className="mr-3" />
                            Quản Lý Thuốc
                        </li>
                        <li
                            className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                                selectedKey === "3"
                                    ? "bg-blue-600 text-white"
                                    : "hover:bg-gray-700 hover:text-blue-300"
                            }`}
                            onClick={() => setSelectedKey("3")}
                        >
                            <Layers className="mr-3" />
                            Tương Tác Thuốc
                        </li>
                    </ul>
                </nav>

                {/* Logout Section */}
                <div className="p-4 border-t border-gray-700 fixed-bottom">
                    <button
                        className="flex items-center w-full p-3 hover:bg-white hover:text-black rounded-lg"
                        onClick={() => {
                            LogoutLogic();
                        }}
                    >
                        <LogOut className="mr-3 text-red-500" />
                        Đăng Xuất
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 bg-gray-100 flex flex-col">
                {/* Main Content */}
                <main className="p-6 flex-grow">{renderContent()}</main>
            </div>
        </div>
    );
};

export default AdminDashboard;