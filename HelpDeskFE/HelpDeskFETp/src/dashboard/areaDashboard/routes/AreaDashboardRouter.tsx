import { Navigate, Route, Routes } from "react-router-dom";
import { AreasDashboardPage } from "../pages/AreasDashboardPage";

export const AreaDashboardRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<AreasDashboardPage />} />
            <Route path="*" element={<Navigate to="." replace />} />
        </Routes>
    );
};  