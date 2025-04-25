import React, { useState, useEffect } from "react";
import {CompactModal } from "../Modals/UserModal"; 
import { Edit, Trash2, Eye} from "lucide-react";
// import axiosClient from "../../services/axiosClient";
import userService from "../../services/userService";
import { message } from "antd"; // Assuming you're using Ant Design for messages
import {LoadingData} from "../loading";
import ReactPaginate from "react-paginate";

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("view"); // 'view', 'edit', 'add', 'delete'
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userToDelete, setUserToDelete] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 20;




        const handlePageChange = ({ selected }) => {
            setCurrentPage(selected);
        };
    const filteredMedicines = users.filter(
        (users) =>
            users.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            users.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            users.role?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const pageCount = Math.ceil(filteredMedicines.length / itemsPerPage);
   const currentUsers = filteredMedicines.slice(
       currentPage * itemsPerPage,
       (currentPage + 1) * itemsPerPage
   );
    // Fetch users data when component mounts
    useEffect(() => {
        fetchUsers();
    }, []);

    // Function to fetch users from API
    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await userService.getAll();
            // console.log("Full response:", response);

            // Check if response.data exists and is an array
            if (response.users && Array.isArray(response.users)) {
                setUsers(response.users);
            } else {
                console.error("Invalid response format:", response);
                setUsers([]);
                setError("Định dạng dữ liệu không hợp lệ");
            }
        } catch (err) {
            console.error("Error fetching users:", err);
            setUsers([]); // Ensure users is at least an empty array
            setError(
                "Không thể tải danh sách người dùng, vui lòng thử lại sau."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleView = (user) => {
        setSelectedUser(user);
        setModalMode("view");
        setIsModalOpen(true);
    };

    const handleEdit = (user) => {
        setSelectedUser(user);
        setModalMode("edit");
        setIsModalOpen(true);
    };

    // Show delete confirmation modal
    const showDeleteConfirmation = (user) => {
        setUserToDelete(user);
        setModalMode("delete");
        setIsModalOpen(true);
    };

    // Handle actual deletion after confirmation
    const handleDelete = async () => {
        try {
            // You'll need to adjust your API endpoint to accept email instead of ID
            // or change how you identify users for deletion
            await userService.delete(userToDelete.email);

            // Close the modal
            setIsModalOpen(false);

            // Show success message
            message.success("Xóa người dùng thành công");

            // Refresh the users list after successful deletion
            fetchUsers();
        } catch (err) {
            console.error("Error deleting user:", err);
            message.error("Không thể xóa người dùng, vui lòng thử lại sau.");
        }
    };

    const handleSave = async (userEmail, updatedUser) => {
        try {
            let respone = await userService.update(userEmail, updatedUser);

            if (respone.status === 200) {
                console.log("User updated successfully:", respone.data);
            } else {
                throw new Error(`Unexpected respone status: ${respone.status}`);
            }

            console.log("respone", respone);
            message.success("Cập nhật thông tin người dùng thành công");
            // Refresh the users list after successful update
            fetchUsers();
            setIsModalOpen(false);
        } catch (err) {
            console.error("Error saving user:", err);
            message.error(
                "Không thể lưu thông tin người dùng, vui lòng thử lại sau."
            );
        }
    };

    // // In the filteredUsers function, remove username from the search
    // const filteredUsers = users.filter(
    //     (user) =>
    //         user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //         user.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
    // );

    return (
        <div>
            <div className="flex justify-between items-center mb-4 caret-transparent">
                <h2 className="text-2xl font-bold">Quản Lý Người Dùng</h2>
            </div>

            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Tìm kiếm người dùng..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg"
                />
            </div>

            {loading ? (
                <LoadingData />
            ) : error ? (
                <div className="text-center py-4 text-red-500 caret-transparent">
                    {error}
                </div>
            ) : (
                <table className="w-full border-collapse caret-transparent">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border p-2">Họ và Tên</th>
                            <th className="border p-2">Email</th>
                            <th className="border p-2">Quyền</th>
                            <th className="border p-2">Thao Tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentUsers.length > 0 ? (
                            currentUsers.map((user, index) => (
                                <tr key={index}>
                                    <td className="border p-2">
                                        {user.full_name}
                                    </td>
                                    <td className="border p-2">{user.email}</td>
                                    <td className="border p-2">{user.role}</td>
                                    <td className="border p-2">
                                        <div className="flex justify-center items-center space-x-2">
                                            <button
                                                onClick={() => handleView(user)}
                                                className="text-blue-500"
                                            >
                                                <Eye />
                                            </button>
                                            <button
                                                onClick={() => handleEdit(user)}
                                                className="text-yellow-500"
                                            >
                                                <Edit />
                                            </button>
                                            <button
                                                onClick={() =>
                                                    showDeleteConfirmation(user)
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
                                    colSpan="4"
                                    className="border p-4 text-center"
                                >
                                    Không tìm thấy người dùng nào
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}

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

            <CompactModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            >
                {modalMode === "view" && selectedUser && (
                    <div>
                        <h3 className="text-xl font-bold mb-4">
                            Chi Tiết Người Dùng
                        </h3>
                        <p>
                            <strong>Email:</strong> {selectedUser.email}
                        </p>
                        <p>
                            <strong>Tên Đầy Đủ:</strong>{" "}
                            {selectedUser.full_name}
                        </p>
                        <p>
                            <strong>Quyền:</strong> {selectedUser.role}
                        </p>
                    </div>
                )}
                {modalMode === "edit" && (
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.target);
                            const updatedUser = {
                                ...(selectedUser || {}),
                                full_name: formData.get("full_name"),
                                role: formData.get("role"),
                            };
                            handleSave(selectedUser.email, updatedUser);
                        }}
                    >
                        <h3 className="text-xl font-bold mb-4">Chỉnh Sửa</h3>
                        <div className="mb-4">
                            <label className="block mb-2">Email</label>
                            <input
                                type="text"
                                name="email"
                                value={selectedUser?.email || ""}
                                className="w-full border p-2 rounded bg-gray-100"
                                readOnly
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2">Tên Đầy Đủ</label>
                            <input
                                type="text"
                                name="full_name"
                                defaultValue={selectedUser?.full_name || ""}
                                className="w-full border p-2 rounded"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2">Quyền</label>
                            <select
                                name="role"
                                defaultValue={selectedUser?.role || "user"}
                                className="w-full border p-2 rounded"
                            >
                                <option value="user">Người Dùng</option>
                                <option value="admin">Quản Trị</option>
                            </select>
                        </div>
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                        >
                            Lưu
                        </button>
                    </form>
                )}
                {modalMode === "delete" && userToDelete && (
                    <div>
                        <h3 className="text-xl font-bold mb-4">Xác Nhận Xóa</h3>
                        <p className="mb-4">
                            Bạn có chắc chắn muốn xóa người dùng{" "}
                            <strong>{userToDelete.full_name}</strong> (
                            {userToDelete.email})?
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
            </CompactModal>
        </div>
    );
};

export default UserManagement;
