import { Navigate, Route, Routes } from "react-router-dom";
import { MaintenanceDashboardPage } from "../pages/MaintenanceDashboardPage";

export const MaintenanceDashboardRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<MaintenanceDashboardPage />} />
            <Route path="*" element={<Navigate to="." replace />} />
        </Routes>
    );
};
