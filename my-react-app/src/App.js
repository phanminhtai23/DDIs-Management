import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import PrivateRoute from "./components/Admin/PrivateRoute"; // Import PrivateRoute

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/admin/" element={<HomePage />} />
                <Route path="/admin/auth/login" element={<LoginPage />} />
                <Route path="/admin/auth/register" element={<RegisterPage />} />
                <Route
                    path="/admin/dashboard"
                    element={
                        <PrivateRoute>
                            <DashboardPage />
                        </PrivateRoute>
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;
